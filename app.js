let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    morgan      = require("morgan"),
    config      = require("./config/server"),
    dotenv      = require("dotenv"),
    cors        = require("cors"),
    ExceptionHandler    = require("./exceptions/exception-handler"),
    jwtInterceptor      = require("./middleware/jwtInterceptor");

/*
 * Import environment variables for local testing
 */
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    app.use(cors());
}

/*
 * Set up server parsing and logging
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
if (process.env.NODE_ENV != "test") {
    app.use(morgan(config.logging));
}

app.use(express.static('./app/dist'));

app.use(jwtInterceptor);

/*
 *Register routes on api 
 */
app.use("/api", require("./controllers/index"));

app.use(ExceptionHandler);

app.get("*", function(req, res) {
    res.redirect("/");
});

module.exports = app;