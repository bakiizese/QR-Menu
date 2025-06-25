import express from "express";
import Admin from "../models/Admin.js";
import { hash_password, verify_password } from "../utils/password.js";
import { gen_jwt_token, gen_refresh_token } from "../utils/jwt.js";
import { superAdmin_authentication } from "./middleware.js";

const authRouter = express.Router();

const adminKeys = [
  "first_name",
  "last_name",
  "username",
  "password",
  "admin_level",
  "company_name",
  "company_type",
];

authRouter.post("/register", async (req, res) => {
  const adminData = req.body;

  //check data and dataType
  for (const key of adminKeys) {
    const adminElem = adminData[key];
    if (!adminElem) {
      return res.status(400).json({ error: `${key} missing` });
    } else if (typeof adminElem !== "string") {
      return res
        .status(400)
        .json({ error: `${key} value must be type string` });
    }
  }

  //check admin existance
  try {
    const checkExist = await Admin.findOne({
      where: {
        username: adminData["username"],
      },
    });

    if (checkExist) {
      return res.status(409).json({
        error: `admin already exist with username: ${adminData["username"]}`,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  //gen hash password
  const hashed_password = hash_password(adminData["password"]);
  adminData["password"] = hashed_password;

  //create admin user
  try {
    const admin = await Admin.create(adminData);
    return res.status(201).json({ admin: admin.id });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

authRouter.post("/login", async (req, res) => {
  const adminData = req.body;

  //check data
  if (!adminData["username"] && !adminData["password"]) {
    return res.status(400).json({ error: "username or password missing" });
  }

  //check existance and return
  try {
    const admin = await Admin.findOne({
      where: {
        username: adminData["username"],
      },
    });
    if (!admin) {
      return res.status(404).json({ error: "admin user not found" });
    }
    const verify = verify_password(adminData["password"], admin.password);

    if (!verify) {
      return res.status(401).json({ error: "incorrect password" });
    }
    const jwt_token = gen_jwt_token({
      user_id: admin.id,
      admin_level: admin.admin_level,
    });
    const jwt_refresh_token = gen_refresh_token({
      user_id: admin.id,
      admin_level: admin.admin_level,
    });
    res.cookie("jwt_token", jwt_token, {
      httpOnly: true,
      maxAge: 20 * 1000,
    });
    res.cookie("jwt_refresh_token", jwt_refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ admin: admin });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

authRouter.post("/logout", (req, res) => {});

authRouter.post(
  "/add-admin",
  superAdmin_authentication,
  async (req, res) => {}
);

export default authRouter;
