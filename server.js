import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // If you are using ES modules, use import for fetch as well.


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your API endpoint
const API_URL = "https://models.inference.ai.azure.com/chat/completions";

app.post('/generate-blog', async (req, res) => {
    const { topic, tone, wordCount } = req.body;

    if (!topic || !tone || !wordCount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: `Write a ${tone} blog post about "${topic}" in approximately ${wordCount} words.`,
                    },
                ],
                max_tokens: parseInt(wordCount) + 50,
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error generating blog:", error);
        res.status(500).json({ error: "Failed to generate blog post" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
