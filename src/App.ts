import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import * as logger from 'morgan';
import * as path from 'path';


// Creates and configures an ExpressJS web server.
export class App {
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.config();
    this.routes();
  }

  // Returns a ready-to-use, configured express application
  public static bootstrap(): App {
    return new App();
  }

  // Configure Express middleware.
  private config(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    // print stack trace only if in development
    if (global.process.env.NODE_ENV === 'development') {
      this.express.use(errorHandler());
    }
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */  // TODO delete
    let router: Router = express.Router();
    // placeholder route handler
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.json({
        message: 'Hello World!',
      });
    });
    this.express.use('/', router);
  }
}
