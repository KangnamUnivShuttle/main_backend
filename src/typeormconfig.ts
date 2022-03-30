import { ConnectionOptions } from "typeorm";
import logger from "./logger";
// https://github.com/nrwl/nx/issues/803#issuecomment-450642765

function entityResolver() {
  const contexts = (require as any).context('./orm/entities', true, /\.ts$/);
  console.log('contexts', contexts, contexts.keys())
  return contexts
  .keys()
  .map((modulePath: any) => {
    console.log('modulePath: ', modulePath)
    return contexts(modulePath)
  })
  .reduce((result: any, entityModule: any) => result.concat(Object.keys(entityModule).map(key => entityModule[key]), []))
}

const ormconfig: ConnectionOptions = {
    type: "mariadb",
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASENAME || 'chatbot_system',
    synchronize: false,
    logging: false,
    entities: process.env.NODE_ENV === 'production' ? entityResolver() : [__dirname + "/orm/entities/*.{js,ts}", ],//__dirname + ,
    migrations: [
      __dirname + "/migrations/entities/*.{js,ts}"
    ],
    cli: {
        entitiesDir: process.env.NODE_ENV === 'production' ? 'dist/orm' : "src/orm",
        migrationsDir: process.env.NODE_ENV === 'production' ? 'dist/migrations' : "src/migrations"
    }
  };
// console.log('asdf', __dirname, __dirname + "src/orm/entities/*.{js,ts}")
logger.debug(`[tyeormconfig] [config] entities: ${JSON.stringify(ormconfig.entities)}`)
export default ormconfig;