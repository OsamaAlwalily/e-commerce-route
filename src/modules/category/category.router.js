import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import subcategoryRouter from "./../subcategory/subcategory.router.js";
import productRouter from "./../product/product.router.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  allCategories,
} from "./category.controller.js";
const router = Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
router.use("/:categoryId/product", productRouter);

//crud
//create category
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(createCategorySchema),
  createCategory,
);

//update category
router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(updateCategorySchema),
  updateCategory,
);

//delete category
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCategorySchema),
  deleteCategory,
);

//get category
router.get("/", allCategories);

export default router;
