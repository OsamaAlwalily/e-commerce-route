import { asyncHandler } from "./../../utils/asyncHandler.js";
import { User } from "./../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmails.js";
import { resetPassTemp, signUpTemp } from "./../../utils/generateHTML.js";
import jwt from "jsonwebtoken";
import { Token } from "./../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.model.js";
// import { isValid } from "./../../middleware/validation.middleware";

//register
export const register = asyncHandler(async (req, res, next) => {
  //data from request
  const { userName, email, password } = req.body;
  //check user existence
  const isUser = await User.findOne({ email });
  if (isUser)
    return next(new Error("Email already registered!", { cause: 409 }));
  //hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND),
  );
  //generate activationCode
  const activationCode = crypto.randomBytes(64).toString("hex");
  //create user
  const user = await User.create({
    userName,
    email,
    password: hashPassword,
    activationCode,
  });
  //create confirmationLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`;
  //send email
  const isSent = await sendEmail({
    to: email,
    subject: "activate account",
    html: signUpTemp(link),
  });
  //send response
  return isSent
    ? res.json({ success: true, message: "Please review your email!" })
    : next(new Error("Something went wrong!"));
});

//activate account
export const activateAccount = asyncHandler(async (req, res, next) => {
  // find user , delete the activationCode , update isConfirmed
  const user = await User.findOneAndUpdate(
    {
      activationCode: req.params.activationCode,
    },
    {
      isConfirmed: true,
      $unset: { activationCode: 1 },
    },
  );

  // check if the user doesn't exist
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  // create a cart
  await Cart.create({ user: user._id });

  // send response
  return res.send(
    "Congratulations, Your account is now activated!, try to login now",
  );
});

//login
export const login = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid email!", { cause: 400 }));
  // check isConfirmed
  if (!user.isConfirmed)
    return next(new Error("Unactivated account", { cause: 400 }));
  // check password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid password!", { cause: 400 }));
  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    { expiresIn: "2d" },
  );
  // save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  // change user status to online and save user
  user.status = "online";
  await user.save();
  // send response
  return res.json({ success: true, results: token });
});

//send forget code
export const sendForgetCode = asyncHandler(async (req, res, next) => {
  //check user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Invalid email!"));

  //generate code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  //save code in db
  user.forgetCode = code;
  await user.save();

  //send email
  return (await sendEmail({
    to: user.email,
    subject: "Reset password",
    html: resetPassTemp(code),
  }))
    ? res.json({ success: true, message: "Check your email!" })
    : next(new Error("Something went wrong"));
});

//reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  //check user
  let user = await User.findOne({ forgetCode: req.body.forgetCode });
  if (!user) return next(new Error("Invalid Code!"));

  //check code
  if (user.forgetCode !== req.body.forgetCode)
    return next(new Error("invalid code!"));

  user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $unset: { forgetCode: 1 } },
  );

  //save password
  user.password = bcryptjs.hashSync(
    req.body.password,
    Number(process.env.SALT_ROUND),
  );

  //save
  await user.save();

  //invalidate tokens
  const tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //send response
  return res.json({ success: true, message: "try to login!" });
});

// // reset password
// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { forgetCode, password } = req.body;

//   // 1. Find user by code
//   const user = await User.findOne({ forgetCode });
//   if (!user) return next(new Error("Invalid Code!"));

//   // 2. Remove forgetCode and update password
//   user.forgetCode = undefined;
//   user.password = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND));

//   // 3. Save updated user
//   await user.save();

//   // 4. Invalidate tokens efficiently in a single query
//   await Token.updateMany({ user: user._id }, { isValid: false });

//   // 5. Send response
//   return res.json({
//     success: true,
//     message: "Password reset successful, try to login!",
//   });
// });
