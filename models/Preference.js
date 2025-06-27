import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Preference extends Model {}

Preference.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    updated_by_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: { model: "admin", key: "id" },
    },
  },
  { sequelize, modelName: "preference" }
);

export default Preference;
