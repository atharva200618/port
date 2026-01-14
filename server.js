import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

// =====================
// Path setup (ES Module fix)
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// App init
// =====================
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files (index.html, css, js)
app.use(express.static(__dirname));

// =====================
// Groq init
// =====================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// =====================
// Chat API (UPDATED PROMPT)
// =====================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are Atharva's AI Assistant.

IMPORTANT: You MUST use Markdown formatting for EVERY answer.
- Use ## for Headings
- Use - or * for Bullet points
- Use **text** for Bold emphasis
- Never write one giant paragraph. Always break text into lines.

STYLE: Friendly, Professional, Hinglish.

If user asks about skills, list them with bullets.
If user asks about projects, describe them with headings.

Context (Atharva):
- 2nd Year BTech CSE (AI & ML) at VIT Vellore.
- Skills: Python, SQL, Power BI, Machine Learning, Data Analytics.
- Projects: Student Performance Prediction, Sales Analytics Dashboard, Churn Prediction.
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (err) {
    console.error("❌ Groq Error:", err.message);
    res.status(500).json({
      reply: "⚠️ Server issue ho gaya. Please thodi der baad try karo."
    });
  }
});

// =====================
// Server start
// =====================
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});