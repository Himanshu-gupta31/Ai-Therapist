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
Given a habit name, a goal, and a current level, generate a single, well-designed 1-week habit target **only** for the user's current level.

**Guidelines:**
1. Apply habit-forming principles from *Atomic Habits* (e.g., make it obvious, attractive, easy, and satisfying).
2. The habit should be realistic and appropriate for the specified level:
   - "Very Easy": so easy you can't say no.
   - "Easy": a small step up but still very manageable.
   - "Medium": requires slightly more time or effort, still under 5 minutes.
   - "Hard": builds discipline and stretches effort.
   - "Very Hard": should match the user's exact stated goal.
3. Make it time-bound and actionable over 1 week.

**Output Format:**
Respond only with a JSON object in the following format:

{
  "Habit": "<habitName>",
  "Goal": "<goal>",
  "Current Level": "<level>",
  "Suggested Target": "..."
}

4. Do NOT include any extra explanation, comments, or markdown.
5. ⚠️ Do NOT wrap the response in triple backticks or code blocks. Return plain raw JSON only.
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
