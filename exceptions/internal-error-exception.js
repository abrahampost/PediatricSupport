const PediatricSupportException = require("./pediatric-support-exception");

module.exports = class InternalErrorException extends PediatricSupportException {
    constructor(message, e) {
        super(message,500);
        this.name = this.constructor.name;
        this.e = e;
    }
}