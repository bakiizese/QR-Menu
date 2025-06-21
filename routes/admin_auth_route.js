import express from "express";
import Admin from "../models/Admin.js";
const authRouter = express.Router();

const adminKeys = [
  "first_name",
  "last_name",
  "username",
  "password",
  "role",
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
        password: adminData["password"],
      },
    });
    if (admin) {
      return res.status(200).json({ admin: admin });
    }
    return res.status(404).json({ error: "admin user not found" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

authRouter.post("/logout", (req, res) => {});

authRouter.post("/add-admin", async (req, res) => {});

export default authRouter;
