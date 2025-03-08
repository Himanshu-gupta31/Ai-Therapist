import { Router } from "express";
import {signin, signup}  from "../controllers/user.controller";
import googleLogin from "../controllers/authController";

const router=Router();

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/google").get(googleLogin)

export default router