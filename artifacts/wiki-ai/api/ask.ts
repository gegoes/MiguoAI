import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const groq = new OpenAI({
  apiKey: process.env["GROQ_API_KEY"] ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body as { question?: string };

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

    return res.json({ answer });
  } catch (err) {
    console.error("Groq API error:", err);
    return res.status(500).json({ error: "Failed to generate answer" });
  }
}
