import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    created_by_id: {
      type: DataTypes.UUIDV4,
    },
    meal_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    review: {
      type: DataTypes.STRING,
    },
    like: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize, modelName: "review" }
);

export default Review;
