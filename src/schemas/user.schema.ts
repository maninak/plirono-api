import { NextFunction } from 'express';
import { Schema } from 'mongoose';

export let UserSchema: Schema = new Schema({
  createdAt : Date,
  email     : String,
  firstName : String,
  lastName  : String,
});
UserSchema.pre('save', (next: NextFunction) => {
  let now: Date = new Date();
  if (this.createdAt === undefined) {
    this.createdAt = now;
  }
  next();
});
