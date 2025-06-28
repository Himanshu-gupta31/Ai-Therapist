"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const quoteController_1 = require("../controllers/quoteController");
const router = (0, express_1.Router)();
router.route("/getQuotes/:habitId").get(auth_middleware_1.VerifyJWT, quoteController_1.QuoteType);
exports.default = router;
