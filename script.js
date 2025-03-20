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
                let homeTeam = game.game.home.names.full;
                let awayTeam = game.game.away.names.full;
                let awayScore = game.game.away.score;
                let homeScore = game.game.home.score;
                let timeParts = game.game.contestClock.split(":");
                let half = game.game.currentPeriod;
                let live = game.game.gameState;
                let totalPoints = Number(homeScore) + Number(awayScore);
                let minutes = Number(timeParts[0]);
                let seconds = Number(timeParts[1]);
        
                if (live == "final") {
                    let gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">FINAL</div><div class="totalPoints">${totalPoints}</div></div>`;
                    document.getElementById("games").innerHTML += gameInfo;
                } else if (live == "pre") {
                    let gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="final">Starting Soon</div></div>`;
                    document.getElementById("games").innerHTML += gameInfo;
                } else {
                    let timeLeft = half == "1ST HALF" ? minutes + seconds / 60 : minutes + seconds / 60;
                    let timePlayed = half == "1ST HALF" ? 20 - timeLeft : 20 + (20 - timeLeft);
                    let timeTotal = 40 - timePlayed;
                    let averagePerMinute = totalPoints / timePlayed;
                    let currentPace = averagePerMinute * timeTotal + totalPoints;
                    let roundedPace = currentPace.toFixed(2);
        
                    let gameInfo = `<div class="game-details"><div class="game-matchup"><div class="home-team">${homeTeam}</div><div class="score">${homeScore}</div><div class="away-team">${awayTeam}</div><div class="score">${awayScore}</div></div><div class="point-total">${totalPoints}</div><div class="pace">Pace: ${roundedPace}</div></div>`;
                    document.getElementById("games").innerHTML += gameInfo;
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function checkUnder(){
    var homeScore = Number(document.getElementById("home-score").value);
    var awayScore = Number(document.getElementById("away-score").value);
    var timeLeft = Number(document.getElementById("time-left").value);
    var firstHalf = document.getElementById("first-half").checked;
    var secondHalf = document.getElementById("second-half").checked;
    if(firstHalf){
        var score = homeScore + awayScore; // 20
        var timeTotal = timeLeft + 20; // 10 + 20 = 30
        var timePlayed = 40 - timeTotal; // 40 - 30 = 10
        var averagePerMinute = score/timePlayed; // 20/10 = 2
        var total = averagePerMinute * timeTotal + score;
    }
    if(secondHalf){
        var score = homeScore + awayScore; // 20
        var timeTotal = timeLeft; // 10 + 20 = 30;
        var timePlayed = 40 - timeTotal; // 40 - 30 = 10
        var averagePerMinute = score/timePlayed; // 20/10 = 2
        var total = averagePerMinute * timeTotal + score;
    }
    var underBet = Number(document.getElementById("bet-line").value);
    if(total > underBet){
        var response = `Not looking good, you bet ${underBet} and the pace is at ${total}`;
        document.getElementById("response").innerHTML = response;
    } else {
        var response = `You are on pace! you bet ${underBet} and the pace is at ${total}`;
        document.getElementById("response").innerHTML = response;
    }
    console.log('working');
}
