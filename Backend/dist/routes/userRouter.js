"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const addCoins_1 = require("../controllers/addCoins");
const fetchCoins_1 = require("../controllers/fetchCoins");
const router = (0, express_1.Router)();
router.route("/signup").post(user_controller_1.signup);
router.route("/signin").post(user_controller_1.signin);
router.route("/google").get(authController_1.default);
//@ts-ignore
router.route("/logout").post(user_controller_1.logOut);
router.route("/verify").get(auth_middleware_1.VerifyJWT, user_controller_1.VerifyUser);
router.route("/coins/:habitId").post(auth_middleware_1.VerifyJWT, addCoins_1.addCoins);
router.route("/getcoins").get(auth_middleware_1.VerifyJWT, fetchCoins_1.getAllCoins);
exports.default = router;
