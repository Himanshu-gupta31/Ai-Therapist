"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.prisma = void 0;
// db/prisma.ts
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "Prisma", { enumerable: true, get: function () { return client_1.Prisma; } });
const globalForPrisma = global;
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
