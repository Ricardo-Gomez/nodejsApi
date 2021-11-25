const BaseHttpError = require("./BaseHttpError");

class InternalServerError extends BaseHttpError {
    statusCode = 500;
    error;
    constructor(message, error) {
        super(message)
        this.error = error;
    }
}

module.exports = InternalServerError;