import { Router } from "express";
import {createCalendar} from "../controllers/googleCalendar"
import { VerifyJWT } from "../middlewares/auth.middleware";
import { createCalendarHabit } from "../controllers/googleHabitCalendar";

const router=Router()
router.route("/calendar/create-event").post(VerifyJWT,createCalendar)
router.route("/calendar/habit-event").post(VerifyJWT,createCalendarHabit)

export default router