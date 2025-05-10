const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
You are a helpful AI that guides users in building habits using the principles from *Atomic Habits* by James Clear.

**Task:**
Given a habit name and a goal, generate a structured JSON response with habit targets across five difficulty levels: Very Easy, Easy, Medium, Hard, and Very Hard.

**Guidelines:**
1. Use the principle: "Make it so easy you can't say no" for the *Very Easy* level.
2. Gradually increase complexity while ensuring each level is a natural step from the previous.
3. Ensure all targets are practical and time-bound. The first three levels (Very Easy to Medium) should be doable in under 5 minutes.
4. The **Very Hard** level should match the user's stated goal exactly.
5. Respond **only** with a JSON object in the following format:

{
  "Habit": "<habitName>",
  "Goal": "<goal>",
  "Targets": {
    "Very Easy": "...",
    "Easy": "...",
    "Medium": "...",
    "Hard": "...",
    "Very Hard": "<goal>"
  }
}

6. Do NOT include any explanatory text, comments, or markdown.
7. ⚠️ Do NOT wrap the response in triple backticks or markdown code blocks. Return raw JSON only.
`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [{ text: "Hey\n" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hi there! How many hours per day do you usually spend on screens?",
        },
      ],
    },
  ],
});
