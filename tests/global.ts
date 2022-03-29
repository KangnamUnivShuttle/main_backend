import { ConnectionOptions } from "typeorm";
import { Guid } from "guid-typescript";
import dotenv from "dotenv";

dotenv.config();

export const SAMPLE_KAKAO_REQ_OBJ = {
    "intent": {
        "id": "5a56ec0008cc1461d75291f6", /* block의 id */
        "name": "스킬테스트" /* block의 이름 */
    },
    "userRequest": {
        "timezone": "Asia/Seoul",
        "block": {
            "id": "5a56ec0008cc1461d75291f6",
            "name": "스킬테스트"
        },
        "utterance": "오늘 날씨 어때?", /* 사용자가 입력한 대화 내용 */
        "lang": "kr",
        "user": {
            "id": "620678", /* 유저의 id 값 */
            "type": "talk_user_id", /* 유저의 값의 종류  */
            "properties": { /* 부가적인 아이디 정보들  */
                "appUserId": "708203191",
                "appUserStatus": "REGISTERED",
                "plusfriend_user_key": "BlGTEYoiNoSh"
            }
        }
    },
    "contexts": [],
    "bot": {
        "id": "5a548e36aea1a43fa851ecd9",
        "name": "또봇"
    },
    "action": {
        "name": "스킬원", /* 스킬의 이름 */
        "clientExtra": "null", /* button 혹은 바로연결에서 넘겨주는 `extra`의 내용 */
        "params": {}, /* 스킬 호출시 함께 넘어가는 action parameter */
        "id": "5a56ebaa211ee046633e958d",
        "detailParams": {} /* resolve 된 action parameter 내용 */
    }
}

export const ormconfig: ConnectionOptions = {
    type: "mariadb",
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME || 'chatbot_system',
    synchronize: false,
    logging: false,
    entities: ["./src/orm/entities/**/*.js", './src/orm/entities/**/*.ts'],
    name: Guid.create().toString()
  };
