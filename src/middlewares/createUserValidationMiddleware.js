const BadRequestError = require("../errors/BadRequestError");

exports.createUserValidationMiddleware = (req, res, next) => {
    console.log("USER", req.body);
  let validationError;
  const requiredFields = ["id"];
  const numberFields = ["id"];
  const requiredFieldMessage = "is Required";
  const numberFieldMessage = "must be number";
  const { user } = req.body;
  let errors = [];
  console.log("USER", req);
  if (!user) {
    validationError = new BadRequestError("empty user request");
    return next(validationError);
  }

  for (const property in user) {
    if (
      (requiredFields.includes(property) && user[property] === "") ||
      user[property] === null
    ) {
      errors.push(`field ${property} ${requiredFieldMessage}`);
    }
    if (numberFields.includes(property) && isNaN(user[property])) {
      errors.push(`field ${property} ${numberFieldMessage}`);
    }
  }
  if (errors.length > 0) {
    validationError = new BadRequestError("validation error", errors);
    return next(validationError);
  }

  return next();
};
