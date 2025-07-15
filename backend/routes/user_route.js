import express from "express";
import Meal from "../models/Meal.js";
import Review from "../models/Review.js";

const userRouter = express.Router();

const reviewKeys = ["meal_id", "created_by_id", "rating"];

userRouter.get("/menu", async (req, res) => {
  try {
    const menuData = await Meal.findAll({ where: { is_available: true } });

    if (menuData.length > 0) {
      return res.status(200).json({ menu: menuData });
    }
    return res.status(404).json({ error: "available meals nout found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
userRouter.get("/meal/:id", async (req, res) => {
  const meal_id = req.params.id;

  try {
    const mealData = await Meal.findOne({
      where: { id: meal_id },
      include: {
        model: Review,
        where: { meal_id: meal_id },
      },
    });

    if (mealData) {
      return res.status(200).json({ meal: mealData });
    }
    return res.status(404).json({ error: "meal not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
userRouter.get("/review/:meal_id", async (req, res) => {
  const meal_id = req.params.meal_id;

  try {
    const reviewDatas = await Review.findAll({ where: { meal_id: meal_id } });
    if (reviewDatas.length > 0) {
      return res.status(200).json({ reviews: reviewDatas });
    }
    return res.status(404).json({ error: "reviews not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
//if user liked the meal and wants to put review to it too, make sure not to create another review data
userRouter.put("/review/:id", async (req, res) => {
  const review_id = req.params.id;
  const updateData = req.body;

  try {
    const reviewData = await Review.findOne({ where: { id: review_id } });
    if (!reviewData) {
      return res.status(404).json({ error: "review not found" });
    }
    for (const key in updateData) {
      reviewData[key] = updateData[key];
    }
    reviewData.save();
    return res.status(200).json({ review: "review updated succesfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
//when user creates a review make sure one if this is present comment, review or like
userRouter.post("/review/:meal_id", async (req, res) => {
  const meal_id = req.params.meal_id;
  const reviewData = req.body;

  try {
    for (const key of reviewKeys) {
      if (!reviewData[key]) {
        return res.status(400).json({ error: `${key} missing` });
      }
    }
    const newReview = await Review.create(reviewData);
    if (newReview) {
      return res.status(201).json({ review: newReview });
    }
    return res.status(500).json({ error: "unable to create review" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

export default userRouter;
