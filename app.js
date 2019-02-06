let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    morgan      = require("morgan"),
    config      = require("./config/server"),
    dotenv      = require("dotenv");

/*
 * Import environment variables for local testing
 */
dotenv.config()

/*
 * Set up server parsing and logging
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
if (process.env.NODE_ENV != "test" && process.env.NODE_ENV != "testlocal") {
    app.use(morgan(config.logging));
}

/*
 *Register routes on api 
 */
app.use("/api", require("./controllers/index"));

app.use(express.static('./app/dist'));

module.exports = app;