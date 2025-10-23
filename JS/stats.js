const proxy = "https://corsproxy.io/?url=";





function displayPointsLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=points&limit=10")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.points.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".skater-points").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

function displayGoalsLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=goals&limit=10")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.goals.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".skater-goals").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

function displayAssistsLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=assists&limit=10")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.assists.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".skater-assists").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

function displayShutoutsLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/goalie-stats-leaders/20242025/2?categories=shutouts&limit=-1")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.shutouts.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".goalie-shutouts").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

function displaySavePctgLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/goalie-stats-leaders/20242025/2?categories=savePctg&limit=10")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.savePctg.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".goalie-pctg").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

function displayWinsLeaders() {

    let i = 1;

    fetch(proxy + "https://api-web.nhle.com/v1/goalie-stats-leaders/current?categories=wins&limit=10")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.wins.forEach(player => {
                let playerDiv = document.createElement("div");

                playerDiv.innerHTML = `
                    <strong>${i}. ${player.firstName.default} ${player.lastName.default}</strong>
                    <span>${player.teamAbbrev}</span>
                    <img src=${player.headshot} width="50px" height="50px">            
                `;

                i++;
                document.querySelector(".goalie-wins").append(playerDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
        });
}

displayPointsLeaders();
displayGoalsLeaders();
displayAssistsLeaders();
displayShutoutsLeaders();
displaySavePctgLeaders();
displayWinsLeaders();
