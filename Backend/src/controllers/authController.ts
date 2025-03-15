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

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    
    if (!code) {
       res.status(400).json({ message: "Authorization code is required" });
       return;
    }
    
    const googleRes = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(googleRes.tokens);

    // Fixed typo in access_token parameter. you should use native fetch function in js not axios here
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    
    const { email } = userRes.data;
    
    // Fixed Prisma query with proper where clause
    let user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    
    if (!user) {
      // Create new user with empty password for Google OAuth users
      user = await prisma.user.create({
        data: {
          email: email,
          password: "", // Empty string for Google users
          authType: "GOOGLE" // Add this field to track auth method
        }
      });
    }
    
    const token = jwt.sign({ email, id: user.id }, JWT_SECRET, {
      expiresIn: "1d"
    });
    
    res.status(200).json({
      message: "Success",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default googleLogin;