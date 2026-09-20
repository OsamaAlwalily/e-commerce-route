//schema
import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 4, max: 15 },
    slug: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    // subCategories: [
    //   { type: Types.ObjectId, ref: "Subcategory", required: true },
    // ],
    brandId: { type: Types.ObjectId, ref: "Brand" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id", //category modle
  foreignField: "categoryId", // subcategory modle
});

//model
export const Category =
  mongoose.models.Category || model("Category", categorySchema);
