import * as Koa from 'koa';

import { AppConfig } from './config/config';
import { Router } from './router';

const config = AppConfig.config;

const app = new Koa();
const router = new Router(app);

app.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
});