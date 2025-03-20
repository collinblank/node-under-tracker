const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const app = express();

// Serve static files from the root directory (no "public" folder needed)
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
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

app.get("/save-pregame-lines", async (req, res) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const dateString = `${year}/${month}/${day}`;

       const response = await axios.get(`https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds?regions=us&markets=totals&date=${dateString}&apiKey=f0bd75892b83e7bef18d84b21e0085dd`);
        const oddsData = response.data.map(game => ({
            home_team: game.home_team,
            away_team: game.away_team,
            pregame_line: game.bookmakers[0].markets[0].outcomes[0].point || "N/A", 
            commence_time: game.commence_time 
        }));
        await fs.writeFile("pregame_lines.json", JSON.stringify(oddsData, null, 2));
        res.json({ message: "Pre-game lines saved", count: oddsData.length });
    } catch (error) {
        res.status(500).json({ error: "Failed to save lines", details: error.message });
    }
});

// Updated /closing-lines to read saved data
app.get("/closing-lines", async (req, res) => {
    const team = req.query.team;
    try {
        const data = await fs.readFile("pregame_lines.json", "utf8");
        const odds = JSON.parse(data);
        const matchedGame = odds.find(odd => 
            odd.home_team.includes(team) || odd.away_team.includes(team)
        );
        res.json(matchedGame || {});
    } catch (error) {
        res.status(500).json({ error: "No saved lines found" });
    }
});

// Listen on the port provided by Render (or 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});