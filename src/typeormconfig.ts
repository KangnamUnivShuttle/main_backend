import { ConnectionOptions } from "typeorm";
import logger from "./logger";
const ormconfig: ConnectionOptions = {
    type: "mariadb",
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME || 'chatbot_system',
    synchronize: false,
    logging: false,
    entities: [__dirname + "/**/entities/*.{js,ts}", ],//__dirname + 
  };
// console.log('asdf', __dirname, __dirname + "src/orm/entities/*.{js,ts}")
logger.debug(`[tyeormconfig] [config] entities: ${JSON.stringify(ormconfig.entities)}`)
export default ormconfig;