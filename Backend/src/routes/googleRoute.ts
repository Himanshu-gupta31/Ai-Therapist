import { Router } from "express";
import {createCalendar} from "../controllers/googleCalendar"
import { VerifyJWT } from "../middlewares/auth.middleware";

const router=Router()
router.route("/calendar/create-event").post(VerifyJWT,createCalendar)

export default router