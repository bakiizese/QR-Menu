import jwt from "jsonwebtoken";

export function gen_jwt_token(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "60m",
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

//verify reset token to make sure user uses it on time
// and while checking make sure to remove the reset token from admin user
export function gen_reset_token(username) {
  const reset_token = jwt.sign(
    { username: username },
    process.env.PASSWORD_RESET_KEY
  );
  return reset_token;
}

export function gen_invitation_id(payload) {
  const invitation_id = jwt.sign(payload, process.env.INVITATION_ID_KEY, {
    expiresIn: "1h",
  });
  return invitation_id;
}

export function verify_inivitation_id(invitation_id) {
  const verify = jwt.verify(invitation_id, process.env.INVITATION_ID_KEY);
  if (verify) {
    return verify;
  }
  return verify;
}
