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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "review" }
);

export default Review;
