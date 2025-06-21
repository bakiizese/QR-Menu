import express from "express";
import Admin from "../models/Admin.js";

const adminRouter = express.Router();

const adminKeys = [
  "first_name",
  "last_name",
  "username",
  "role",
  "company_name",
  "company_type",
];

//only for superadmin only
adminRouter.get("/profile/:id", async (req, res) => {
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
adminRouter.put("/profile/:id", async (req, res) => {
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

//for admin and super admin
adminRouter.get("/profile", async (req, res) => {});
adminRouter.put("/profile", async (req, res) => {});

adminRouter.get("/all-meal", (req, res) => {});
adminRouter.get("/meal/:id", (req, res) => {});
adminRouter.post("/meal", (req, res) => {});
adminRouter.put("/meal/:id", (req, res) => {});
adminRouter.delete("/meal/:id", (req, res) => {});

adminRouter.get("/preference", (req, res) => {});
adminRouter.put("/preference", (req, res) => {});
adminRouter.get("/all-review", (req, res) => {});
adminRouter.get("/review/:meal_id", (req, res) => {});

export default adminRouter;
