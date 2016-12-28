import { Model } from 'mongoose';
import { IUserModel } from './user.model';

export interface IModelHolder {
  user: Model<IUserModel>;
  // [additional models here...]
}
