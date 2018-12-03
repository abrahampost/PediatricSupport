let dev = {
    mode: 'dev',
    logging: 'dev',
    port: 8080
}

let prod = {
    mode: 'prod',
    logging: 'common',
    port: process.env.PORT || 80
}

let configs = {
    dev,
    prod
}

module.exports = process.env.NODE_ENV == "prod" ? configs["prod"] : configs["dev"];