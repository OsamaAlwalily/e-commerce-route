import { asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import { Category } from "./../../../DB/models/category.model.js";
import cloudinary from "./../../utils/cloud.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";

//createCategory
export const createCategory = asyncHandler(async (req, res, next) => {
  //file
  if (!req.file) return next(new Error("Category image is required!"));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/category` },
  );

  //save category in DB
  const category = await Category.create({
    name: req.body.name,
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    slug: slugify(req.body.name),
  });

  //send response
  return res.status(201).json({ success: true, results: category });
});

//update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  //check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found!"));

  //check owner
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("You are not authorized!"));

  //name
  category.name = req.body?.name || category.name;

  //slug
  category.slug = req.body?.name ? slugify(req.body.name) : category.slug;

  //file
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id },
    );
    category.image.url = secure_url;
  }

  //save category
  await category.save();
  return res.json({ success: true });
});

//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  //check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Invalid category id!"));

  //check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("You are not authorized!"));

  //delete image
  const result = await cloudinary.uploader.destroy(category.image.id);
  console.log(result);

  //delete category
  // await category.remove();
  await Category.findByIdAndDelete(req.params.categoryId);

  //delete subcategories
  await Subcategory.deleteMany({ categoryId: req.params.categoryId });

  return res.json({ success: true, message: "category deleted!" });
});

//get all categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate({
    path: "subcategory",
    // select: "name",
    populate: [{ path: "createdBy" }],
  }); //nested populate
  console.log(categories);
  return res.json({ success: true, results: categories });
});
