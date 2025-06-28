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
exports.VerifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT secret not found");
}
const VerifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "")) ||
            req.query.token;
        if (!token) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decodedToken.userId) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: {
                id: decodedToken.userId,
                token
            }
        });
        if (!user) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            refresh_token: user.refresh_token,
            access_token: user.access_token
        };
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
});
exports.VerifyJWT = VerifyJWT;
