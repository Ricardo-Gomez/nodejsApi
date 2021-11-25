const BadRequestError = require("../errors/BadRequestError");

exports.idsValidationMiddleware = (req, res, next) => {
   const {ids} = req.params;
   
   const idsArray = ids.split(',');
   const arrayValid = idsArray.map(id => {
       const idInt = parseInt(id);
       return idInt;
   });

   if(arrayValid.includes(NaN)) {
       return next(new BadRequestError('request validation error', 'ids param must be only numbers'));
   }

   req.params.ids = idsArray.length === 1 ? arrayValid[0] : arrayValid;
   return next()
}