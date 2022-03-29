import { app } from "./app";
import logger from './logger';

import { createConnection, getConnection } from "typeorm";
import ormconfig from './typeormconfig';

import {GracefulShutdownManager} from '@moebius/http-graceful-shutdown'

const port = process.env.PORT || 3000;
let httpServer: any = null;
// createConnection(ormconfig)
//   .then(() => {
//     logger.info(`[Server] DB connection ok.`)
//   })
//   .catch(err => {
//     logger.error(`[Server] DB connection failed. ${err.message}. Shutdown server.`)

//     if (httpServer) {
//       httpServer.close();
//     }
// })

httpServer = app.listen(port, () =>
  logger.info(`[Server] Example app listening at http://localhost:${port}`)
);

const shutdownManager = new GracefulShutdownManager(httpServer)

process.on('SIGTERM', onSignalShutdown);
process.on('SIGINT', onSignalShutdown);

async function onSignalShutdown() {
  logger.warn(`[Server] Signal interrupt or terminate detected.`)

  await getConnection().close();
  logger.warn(`[Server] DB Connection closed`)

  shutdownManager.terminate(() => {
    logger.warn(`[Server] Server closed.`)
  })
}

// https://stackoverflow.com/a/51142584/7270469

module.exports = (async function () {
  try {
    logger.debug(`[Server] DB connection info: ${process.env.DB_HOST || 'localhost'}`)
    const connection = await createConnection(ormconfig)
    logger.info(`[Server] DB connection ok.`)
  } catch (err: any) {
    logger.error(`[Server] DB connection failed. ${err.message}. Shutdown server.`)
    httpServer.close();
    return { app, undefined, shutdownManager }
  }
  return { app, httpServer, shutdownManager };
})();