const   jwt                 = require("jsonwebtoken"),
        UnauthorizedRequestException = require("../exceptions/unauthorized-request-exception");

module.exports = (req, res, next) => {
    
    if(req.path.endsWith("/api/authenticate/login") || !req.path.includes("/api/")) {
        //if the user is trying to log in, don't require a token
        next();
        return;
    }

    let token = req.headers.authorization;
    token = token.substring(7);
    jwt.verify(token, process.env.SIGN_KEY, function(err, decoded) {
        if(err || decoded.iss != "pediatricsupport") {
            throw new UnauthorizedRequestException("Did not provide valid token")
        }
        req.decoded = {
            id: decoded.sub,
            level: decoded.lvl
        };
        next();
    });
}