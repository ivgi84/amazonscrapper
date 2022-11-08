import * as Koa from "koa";

export class ItemsController {
  constructor() {}

  public handleGetPageItemsRequest(ctx:Koa.Context) {
    const url = ctx.params.url
     
    console.log('REQUEST ', ctx);
    // ctx.body = `PAGE ITEM REQUEST RECEIVED with url: ${url}`;
  }
}