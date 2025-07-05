import express from "express";
import Admin from "../models/Admin.js";
import Meal from "../models/Meal.js";
import Review from "../models/Review.js";
import Video from "../models/Video.js";
import Image from "../models/Image.js";
import {
  admin_authentication,
  superAdmin_authentication,
} from "./middleware.js";
import {
  gen_jwt_token,
  gen_reset_token,
  refresh_token_verify,
} from "../utils/jwt.js";
import {
  hash_password,
  update_password,
  verify_password,
} from "../utils/password.js";
import QRCode from "qrcode";
import { uploadFields } from "../utils/upload.js";
import fs, { cpSync } from "fs";

const adminRouter = express.Router();

const adminKeys = [
  "first_name",
  "last_name",
  "username",
  "company_name",
  "company_type",
  "admin_level",
];
const mealKeys = ["created_by_id", "title", "is_available", "updated_by_id"];
const classes = { image: Image, video: Video };

//SupetAdmin Managment
adminRouter.get("/profiles", superAdmin_authentication, async (req, res) => {
  try {
    const adminData = await Admin.findAll();
    if (adminData.length > 0) {
      return res.status(200).json({ "admin-users": adminData });
    }
    return res.status(404).json({ error: "admin users not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/profile/:id", superAdmin_authentication, async (req, res) => {
  const admin_id = req.params.id;
  try {
    const adminData = await Admin.findOne({ where: { id: admin_id } });
    if (adminData) {
      return res.status(200).json({ admin: adminData });
    }
    return res.status(404).json({ error: "admin user not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.delete(
  "/admin-user/:id",
  superAdmin_authentication,
  async (req, res) => {
    const admin_id = req.params.id;
    try {
      const adminData = await Admin.destroy({ where: { id: admin_id } });
      if (adminData) {
        return res.status(200).json({ admin: "deleted successfuly" });
      }
      return res.status(404).json({ error: "admin user not found" });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

//Profile Management
adminRouter.post("/reset-token", async (req, res) => {
  const userData = req.body;

  if (!userData["username"]) {
    return res.status(400).json({ error: "username missing" });
  }
  try {
    const adminData = await Admin.findOne({
      where: { username: userData["username"] },
    });
    if (!adminData) {
      return res.status(404).json({ user: "user not found" });
    }
    const reset_token = gen_reset_token(userData["username"]);
    adminData.reset_token = reset_token;
    adminData.save();
    return res.status(201).json({ reset_token: reset_token });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/refresh-token", async (req, res) => {
  const refresh_token = req.cookies.jwt_refresh_token;
  const verify = refresh_token_verify(refresh_token);
  if (!verify) {
    return res.status(401).json({ error: "refresh token not autherized" });
  }
  delete verify.exp;
  delete verify.iat;
  const jwt_token = gen_jwt_token(verify);
  res.cookie("jwt_token", jwt_token, {
    httpOnly: true,
    maxAge: 20 * 1000,
  });
  res.status(201).json({ jwt_token: jwt_token });
});
adminRouter.put("/password", async (req, res) => {
  const passwordData = req.body;

  for (const key of ["reset_token", "password"]) {
    if (!passwordData[key]) {
      return res.status(400).json({ error: `${key} missing` });
    }
  }
  try {
    const updatePassword = await update_password(
      passwordData["reset_token"],
      passwordData["password"]
    );
    if (!updatePassword) {
      return res.status(404).json({ error: "incorrect reset_token" });
    }
    return res.status(200).json({ error: "password updated successfuly" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/profile", admin_authentication, async (req, res) => {
  const self_id = req.self_id;
  try {
    const adminData = await Admin.findOne({ where: { id: self_id } });
    if (adminData) {
      return res.status(200).json({ admin: adminData });
    }
    return res.status(404).json({ error: "admin user not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.put("/profile", admin_authentication, async (req, res) => {
  const self_id = req.self_id;
  const updateData = req.body;
  try {
    const adminData = await Admin.findOne({ where: { id: self_id } });
    if (!adminData) {
      return res.status(404).json({ error: "admin user not found" });
    }
    if (updateData["new_password"]) {
      if (!updateData["old_password"]) {
        return res.status(400).json({ error: "old password missing" });
      }
      const verify = await verify_password(
        updateData["old_password"],
        adminData.password
      );
      if (!verify) {
        return res.status(400).json({ error: "incorrect old password" });
      }
      adminData.password = await hash_password(updateData["new_password"]);
      delete updateData.new_password;
      delete updateData.old_password;
    }
    for (const key of adminKeys) {
      const adminElem = updateData[key];
      if (adminElem) {
        if (typeof adminElem !== "string") {
          return res.status(400).json({ error: `${key} must be type string` });
        }
        adminData[key] = adminElem;
      }
    }
    adminData.save();
    return res.status(200).json({ admin: "profile successfuly updated" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.delete("/self", admin_authentication, async (req, res) => {
  const self_id = req.self_id;

  try {
    const selfDestroy = await Admin.destroy({ where: { id: self_id } });
    if (!selfDestroy) {
      return res.status(404).json({ error: "admin user not found" });
    }
    res.clearCookie("jwt_token", {
      httpOnly: true,
    });
    res.clearCookie("jwt_refresh_token", {
      httpOnly: true,
    });
    return res.status(200).json({ admin: "user deleted successfuly" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

//Meal Management
adminRouter.get("/all-meal", admin_authentication, async (req, res) => {
  try {
    const mealsData = await Meal.findAll();
    if (mealsData.length > 0) {
      return res.status(200).json({ meals: mealsData });
    }
    return res.status(404).json({ error: "meals not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/meal/:id", admin_authentication, async (req, res) => {
  const meal_id = req.params.id;
  try {
    const mealData = await Meal.findOne({ where: { id: meal_id } });
    if (mealData) {
      return res.status(200).json({ meal: mealData });
    }
    return res.status(404).json({ error: "meal not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.post("/meal", admin_authentication, async (req, res) => {
  const mealData = req.body;

  for (const key of mealKeys) {
    if (!mealData[key]) {
      return res.status(400).json({ error: `${key} is missing` });
    }
  }
  const mealExist = await Meal.findOne({ where: { title: mealData["title"] } });
  if (mealExist) {
    return res.status(400).json({ error: "meal already exists" });
  }
  try {
    const newMeal = await Meal.create(mealData);
    if (newMeal) {
      return res.status(201).json({ meal: newMeal });
    }
    return res.status(500).json({ error: "unable to create new meal" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.put("/meal/:id", admin_authentication, async (req, res) => {
  const meal_id = req.params.id;
  const updateData = req.body;

  try {
    const mealData = await Meal.findOne({ where: { id: meal_id } });
    if (!mealData) {
      return res.status(404).json({ error: "meal not found" });
    }
    for (const key in updateData) {
      if (["video", "image"].includes(key)) {
        if (updateData[key].length < 1) {
          mealData[key] = null;
        } else {
          mealData[key] = [...(mealData[key] || []), updateData[key]];
        }
      } else {
        mealData[key] = updateData[key];
      }
    }
    mealData.save();
    return res.status(200).json({ meal: "meal updated successfuly" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.delete("/meal/:id", admin_authentication, async (req, res) => {
  const meal_id = req.params.id;

  try {
    const removeMeal = await Meal.destroy({ where: { id: meal_id } });

    if (!removeMeal) {
      return res.status(404).json({ error: "meal not found" });
    }
    return res.status(200).json({ meal: "meal successfuly removed" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

adminRouter.get("/preference", admin_authentication, (req, res) => {});
adminRouter.put("/preference", admin_authentication, (req, res) => {});

adminRouter.get("/all-review", admin_authentication, async (req, res) => {
  try {
    const reviewDatas = await Review.findAll();
    if (reviewDatas.length > 0) {
      return res.status(200).json({ reviews: reviewDatas });
    }
    return res.status(404).json({ error: "reviews not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/review/:meal_id", admin_authentication, async (req, res) => {
  const meal_id = req.params.id;
  const reviews_by_meal_id = `reviews_by_meal_id: ${meal_id}`;
  try {
    const reviewData = await Review.findAll({ where: { meal_id: meal_id } });
    if (reviewData.length > 0) {
      return res.status(200).json({ [reviews_by_meal_id]: reviewData });
    }
    return res.status(404).json({ error: `reviews not found` });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/qrcode", admin_authentication, async (req, res) => {
  const data = req.body;
  const filePath = "./uploads/qrcode_img/qrcode.png";

  if (!data["url"]) {
    return res.status(400).json({ error: "url missing" });
  }

  try {
    await QRCode.toFile(filePath, data["url"]);
    return res.status(201).json({ qrcode: "qrcode successfuly created" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.get("/all-video", admin_authentication, async (req, res) => {
  const videoData = await Video.findAll();
  if (videoData.length < 0) {
    return res.status(404).json({ error: "videos not found" });
  }
  return res.status(200).json({ videos: videoData });
});
adminRouter.get("/all-image", admin_authentication, async (req, res) => {
  const imageData = await Image.findAll();
  if (imageData.length < 0) {
    return res.status(404).json({ error: "images not found" });
  }
  return res.status(200).json({ images: imageData });
});
adminRouter.get("/video/:id", admin_authentication, async (req, res) => {
  const video_id = req.params.id;
  const videoData = await Video.findOne({ where: { id: video_id } });

  if (!videoData) {
    return res.status(404).json({ error: "video not found" });
  }
  return res.status(200).json({ video: videoData });
});
adminRouter.get("/image/:id", admin_authentication, async (req, res) => {
  const image_id = req.params.id;
  const imageData = await Image.findOne({ where: { id: image_id } });

  if (!imageData) {
    return res.status(404).json({ error: "image not found" });
  }
  return res.status(200).json({ image: imageData });
});
adminRouter.post(
  "/upload",
  admin_authentication,
  uploadFields,
  async (req, res) => {
    const file = req.files;
    const self_id = req.self_id;
    if (!file) return res.status(400).json({ error: "file missing" });

    if (Object.entries(file).length === 0) {
      return res.status(400).json({ error: "file's data is missing" });
    }

    try {
      for (const key in file) {
        for (const item of file[key]) {
          const uploadData = classes[item.fieldname].create({
            path: item.path,
            created_by_id: self_id,
          });
          if (!uploadData) {
            return res
              .status(500)
              .json({ error: "unable to create video or image data" });
          }
        }
      }
      return res.status(200).json({ file: "successfully uploaded" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  }
);

//fix for multiple uploads or updates of image and video to be stored correctly as an array
adminRouter.put("/upload", admin_authentication, async (req, res) => {
  const parentData = req.body;
  const fileKeys = ["parent_id", "parent_name", "file_type", "file_id"];

  for (const key of fileKeys) {
    if (!parentData[key]) {
      return res.status(400).json({ error: `${key} missing` });
    }
  }
  try {
    const fileData = await classes[parentData["file_type"]].findOne({
      where: { id: parentData["file_id"] },
    });

    if (!fileData) {
      return res
        .status(404)
        .json({ error: `${parentData["file_type"]} not found` });
    }

    const mealData = await Meal.findOne({
      where: { id: parentData["parent_id"] },
    });
    if (!mealData) {
      return res.status(404).json({ error: "meal not found" });
    }

    mealData[parentData["file_type"]] = [
      ...(mealData[parentData["file_type"]] || []),
      parentData["file_id"],
    ];

    mealData.save();
    for (const key in parentData) {
      fileData[key] = parentData[key];
    }
    fileData.save();
    return res
      .status(200)
      .json({ error: `${parentData["file_type"]} updated successfuly` });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
adminRouter.delete("/upload", admin_authentication, async (req, res) => {
  const dataIds = req.body;

  for (const item in dataIds) {
    for (const key of dataIds[item]) {
      let filePath = await classes[item].findOne({ where: { id: key } });
      if (!filePath) {
        return res.status(404).json({ error: "file not found" });
      }
      filePath = filePath.path;
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
      });
      const deleteData = await classes[item].destroy({ where: { id: key } });
      if (!deleteData) {
        return res.status(404).json({ error: "file not found" });
      }
    }
  }
  return res.status(200).json({ file: "file deleted successfully" });
});
export default adminRouter;
