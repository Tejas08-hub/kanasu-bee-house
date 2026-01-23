import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Initialize Gemini API (Fixed ReferenceError)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Initialize Model with correct ID for Render/Production
// We use 'gemini-1.5-flash' which is the current stable standard
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.length > 1000) {
            return res.status(400).json({ error: "Message required and must be under 1000 chars." });
        }

        // 3. System Instructions are passed directly here for better stability
        const prompt = `System: You are the Kanasu Bee House assistant. You help beekeepers. Keep your answers brief and professional.\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error.message);

        // Specific fix for the 404 error on Render
        if (error.message.includes("404")) {
            return res.status(500).json({ reply: "The AI hive is updating. Please try again in 1 minute." });
        }

        res.status(500).json({ reply: "The hive is a bit smoky. Please try again later." });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
server.timeout = 10000;