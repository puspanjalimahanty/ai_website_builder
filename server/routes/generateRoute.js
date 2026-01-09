import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a senior frontend developer.

STRICT RULES:
- Generate ONE complete HTML document
- Start with <!DOCTYPE html>
- Use semantic sections with IDs: home, about, projects, contact
- Navbar links MUST be anchor links (#home, #about, #projects, #contact)
- Include ALL CSS inside <style> in <head>
- Use modern UI: gradients, cards, spacing, hover effects
- Add smooth scrolling
- ALWAYS include images using ONLINE URLs ONLY
- Use images from https://images.unsplash.com or https://picsum.photos
- Each project card MUST have an image
- Hero section MUST include a background image or illustration
- Do NOT use markdown
- Do NOT include file names
- Do NOT include explanations
`

          },
          {
            role: "user",
            content: `
Design a professional, modern website that looks like a real production website.

User request:
${prompt}
`
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 🔥 HARD CLEANUP (IMPORTANT)
    let output = response.data.choices[0].message.content;

    output = output
      .replace(/```html/gi, "")
      .replace(/```css/gi, "")
      .replace(/```/g, "")
      .replace(/\*\*.*?\*\*/g, "")
      .replace(/^[\s\S]*?(<!DOCTYPE html>)/i, "<!DOCTYPE html>")
      .trim();

    if (!output.toLowerCase().includes("<html")) {
      return res.status(500).json({ error: "Invalid HTML generated" });
    }

    res.json({ code: output });

  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
