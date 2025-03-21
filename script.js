function fetchLiveScores() {
    const url = "/scores";
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            return response.json();
        })
        .then(data => {
            myObj = data.games;
            let bracketGames = myObj.filter(game => game.game.bracketRound != "");
            bracketGames.forEach(game => {
                let homeTeam = game.game.home.names.short;
                let awayTeam = game.game.away.names.short;
                let awayScore = game.game.away.score;
                let homeScore = game.game.home.score;
                let timeParts = game.game.contestClock.split(":");
                let half = game.game.currentPeriod;
                let live = game.game.gameState;
                let totalPoints = Number(homeScore) + Number(awayScore);
                let minutes = Number(timeParts[0]);
                let seconds = Number(timeParts[1]);
                let timeRemaining = game.game.contestClock;
                let gameId = game.game.gameID;
                let startTimeParts = game.game.startTime.split(":");
                let startTime = Number(startTimeParts[0][1]) + ":" + startTimeParts[1];

                fetchLiveLines(homeTeam)
                .then(odds => {
                    if(!odds.pregame_line) {
                        return fetchLiveLines(awayTeam);
                    }
                    return odds;
                })
                .then(odds=> {
                    let closingLine = odds.pregame_line || "N/A";
                    let gameInfo;
                    console.log(typeof(closingLine));

                    if (live == "final") {
                        gameInfo = `<div class="game-details" id="${gameId}"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">FINAL</div><div class="totalPoints">${totalPoints}</div><div class="closing-line">O/U: ${closingLine}</div></div>`;
                        document.getElementById("finals").innerHTML += gameInfo;
                        if (closingLine > totalPoints){
                            document.getElementById(`${gameId}`).classList.add("win");
                        } else {
                            document.getElementById(`${gameId}`).classList.add("loss")
                        }
                    } else if (live == "pre") {
                        gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">${startTime}</div><div class="closing-line">O/U: ${closingLine}</div></div>`;
                        document.getElementById("not-started").innerHTML += gameInfo;
                    } else if (!half) {
                        let currentPace = totalPoints * 2;
                        gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">HALF</div><div class="totalPoints">${totalPoints}</div><div class="pace">Pace: ${currentPace}</div><div class="closing-line">O/U: ${closingLine}</div></div>`;
                        document.getElementById("games").innerHTML += gameInfo;
                    } else {
                        let timeLeft = half == "1ST HALF" ? minutes + seconds / 60 : minutes + seconds / 60;
                        let timePlayed = half == "1ST HALF" ? 20 - timeLeft : 20 + (20 - timeLeft);
                        let timeTotal = 40 - timePlayed;
                        let averagePerMinute = totalPoints / timePlayed;
                        let currentPace = averagePerMinute * timeTotal + totalPoints;
                        let roundedPace = currentPace.toFixed(2);
                        gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">${half} | ${timeRemaining}</div><div class="point-total">${totalPoints}</div><div class="pace">Pace: ${roundedPace}</div><div class="closing-line">O/U: ${closingLine}</div></div>`;
                        document.getElementById("games").innerHTML += gameInfo;
                    }
                }).catch(error => {
                    console.error(`Error fetching lines for ${homeTeam}:`, error);
                    let gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">${half || live}</div><div class="totalPoints">${totalPoints}</div></div>`;
                    document.getElementById("games").innerHTML += gameInfo;
                });
            });
        })
        .catch(error => {
            console.error("Error fetching scores:", error);
        });
}

function fetchLiveLines(shortName) {
    return fetch(`/closing-lines?team=${encodeURIComponent(shortName)}`) 
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch saved odds");
            return response.json();
        })
        .then(odds => odds);
}