let test = {
    mode: 'test',
    logging: '',
    port: process.env.PORT || 8800
}

let dev = {
    mode: 'dev',
    logging: 'dev',
    port: process.env.PORT || 8080,
}

let production = {
    mode: 'prod',
    logging: 'common',
    port: process.env.PORT || 80
}

let configs = {
    test,
    dev,
    production
}

module.exports = configs[process.env.NODE_ENV];