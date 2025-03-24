import { Router } from "express";
import { handleChat } from "../controllers/chatController";

const router = Router();

router.route("/chat").post(handleChat)

export default router;