#!/usr/bin/env bash
# Directory aliases
######################
export DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
export APP_DIR="$(dirname "${DIR}")"
export ENV_FILE="${APP_DIR}/.env"
export COPTER_DIR="${APP_DIR}/copter"
export SERVER_DIR="${APP_DIR}/copter"

# CWD helpers
######################
function cdApp() {
    cd $APP_DIR
}
function cdScripts() {
    cd $DIR
}
function cdCopterDir() {
    cd $COPTER_DIR
}
function cdServerDir() {
    cd $SERVER_DIR
}

# Build
######################
function buildCopter() {
    cdCopterDir && npm run build
}
function buildServer() {
    cdServerDir && npm run build
}

# SSH Connections
######################
ROBOT_USER="robot"
ROBOT_IP="192.168.1.141"
ROBOT_CONNECTION="${ROBOT_USER}@${ROBOT_IP}"
export ROBOT_USER=$ROBOT_USER
export ROBOT_IP=$ROBOT_IP
export ROBOT_CONNECTION=$ROBOT_CONNECTION
export REMOTE_ROBOT_PATH="/home/${ROBOT_USER}/jetcopter_controller"

alias goToRobot="ssh ${ROBOT_CONNECTION}"

function pushToRobot() {
    cd $APP_DIR
    rsync -aP --exclude '**/node_modules/*' --exclude '**/dist/*' ${APP_DIR}/ ${ROBOT_CONNECTION}:${REMOTE_ROBOT_PATH}
}

function buildRobot() {
    pushToRobot
    ssh $ROBOT_CONNECTION source $REMOTE_ROBOT_PATH/scripts/build.sh
}
