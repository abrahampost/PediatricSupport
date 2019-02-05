#!/usr/bin/sh
node db/drop-tables.js
node db/init-db.js
mocha --timeout 10000