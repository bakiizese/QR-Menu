import Admin from "./Admin.js";
import Meal from "./Meal.js";
import Preference from "./Preference.js";
import Review from "./Review.js";
import Video from "./Video.js";
import Image from "./Image.js";

const association = () => {
  Admin.hasMany(Meal, {
    foreignKey: "created_by_id",
    as: "created_meals",
  });

  Admin.hasMany(Meal, {
    foreignKey: "updated_by_id",
    as: "updated_meals",
  });

  Admin.hasMany(Video, {
    foreignKey: "created_by_id",
    as: "videosCreated",
  });

  Video.belongsTo(Admin, {
    foreignKey: "created_by_id",
    as: "creator",
  });

  Admin.hasMany(Image, {
    foreignKey: "created_by_id",
    as: "imagesCreated",
  });

  Image.belongsTo(Admin, {
    foreignKey: "created_by_id",
    as: "creator",
  });

  Meal.belongsTo(Admin, {
    foreignKey: "created_by_id",
    as: "created_by",
  });
  Meal.belongsTo(Admin, {
    foreignKey: "updated_by_id",
    as: "updated_by",
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
  });

  Preference.belongsTo(Admin, {
    foreignKey: "updated_by_id",
  });
};

export default association;
