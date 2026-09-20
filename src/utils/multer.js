import multer, { diskStorage } from "multer";

export const filterObject = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};

// export const fileUpload = (filterArray) => {
//   const fileFilter = (req, file, cb) => {
//     if (!filterArray.includes(file.mimetype)) {
//       return cb(new Error("invalid file format!"), false);
//     }
//     return cb(null, true);
//   };
//   return multer({ storage: diskStorage({}), fileFilter });
// };

export const fileUpload = (filterArray) => {
  const fileFilter = (req, file, cb) => {
    // تحقق من الامتداد بدل الـ mimetype
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      return cb(new Error("invalid file format!"), false);
    }
    return cb(null, true);
  };

  const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  return multer({ storage, fileFilter });
};
