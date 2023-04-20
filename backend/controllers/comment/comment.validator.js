const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  create: validator({
    body: Joi.object({
      ratting: Joi.number(),
      text: Joi.string(),
      productId : Joi.string(),
    }).required(),
  }),
  delete: validator({
    params: Joi.object({
      id: Joi.string().required(),
    }),
  }),
};
