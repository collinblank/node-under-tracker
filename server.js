const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.static(__dirname));

app.get("/scores", async (req, res) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const dateString = `${year}/${month}/${day}`;
        const apiUrl = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${dateString}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Scores error:", error);
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

app.get("/closing-lines", async (req, res) => {
    const team = req.query.team;
    try {
        const data = await fs.readFile(path.join(__dirname, "pregame_lines.json"), "utf8");
        const odds = JSON.parse(data);
        const matchedGame = odds.find(odd => 
            odd.home_team.includes(team) || odd.away_team.includes(team)
        );
        res.json(matchedGame || {});
    } catch (error) {
        console.error("Closing lines error:", error);
        res.status(500).json({ error: "Failed to read pregame_lines.json", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});