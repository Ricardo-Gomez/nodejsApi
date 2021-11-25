const BaseHttpError = require("./BaseHttpError");

class NotFoundError extends BaseHttpError {
    statusCode = 404;
    constructor(message){
        super(message);
    }
}

module.exports = NotFoundError;