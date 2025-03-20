const express = require("express");
const axios = require("axios");
const app = express();

// Serve static files from the root directory (no "public" folder needed)
app.use(express.static(__dirname));

app.get("/scores", async (req, res) => {
    try {
        const apiUrl = "https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/2025/03/19";
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

// Listen on the port provided by Render (or 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});