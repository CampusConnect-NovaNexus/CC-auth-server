import * as grpc from '@grpc/grpc-js';
import { Database } from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/hash';
import { createJWT, isValidToken, verifyJWT } from '../lib/jwt';
const prisma = Database.getClient();

export const register = async (call: any, callback: any) => {
  const { email, password, name } = call.request;
  console.log(`Register attempt for email: ${email}`);

  if (!prisma) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Database connection error',
    });
    return;
  }

  const hashedPassword = await hashPassword(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name || undefined,
      },
    });

    const accessToken = await createJWT(newUser.id, newUser.email, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes 
    const refreshToken = await createJWT(newUser.id, newUser.email, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days

    callback(null, { accessToken, refreshToken });
  } catch (err: any) {
    await Database.disconnect();
    if (err.code === 'P2002') {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        details: 'User already exists',
      });
    } else if (err.code === 'P2003') {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: 'Invalid data',
      });
    } else {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error',
      });
    }
  }
}

export const login = async (call: any, callback: any) => {
  const { email, password } = call.request;

  if (!prisma) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Database connection error',
    });
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        details: 'Invalid credentials',
      });
      return;
    }
    
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        details: 'Invalid credentials',
      });
      return;
    }
    
    const accessToken = createJWT(user.id, user.email, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes
    const refreshToken = createJWT(user.id, user.email, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days
    
    callback(null, { accessToken, refreshToken });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Internal server error',
    });
  }
}

export const validateToken = (call: any, callback: any) => {
  const { token } = call.request;
  
  if (!token) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'Token is required',
    });
    return;
  }
  
  try {
    const isValid = isValidToken(token);
    callback(null, { isValid: isValid }); 
  } catch (error) {
    console.log('Token validation error:', error);
    callback(null, { isValid: false }); 
  }
}

export const refreshToken = async (call: any, callback: any) => {
  const { token } = call.request;
  
  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        details: 'Invalid token',
      });
      return;
    }
    const userId = (decoded as any).userId;
    const userEmail = (decoded as any).userEmail;
    const newAccessToken = createJWT(userId, userEmail, Math.floor(Date.now() / 1000) + 60 * 15); // 15 minutes
    const newRefreshToken = createJWT(userId, userEmail, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30); // 30 days
    callback(null, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Internal server error',
    });
  }
}