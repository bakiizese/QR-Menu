import Admin from "./Admin.js";
import Meal from "./Meal.js";
import Preference from "./Preference.js";
import Review from "./Review.js";

const association = () => {
  Admin.hasMany(Meal, {
    foreignKey: "created_by_id",
  });

  Meal.belongsTo(Admin, {
    foreignKey: "created_by_id",
  });

  Meal.hasMany(Review, {
    foreignKey: "meal_id",
    onDelete: "CASCADE",
  });

  Review.belongsTo(Meal, {
    foreignKey: "meal_id",
  });

  Admin.hasOne(Preference, {
    foreignKey: "updated_by_id",
    onDelete: "CASCADE",
  });

  Preference.belongsTo(Admin, {
    foreignKey: "updated_by_id",
  });
};

export default association;
