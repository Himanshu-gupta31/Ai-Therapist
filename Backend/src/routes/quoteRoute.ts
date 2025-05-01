import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware";
import { QuoteType } from "../controllers/quoteController";
const router=Router()

router.route("/getQuotes/:habitId").get(VerifyJWT,QuoteType)

export default router