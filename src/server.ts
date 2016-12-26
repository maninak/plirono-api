import { IError } from './interfaces/error.interface';
import { IUser } from './interfaces/user.interface';
import { IModelHolder } from './models/model-holder';
import { IUserModel } from './models/user.model';
import { IndexRoute } from './routes/index.route';
import { userSchema } from './schemas/user.schema';

import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as methodOverride from 'method-override';
import * as logger from 'morgan';
import * as path from 'path';
import mongoose = require('mongoose');

const MONGO_URL: string   = global.process.env.MONGO_URL || 'localhost';
const MONGO_PORT: number  = global.process.env.MONGO_PORT || 37017;
const MONGO_USERS_DB      = `mongodb://${MONGO_URL}:${MONGO_PORT}/users`;


/**
 * The express web-server.
 * @class Server
 */
export class Server {
  public app: Application;
  private models: IModelHolder;
  private usersDB: mongoose.Connection;

  /**
   * Constructor.
   * @class Server
   * @constructor
   */
  constructor() {
    // instance defaults
    this.app = express();
    this.models = Object(); // initialize this to an empty object
    this.config();
    this.routes();
    this.api();
  }

  /**
   * Bootstraps the application.
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Configures the webserver
   * @class Server
   * @method config
   */
  public config(): void {
    this.app.use(express.static(path.join(__dirname, 'public'))); // TODO delete this could be merchant-app's www folder
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(methodOverride());
    // catch 404 and forward to error handler
    this.app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
        err.message = 'Not Found';
        err.status = 404;
        next(err);
    });
    // print stack trace only if in development
    if (global.process.env.NODE_ENV === 'development') {
      this.app.use(errorHandler());
    }

    // setup to use q promises
    mongoose.Promise = global.Promise = require('q').Promise;
    // connect to mongoDB
    this.usersDB = mongoose.createConnection(MONGO_USERS_DB);
    // create models
    this.models.user = this.usersDB.model<IUserModel>('User', userSchema);
    // [additional models here...]
  }

  /**
   * Creates REST API routes
   * @class Server
   * @method api
   */
  public api(): void {
    // empty for now
  }

  /**
   * Creates the router.
   * @class Server
   * @method config
   * @return void
   */
  private routes(): void {
    let router = express.Router();
    IndexRoute.create(router);
    // [additional routes here...]
    this.app.use(router);
  }
}
