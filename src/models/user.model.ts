import { Document } from 'mongoose';

export interface IUser {
  email?      : string;
  firstName?  : string;
  lastName?   : string;
}

export interface IUserModel extends IUser, Document {
  // custom methods for your model would be defined here
}
