import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT secret not found");
}

// Extend Express's Request type to include "user"
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
}

export const VerifyJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    
    const token = 
      req.cookies?.token || 
      req.header("Authorization")?.replace("Bearer ", "") || 
      req.query.token as string;
      
      
    if (!token) {
       res.status(401).json({ message: "Authentication required" });
       return
    }

   
    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    if (!decodedToken.userId) {
       res.status(401).json({ message: "Invalid token" });
       return
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decodedToken.userId,
        token 
      }
    });

    if (!user) {
       res.status(401).json({ message: "Invalid or expired token" });
       return
    }

    
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
     res.status(401).json({ message: "Invalid or expired token" });
     return
  }
};