const UnauthorizedRequestException = require("../exceptions/unauthorized-request-exception");

exports.ADMIN = (req, res, next) => {
  if (req.decoded.level !== 'admin') {
    throw new UnauthorizedRequestException(`Access level required: 'admin', received: '${req.decoded.level}'`);
  }
  next();
}

exports.PATIENT = (req, res, next) => {
  if (req.decoded.level !== 'patient' && req.decoded.level !== 'admin') {
    //admins can access patient routes, but not vice-versa
    throw new UnauthorizedRequestException(`Access level required: 'patient', received: '${req.decoded.level}'`);
  }
  next();
}

exports.PARENT = (req, res, next) => {
  if (req.decoded.level !== 'parent' && req.decoded.level !== 'admin') {
    throw new UnauthorizedRequestException(`Access level required: 'parent', received: '${req.decoded.level}'`);
  }
  next();
}