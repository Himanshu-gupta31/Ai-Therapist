import { chatSession } from "../services/aiModel";
import { Request, Response } from "express";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const {habitName,goal}=req.body;
    if (!habitName || !goal) {
       res.status(400).json({ error: "habitName, goal, and expertiseLevel are required" });
       return
    }
    const message=`Habit Name:${habitName}
    Goal:${goal}
    Suggest a suitable Week 1 habit target.
    `;
    if (!message) {
       res.status(400).json({ error: "Message is required" });
    }

    // Send the message
    const result = await chatSession.sendMessage(message);

    // Correct way to get text
    // console.log(result)
    const responseText = await result.response.text();
    // console.log(responseText)

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
