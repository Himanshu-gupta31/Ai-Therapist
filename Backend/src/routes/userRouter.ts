import { Router } from "express";
import {signin, signup}  from "../controllers/user.controller";

const router=Router();

router.route("/signup").post(signup)
router.route("/signin").post(signin)

export default router