const   jwt                 = require("jsonwebtoken"),
        UnauthorizedRequestException = require("../exceptions/unauthorized-request-exception");

module.exports = (req, res, next) => {
    
    if(req.path.endsWith("/api/authenticate/login")) {
        //if the user is trying to log in, don't require a token
        next();
        return;
    }

    let token = req.headers.authorization;
    jwt.verify(token, process.env.SIGN_KEY, function(err, decoded) {
        if(err) {
            throw new UnauthorizedRequestException("Did not provide valid token")
        }
        req.decoded = decoded.data;
        next();
    });
}