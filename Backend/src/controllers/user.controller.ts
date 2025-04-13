import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT secret not found in environment variables!");
}

// Common Cookie Options
const cookieOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie
  secure: process.env.NODE_ENV === 'production',  // Set to true in production (HTTPS)
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       res.status(400).json({ message: "Email and Password are required" });
       return
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
       res.status(400).json({ message: "User already exists with this email" });
       return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without token first
    const newUser = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword,
        authType: "EMAIL" 
      },
      select: { id: true, email: true },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update user with token
    await prisma.user.update({
      where: { id: newUser.id },
      data: { token }
    });

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({ message: "User registered successfully", user: newUser, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       res.status(400).json({ message: "Email and Password are required" });
       return
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
       res.status(400).json({ message: "User must signup first" });
       return
    }

    // Skip password check for OAuth users
    if (user.authType === "GOOGLE" && !user.password) {
       res.status(400).json({ 
        message: "This account uses Google authentication. Please sign in with Google."
      });
      return
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
       res.status(401).json({ message: "Incorrect Password" });
       return
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { token }
    });

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ message: "Login successful", token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = async (req: CustomRequest, res: Response) => {
  try {
    // Clear token in database if user is logged in
    if (req.user && req.user.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { token: null }
      });
    }

    res
      .clearCookie("token", cookieOptions)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const VerifyUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user || !user.id) {
       res.status(401).json({ message: "Unauthorized Access" });
       return
    }
    
    const verifiedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        id: true,
        name: true,
        authType: true
      }
    });
    
    if (!verifiedUser) {
       res.status(404).json({ message: "User not found" });
       return
    }
    
     res.status(200).json({ user: verifiedUser });
     return
  } catch (error) {
    console.error("Error verifying the user", error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
};