
#! /bin/bash

export $(grep -v '^#' $1 | xargs)

if [[ -n ${FORWARDING_PORT} && -n ${DB_HOST} && -n ${DB_PORT} && -n ${SSH_USER} && -n ${SSH_HOST} ]]
then
    echo "checking port usage ..."
    npx kill-port ${FORWARDING_PORT}
    npx kill-port ${DB_PORT}

    echo "starting connection with ssh server ...";
    echo ssh -N -L ${FORWARDING_PORT}:${DB_HOST}:${DB_PORT} ${SSH_USER}@${SSH_HOST}

    ssh -N -L ${FORWARDING_PORT}:${DB_HOST}:${DB_PORT} ${SSH_USER}@${SSH_HOST}
else
    echo ".env.local must define FORWARDING_PORT, DB_HOST, DB_PORT, SSH_USER and SSH_HOST values";
fi;