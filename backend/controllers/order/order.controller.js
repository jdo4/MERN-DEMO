const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const ObjectId = require("mongoose");
const {
  USER_TYPE: { ADMIN },
} = require("../../json/enums.json");
module.exports = exports = {
  purchase: async (req, res) => {
    const { body } = req;
    const { _id } = req.user;
   
    try {
      // create order
        await DB.ORDER.create({
          ...body,
          userId: _id,
        });

        // remove cart for this user
        await DB.CART.findOneAndDelete({
          userId: _id,
        });

        return apiResponse.OK({
          res,
          message: messages.ORDER_CREATED,
        });

       
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  getOrderHistory: async (req, res) => {
    const { _id, role } = req.user;
    let init = {};
    if (role !== ADMIN) {
      init = {
        userId: _id,
      };
    }
    try {
      const orders = await DB.ORDER.find(init)
        .populate({
          path: "order.productId",
            model: "product",
            select: {
              _id: 1,
              productName: 1,
              // pricing: 1,
              // shippingCost: 1,
              images: 1,
              description: 1,
            },
        })
        .populate("userId", {
          _id: 1,
          username: 1,
          email: 1,
        });
      return apiResponse.OK({ res, data: orders });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
};
