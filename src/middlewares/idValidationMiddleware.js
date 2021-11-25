const BadRequestError = require("../errors/BadRequestError");

exports.idValidationMiddleware = (req, res, next) => {
   const {id} = req.params;

   if(parseInt(id) === NaN) {
       return next(new BadRequestError('request validation error', 'id param must be number'));
   }

   return next()
}