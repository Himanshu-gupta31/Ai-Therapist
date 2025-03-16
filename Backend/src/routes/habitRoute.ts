import { Router } from "express";
import { addHabit } from "../controllers/addHabit";
import { getHabit } from "../controllers/getHabit";

const router=Router();

router.route("/addHabit").post(addHabit)
router.route("/getHabit").get(getHabit)


export default router
