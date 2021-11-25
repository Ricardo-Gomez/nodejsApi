const BaseHttpError = require("./BaseHttpError");

class BadRequestError extends BaseHttpError {
    statusCode = 400;
    error;
    constructor(message, error) {
        super(message)
        this.error = error;
    }
}

module.exports = BadRequestError;