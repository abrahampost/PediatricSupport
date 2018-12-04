#!/usr/bin/sh
cross-env NODE_ENV=test node db/drop-tables.js
cross-env NODE_ENV=test node db/init-db.js
mocha --timeout 2000