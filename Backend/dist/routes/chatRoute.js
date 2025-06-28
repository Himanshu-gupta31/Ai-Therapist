"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progressiveTarget_1 = require("../controllers/progressiveTarget");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route("/chat/:habitId").post(auth_middleware_1.VerifyJWT, progressiveTarget_1.progressiveTarget);
exports.default = router;
