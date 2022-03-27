#! /bin/bash
npx typeorm-model-generator -h kws1.gapmoe.net -d chatbot_system -p 8080 -u root -x $1 -e mariadb -o "./src/orm"