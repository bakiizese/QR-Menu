import Temp from "../models/Temp.js";
import { jwt_verify, verify_inivitation_id } from "../utils/jwt.js";

export function superAdmin_authentication(req, res, next) {
  try {
    req.cookies.jwt_token;
  } catch (err) {
    return res.status(500).json({ error: "jwt token missing", detail: err });
  }
  const jwt_token = req.cookies.jwt_token;

  try {
    const verify = jwt_verify(jwt_token);
    if (!verify) {
      return res.status(401).json({ error: "token not autherized" });
    }

    if (verify.admin_level !== "superadmin") {
      return res.status(403).json({ error: "access only for super admin" });
    }
    req.self_id = verify.user_id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token has expired" });
    } else {
      return res.status(401).json({ error: "invalid token", detail: err });
    }
  }
}

export function admin_authentication(req, res, next) {
  const jwt_token = req.cookies.jwt_token;
  if (!jwt_token) {
    return res.status(500).json({ error: "jwt token missing" });
  }

  try {
    const verify = jwt_verify(jwt_token);

    if (!verify) {
      return res.status(401).json({ error: "token not autherized" });
    }

    req.self_id = verify.user_id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token has expired" });
    } else {
      return res.status(401).json({ error: "invalid token", detail: err });
    }
  }
}

export async function invitation_authentication(req, res, next) {
  const invitation_id = req.params.invitation_id;
  try {
    const checkTemp = await Temp.findOne({ where: { id: invitation_id } });
    if (!checkTemp) {
      return res.status(401).json({ error: "token not available" });
    }
    const verify = verify_inivitation_id(invitation_id);
    if (!verify) {
      return res.status(401).json({ error: "token not autherized" });
    }
    let currentBody = req.body;
    for (const key in verify) {
      currentBody[key] = verify[key];
    }

    req.body = currentBody;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredErrro") {
      return res.status(401).json({ error: "token has expired" });
    } else {
      return res.status(401).json({ error: "invalid error", detail: err });
    }
  }
}
