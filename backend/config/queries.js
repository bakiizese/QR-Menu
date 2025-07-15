import Admin from "../models/Admin.js";
import Meal from "../models/Meal.js";
import Preference from "../models/Preference.js";
import Review from "../models/Meal.js";

const models = {
  Admin: Admin,
  Meal: "Meal",
  Preference: Preference,
  Review: Review,
};

async function getOne(model, cond) {
  try {
    const data = await models[model].findOne({ where: cond });
    return data;
  } catch (err) {}
}
function getAll() {}
