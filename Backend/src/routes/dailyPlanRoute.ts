import { Router } from "express";
import { addDailyPlan } from "../controllers/addDailyPlanner";
import { fetchDailyPlan } from "../controllers/fetchDailyPlan";
import { VerifyJWT } from "../middlewares/auth.middleware";
import { deletePlan } from "../controllers/deletePlan";
const router=Router();

router.route("/addplan").post(VerifyJWT,addDailyPlan)
router.route("/fetchplan").get(VerifyJWT,fetchDailyPlan)
router.route("/deleteplan/:id").delete(VerifyJWT,deletePlan)

export default router