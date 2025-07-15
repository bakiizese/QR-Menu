import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export async function hash_password(password) {
  const hashed_password = await bcrypt.hash(password, 10);

  return hashed_password;
}

export async function verify_password(password, hashed_password) {
  const verify = await bcrypt.compare(password, hashed_password);
  if (verify) {
    return true;
  }
  return false;
}

export async function update_password(reset_token, new_password) {
  try {
    const admin_user = await Admin.findOne({
      where: { reset_token: reset_token },
    });
    if (!admin_user) {
      return false;
    }
    admin_user.reset_token = "";
    admin_user.password = await hash_password(new_password);
    admin_user.save();
    return true;
  } catch (err) {
    throw err;
  }
}
