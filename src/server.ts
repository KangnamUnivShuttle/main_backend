import { app } from "./app";
import logger from './logger';

import { createConnection } from "typeorm";
import ormconfig from './typeormconfig';

const port = process.env.PORT || 3000;
let httpServer = null;
createConnection(ormconfig)
.then(() => {
  logger.info(`[Server] DB connection ok.`)
  httpServer = app.listen(port, () =>
    logger.info(`[Server] Example app listening at http://localhost:${port}`)
  );
})
.catch(err => {
  logger.error(`[Server] DB connection failed. ${err.message}`)
})

module.exports = {
  app,
  httpServer
};