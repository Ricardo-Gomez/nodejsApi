const BaseHttpError = require("./BaseHttpError");

class BadGatewayError extends BaseHttpError {
    statusCode = 502;
    constructor(message){
        super(message);
    }
}

module.exports = BadGatewayError;