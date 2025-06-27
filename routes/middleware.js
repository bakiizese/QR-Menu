import { jwt_verify } from "../utils/jwt.js";

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

    if (verify.admin_level !== "super_admin") {
      return res.status(403).json({ error: "access only for super admin" });
    }

    res.user_id = verify.user_id;
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
