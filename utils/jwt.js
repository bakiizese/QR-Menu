import jwt from "jsonwebtoken";

export function gen_jwt_token(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "20s",
  });

  return token;
}

export function jwt_verify(jwt_token) {
  const verify = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);
  if (verify) {
    return verify;
  }
  return false;
}

export function gen_refresh_token(payload) {
  const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });
  return refresh_token;
}

export function refresh_token_verify(refresh_token) {
  const verify = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);
  if (verify) {
    return verify;
  }
  return false;
}
