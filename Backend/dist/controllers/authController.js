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
const googleConfig_1 = require("../utils/googleConfig");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT secret not found");
}
const prisma = new client_1.PrismaClient();
// Common Cookie Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ message: "Authorization code is required" });
            return;
        }
        const googleRes = yield googleConfig_1.oauth2client.getToken(code);
        googleConfig_1.oauth2client.setCredentials(googleRes.tokens);
        const userRes = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        const { email, name } = userRes.data;
        const { access_token, refresh_token } = googleRes.tokens;
        let user = yield prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    password: "",
                    authType: "GOOGLE",
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: "1d" });
        user = yield prisma.user.update({
            where: { id: user.id },
            data: {
                token,
                name: user.name || name || null,
                refresh_token, //Handle case where refresh token is not provided(ToDo)
                access_token
            }
        });
        res.cookie('token', token, cookieOptions);
        res.status(200).json({
            message: "Success",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                refresh_token: user.refresh_token,
                access_token: user.access_token
            }
        });
    }
    catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = googleLogin;
