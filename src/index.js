let app     = require("./app"),
    config  = require("./config/server");

app.listen(config.port, function() {
    console.log(`Server started on port ${config.port} in ${config.mode} mode`)
})