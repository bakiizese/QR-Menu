import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Temp extends Model {}

Temp.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "temp" }
);

export default Temp;
