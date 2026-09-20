import mongoose, { Schema, model } from "mongoose";

//schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    activationCode: {
      type: String,
    },
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/df2ywzovw/image/upload/v1785784534/IMG-20220829-WA0002_vak7im.jpg",
      },
      id: {
        type: String,
        default: "IMG-20220829-WA0002_vak7im",
      },
    },
    coverImages: [
      {
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

//model
export const User = mongoose.models.User || model("User", userSchema);
