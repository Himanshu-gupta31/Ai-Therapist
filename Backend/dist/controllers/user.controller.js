"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUser = exports.logOut = exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT secret not found in environment variables!");
}
// Common Cookie Options
const cookieOptions = {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and Password are required" });
            return;
        }
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with this email" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user without token first
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                authType: "EMAIL"
            },
            select: { id: true, email: true },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });
        // Update user with token
        yield prisma.user.update({
            where: { id: newUser.id },
            data: { token }
        });
        res
            .cookie("token", token, cookieOptions)
            .status(201)
            .json({ message: "User registered successfully", user: newUser, token });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and Password are required" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(400).json({ message: "User must signup first" });
            return;
        }
        // Skip password check for OAuth users
        if (user.authType === "GOOGLE" && !user.password) {
            res.status(400).json({
                message: "This account uses Google authentication. Please sign in with Google."
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: "Incorrect Password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        // Update user with new token
        yield prisma.user.update({
            where: { id: user.id },
            data: { token }
        });
        res
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signin = signin;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear token in database if user is logged in
        if (req.user && req.user.id) {
            yield prisma.user.update({
                where: { id: req.user.id },
                data: { token: null }
            });
        }
        res
            .clearCookie("token", cookieOptions)
            .status(200)
            .json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logOut = logOut;
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized Access" });
            return;
        }
        const verifiedUser = yield prisma.user.findUnique({
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
            return;
        }
        res.status(200).json({ user: verifiedUser });
        return;
    }
    catch (error) {
        console.error("Error verifying the user", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.VerifyUser = VerifyUser;
