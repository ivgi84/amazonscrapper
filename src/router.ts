import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyparser from 'koa-bodyparser';

import { ItemsController } from './controllers/items-controller';

interface ResponseError {
  status: number;
  message: string;
}

export class Router {
  public router;
  private app:Koa;
  private itemsController; 

  constructor(app: Koa) {
    this.app = app;
    this.router = new KoaRouter();
    this.setMiddlewares();
    this.setRoutes();
    this.itemsController = new ItemsController();

    app.use(this.router.routes()).use(this.router.allowedMethods());
  }

  private setRoutes() {
    this.router.get('/', async (ctx, next) => {
      ctx.body = 'Hello!!';
      await next();
    });

    this.router.get('/getPageItems/:url(.*)', this.itemsController.handleGetPageItemsRequest.bind(this))
  }

  private setMiddlewares() {
    this.app.use(json());
    this.app.use(logger());
    this.app.use(bodyparser());
    this.generalErrorHandler();
  }

  private generalErrorHandler() {
    this.app.use( async(ctx, next) => {
      try{ 
        await next();
      } catch(err: any) {
        console.log(err);
        ctx.status = err.status || 500;
        ctx.body = err.message;
      }
    })
  }
}