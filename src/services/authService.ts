import { Request, Response } from "express"
import { Database } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/hash";
import { createJWT, getDetailsFromToken, isValidToken } from "../lib/jwt";
import { loginSchema, LoginSchema, registerSchema, RegisterSchema } from "../validators/auth";

export const login = async (req: Request, res: Response):Promise<any> => {
  const body: LoginSchema = req.body;
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const prisma = Database.getClient();

  const user = await prisma.user.findUnique({
    where: {
      email: parsedBody.data.email,
    },
  });

  await Database.disconnect();

  if (!user || !(await verifyPassword(parsedBody.data.password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = await createJWT(user.id, user.email, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes 
  const refreshToken = await createJWT(user.id, user.email, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days

  return res.status(200).json({ accessToken, refreshToken });
};

export const register = async (req: Request, res: Response):Promise<any> => {
  const body: RegisterSchema = req.body;
  const parsedBody = registerSchema.safeParse(body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const prisma = Database.getClient();

  const hashedPassword = await hashPassword(parsedBody.data.password);

  try {
    const newUser = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        password: hashedPassword,
        name: parsedBody.data.name || undefined,
      },
    });

    await Database.disconnect();

    const accessToken = await createJWT(newUser.id, newUser.email, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes 
    const refreshToken = await createJWT(newUser.id, newUser.email, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days

    return res.status(200).json({ message: "User Created successfully", accessToken, refreshToken });
  } catch (err: any) {
    await Database.disconnect();
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'User already exists' });
    } else {
      return res.status(500).json({ 
        error: 'Internal server error', 
        details: err
      });
    }
  }
}

export const refreshToken = async (req: Request, res: Response):Promise<any> => {
  const body = req.body;
  const oldRefreshToken = body.refreshToken; 
  
  if (!oldRefreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }
  
  const tokenDetails = await getDetailsFromToken(oldRefreshToken);
  if (!tokenDetails) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  const { userId, emailId } = tokenDetails;
  if (await isValidToken(oldRefreshToken)) {
    const newAccessToken = await createJWT(userId!, emailId!, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes
    const newRefreshToken = await createJWT(userId!, emailId!, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days
    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } else {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}