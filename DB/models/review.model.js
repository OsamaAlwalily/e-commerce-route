import mongoose, { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Review = mongoose.models.Review || model("Review", reviewSchema);
