import { IUserModel } from './../structures/user.interface';

import * as mongoose from 'mongoose';


let userSchema: mongoose.Schema = new mongoose.Schema({
  first_name: String,
  last_name : String,
  email     : String,
});

let User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', userSchema);

export = User;
