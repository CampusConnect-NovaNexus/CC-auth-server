import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; 
if (!secret) {
  throw new Error("JWT secret is not set in environment variables.");
}

export const createJWT = async (userId: string, userEmail?: string, expiresIn?: number) => {
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

export const getDetailsFromToken = async (
  token: string
): Promise<{ userId: string; emailId: string } | null> => {
  const decoded = verifyJWT(token);
  if (!decoded) {
    return null;
  }
  const userId = (decoded as jwt.JwtPayload).userId as string;
  const emailId = (decoded as jwt.JwtPayload).userEmail as string;

  return { userId, emailId };
};

export const isValidToken = async (token: string): Promise<boolean> => {
  const decoded = verifyJWT(token);
  return !!decoded;
}
