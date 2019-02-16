const PediatricSupportException = require("./pediatric-support-exception");

module.exports = class BadRequestException extends PediatricSupportException {
    constructor(message) {
        super(message,400);
        this.name = this.constructor.name;
    }
}