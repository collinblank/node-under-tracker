const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.static("public"));
app.get("/scores", async (req, res) => {
    try {
        const apiUrl = "https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/2025/03/19";
        // Use axios to fetch data from the NCAA API
        const response = await axios.get(apiUrl);
        // Send the data back to your front-end
        res.json(response.data);
    } catch (error) {
        // What could you send if the request fails?
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});


// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});