import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utils/appError'; // Your custom error class

export const attachUserRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get the token from the headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    console.log(token)
    if(!token) {
        throw new ApiError(401, 'Access denied. Token missing.');
    }
    // 2. Verify and decode the JWT
    // (Assuming your JWT was signed with an object like { userId: "123", role: "ADMIN" })
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
      role: string;
    };

    // 3. ATTACH GLOBALLY: Add the decoded user data to the request object
    req.user = decoded;

    // 4. Move to the next step in the pipeline (which will be your controller)
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
       next(new ApiError(401, 'Your session has expired. Please log in again.'));
    } else {
       next(new ApiError(401, 'Invalid authentication token.'));
    }
  }
};