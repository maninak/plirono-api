import { NextFunction } from 'express';
import { Schema } from 'mongoose';

export let userSchema: Schema = new Schema({
  createdAt : Date,
  email     : String,
  firstName : String,
  lastName  : String,
});
userSchema.pre('save', (next: NextFunction) => {
  let now: Date = new Date();
  if (this.createdAt === undefined) {
    this.createdAt = now;
  }
  next();
});
