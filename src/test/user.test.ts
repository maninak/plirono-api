import { IUserModel } from '../models/user.model';
import { userSchema } from '../schemas/user.schema';
import { IUser } from './../interfaces/user.interface';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';
import mongoose = require('mongoose');


@suite // equivalent to describe()
class UserTest {
  private static UserModel: mongoose.Model<IUserModel>;
  private controlUser1: IUser;
  private controlUser2: IUser;

  constructor() {
    this.controlUser1 = {
      email: 'foo@bar.com',
      firstName: 'Takis',
      lastName: 'Sketos',
    };
    this.controlUser2 = {
      email: 'foo@updated.com',
      firstName: 'Takis-updated',
      lastName: 'Sketos-updated',
    };
  }

  static before(): void {
    // use chai-as-promised and 'should' assertions
    chai.use(chaiAsPromised);
    chai.should();
    // set up q as the global promise library
    mongoose.Promise = global.Promise = require('q').Promise;
    // connect to mongoose and create model
    const MONGO_URL: string = global.process.env.MONGO_URL || 'localhost';
    const MONGO_PORT: number = global.process.env.MONGO_PORT || 37017;
    const MONGODB_CONNECTION = `mongodb://${MONGO_URL}:${MONGO_PORT}/test`;
    const connection = mongoose.createConnection(MONGODB_CONNECTION);
    this.UserModel = connection.model<IUserModel>('User', userSchema);
  }

  @test('can create a new User') // equivalent to it()
  async create(): Promise<void> {
    // save controlUser1 in DB
    let savedUser: IUserModel = await new UserTest.UserModel(this.controlUser1).save();
    // check if DB response contains what we told it to save
    // tslint:disable-next-line:no-any
    return (savedUser as any)._doc.should.contain(this.controlUser1);
  }

  @test('can retrieve existing User')
  async retrieve(): Promise<void> {
    // save controlUser1 in DB
    let savedUser: IUserModel = await new UserTest.UserModel(this.controlUser1).save();
    // retrieve entry and verify that it has the correct data
    return UserTest.UserModel.findById(savedUser._id).should.eventually.contain(this.controlUser1);
  }

  @test('can update an existing User')
  async update(): Promise<Chai.Assertion> {
    // save controlUser1 in DB
    let savedUser: IUserModel = await new UserTest.UserModel(this.controlUser1).save();
    // update controlUser1's entry in DB with controlUser2 data
    await UserTest.UserModel.findByIdAndUpdate(savedUser._id, this.controlUser2);
    // retrieve entry's latest data from DB
    let foundUser: IUserModel = await UserTest.UserModel.findById(savedUser._id);
    // verify that retrieved entry has the updated data
    return foundUser.should.contain(this.controlUser2);
  }

  @test('can delete existing user')
  async delete(): Promise<Chai.Assertion> {
    // save controlUser1 in DB
    let savedUser: IUserModel = await new UserTest.UserModel(this.controlUser1).save();
    // remove from the DB the entry we just created
    await UserTest.UserModel.findByIdAndRemove(savedUser._id);
    // request the same entry we just deleted from the db
    let foundUser: IUserModel = await UserTest.UserModel.findById(savedUser._id);
    // if entry was successfully removed, we expect db response to be null
    // tslint:disable-next-line:no-null-keyword
    return (foundUser === null).should.be.true;
  }
}
