#!/usr/bin/sh
node db/drop-tables.js && node db/init-db.js && node db/seed-db.js