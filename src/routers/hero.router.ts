import { NextFunction, Request, Response, Router } from 'express';

import { IHero } from './../structures/hero.interface';

// tslint:disable-next-line:no-var-requires
const Heroes: Array<IHero> = require('../assets/data');


export class HeroRouter {
  router: Router;

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Returns a new, ready-to-use, configured express hero express Router.
   * @class App 
   * @method bootstrap 
   * @static 
   * @return {express.Router} Returns the newly created express application. 
   */
  public static bootstrap(): Router {
    return new HeroRouter().router;
  }

  /**
   * GET all Heroes.
   */
  public getAll(req: Request, res: Response, next: NextFunction): void {
    res.send(Heroes);
  }

  /**
   * GET one hero by id
   */
  public getOne(req: Request, res: Response, next: NextFunction): void {
    let queryId: number = parseInt(req.params.id);
    let hero: IHero = Heroes.find((foundHero: IHero) => foundHero.id === queryId);
    if (hero) {
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          hero,
        });
    }
    else {
      res.status(404)
        .send({
          message: 'No hero found with the given id.',
          status: res.status,
        });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init(): void {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
  }
}

