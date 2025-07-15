import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.includes("image")) {
      cb(null, "./uploads/images");
    } else if (file.mimetype.includes("video")) {
      cb(null, "./uploads/videos");
    } else {
      cb(null, "./uploads");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedtypes = ["image/jpeg", "image/png", "video/mp4", "video/mpeg"];

  if (allowedtypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only images and video are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter });

export const uploadFields = upload.fields([
  { name: "image", maxCount: 20 },
  { name: "video", maxCount: 10 },
]);
