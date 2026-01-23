// Replace your existing model line with this:
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Switch back to flash but with the fix below
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // We use the 'contents' array format which is more stable on Render
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        // If it's still a 404, we catch it here to give a better hint
        if (error.message.includes("404")) {
            return res.status(500).json({ reply: "The AI is updating. Please try again in 5 minutes." });
        }
        res.status(500).json({ reply: "The hive is a bit smoky right now." });
    }
});