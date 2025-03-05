import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const prisma=new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET 
if(!JWT_SECRET){
    throw new Error("Jwt secret not found")
}
export const signup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and Password should be there" });
        return;
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
      if (existingUser) {
        res.status(400).json({ message: "User already exists with this email" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true
        }
      });
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email
        },
        JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );
      res.status(201).json({ message: "User registered successfully", user: newUser, token: token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const signin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and Password should be there" });
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
      if (!user) {
        res.status(400).json({ message: "User must signup first" });
        return;
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).json({ message: "Incorrect Password" });
        return;
      }
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email
        },
        JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );
      res.status(200).json({
        message: "Login successful",
        token: token
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  