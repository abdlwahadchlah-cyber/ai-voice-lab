import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const model = lang === "ar" ? "facebook/mms-tts-ara" : "facebook/mms-tts-eng";

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) throw new Error("API error");

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      audio: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: "Failed to generate audio" });
  }
}
