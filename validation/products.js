const Joi = require("joi");

const schema = Joi.object().keys({
    name: Joi.string()
      .min(5)
      .max(20)
      .regex(/^[A-Z]+[\w ]+\w$/)
      .required(),
    category: Joi.string()
      .invalid("all")
      .required(),
    specification: Joi.string()
      .min(10)
      .max(100)
      .regex(/^[\w][\w+\s]+[(\w][/ \w]+[)a-z]$/)
      .required(),
    newprice: Joi.string()
      .regex(/^\d[,\d]+\d$/)
      .required(),
    oldprice: Joi.string()
      .regex(/^\d[,\d]+\d$/)
      .required(),
    imagename: Joi.string().required()
  });


module.exports=schema;