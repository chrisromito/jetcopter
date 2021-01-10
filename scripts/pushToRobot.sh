#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
source "${DIR}/env.sh"
cd $APP_DIR
rsync -aP --exclude '**/node_modules/*' --exclude '**/dist/*' ${APP_DIR}/ ${ROBOT_CONNECTION}:${REMOTE_ROBOT_PATH}
