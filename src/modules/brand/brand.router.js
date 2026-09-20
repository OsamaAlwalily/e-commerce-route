import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createbrandSchema,
  deletebrandSchema,
  updatebrandSchema,
} from "./brand.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

import {
  createBrand,
  deleteBrand,
  updateBrand,
  allBrands,
} from "./brand.controller.js";
const router = Router();

//crud
//create brand
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(createbrandSchema),
  createBrand,
);

//update brand
router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(updatebrandSchema),
  updateBrand,
);

//delete brand
router.delete(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deletebrandSchema),
  deleteBrand,
);

//get brand
router.get("/", allBrands);

export default router;
