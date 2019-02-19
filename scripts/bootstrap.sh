#!/usr/bin/sh
if [ "$NODE_ENV" != "production" ]; then
    node db/drop-tables.js
    node db/init-db.js
    node db/seed-db.js
    cd app && npm install && npm run build
fi

node db/init-db.js

