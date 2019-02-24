[![Build Status](https://semaphoreci.com/api/v1/abrahampost/pediatricsupport/branches/master/badge.svg)](https://semaphoreci.com/abrahampost/pediatricsupport)

# PediatricSupport
The Pediatric Support Group App connects children at UNC Children’s Hospital with others children with common interests and similar situations in order to foster friendship and a more supportive atmosphere.

## Backend
### To install
Make sure you have [node](https://nodejs.org/en/download/) installed
run `npm install` - it should install everything for the backend

### To run
* dev - will run locally on your own machine
  * `npm run dev`
* prod - This will connect to the shared database and runs on protected port 80. For use on Heroku instance.
  * `npm run prod`
* test-local - will run all tests in `\test` folder locally and report errors
  * `npm run test-local`
* test - will run all tests in `\test` folder on postgres database specified by TEST_DATABASE_URL environment variable.
  * `npm test`
* bootstrap - drops tables in db, initializes db, and then seeds it
  * `npm run bootstrap`
* init-db(deprecated) - will initialize the database tables
  * `npm run init-db`

## Frontend
### To install
`cd app` to get into the app folder
run `npm install` to install all frontend dependencies

### To run
* `npm run serve` - This serves the frontend on port 9000 with hot-reload (the changes you save will be reflected immediately in the website). Use this to develop.
* `npm run lint` - This can fix linter errors and make the code compliant to the standard. Be careful when using this, as it makes changes automatically to the code, and all new features should definitely be checked again afterwards.
* `npm run build` - Builds the project to be served statically by the server. This is used by heroku so we aren't committing compiled assets to the server.

## Technologies used within the app
* [express](https://expressjs.com/en/api.html) as a server
* [sequelize](http://docs.sequelizejs.com/) as an orm
* [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) as a testing framework
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) and [jsonwebtoken](https://jwt.io/) for authentication and security
* [vue](https://vuejs.org)
* [vue-router](https://router.vuejs.org)

NOTE: Must have `.env` file in root level of repository with database information in order to run. File must contain `DATABASE_URL`, `SIGN_KEY`, `TEST_DATABASE_URL`, `EMAIL_USER`, and `EMAIL_PASSWORD` (if you want have any questions message Abe).
