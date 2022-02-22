#! /bin/bash
npx typeorm-model-generator -h localhost -d chatbot_system -p 3306 -u root -x $1 -e mariadb -o "./orm"