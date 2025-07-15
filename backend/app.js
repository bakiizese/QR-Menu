import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import association from "./models/Associations.js";
import authRouter from "./routes/admin_auth_route.js";
import adminRouter from "./routes/admin_route.js";
import userRouter from "./routes/user_route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

association();
sequelize.sync().then(() => console.log("tables successfult created"));

//admin-routes
app.use("/admin-auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, HOST, () =>
  console.log(`QR-Menu Server Running at ${HOST}:${PORT}/.....`)
);
