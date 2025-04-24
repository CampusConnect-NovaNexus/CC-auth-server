import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; 
if (!secret) {
  throw new Error("JWT secret is not set in environment variables.");
}

export const createJWT = (userId: string, userEmail?: string, expiresIn?: number) => {
  const payload = {
    userId,
    userEmail
  };
  
  const options: jwt.SignOptions = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  }
  
  const token = jwt.sign(payload, secret, options); 
  return token;
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getDetailsFromToken = (
  token: string
) => {
  try {
    const decoded = verifyJWT(token);
    const userId = (decoded as jwt.JwtPayload).userId as string;
    const emailId = (decoded as jwt.JwtPayload).userEmail as string;
    return { userId, emailId };
  } catch (error) {
    return null;
  }
};

export const isValidToken = (token: string) => {
  try {
    const decoded = verifyJWT(token);
    if (decoded==null) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
