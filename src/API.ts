import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import * as logger from 'morgan';
import * as path from 'path';

import { HeroRouter } from './routes/hero.router';  // TODO delete, mock router


/**
 * Creates and configures an ExpressJS web server.
 */
export class API {
  express: express.Application;

  /**
   * Initialise the express app
   */
  constructor() {
    this.express = express();
    this.config();
    this.routes();
  }

  /**
   * Returns a new, ready-to-use, configured express application.
   * @class App 
   * @method bootstrap 
   * @static 
   * @return {Express.Application} Returns the newly created express application. 
   */
  public static bootstrap(): express.Application {
    return new API().express;
  }


  /** 
   * Configures the express web Server.
   * @class Server 
   * @method config 
   */
  private config(): void {
    switch (process.env.NODE_ENV) {
      case 'production':
        this.express.use(logger('combined'));
      case 'development':
        this.express.use(logger('dev'));
        this.express.use(errorHandler());
      case 'test':
        break;
      default:
        this.express.use(logger('dev'));
    }
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  /** 
   * Configures the API endpoints. 
   * @class Server 
   * @method config 
   * @return void 
   */
  private routes(): void {
    this.express.use('/heroes', HeroRouter.bootstrap()); // TODO delete, mock router
  }
}
