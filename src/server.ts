import { IError } from './interfaces/error.interface';
import { IUser } from './interfaces/user.interface';
import { IModel } from './models/model';
import { IUserModel } from './models/user.model';
import { IndexRoute } from './routes/index.route';
import { userSchema } from './schemas/user.schema';

import { NextFunction, Request, Response } from 'express';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as logger from 'morgan';
import * as path from 'path';
import mongoose = require('mongoose');


/**
 * An express web-server.
 * @class Server
 */
export class Server {
  public app: express.Application;
  private model: IModel; // an instance of IModel
  private MONGO_PORT: number;

  /**
   * Constructor.
   * @class Server
   * @constructor
   */
  constructor() {
    // instance defaults
    this.MONGO_PORT = global.process.env.MONGO_PORT || 37017;
    this.model = Object(); // initialize this to an empty object
    this.app = express();
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

    const MONGODB_CONNECTION = `mongodb://localhost:${this.MONGO_PORT}/heros`;

    // add static paths  // TODO delete this could be merchant-app
    this.app.use(express.static(path.join(__dirname, 'public')));

    // mount logger
    this.app.use(logger('dev'));

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));

    // mount cookie parker
    this.app.use(cookieParser('SECRET_GOES_HERE'));

    // mount override
    this.app.use(methodOverride());

    // setup to use q promises
    global.Promise = require('q').Promise;
    mongoose.Promise = global.Promise;

    // connect to mongoose
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    // create models
    this.model.user = connection.model<IUserModel>('User', userSchema);

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
    let router: express.Router = express.Router();
    IndexRoute.create(router);
    this.app.use(router);
  }
}
