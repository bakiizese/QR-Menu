import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Meal extends Model {}

Meal.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    created_by_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    updated_by_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.JSON,
    },
    video: {
      type: DataTypes.JSON,
    },
    max_eta: {
      type: DataTypes.INTEGER,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "meal" }
);

export default Meal;
