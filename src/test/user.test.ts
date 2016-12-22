import { IUser } from '../interfaces/user.interface';
import { IUserModel } from '../models/user.model';
import { userSchema } from '../schemas/user.schema';

import { suite, test } from 'mocha-typescript';
import mongoose = require('mongoose');


@suite // equivalent to describe()
class UserTest {
  public static User: mongoose.Model<IUserModel>;
  private controlUser: IUser;

  constructor() {
    this.controlUser = {
      email: 'foo@bar.com',
      firstName: 'Brian',
      lastName: 'Love',
    };
  }

  public static before(): void {
    global.Promise = require('q').Promise;
    mongoose.Promise = global.Promise;

    // connect to mongoose and create model
    const MONGODB_CONNECTION = 'mongodb://localhost:27017/test';
    let connection = mongoose.createConnection(MONGODB_CONNECTION);
    UserTest.User = connection.model<IUserModel>('User', userSchema);

    // require chai and use should() assertions
    let chai = require('chai');
    chai.should();
  }

  @test('should create a new User') //  equivalent to it()
  public create(): Promise<void> {
    // create user and return promise
    return new UserTest.User(this.controlUser).save()
      .then((result: IUserModel) => {
        // tslint:disable-next-line:no-unused-expression
        result._id.should.exist;
        result.email.should.equal(this.controlUser.email);
        result.firstName.should.equal(this.controlUser.firstName);
        result.lastName.should.equal(this.controlUser.lastName);
      });
  }
}
