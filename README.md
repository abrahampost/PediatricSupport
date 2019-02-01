# PediatricSupport
The Pediatric Support Group App connects children at UNC Children’s Hospital with others children with common interests and similar situations in order to foster friendship and a more supportive atmosphere.

## To install
Make sure you have [node](https://nodejs.org/en/download/) installed
run `npm install`

## To run
* dev - will run locally on your own machine
  * `npm run dev`
* prod - This will connect to the shared database and runs on protected port 80. For use on Heroku instance.
  * `npm run prod`
* test - will run all tests in `\test` folder locally and report errors
  * `npm run test`
* init-db - will initialize the database tables
  * `npm run init-db`

## Technologies used within the app
* [express](https://expressjs.com/en/api.html) as a server
* [sequelize](http://docs.sequelizejs.com/) as an orm
* [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) as a testing framework
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) and [jsonwebtoken](https://jwt.io/) for authentication and security

NOTE: Must have `.env` files in root level of repository with database information in order to run.
