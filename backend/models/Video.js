import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Video extends Model {}

Video.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    parent_id: {
      type: DataTypes.UUIDV4,
      defaultValue: null,
    },
    created_by_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: { model: "admins", key: "id" },
    },
  },
  { sequelize, modelName: "video" }
);

export default Video;
