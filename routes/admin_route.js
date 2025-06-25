import express from "express";
import Admin from "../models/Admin.js";
import Meal from "../models/Meal.js";
import Review from "../models/Review.js";
import {
  admin_authentication,
  superAdmin_authentication,
} from "./middleware.js";
import { gen_jwt_token, refresh_token_verify } from "../utils/jwt.js";

const adminRouter = express.Router();

const adminKeys = ["first_name", "last_name", "username"];
const mealKeys = ["created_by_id", "title", "is_available"];

//only for superadmin only
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
adminRouter.put("/profile/:id", superAdmin_authentication, async (req, res) => {
  const admin_id = req.params.id;
  const updateData = req.body;

  try {
    const adminData = await Admin.findOne({ where: { id: admin_id } });
    if (!adminData) {
      return res.status(404).json({ error: "admin user not found" });
    }
    for (const key of adminKeys) {
    }
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

//for admin and super admin
adminRouter.get("/refresh-token", async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  const verify = refresh_token_verify(refresh_token);
  if (!verify) {
    return res.status(401).json({ error: "refresh token not autherized" });
  }
  const jwt_token = gen_jwt_token(verify);
  res.cookie("jwt_token", jwt_token, {
    httpOnly: true,
    maxAge: 20 * 1000,
  });
  res.status(201).json({ jwt_token: jwt_token });
});
adminRouter.put("/password", admin_authentication, async (req, res) => {});
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
      mealData[key] = updateData[key];
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

export default adminRouter;
