#!/usr/bin/sh
pwd
node /app/db/drop-tables.js
node /app/db/init-db.js
node /app/db/seed-db.js