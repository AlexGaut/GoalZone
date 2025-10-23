// Variables pour aller chercher les données avec L'API
const base_endpoint = "https://api-web.nhle.com/v1/standings/now";
const proxy = "https://corsproxy.io/?url=";
const roster = "https://api-web.nhle.com/v1/roster/";
const season = getCurrentSeason();

/**
 * 
 * @returns la saison en cours ex:20242025 ou 20252026
 * La change passe à l'année prochaine au mois de juillet quand le calendrier de la LNH est annoncé
 */
function getCurrentSeason() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript months are 0-based (Jan = 0, Dec = 11)

    // If the date is after July 10th, return the next season
    if (month > 7 || (month === 7 && today.getDate() > 10)) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
}

/**
 * 
 * @param {*} dateString une date sous ce format YYYY-MM-JJ
 * @returns la date sous ce format: Dec 5, 1998
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}




/**
 * 
 * Fonction qui retourne un json avec les données des équipes de la LNH
 */
async function getTeams() {
    const apiUrl = proxy + base_endpoint;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData; // Return the JSON data
    } catch (error) {
        console.error("Error fetching standings:", error);
    }
}


/**
 * Pour afficher les 8 équipes de chaques divisions dans la page teams.html
 */
function displayTeams() {

    let teams_atl = [];
    let teams_metro = [];
    let teams_central = [];
    let teams_paci = [];

    // On créer les 4 titres des divisions
    for (let i = 0; i < 4; i++) {
        let h2 = document.createElement("h2");
        if (i == 0) {
            h2.textContent = "Metropolitan";
        } else if (i == 1) {
            h2.textContent = "Atlantic";
        } else if (i == 2) {
            h2.textContent = "Central";
        } else if (i == 3) {
            h2.textContent = "Pacific";
        }
        document.querySelector(".division").append(h2);
    }

    getTeams().then((data) => {

        let container = document.querySelectorAll(".teams");

        data.standings.forEach((standing) => {

            if (standing.divisionName == "Atlantic") {

                teams_atl.push(standing.teamName.default);
                teams_atl.sort();

                for (let i = 0; i < teams_atl.length; i++) {

                    if (teams_atl[i] === standing.teamName.default) {

                        let div = document.querySelector("#teams2 div");
                        let a = document.querySelector("#teams2 div a");
                        let img = document.querySelector("#teams2 div a img");
                        let span = document.querySelector("#teams2 div a span");

                        img.src = standing.teamLogo;
                        img.style.width = "96px";
                        img.style.height = "96px";
                        span.textContent = teams_atl[i];
                        a.append(img);
                        a.append(span);
                        div.append(a);
                        container[1].appendChild(div);
                    }
                }

            } else if (standing.divisionName == "Metropolitan") {

                teams_metro.push(standing.teamName.default);
                teams_metro.sort();


                for (let i = 0; i < teams_metro.length; i++) {
                    if (teams_metro[i] == standing.teamName.default) {


                        let div = document.querySelector("#teams1 div");
                        let a = document.querySelector("#teams1 div a");
                        let img = document.querySelector("#teams1 div a img");
                        let span = document.querySelector("#teams1 div a span");

                        img.src = standing.teamLogo;
                        img.style.width = "96px";
                        img.style.height = "96px";
                        span.textContent = teams_metro[i];
                        a.append(img);
                        a.append(span);
                        div.append(a);
                        container[0].appendChild(div);

                    }
                }
            } else if (standing.divisionName == "Central") {

                teams_central.push(standing.teamName.default);
                teams_central.sort();

                for (let i = 0; i < teams_central.length; i++) {

                    if (teams_central[i] == standing.teamName.default) {

                        let div = document.querySelector("#teams3 div");
                        let a = document.querySelector("#teams3 div a");
                        let img = document.querySelector("#teams3 div a img");
                        let span = document.querySelector("#teams3 div a span");

                        img.src = standing.teamLogo;
                        img.style.width = "96px";
                        img.style.height = "96px";
                        span.textContent = teams_central[i]
                        a.append(img);
                        a.append(span);
                        div.append(a);
                        container[2].appendChild(div);
                    }
                }
            } else if (standing.divisionName == "Pacific") {

                teams_paci.push(standing.teamName.default);
                teams_paci.sort();

                for (let i = 0; i < teams_paci.length; i++) {
                    if (teams_paci[i] == standing.teamName.default) {

                        let div = document.querySelector("#teams4 div");
                        let a = document.querySelector("#teams4 div a");
                        let img = document.querySelector("#teams4 div a img");
                        let span = document.querySelector("#teams4 div a span");

                        img.src = standing.teamLogo;
                        img.style.width = "96px";
                        img.style.height = "96px";
                        span.textContent = teams_paci[i]
                        a.append(img);
                        a.append(span);
                        div.append(a);
                        container[3].appendChild(div);
                    }
                }

            }
        });
    });
}
/**
 * 
 * @param {*} teamName le nom de l'équipe à convertir en abbreviation
 * @returns l'abbreviation de 3 lettres de l'équipe passée en paramètres
 */
function getTeamAbbreviation(teamName) {
    let teamAbbreviations = {
        "Montréal Canadiens": "mtl",
        "Toronto Maple Leafs": "tor",
        "Boston Bruins": "bos",
        "Chicago Blackhawks": "chi",
        "Detroit Red Wings": "det",
        "New York Rangers": "nyr",
        "Pittsburgh Penguins": "pit",
        "Philadelphia Flyers": "phi",
        "Washington Capitals": "wsh",
        "Carolina Hurricanes": "car",
        "New Jersey Devils": "njd",
        "Columbus Blue Jackets": "cbj",
        "New York Islanders": "nyi",
        "Tampa Bay Lightning": "tbl",
        "Florida Panthers": "fla",
        "Ottawa Senators": "ott",
        "Buffalo Sabres": "buf",
        "Winnipeg Jets": "wpg",
        "Calgary Flames": "cgy",
        "Edmonton Oilers": "edm",
        "Vancouver Canucks": "van",
        "Seattle Kraken": "sea",
        "Vegas Golden Knights": "vgk",
        "San Jose Sharks": "sjs",
        "Los Angeles Kings": "lak",
        "Anaheim Ducks": "ana",
        "St. Louis Blues": "stl",
        "Colorado Avalanche": "col",
        "Nashville Predators": "nsh",
        "Minnesota Wild": "min",
        "Utah Hockey Club": "uta",
        "Dallas Stars": "dal"
    };

    return teamAbbreviations[teamName] || "N/A";
}


/**
 * Fonction qui permet d'afficher les infos de l'équipe qui a été cliquée dans la page HTML roster.html
 */
function clickTeams() {
    let teamName;

    document.querySelectorAll(".teams a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Empêche la navigation si href="#" est utilisé
            window.scrollTo(0, 1400);

            //On vide la section des joueurs
            document.querySelector(".attaquants table tbody").innerHTML = "";
            document.querySelector(".defenseurs table tbody").innerHTML = "";
            document.querySelector(".gardiens table tbody").innerHTML = "";
            teamName = link.querySelector("span").textContent;

            //On parcours les joeurs de l'équipe cliquée
            getRosters(teamName).then((data) => {


                //On ajoute tous les attaquants dans le tableau des attaquants
                data.forwards.forEach(forward => {
                    let row = document.createElement("tr");
                    let tbody = document.querySelector(".attaquants table tbody");
                    if (forward.birthCountry == "USA" || forward.birthCountry == "CAN") {
                        row.innerHTML = `
                        <td><img src=${forward.headshot}><span id="${forward.id}">${forward.firstName.default + " " + forward.lastName.default}</span></td>
                        <td>${forward.sweaterNumber}</td>
                        <td>${forward.positionCode}</td>
                        <td>${forward.shootsCatches}</td>
                        <td>${forward.heightInInches}</td>
                        <td>${forward.weightInPounds}</td>
                        <td>${formatDate(forward.birthDate)}</td>
                        <td>${forward.birthCity.default + ", " + forward.birthStateProvince.default + ", " + forward.birthCountry}</td>
                    `;
                        tbody.appendChild(row);

                    } else {
                        row.innerHTML = `
                        <td><img src=${forward.headshot}><span id="${forward.id}">${forward.firstName.default + " " + forward.lastName.default}</span></td>
                        <td>${forward.sweaterNumber}</td>
                        <td>${forward.positionCode}</td>
                        <td>${forward.shootsCatches}</td>
                        <td>${forward.heightInInches}</td>
                        <td>${forward.weightInPounds}</td>
                        <td>${formatDate(forward.birthDate)}</td>
                        <td>${forward.birthCity.default + ", " + forward.birthCountry}</td>
                    `;
                        tbody.appendChild(row);
                    }

                });

                //On ajoute tous les defenseurs dans le tableau des attaquants
                data.defensemen.forEach(dman => {

                    let row = document.createElement("tr");
                    let tbody = document.querySelector(".defenseurs table tbody");
                    if (dman.birthCountry == "USA" || dman.birthCountry == "CAN") {
                        row.innerHTML = `
                        <td><img src=${dman.headshot}><span id="${dman.id}">${dman.firstName.default + " " + dman.lastName.default}</span></td>
                        <td>${dman.sweaterNumber}</td>
                        <td>${dman.positionCode}</td>
                        <td>${dman.shootsCatches}</td>
                        <td>${dman.heightInInches}</td>
                        <td>${dman.weightInPounds}</td>
                        <td>${formatDate(dman.birthDate)}</td>
                        <td>${dman.birthCity.default + ", " + dman.birthStateProvince.default + ", " + dman.birthCountry}</td>
                    `;
                        tbody.appendChild(row);
                    } else {
                        row.innerHTML = `
                        <td><img src=${dman.headshot}><span id="${dman.id}">${dman.firstName.default + " " + dman.lastName.default}</span></td>
                        <td>${dman.sweaterNumber}</td>
                        <td>${dman.positionCode}</td>
                        <td>${dman.shootsCatches}</td>
                        <td>${dman.heightInInches}</td>
                        <td>${dman.weightInPounds}</td>
                        <td>${formatDate(dman.birthDate)}</td>
                        <td>${dman.birthCity.default + ", " + dman.birthCountry}</td>
                    `;
                        tbody.appendChild(row);
                    }
                });

                //On ajoute tous les gardiens dans le tableau des attaquants
                data.goalies.forEach(goalie => {

                    let row = document.createElement("tr");
                    let tbody = document.querySelector(".gardiens table tbody");
                    if (goalie.birthCountry == "USA" || goalie.birthCountry == "CAN") {
                        row.innerHTML = `
                        <td><img src=${goalie.headshot}><span id="${goalie.id}">${goalie.firstName.default + " " + goalie.lastName.default}</span></td>
                        <td>${goalie.sweaterNumber}</td>
                        <td>${goalie.positionCode}</td>
                        <td>${goalie.shootsCatches}</td>
                        <td>${goalie.heightInInches}</td>
                        <td>${goalie.weightInPounds}</td>
                        <td>${formatDate(goalie.birthDate)}</td>
                        <td>${goalie.birthCity.default + ", " + goalie.birthStateProvince.default + ", " + goalie.birthCountry}</td>
                    `;
                        tbody.appendChild(row);
                    } else {
                        row.innerHTML = `
                        <td><img src=${goalie.headshot}><span id="${goalie.id}">${goalie.firstName.default + " " + goalie.lastName.default}</span></td>
                        <td>${goalie.sweaterNumber}</td>
                        <td>${goalie.positionCode}</td>
                        <td>${goalie.shootsCatches}</td>
                        <td>${goalie.heightInInches}</td>
                        <td>${goalie.weightInPounds}</td>
                        <td>${formatDate(goalie.birthDate)}</td>
                        <td>${goalie.birthCity.default + ", " + goalie.birthCountry}</td>
                    `;
                        tbody.appendChild(row);
                    }

                    
                });
            });
        });

    });

}

/**
 * Quand on clique sur un joueur, on affiche ses statisques dans la LNH
 */
function clickPlayers() {
    document.querySelectorAll(".roster tbody").forEach(link => {
        link.addEventListener("click", function (event) {
            document.querySelector(".player-info").style.display = "block";

            let tbody = document.querySelectorAll(".player-info table tbody")[0];
            let tbody_playoffs = document.querySelectorAll(".player-info table tbody")[1];
            let tbody_awards = document.querySelectorAll(".player-info table tbody")[2];

            tbody.innerHTML = "";
            tbody_playoffs.innerHTML = "";
            tbody_awards.innerHTML = "";

            if (event.target.tagName === "SPAN") {
                getPlayers(event.target.id).then(data => {
                    console.log("Données du joueur :", data);

                    let h1 = document.querySelector(".bio h1");
                    h1.textContent = data.firstName.default + " " + data.lastName.default + " #" + data.sweaterNumber;

                    let img = document.querySelector(".bio img");
                    img.src = data.headshot;

                    let span_position = document.querySelectorAll(".bio span")[0];
                    if (data.position == "R") {
                        span_position.textContent = "Right wing";
                    } else if (data.position == "L") {
                        span_position.textContent = "Left wing";
                    }
                    else if (data.position == "C") {
                        span_position.textContent = "Center";
                    } else if (data.position == "D") {
                        span_position.textContent = "Defense";
                    } else if (data.position == "G") {
                        span_position.textContent = "Goalie";
                    }

                    let span_shooting = document.querySelectorAll(".bio span")[1];
                    span_shooting.textContent = "Shoots " + data.shootsCatches;

                    let span_birth = document.querySelectorAll(".bio span")[2];
                    if (data.birthCountry == "CAN" || data.birthCountry == "USA") {
                        span_birth.textContent = "Born  " + formatDate(data.birthDate) + ", " + data.birthCity.default + ", " + data.birthStateProvince.default + ", " + data.birthCountry;
                    } else {
                        span_birth.textContent = "Born  " + formatDate(data.birthDate) + ", " + data.birthCity.default + ", " + data.birthCountry;
                    }

                    let span_age = document.querySelectorAll(".bio span")[3];
                    span_age.textContent = calculerAge(data.birthDate) + " years old";

                    let span_height = document.querySelectorAll(".bio span")[4];
                    span_height.textContent = convertirPoucesEnPiedsEtPouces(data.heightInInches) + " (" + data.heightInCentimeters + " cm)";

                    let span_weight = document.querySelectorAll(".bio span")[5];
                    span_weight.textContent = data.weightInPounds + " lbs (" + data.weightInKilograms + " kg)";

                    let span_draft = document.querySelectorAll(".bio span")[6];
                    let span_draft_position = document.querySelectorAll(".bio span")[7];
                    if (data.draftDetails) {
                        span_draft.textContent = "Draft by " + data.draftDetails.teamAbbrev;
                        span_draft_position.textContent = "Round " + data.draftDetails.round + " #" + data.draftDetails.overallPick + " in the " + data.draftDetails.year + " NHL Entry Draft";
                    } else {
                        span_draft.textContent = "Undrafted";
                        span_draft_position.textContent = "";

                    }
                    if (data.seasonTotals) {
                        data.seasonTotals.forEach(season => {


                            // Pour les matchs de saison régulière dans la LNH
                            if (season.leagueAbbrev == "NHL" && season.gameTypeId == 2) {

                                //Si c'est pas un gardien on affiche les statistiques de joueurs
                                if (data.position != "G") {
                                    let header = document.querySelectorAll(".player-info table thead")[0];

                                    header.innerHTML = `
                                        <tr>
                                            <th title="Season">Season</th>
                                            <th title="Team">Team</th>
                                            <th title="League">Lge</th>
                                            <th title="Games Played">GP</th>
                                            <th title="Goals">G</th>
                                            <th title="Assists">A</th>
                                            <th title="Points">P</th>
                                            <th title="Plus-Minus">+/-</th>
                                            <th title="Penalty Minutes">PIM</th>
                                        </tr>
                                    `;

                                    let footer = document.querySelectorAll(".player-info table tfoot")[0];

                                    footer.innerHTML = `
                                        <tr>
                                            <td></td>
                                            <td>NHL Totals</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    `;

                                    let row = document.createElement("tr");

                                    row.innerHTML = `
                                        <td>${String(season.season).slice(0, 4) + "-" + String(season.season).slice(4)}</td>
                                        <td>${season.teamName.default}</td>
                                        <td>${season.leagueAbbrev}</td>
                                        <td>${season.gamesPlayed}</td>
                                        <td>${season.goals}</td>
                                        <td>${season.assists}</td>
                                        <td>${season.points}</td>
                                        <td>${season.plusMinus}</td>
                                        <td>${season.pim}</td>
                                    `;
                                    tbody.append(row);

                                    //On affiche les statistiqes complètes des matchs en saison régulières au pied du tableau
                                    document.querySelectorAll(".player-info table tfoot tr td")[3].textContent = data.careerTotals.regularSeason.gamesPlayed;
                                    document.querySelectorAll(".player-info table tfoot tr td")[4].textContent = data.careerTotals.regularSeason.goals;
                                    document.querySelectorAll(".player-info table tfoot tr td")[5].textContent = data.careerTotals.regularSeason.assists;
                                    document.querySelectorAll(".player-info table tfoot tr td")[6].textContent = data.careerTotals.regularSeason.points;
                                    document.querySelectorAll(".player-info table tfoot tr td")[7].textContent = data.careerTotals.regularSeason.plusMinus;
                                    document.querySelectorAll(".player-info table tfoot tr td")[8].textContent = data.careerTotals.regularSeason.pim;


                                    //Si c'est  un gardien on affiche les statistiques de gardiens
                                } else if (data.position == "G") {
                                    let header = document.querySelectorAll(".player-info table thead")[0];

                                    header.innerHTML = `
                                        <tr>
                                            <th title="Season">Season</th>
                                            <th title="Team">Team</th>
                                            <th title="League">Lge</th>
                                            <th title="Games Played">GP</th>
                                            <th title="Wins">W</th>
                                            <th title="Losses">L</th>
                                            <th title="Points">OTL</th>
                                            <th title="Goals Against">GA</th>
                                            <th title="Goal Against Average">GAA</th>
                                            <th title="Save Percentage">SV%</th>
                                            <th title="Shutouts">SO</th>                                           
                                      </tr>
                                    `;

                                    let footer = document.querySelectorAll(".player-info table tfoot")[0];

                                    footer.innerHTML = `
                                        <tr>
                                            <td></td>
                                            <td>NHL Totals</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    `;


                                    let row = document.createElement("tr");

                                    row.innerHTML = `
                                    <td>${String(season.season).slice(0, 4) + "-" + String(season.season).slice(4)}</td>
                                    <td>${season.teamName.default}</td>
                                    <td>${season.leagueAbbrev}</td>
                                    <td>${season.gamesPlayed}</td>
                                    <td>${season.wins}</td>
                                    <td>${season.losses}</td>
                                    <td>${season.otLosses}</td>
                                    <td>${season.goalsAgainst}</td>
                                    <td>${(Math.round(season.goalsAgainstAvg * 1000) / 1000).toFixed(2)}</td>
                                    <td>${(Math.round(season.savePctg * 1000) / 1000).toFixed(3)}</td>
                                    <td>${season.shutouts}</td>
                                `;
                                    tbody.append(row);


                                    //On affiche les statistiqes complètes des matchs en saison régulières au pied du tableau
                                    document.querySelectorAll(".player-info table tfoot tr td")[3].textContent = data.careerTotals.regularSeason.gamesPlayed;
                                    document.querySelectorAll(".player-info table tfoot tr td")[4].textContent = data.careerTotals.regularSeason.wins;
                                    document.querySelectorAll(".player-info table tfoot tr td")[5].textContent = data.careerTotals.regularSeason.losses;
                                    document.querySelectorAll(".player-info table tfoot tr td")[6].textContent = data.careerTotals.regularSeason.otLosses;
                                    document.querySelectorAll(".player-info table tfoot tr td")[7].textContent = data.careerTotals.regularSeason.goalsAgainst;
                                    document.querySelectorAll(".player-info table tfoot tr td")[8].textContent = (Math.round(data.careerTotals.regularSeason.goalsAgainstAvg * 1000) / 1000).toFixed(2);
                                    document.querySelectorAll(".player-info table tfoot tr td")[9].textContent = (Math.round(data.careerTotals.regularSeason.savePctg * 1000) / 1000).toFixed(3);
                                    document.querySelectorAll(".player-info table tfoot tr td")[10].textContent = data.careerTotals.regularSeason.shutouts;
                                }


                                //Pour les matchs de séries dans la LNH 
                            } else if (season.leagueAbbrev == "NHL" && season.gameTypeId == 3) {
                                if (data.position != "G") {

                                    let header = document.querySelectorAll(".player-info table thead")[1];

                                    header.innerHTML = `
                                            <tr>
                                                <th title="Season">Season</th>
                                                <th title="Team">Team</th>
                                                <th title="League">Lge</th>
                                                <th title="Games Played">GP</th>
                                                <th title="Goals">G</th>
                                                <th title="Assists">A</th>
                                                <th title="Points">P</th>
                                                <th title="Plus-Minus">+/-</th>
                                                <th title="Penalty Minutes">PIM</th>
                                            </tr>
                                        `;

                                    let footer = document.querySelectorAll(".player-info table tfoot")[1];

                                    footer.innerHTML = `
                                            <tr>
                                                <td></td>
                                                <td>Playoffs Totals</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        `;

                                    let row = document.createElement("tr");

                                    row.innerHTML = `
                                            <td>${String(season.season).slice(0, 4) + "-" + String(season.season).slice(4)}</td>
                                            <td>${season.teamName.default}</td>
                                            <td>${season.leagueAbbrev}</td>
                                            <td>${season.gamesPlayed}</td>
                                            <td>${season.goals}</td>
                                            <td>${season.assists}</td>
                                            <td>${season.points}</td>
                                            <td>${season.plusMinus}</td>
                                            <td>${season.pim}</td>
                                        `;
                                    tbody_playoffs.append(row);

                                    //On affiche les statistiqes complètes des matchs éliminatoires au pied du tableau
                                    document.querySelectorAll(".player-info table tfoot tr td")[12].textContent = data.careerTotals.playoffs.gamesPlayed;
                                    document.querySelectorAll(".player-info table tfoot tr td")[13].textContent = data.careerTotals.playoffs.goals;
                                    document.querySelectorAll(".player-info table tfoot tr td")[14].textContent = data.careerTotals.playoffs.assists;
                                    document.querySelectorAll(".player-info table tfoot tr td")[15].textContent = data.careerTotals.playoffs.points;
                                    document.querySelectorAll(".player-info table tfoot tr td")[16].textContent = data.careerTotals.playoffs.plusMinus;
                                    document.querySelectorAll(".player-info table tfoot tr td")[17].textContent = data.careerTotals.playoffs.pim;

                                } else if (data.position == "G") {
                                    let header = document.querySelectorAll(".player-info table thead")[1];

                                    header.innerHTML = `
                                            <tr>
                                                <th title="Season">Season</th>
                                                <th title="Team">Team</th>
                                                <th title="League">Lge</th>
                                                <th title="Games Played">GP</th>
                                                <th title="Wins">W</th>
                                                <th title="Losses">L</th>
                                                <th title="Points">OTL</th>
                                                <th title="Goals Against">GA</th>
                                                <th title="Goal Against Average">GAA</th>
                                                <th title="Save Percentage">SV%</th>
                                                <th title="Shutouts">SO</th>                                           
                                          </tr>
                                        `;

                                    let footer = document.querySelectorAll(".player-info table tfoot")[1];

                                    footer.innerHTML = `
                                            <tr>
                                                <td></td>
                                                <td>Playoffs Totals</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        `;


                                    let row = document.createElement("tr");

                                    row.innerHTML = `
                                        <td>${String(season.season).slice(0, 4) + "-" + String(season.season).slice(4)}</td>
                                        <td>${season.teamName.default}</td>
                                        <td>${season.leagueAbbrev}</td>
                                        <td>${season.gamesPlayed}</td>
                                        <td>${season.wins}</td>
                                        <td>${season.losses}</td>
                                        <td>${season.otLosses}</td>
                                        <td>${season.goalsAgainst}</td>
                                        <td>${(Math.round(season.goalsAgainstAvg * 1000) / 1000).toFixed(2)}</td>
                                        <td>${(Math.round(season.savePctg * 1000) / 1000).toFixed(3)}</td>
                                        <td>${season.shutouts}</td>
                                        `;
                                    tbody_playoffs.append(row);

                                    //On affiche les statistiqes complètes des matchs en saison régulières au pied du tableau
                                    document.querySelectorAll(".player-info table tfoot tr td")[14].textContent = data.careerTotals.playoffs.gamesPlayed;
                                    document.querySelectorAll(".player-info table tfoot tr td")[15].textContent = data.careerTotals.playoffs.wins;
                                    document.querySelectorAll(".player-info table tfoot tr td")[16].textContent = data.careerTotals.playoffs.losses;
                                    document.querySelectorAll(".player-info table tfoot tr td")[17].textContent = data.careerTotals.playoffs.otLosses;
                                    document.querySelectorAll(".player-info table tfoot tr td")[18].textContent = data.careerTotals.playoffs.goalsAgainst;
                                    document.querySelectorAll(".player-info table tfoot tr td")[19].textContent = (Math.round(data.careerTotals.playoffs.goalsAgainstAvg * 1000) / 1000).toFixed(2);
                                    document.querySelectorAll(".player-info table tfoot tr td")[20].textContent = (Math.round(data.careerTotals.playoffs.savePctg * 1000) / 1000).toFixed(3);
                                    document.querySelectorAll(".player-info table tfoot tr td")[21].textContent = data.careerTotals.playoffs.shutouts;
                                }
                            } else if (!data.careerTotals.playoffs) {
                                if (data.position != "G") {
                                    tbody_playoffs.innerHTML = "";
                                    document.querySelectorAll(".player-info table tfoot td")[12].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[13].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[14].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[15].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[16].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[17].textContent = "---";
                                }else{
                                    tbody_playoffs.innerHTML = "";
                                    document.querySelectorAll(".player-info table tfoot td")[12].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[13].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[14].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[15].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[16].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[17].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[18].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[19].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[20].textContent = "---";
                                    document.querySelectorAll(".player-info table tfoot td")[21].textContent = "---";
                                }

                            }

                        });

                        if (data.awards) {
                            data.awards.forEach(award => {
                                award.seasons.forEach(season => {
                                    let row = document.createElement("tr");
                                    row.innerHTML = `
                                    <td>${String(season.seasonId).slice(0, 4) + "-" + String(season.seasonId).slice(4)}</td>
                                    <td>${award.trophy.default}</td>
                                `;
                                    tbody_awards.append(row);
                                })
                            });
                        } else {
                            let row = document.createElement("tr");
                            row.innerHTML = `
                                    <td>No trophies yet</td>
                                    <td>No trophies yet</td>
                                `;
                            tbody_awards.append(row);
                        }
                    }





                }).catch(error => {
                    console.error("Erreur lors de la récupération du joueur :", error);
                });
            }
        })
    })

}

/**
 * 
 * @param {*} dateNaissance une date sous le format YYYY-MM-JJ
 * @returns l'âge du joueur
 */
function calculerAge(dateNaissance) {
    const aujourdHui = new Date(); // Date actuelle
    const naissance = new Date(dateNaissance); // Convertir la date de naissance en objet Date

    let age = aujourdHui.getFullYear() - naissance.getFullYear(); // Calcul de l'âge en années
    const mois = aujourdHui.getMonth() - naissance.getMonth(); // Comparaison des mois

    // Si le mois actuel est avant le mois de naissance, on soustrait une année
    if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
        age--;
    }

    return age;
}

/**
 * 
 * @param {*} pouces nombres de pouces qu'on veut convertir
 * @returns le nombre de pouce en pieds et pouces. Ex; 70 pouces retourne 5"3'
 */
function convertirPoucesEnPiedsEtPouces(pouces) {
    const pieds = Math.floor(pouces / 12); // 1 pied = 12 pouces
    const poucesRestants = pouces % 12;
    if (poucesRestants < 10) {
        return pieds + ".0" + poucesRestants;
    } else {
        return pieds + "." + poucesRestants;
    }


}

/**
 * 
 * @param {*} team_fullName le nom de l'équipe complète (Montreal Canadiens)
 * @returns  les joueurs de l'équipe passée en paramètres
 */
async function getRosters(team_fullName) {
    const apiUrl = proxy + "https://api-web.nhle.com/v1/roster/" + getTeamAbbreviation(team_fullName) + "/" + season;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData; // Return the JSON data
    } catch (error) {
        console.error("Error fetching standings:", error);
    }
}

/**
 * 
 * @param {*} id l'ID unique du joueur
 * @returns  les joueurs de l'équipe passée en paramètres
 */
async function getPlayers(id) {
    const apiUrl = proxy + "https://api-web.nhle.com/v1/player/" + id + "/landing";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData; // Return the JSON data
    } catch (error) {
        console.error("Error fetching standings:", error);
    }
}

document.querySelector(".player-info").addEventListener("click", function (event) {
    let playerInfo = document.querySelector(".player-info");

    // Vérifie si l'élément cliqué est en dehors de ".player-info"
    if (!playerInfo.contains(event.target)) {
        playerInfo.style.display = "none"; // Cache la div
        console.log("body");
    }
})


/**
 * Pour cacher la div des stats du joueur quand elle est ouverte
 */
document.addEventListener("click", function (event) {
    let playerInfo = document.querySelector(".player-info");

    // Vérifie si la div .player-info est visible
    if (playerInfo.style.display === "block") {
        // Vérifie si l'élément cliqué est en dehors de .player-info
        if (!playerInfo.contains(event.target) && !event.target.closest(".roster tbody")) {
            playerInfo.style.display = "none"; // Cache la div
        }
    }
});


displayTeams();
clickTeams();
clickPlayers();




