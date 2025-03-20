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

export const VerifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
   
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "") || req.query?.token;
    


  try {
    const decodedToken = jwt.verify(token, JWT_SECRET!) as DecodedToken;

    if (!decodedToken.userId) {
       res.status(401).json({ message: "Invalid token" });
    }

    prisma.user.findUnique({ where: { id: decodedToken.userId } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Invalid token" });
        }

        req.user = {
          id: user.id,
          email: user.email,
        };

        next(); // Proceed
      })
      .catch((error) => {
        console.error("DB error:", error);
        res.status(401).json({ message: "Invalid token" });
      });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

