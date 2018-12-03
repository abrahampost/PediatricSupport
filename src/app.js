let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    morgan      = require("morgan"),
    config      = require("./config/server");

/*
 * Set up server parsing and logging
 */
app.use(bodyParser.json());;
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan(config.logging))

module.exports = app;