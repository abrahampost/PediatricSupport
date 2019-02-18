const PediatricSupportException = require("./pediatric-support-exception");

module.exports = function (err, req, res, next) {
    if(err instanceof PediatricSupportException) {
        res.status(err.status_code).send({error: err.message});
    } else {
        //log uncaught exception and throw internal exception
        console.error(`Uncaught exception occurred: ${err.stack}`);
        res.status(500).send({error: "An unspecified error occurred while completing your request."});
    }
}