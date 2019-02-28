#!/usr/bin/sh
cd app
NODE_ENV=dev npm install
npm run build
npm uninstall