import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/db";

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
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decodedToken.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
    }; // Attach user details to request

    next(); // Proceed to next middleware/controller
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
