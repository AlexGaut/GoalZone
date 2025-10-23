const base_endpoint = "https://corsproxy.io/?url=https://api-web.nhle.com/v1/score/"



function displayScores() {
    let date = document.getElementById("current-date").textContent;
    date = date.replace(" 🢓", "");
    document.querySelector(".fixtures").innerHTML = "";
    fetch('https://corsproxy.io/?url=https://api-web.nhle.com/v1/score/' + date)

        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // Logs the fetched JSON data
            data.games.forEach(game => {
               
                // variables
                const awayTeam = game.awayTeam.abbrev;
                const awayScore = game.awayTeam.score;
                const homeTeam = game.homeTeam.abbrev;
                const homeScore = game.homeTeam.score;

                //Pour chaque match on créer une div match et on ajoute les infos du match dans la div
                let div = document.createElement('div');
                div.className = 'match'
                document.querySelector(".fixtures").append(div);

                //Pour chaque match on créer les informations de l'équipe visiteure
                let imgAway = document.createElement('img');
                imgAway.src = game.awayTeam.logo;
                imgAway.alt = "Away Team Logo";
                div.appendChild(imgAway);

                let spanAway = document.createElement('span');
                spanAway.textContent = awayTeam;
                spanAway.className = "away";
                div.appendChild(spanAway);


                let spanTime = document.createElement('span');

                //Si le match est commencé. on affiche le cadran et les scores
                let date = new Date(game.startTimeUTC);
                if (date < new Date()) {

                    spanTime.textContent = updateRemainingTime();

                    spanTime.className = "time";

                    div.appendChild(spanTime);

                    //Sinon on affiche l'heure de début du match 
                } else {
                    date = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: 'numeric', timeZone: 'America/New_York' }).format(date);
                    spanTime.innerHTML = date;
                    div.appendChild(spanTime);
                }

                //Selon l'issue du match (reglementaire, prolongation ou tir barrage, on affiche comment ca s'est terminé)
                if (game.hasOwnProperty('gameOutcome') && game.gameOutcome.lastPeriodType == "REG") {
                    spanTime.textContent = awayScore + " Final " + homeScore;
                } else if (game.hasOwnProperty('gameOutcome') && game.gameOutcome.lastPeriodType == "OT") {
                    spanTime.textContent = awayScore + " OT " + homeScore;
                } else if (game.hasOwnProperty('gameOutcome') && game.gameOutcome.lastPeriodType == "SO") {
                    spanTime.textContent = awayScore + " SO " + homeScore;
                }



                //Pour chaque match on créer les informations de l'équipe locale
                let spanHome = document.createElement('span');
                spanHome.innerHTML = homeTeam;
                spanHome.className = "home";
                div.appendChild(spanHome);

                let imgHome = document.createElement('img');
                imgHome.src = game.homeTeam.logo;
                imgHome.alt = "Home Team Logo";
                div.appendChild(imgHome);

                //Si une période est en cours on affiche la barre de progression bleu pour dire que c'est en cours sinon on affiche l'intermission
                if (game.gameState == "LIVE" && game.clock.inIntermission == false) {
                    let live = document.createElement("div");
                    live.className = "loader";
                    let live_status_div = document.createElement('div');
                    document.querySelector(".fixtures").append(live_status_div);
                    live_status_div.appendChild(live);

                } else if (game.gameState == "LIVE" && game.clock.inIntermission == true && game.period === 1) {
                    spanTime.textContent = awayScore + " 1st Int " + homeScore;
                } else if (game.gameState == "LIVE" && game.clock.inIntermission == true && game.period === 2) {
                    spanTime.textContent = awayScore + " 2nd Int " + homeScore;
                } else if (game.gameState == "LIVE" && game.clock.inIntermission == true && game.period === 3) {
                    spanTime.textContent = awayScore + " 3rd Int " + homeScore;
                };


            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });



}

function updateRemainingTime() {
    let date = document.getElementById("current-date").textContent;
    date = date.replace(" 🢓", "");

    setInterval(() => {
        fetch(`https://corsproxy.io/?url=https://api-web.nhle.com/v1/score/${date}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                data.games.forEach((game, index) => {
                    if (game.clock.inIntermission === false && game.clock.secondsRemaining !== 0 && document.getElementById("current-date").textContent.replace(" 🢓", "") == game.gameDate) {
                        // Calculate the remaining time
                        let minutes = Math.floor(game.clock.secondsRemaining / 60);
                        let seconds = game.clock.secondsRemaining % 60;
                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;
                        const timeString = `${minutes}:${seconds}`;

                        // Update the corresponding game time in the DOM
                        const gameDiv = document.querySelectorAll(".fixtures .match")[index];
                        if (gameDiv) {
                            const timeSpan = gameDiv.querySelector(".time");
                            if (game.gameState === "LIVE") {
                                if (game.period == 1) {
                                    timeSpan.textContent = game.awayTeam.score + " " + timeString + " " + game.period + "st " + game.homeTeam.score;
                                } else if (game.period == 2) {
                                    timeSpan.textContent = game.awayTeam.score + " " + timeString + " " + game.period + "nd " + game.homeTeam.score;
                                } else if (game.period == 3) {
                                    timeSpan.textContent = game.awayTeam.score + " " + timeString + " " + game.period + "rd " + game.homeTeam.score;
                                }

                            }
                            else {

                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, 1000); // Update every second
}



displayScores();


