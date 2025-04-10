import { Router } from "express";
import { addDailyPlan } from "../controllers/addDailyPlanner";
import { fetchDailyPlan } from "../controllers/fetchDailyPlan";
import { VerifyJWT } from "../middlewares/auth.middleware";
const router=Router();

router.route("/addplan").post(VerifyJWT,addDailyPlan)
router.route("/fetchplan").get(VerifyJWT,fetchDailyPlan)

export default router