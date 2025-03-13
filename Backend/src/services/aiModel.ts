const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Ask the user for their daily screen time in hours. Once they provide a number, ask whether they are a student or a working professional. Based on their response, give them a concise, practical solution (around 150 words) with actionable methods to reduce screen time. Include a simple table outlining key strategies and their benefits. Keep the response clear, to the point, and easy to follow.",
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
          parts: [
            {text: "Hey\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Hi there! To help you reduce your screen time, could you first tell me approximately how many hours a day you spend looking at screens? And are you a student or a working professional?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "9 hrs and i am a student\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, 9 hours is quite a lot! As a student, managing screen time is crucial for balancing studies, social life, and well-being. Given your screen time, aim for at least a 2-hour reduction daily. Start by allocating specific \"screen-free\" study blocks using the Pomodoro Technique (25-minute focus, 5-minute break - no screens during breaks!). Replace screen-based entertainment with physical activities or hobbies during leisure time. Use website blockers on your computer during study hours, and set app limits on your phone. Wind down an hour before bed without any screens to improve sleep quality. Small consistent changes will make a big difference.\n\nHere's a quick summary:\n\n| Strategy               | Benefit                                       |\n|------------------------|-----------------------------------------------|\n| Screen-free Study Blocks | Improved focus & retention                     |\n| App Limits & Blockers    | Reduced temptation & minimized distractions   |\n| Screen-Free Hobbies      | Enhanced well-being & improved sleep quality |\n"},
          ],
        },
      ],
    });
  

  