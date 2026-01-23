import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// SAFETY 1: Add System Instructions to keep the AI focused
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Use the most stable ID for your region
    systemInstruction: "You are the Kanasu Bee House assistant. You help beekeepers. Keep your answers brief and professional."
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;

        // SAFETY 2: Input Length Check
        // Prevents someone from sending a 1-million character message to drain your quota
        if (!message || message.length > 1000) {
            return res.status(400).json({ error: "Message is required and must be under 1000 characters." });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        // SAFETY 3: Specific Error Handling
        console.error("Gemini API Error:", error.message);

        // If Google says "too many requests" (Error 429)
        if (error.status === 429) {
            return res.status(429).json({ reply: "I'm a bit busy right now. Please wait a minute before asking again!" });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now. Please try again later." });
    }
});

// SAFETY 4: Basic timeout to prevent hanging connections
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
server.timeout = 10000; // 10 second timeout