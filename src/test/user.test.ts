import { IUser } from '../interfaces/user.interface';
import { IUserModel } from '../models/user.model';
import { userSchema } from '../schemas/user.schema';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';
import mongoose = require('mongoose');


@suite // equivalent to describe()
class UserTest {
  static UserModel: mongoose.Model<IUserModel>;
  controlUser: IUser;

  constructor() {
    this.controlUser = {
      email: 'foo@bar.com',
      firstName: 'Takis',
      lastName: 'Sketos',
    };
  }

  static before(): void {
    // use chai-as-promised and 'should' assertions
    chai.use(chaiAsPromised);
    chai.should();

    // set up q as the global promise library
    global.Promise = require('q').Promise;
    mongoose.Promise = global.Promise;

    // connect to mongoose and create model
    const MONGO_URL: string = global.process.env.MONGO_URL || 'localhost';
    const MONGO_PORT: number = global.process.env.MONGO_PORT || 37017;
    const MONGODB_CONNECTION = `mongodb://${MONGO_URL}:${MONGO_PORT}/test`;
    let connection = mongoose.createConnection(MONGODB_CONNECTION);
    this.UserModel = connection.model<IUserModel>('User', userSchema);
  }

  @test('can create a new User') // equivalent to it()
  create(): Promise<void> {
    // save controlUser in DB and test response against our control
    return new UserTest.UserModel(this.controlUser).save()
      .then((response: IUserModel) => {
        // because mongoose typings are missing _doc property in Model
        // tslint:disable-next-line:no-any
        (response as any)._doc.should.contain(this.controlUser);
      });
  }
}
