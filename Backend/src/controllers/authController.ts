import { Request, Response } from "express";
import { oauth2client } from "../utils/googleConfig";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT secret not found");
}

const prisma = new PrismaClient();

// Common Cookie Options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    
    if (!code) {
       res.status(400).json({ message: "Authorization code is required" });
       return
    }
    
    const googleRes = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(googleRes.tokens);

    
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    
    const { email, name } = userRes.data;
    
    
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          password: "", 
          authType: "GOOGLE",
        }
      });
    }
    
    
    const token = jwt.sign(
      { userId: user.id, email }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );
    
    
    user = await prisma.user.update({
      where: { id: user.id },
      data: { 
        token,
        name: user.name || name || null
      }
    });
    
    
    res.cookie('token', token, cookieOptions);
    
    
     res.status(200).json({
      message: "Success",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error("Google login error:", error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
};

export default googleLogin;