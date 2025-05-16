import { Router } from "express";
import {progressiveTarget} from "../controllers/progressiveTarget"
import { VerifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/chat/:habitId").post(VerifyJWT,progressiveTarget)

export default router;