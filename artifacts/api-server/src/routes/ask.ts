import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const groq = new OpenAI({
  apiKey: process.env["GROQ_API_KEY"] ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

function parseThinking(content: string): { thinking: string | null; answer: string } {
  const thinkMatch = content.match(/^<think>([\s\S]*?)<\/think>\s*/);
  if (thinkMatch) {
    return {
      thinking: thinkMatch[1].trim(),
      answer: content.slice(thinkMatch[0].length).trim(),
    };
  }
  return { thinking: null, answer: content.trim() };
}

router.post("/ask", async (req, res) => {
  const { question, deepthink } = req.body as { question?: string; deepthink?: boolean };

  if (!question || typeof question !== "string" || !question.trim()) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  const model = deepthink ? "deepseek-r1-distill-llama-70b" : "llama-3.3-70b-versatile";

  try {
    const completion = await groq.chat.completions.create({
      model,
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

    const raw = completion.choices[0]?.message?.content ?? "";
    const { thinking, answer } = parseThinking(raw);

    res.json({ answer: answer || "I couldn't generate an answer. Please try again.", thinking });
  } catch (err) {
    req.log.error({ err }, "Groq API error");
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

export default router;
