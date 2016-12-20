import * as mongoose from 'mongoose';

export interface IUser {
  first_name: string;
  last_name : string;
  email     : string;
}

export interface IUserModel extends IUser, mongoose.Document {};
