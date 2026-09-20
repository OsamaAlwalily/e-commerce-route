//create subcategory
import { asyncHandler } from "./../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Subcategory } from "./../../../DB/models/subcategory.model.js";
import { Category } from "./../../../DB/models/category.model.js";
import slugify from "slugify";

//create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  //data
  // const { name } = req.body;
  //categoryId ?? params
  const { categoryId } = req.params;

  //check category
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found!", { cause: 400 }));

  //check file
  if (!req.file) return next(new Error("Image is required", { cause: 404 }));

  //upload file
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory`,
    },
  );

  //save in DB
  const subcategory = await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    categoryId,
  });
  return res.json({ success: true, results: subcategory });
});

//update subcategory
export const updateSubcategory = asyncHandler(async (req, res, next) => {
  //check category
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  //check subcategory
  const subcategory = await Subcategory.findOne({
    id: req.params.subcategoryId,
    categoryId: req.params.categoryId,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  //check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("You are not authorized!"));

  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  //file?
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id,
    });
    subcategory.image.url = secure_url;
  }
  await subcategory.save();
  return res.json({
    success: true,
    message: "updated successfully!",
    results: subcategory,
  });
});

//delete subcategory
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  //check category
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  //check subcategory and delete
  const subcategory = await Subcategory.findOneAndDelete({
    id: req.params.subcategoryId,
    categoryId: req.params.categoryId,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  //check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("You are not authorized!"));

  return res.json({
    success: true,
    message: "deleted successfully!",
  });
});

//all subcategories
export const allSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await Subcategory.find().populate([
    { path: "categoryId" },
    { path: "createdBy" },
  ]);
  return res.json({ success: true, results: subcategories });
});
