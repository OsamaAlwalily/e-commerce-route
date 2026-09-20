import mongoose, { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1 },
        name: { type: String },
        itemPrice: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    invoice: { id: String, url: String },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    coupon: {
      id: {
        type: Types.ObjectId,
        ref: "Coupon",
      },
      name: { type: String },
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Canceled", "Refunded"],
      default: "Placed",
    },
    payment: { type: String, enum: ["Visa", "Cash"], default: "Cash" },
  },
  { timestamps: true },
);
//virtual
orderSchema.virtual("finalPrice").get(function () {
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount) / 100,
      ).toFixed(2)
    : this.price;
});

export const Order = mongoose.models.Order || model("Order", orderSchema);
