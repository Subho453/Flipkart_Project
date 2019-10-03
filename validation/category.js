const Joi = require("joi");

function updateValidation(){
const schema = Joi.object().keys({
  name: Joi.string()
    .min(5)
    .max(20)
    .regex(/^[\w_]+\w$/)
    .required()
});
Joi.validate(req.body, schema, (err, result,next) => {
  if (err) {
    next(err);
  } else {
    next();
  }
});
}
module.exports = updateValidation;
