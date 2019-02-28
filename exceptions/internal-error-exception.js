const PediatricSupportException = require("./pediatric-support-exception");

module.exports = class InternalErrorException extends PediatricSupportException {
    constructor(message) {
        super(message,500);
        this.name = this.constructor.name;
    }
}