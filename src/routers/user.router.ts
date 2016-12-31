import mongoose = require('mongoose');
import { NextFunction, Request, Response, Router } from 'express';

import { IUser, IUserModel, UserSchema } from './../schemas/user.schema';

// Connect to mongoDB
mongoose.Promise = global.Promise;
const MONGO_URL: string       = global.process.env.MONGO_URL  || 'localhost';
const MONGO_PORT: number      = global.process.env.MONGO_PORT || 37017;
const MONGO_USERS_DB: string  = `mongodb://${MONGO_URL}:${MONGO_PORT}/users`;
const USERS_DB_CONNECTION: mongoose.Connection = mongoose.createConnection(MONGO_USERS_DB);

// this is what we will use to talk to mongo regarding User documents
const USER_MODEL: mongoose.Model<IUserModel> = USERS_DB_CONNECTION.model<IUserModel>('User', UserSchema);


export class UserRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  /**
   * Creates and returns a new, ready-to-use, configured express Router
   */
  static bootstrap(): Router {
    return new UserRouter().router;
  }

  /**
   * GET all Users
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let foundUsers: IUserModel[] = await USER_MODEL.find();
    res.send(foundUsers);
  }

  /**
   * GET one User by id
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let queryId: string = req.params.id;
    if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
      res.status(400).send({
        error: 'Invalid user id',
        requested: queryId,
        status: res.status,
      });
    }
    let foundUser: IUserModel = await USER_MODEL.findById(queryId);
    res.send(foundUser);
  }

  /**
   * PUT a new User to the DB
   */
  async putOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let newUser: IUser = {
      email: req.headers['email'],
      firstname: req.headers['firstname'],
      lastname: req.headers['lastname'],
    };
    try {
      let value: IUserModel = await USER_MODEL.create(newUser);
      res.send(value);
    }
    catch (error) {
      res.status(406).send(error.message); // NOT ACCEPTABLE, client is missing proper header fields
    }
  }

  /**
   * Take each handler and attach it to one of the Express.Router's endpoints
   */
  private initRoutes(): void {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.put('/create', this.putOne);
  };
}
