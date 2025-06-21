import express from "express";

const userRouter = express.Router();

userRouter.get("/menu", (req, res) => {});
userRouter.get("/meal/:id", (req, res) => {});
userRouter.get("/review/:meal_id", (req, res) => {});
userRouter.post("/review/:meal_id", (req, res) => {});

export default userRouter;
