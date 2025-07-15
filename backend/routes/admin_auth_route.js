import express from "express";
import Admin from "../models/Admin.js";
import { hash_password, verify_password } from "../utils/password.js";
import {
  gen_invitation_id,
  gen_jwt_token,
  gen_refresh_token,
} from "../utils/jwt.js";
import {
  admin_authentication,
  superAdmin_authentication,
  invitation_authentication,
} from "./middleware.js";
import Temp from "../models/Temp.js";

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

async function admin_register(req, res, add = false) {
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
  const hashed_password = await hash_password(adminData["password"]);

  adminData["password"] = hashed_password;

  //create admin user
  try {
    const admin = await Admin.create(adminData);
    if (add) {
      await Temp.destroy({ where: { id: req.params.invitation_id } });
    }
    return res.status(201).json({ admin: admin.id });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

authRouter.post("/register", async (req, res) => {
  admin_register(req, res);
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
    const verify = await verify_password(adminData["password"], admin.password);

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
      maxAge: 60 * 60 * 1000,
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

authRouter.post("/logout", admin_authentication, (req, res) => {
  res.clearCookie("jwt_token", {
    httpOnly: true,
  });
  res.clearCookie("jwt_refresh_token", {
    httpOnly: true,
  });
  res.status(200).json({ user: "logged out" });
});

authRouter.get("/invite-admin", superAdmin_authentication, async (req, res) => {
  const adminData = await Admin.findOne({ where: { id: req.self_id } });
  const invitation_id = gen_invitation_id({
    company_name: adminData.company_name,
    company_type: adminData.company_type,
    admin_level: "admin",
  });
  const tempData = await Temp.create({ id: invitation_id });
  return res.status(201).json({ invitation_id: invitation_id });
});

authRouter.post(
  "/add-admin/:invitation_id",
  invitation_authentication,
  async (req, res) => {
    admin_register(req, res, true);
  }
);

export default authRouter;
