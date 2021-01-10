#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
source "${DIR}/env.sh"
cdCopterDir

export IS_PI=true
nvm use
alias nodeRepl='node --experimental-repl-await --experimental-modules'
alias copterRepl='buildCopter && sudo su --'

function buildCopter() {
    cdCopterDir
    nvm use
    export IS_PI=true
    npm run build
}
