const Joi = require("joi");

function validation(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(5)
      .max(20)
      .regex(/^[\w_]+\w$/)
      .required()
  });
  Joi.validate(req.body, schema, (err, result) => {
    if (err) {
      res.status(422).send(err.message);
    } else {
      next();
      // res.send("validation Succes");
    }
  });
}

module.exports = validation;
