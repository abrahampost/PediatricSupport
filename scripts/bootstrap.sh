#!/usr/bin/sh
if [ "$NODE_ENV" != "production" ]; then
    node db/drop-tables.js
fi

node db/init-db.js