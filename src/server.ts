import { app } from "./app";
import logger from './logger';

const port = process.env.PORT || 3000;

const httpServer = app.listen(port, () =>
  logger.info(`Example app listening at http://localhost:${port}`)
);

module.exports = {
  app,
  httpServer
};