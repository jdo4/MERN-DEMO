const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    name : String,
    phone : String,
    email : String,
    owner : String,
    cardDetail : {
      CVV : String,
      cardNumber : String,
      expMonth: String,
      expYear: String,
    },
    addressDetail : {
      address : String,
       city : String,
       province : String,
       postcode : String,
    },
    order : [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
        price : {
          type: Number,
        },
        total : {
          type: Number,
        }
      }

    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalShippingCost: {
      type: Number,
      required: true,
    },
    invoiceNo: {
      type: String,
    },
    duedate: {
      type: Date,
      default: Date.now() + 3 * 24 * 60 * 60 * 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let orderModel = model("order", orderSchema, "order");
module.exports = orderModel;
