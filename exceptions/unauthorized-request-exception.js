const PediatricSupportException = require("./pediatric-support-exception");

module.exports = class UnauthorizedRequestException extends PediatricSupportException {
    constructor(message) {
        super(message,401);
        this.name = this.constructor.name;
    }
}