#!/usr/bin/env bash
# Call as 'source ./scripts/runserver.sh'
#pm2 delete all
#pm2 startOrRestart ecosystem.config.js --update-env
source env.sh
cdCopterDir
npm run build
npm run start
