import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const deepseek = new OpenAI({
  apiKey: process.env["DEEPSEEK_API_KEY"] ?? "",
  baseURL: "https://api.deepseek.com",
});

router.post("/ask", async (req, res) => {
  const { question } = req.body as { question?: string };

  if (!question || typeof question !== "string" || !question.trim()) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  try {
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable, helpful assistant. Answer questions clearly, accurately, and concisely. Use plain text only — no markdown formatting.",
        },
        {
          role: "user",
          content: question.trim(),
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "I couldn't generate an answer. Please try again.";

    res.json({ answer });
  } catch (err) {
    req.log.error({ err }, "DeepSeek API error");
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

export default router;
