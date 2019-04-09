#!/usr/bin/sh
cd app
npm install --only-prod
npm install --only-dev
npm run build
npm uninstall