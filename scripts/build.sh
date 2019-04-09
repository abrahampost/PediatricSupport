#!/usr/bin/sh
cd app
npm install
npm run build
rm -rf node_modules/ && echo "Successfully removed npm packages"