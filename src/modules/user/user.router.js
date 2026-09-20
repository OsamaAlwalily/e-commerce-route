import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  activateSchema,
  forgetCodeSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./user.validation.js";
import {
  activateAccount,
  register,
  login,
  sendForgetCode,
  resetPassword,
} from "./user.controller.js";

const router = Router();

//register
router.post("/register", isValid(registerSchema), register);

//activate account
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateSchema),
  activateAccount,
);

//login
router.post("/login", isValid(loginSchema), login);

//send forget password code
router.patch("/forgetCode", isValid(forgetCodeSchema), sendForgetCode);

//reset password
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default router;
