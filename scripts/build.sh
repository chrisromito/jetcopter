#!/usr/bin/env bash
# Set up environment vars
####################################
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
cd $DIR
source "${DIR}/env.sh"
cp $ENV_FILE "${COPTER_DIR}/.env"
cp $ENV_FILE "${SERVER_DIR}/.env"

# Set up dependencies
#########################
#cd $APP_DIR
#cd ../
#npm install pm2@latest -g
export IS_PI=true
export NODE_ENV=development

# Build & initialize copter app
#####################################
cdCopterDir
nvm use lts/*
echo "Installing node dependencies..."
npm install
echo "Installing raspi-io dependency..."
npm install --save raspi-io
echo "\n\n"
echo "Copter is installed, building..."
npm run build
echo "Copter is built and ready to rock"
