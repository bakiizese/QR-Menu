import { Sequelize } from "sequelize";

const sequelize = new Sequelize({ dialect: "sqlite", storage: "./db.sqlite" });

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query("PRAGMA foreign_keys = ON");
    console.log("Database initialized successfuly");
  } catch (err) {
    console.error("unable to initialize db: ", err);
  }
};

initializeDB();

export default sequelize;
