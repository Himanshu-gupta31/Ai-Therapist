import { Router } from "express";
import { addHabit } from "../controllers/addHabit";
import { getHabit } from "../controllers/getHabit";
import { VerifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.route("/addHabit").post(VerifyJWT,addHabit)
router.route("/getHabit").get(VerifyJWT,getHabit)


export default router
