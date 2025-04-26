import { Router } from "express";
import {logOut, signin, signup, VerifyUser}  from "../controllers/user.controller";
import googleLogin from "../controllers/authController";
import { VerifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/google").get(googleLogin)
//@ts-ignore
router.route("/logout").post(logOut)
router.route("/verify").get(VerifyJWT,VerifyUser)

export default router