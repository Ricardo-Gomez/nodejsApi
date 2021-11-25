class BaseHttpError extends Error {
    statusCode;
    message;
    error;
    constructor(message) {
        super(message);
        this.message = message
        this.name = this.constructor.name
    }
    getStatusCode() {
        return this.statusCode;
    }

    getMessage() {
        return this.message;
    }
    getError() {
        return this.error;
    }
}

module.exports = BaseHttpError;