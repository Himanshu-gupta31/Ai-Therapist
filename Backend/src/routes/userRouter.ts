import { Router } from "express";
import {logOut, signin, signup}  from "../controllers/user.controller";
import googleLogin from "../controllers/authController";

const router=Router();

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/google").get(googleLogin)
router.route("/logout").post(logOut)
//@ts-ignore
router.route("/logout").post(logOut)


export default router