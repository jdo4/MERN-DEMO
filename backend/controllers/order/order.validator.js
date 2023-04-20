const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  purchase: validator({
    body: Joi.object({
      name : Joi.string().required(),
      phone : Joi.string().required(),
      email : Joi.string().required(),
      owner : Joi.string(),
      addressDetail: Joi.object({
        address : Joi.string(),
        city : Joi.string(),
        province : Joi.string(),
        postcode : Joi.string(),
      }).required(),
      cardDetail: Joi.object({
        CVV : Joi.string(),
        cardNumber : Joi.string(),
        expMonth: Joi.string(),
        expYear: Joi.string(),
      }).required(),
      totalPrice : Joi.number(),
      totalShippingCost  : Joi.number(),
      invoiceNo : Joi.string(),
      order: Joi.array().items(Joi.object({
        productId: Joi.string(),
        quantity: Joi.number(),
        price: Joi.number(),
        total: Joi.number(),
    })),
    }).required(),
  }),
};
