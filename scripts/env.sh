#!/usr/bin/env bash
# DIR = Path to current directory (no trailing slash)
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
APP_DIR="$(dirname "${DIR}")"
ENV_FILE="${APP_DIR}/.env"
ALIAS_FILE="${DIR}/aliases.sh"
source $ALIAS_FILE
if [ -f $ENV_FILE ]; then
    set -o allexport
    source $ENV_FILE
    source $ALIAS_FILE
    export SCRIPTS_DIR=$DIR
    export APP_DIR=$APP_DIR
    export ENV_FILE=$ENV_FILE
    set +o allexport
fi
