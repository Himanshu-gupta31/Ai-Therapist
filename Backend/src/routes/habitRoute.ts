import { Router } from "express";
import { addHabit } from "../controllers/addHabit";
import { getHabit } from "../controllers/getHabit";
import { VerifyJWT } from "../middlewares/auth.middleware";
import { deleteTodo } from "../controllers/deleteHabit";

const router=Router();

router.route("/addHabit").post(VerifyJWT,addHabit)
router.route("/getHabit").get(VerifyJWT,getHabit)
router.route("/deleteHabit/:id").delete(VerifyJWT,deleteTodo)


export default router
