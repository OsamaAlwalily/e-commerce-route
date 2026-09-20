import "dotenv/config";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { nanoid } from "nanoid";
import { Brand } from "./../../../DB/models/brand.model.js";
import { Category } from "./../../../DB/models/category.model.js";
import { Subcategory } from "./../../../DB/models/subcategory.model.js";

//create product
export const addProduct = asyncHandler(async (req, res, next) => {
  //data
  // const {
  //   name,
  //   description,
  //   price,
  //   discount,
  //   availableItems,
  //   category,
  //   subcategory,
  //   brand,
  // } = req.body;

  //check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("Category not found ", { cause: 404 }));

  //check subcategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("subcategory not found ", { cause: 404 }));

  //check Brand
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found ", { cause: 404 }));

  //check files
  if (!req.files)
    return next(new Error("Product images are required", { cause: 400 }));

  //create unique folder name
  const cloudFolder = nanoid();
  let images = [];

  //upload subfiles
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` },
    );
    images.push({ id: public_id, url: secure_url });
  }

  //upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` },
  );

  //create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });
  console.log("Product2 without discount: ", product.finalPrice);

  //send response
  return res.status(201).json({ success: true, results: product });
});

//delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  //check product
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found"));

  //check owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new Error("Not authorized", { cause: 401 }));

  const imagesArr = product.images; // [{id: , url: }, {id: , url: }]
  const ids = imagesArr.map((imageObj) => imageObj.id);
  // console.log(ids);
  ids.push(product.defaultImage.id); //add id of default image

  //delete images
  const result = await cloudinary.api.delete_resources(ids);
  // console.log(result);

  //delete folder >>>> empty
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`,
  );

  //delete product from db
  await Product.findByIdAndDelete(req.params.productId);

  //send response
  return res.json({ success: true, message: "product deleted successfully" });
});

//all products
export const allProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error("category not found", { cause: 404 }));
    const products = await Product.find({ category: req.params.categoryId });
    return res.json({ success: true, results: products });
  }
  //data ? search by name
  // const products = await Product.find({ name: { $regex: req.query.name } });
  // const products = await Product.find();

  //data page
  // const { page } = req.query;
  // const limit = 2;
  // const skip = limit * (page - 1);

  // // pagination
  // const products = await Product.find().skip(skip).limit(limit);

  //select
  // const { fields } = req.query;
  // const products = await Product.find().select(fields);

  //sort
  // const { sort } = req.query;

  //**********search******************* */
  // const { keyword } = req.query;
  // const products = await Product.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } },
  //     { description: { $regex: keyword, $options: "i" } },
  //   ],
  // });

  //*****************************filter******************* */

  // const { name, price, sort } = req.query;
  // const products = await Product.find({ ...req.query });

  //************pagination***************** */
  // let { page } = req.query;
  // page = !page || page < 1 || isNaN(page) ? 1 : page;
  // const limit = 2;
  // const skip = (page - 1) * limit;
  // const products = await Product.find().skip(skip).limit(limit);
  // console.log("skip: ", skip);
  // return res.json({ page, success: true, results: products });

  //************sort***************** */
  // const { sort } = req.query;
  // console.log("sort: ", sort);
  // const products = await Product.find().sort(sort);

  //************selection***************** */
  // const { fields } = req.query;
  // console.log("fields: ", fields);

  // //model keys
  // const modelKeys = Object.keys(Product.schema.paths);
  // console.log("modelKeys: ", modelKeys);

  // //querykeys
  // const queryKeys = fields.split(" ");
  // console.log("queryKeys: ", queryKeys);

  // //matchedKeys
  // const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));
  // console.log("matchedKeys: ", matchedKeys);

  // const products = await Product.find().select(matchedKeys);
  // return res.json({ success: true, results: products });

  //--------------------------------------------------------------

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort);
  return res.json({ success: true, results: products });
});

//single product
export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  return res.json({ success: true, results: product });
});
