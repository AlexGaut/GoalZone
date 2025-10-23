// Variables pour aller chercher les données avec L'API
const base_endpoint = "https://api-web.nhle.com/v1/standings/now";
const proxy = "https://corsproxy.io/?url=";

// Variables des boutons du type de classement que l'on veut afficher
const conference = document.querySelectorAll(".tab")[0];
const division = document.querySelectorAll(".tab")[1];
const wild_card = document.querySelectorAll(".tab")[2];
const league = document.querySelectorAll(".tab")[3];

const buttons = document.querySelectorAll(".tab");

// Variable qu'on incrémente a chaque équipe du classement pour afficher la position au classement (1 à 32)
let rank;
let rank_east;
let rank_west;
let rank_atlantic;
let rank_metropolitan;
let rank_pacific;
let rank_central;
let rank_wildCard_east;
let rank_wildCard_west;

/**
 * 
 * Fonction qui retourne un json avec les données du classement de la LNH
 */
async function getStandings() {
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
 * Fonction qui affiche le classement des équipes repêchées (wild Card) dans la page HTML Standings
 */
function WildCardClick() {
  rank_atlantic = 1, rank_metropolitan = 1, rank_central = 1, rank_pacific = 1, rank_wildCard_east = 1, rank_wildCard_west = 1;

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].id = "";
  }
  wild_card.id = "standing-selected";

  // On supprime les titres des classements
  let hElements = document.querySelectorAll("h1, h2, h3");
  hElements.forEach((h) => {
    h.remove();
  });

  //Pour effacer les autres classements de trop
  let standingsItems = document.querySelectorAll(".standings");
  for (let i = 1; i < standingsItems.length; i++) {
    standingsItems[i].remove();
  }

  // On créer les titres des  classements
  let east_title = document.createElement("h1");
  east_title.textContent = "Eastern";
  east_title.classList.add("h1");

  let west_title = document.createElement("h1");
  west_title.textContent = "Western";
  west_title.classList.add("h1");

  let atl_title = document.createElement("h2");
  atl_title.textContent = "Atlantic";
  atl_title.classList.add("h1");

  let metro_title = document.createElement("h2");
  metro_title.textContent = "Metropolitan";
  metro_title.classList.add("h1");

  let central_title = document.createElement("h2");
  central_title.textContent = "Central";
  central_title.classList.add("h1");

  let wild_card__east_title = document.createElement("h2");
  wild_card__east_title.textContent = "Wild Card";
  wild_card__east_title.classList.add("h1");

  let wild_card__west_title = document.createElement("h2");
  wild_card__west_title.textContent = "Wild Card";
  wild_card__west_title.classList.add("h1");

  let pac_title = document.createElement("h2");
  pac_title.textContent = "Pacific";
  pac_title.classList.add("h1");

  // On créer 6 classements vides en copiant le premier tableau vide
  for (let i = 0; i < 5; i++) {

    let div = document.querySelector(".standings");
    let clone = div.cloneNode(true);
    div.before(clone);

    let tbody = document.querySelectorAll("#table-body")[i];

    tbody.innerHTML = "";

    if (i == 4) {
      i = 5;
      let tbody = document.querySelectorAll("#table-body")[i];
      tbody.innerHTML = "";
    }

  };

  // On met chacun des tableaux dans une variable unique
  let tbody_atlantic = document.querySelectorAll("#table-body")[0];
  let tbody_metropolitan = document.querySelectorAll("#table-body")[1];
  let tbody_wildCard_east = document.querySelectorAll("#table-body")[2];
  let tbody_central = document.querySelectorAll("#table-body")[3];
  let tbody_pacific = document.querySelectorAll("#table-body")[4];
  let tbody_wildCard_west = document.querySelectorAll("#table-body")[5];

  // On vide les tableaux des classements
  for (let i = 0; i < document.querySelectorAll("#table-body").length; i++) {
    document.querySelectorAll("#table-body")[i].innerHTML = "";
  }

  // On va chercher les infos du classement via l'API
  getStandings().then((data) => {
    data.standings.forEach((standing) => {

      //Pour chaque équipe de la conférence Est et de la division Atlantique on créer une ligne dans le tableau #1
      if (standing.conferenceName == "Eastern" && standing.divisionName == "Atlantic" && standing.wildcardSequence == 0) {
        document.querySelectorAll(".standings")[0].before(east_title);
        document.querySelectorAll(".standings")[0].before(atl_title);


        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_atlantic++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_atlantic.appendChild(row);

        //Pour chaque équipe de la conférence Est et de la division Metropolitaine on créer une ligne dans le tableau #2
      } else if (standing.conferenceName == "Eastern" && standing.divisionName == "Metropolitan" && standing.wildcardSequence == 0) {
        document.querySelectorAll(".standings")[1].before(metro_title);

        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_metropolitan++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_metropolitan.appendChild(row);

        //Pour chaque équipe repêchée (Wild Card) de la conférence Est on créer une ligne dans le tableau #3
      } else if (standing.conferenceName == "Eastern" && standing.wildcardSequence != 0) {


        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_wildCard_east++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td> 
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_wildCard_east.appendChild(row);

        //Pour chaque équipe de la conférence Ouest et de la division Central qui ne sont pas parmis les équipes repèchées on créer une ligne dans le tableau #4
      } else if (standing.conferenceName == "Western" && standing.divisionName == "Central" && standing.wildcardSequence == 0) {
        document.querySelectorAll(".standings")[3].before(west_title);
        document.querySelectorAll(".standings")[3].before(central_title);

        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_central++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_central.appendChild(row);
      }

      //Pour chaque équipe de la conférence Ouest et de la division Pacific on créer une ligne dans le tableau #5
      else if (standing.conferenceName == "Western" && standing.divisionName == "Pacific" && standing.wildcardSequence == 0) {
        document.querySelectorAll(".standings")[4].before(pac_title);

        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_pacific++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_pacific.appendChild(row);
      }

      //Pour chaque équipe repêchée de la conférence Ouest on créer une ligne dans le tableau
      else if (standing.conferenceName == "Western" && standing.wildcardSequence != 0) {


        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_wildCard_west++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_wildCard_west.appendChild(row);
      }
    });
  });


  document.querySelectorAll(".standings")[2].before(wild_card__east_title);
  document.querySelectorAll(".standings")[5].before(wild_card__west_title);


}



/**
 * Fonction qui affiche le classement par conférence dans la page HTML Standings
 */
function ConferenceClick() {
  rank_east = 1, rank_west = 1;

  let tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  // On supprime les titres de la conférence
  let hElements = document.querySelectorAll("h1, h2, h3");
  hElements.forEach((h) => {
    h.remove();
  });

  //Pour effacer les autres classements de trop
  let standingsItems = document.querySelectorAll(".standings");
  for (let i = 1; i < standingsItems.length; i++) {
    standingsItems[i].remove();
  }

  let east_title = document.createElement("h1");
  east_title.textContent = "Eastern";
  east_title.classList.add("h1");

  let west_title = document.createElement("h1");
  west_title.textContent = "Western";
  west_title.classList.add("h1");

  // Si la div pour le classement de l'ouest n'est pas créer on la créer
  if (document.querySelectorAll(".standings").length != 2) {
    //On copie le tableau pour la section Ouest
    let div = document.querySelector(".standings");
    let clone = div.cloneNode(true);
    div.before(clone);
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].id = "";
  }
  conference.id = "standing-selected";

  let tbody_east = document.querySelectorAll("#table-body")[0];
  let tbody_west = document.querySelectorAll("#table-body")[1];
  tbody_east.innerHTML = "";
  tbody_west.innerHTML = "";

  //Pour chaque équipe dans le classement, on créer une ligne dans le tableau
  getStandings().then((data) => {
    data.standings.forEach((standing) => {
      //Si l'équipe est dans l'est, ses informations au classement de l'est
      if (standing.conferenceName == "Eastern") {
        document.querySelectorAll(".standings")[0].before(east_title);

        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_east++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_east.appendChild(row);

        //Si l'équipe est dans l'Ouest, ses informations au classement de l'est
      } else if (standing.conferenceName == "Western") {
        document.querySelectorAll(".standings")[1].before(west_title);
        tbody = document.getElementById("table-body").lastChild;
        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
        }

        row.innerHTML = `
                    <td>${rank_west++}</td>
                    <td><img src=${standing.teamLogo}>${standing.teamName.default}</td>
                    <td>${standing.gamesPlayed}</td>
                    <td>${standing.wins}</td>
                    <td>${standing.losses}</td>
                    <td>${standing.otLosses}</td>
                    <td>${standing.points}</td>
                    <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                    <td>${standing.regulationWins}</td>
                    <td>${standing.regulationPlusOtWins}</td>
                    <td>${standing.goalFor}</td>
                    <td>${standing.goalAgainst}</td>
                    <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                    <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                    <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                    <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                    <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                    <td>${standing.streakCode + standing.streakCount}</td>
                `;
        tbody_west.appendChild(row);
      }
    });
  });
}


/**
 * Fonction qui affiche le classement de la ligue dans la page HTML Standings
 */
function LeagueClick() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].id = "";
  }
  rank = 0;
  league.id = "standing-selected";
  let tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  // On supprime les titres des classements
  let hElements = document.querySelectorAll("h1, h2, h3");
  hElements.forEach((h) => {
    h.remove();
  });

  let league_title = document.createElement("h1");
  league_title.textContent = "League";
  league_title.classList.add("h1");



  //Pour effacer les autres classements de trop
  let standingsItems = document.querySelectorAll(".standings");
  for (let i = 1; i < standingsItems.length; i++) {
    standingsItems[i].remove();
  }

  //Pour chaque équipe dans le classement, on créer une ligne dans le tableau
  getStandings().then((data) => {
    data.standings.forEach((standing) => {
      //Pour chaque équipe du classement on créer une ligne dans le tableau
      let row = document.createElement("tr");

      //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
      // Récupérer la valeur du différentiel de buts et appliquer un signe
      let goalDifferential = standing.goalDifferential;
      let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
      let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

      // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
      if (goalDifferential > 0) {
        goalDifferentialDisplay = `+${goalDifferential}`;
        goalDifferentialClass = "positive"; // Classe pour le style vert
      }
      // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
      else if (goalDifferential < 0) {
        goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
        goalDifferentialClass = "negative"; // Classe pour le style rouge
      }
      // Si égal à zéro, on affiche "0" sans couleur spécifique
      else {
        goalDifferentialDisplay = "0";
        goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
      }

      row.innerHTML = `
                <td>${++rank}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default
        }</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;

      tbody.appendChild(row);
      document.querySelectorAll(".standings")[0].before(league_title);
    });
  });
}

/**
 * Fonction qui affiche le classement par division dans la page HTML Standings
 */
function DivisionClick() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].id = "";
  }
  division.id = "standing-selected";

  let tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  // On supprime les titres de la conférence
  let hElements = document.querySelectorAll("h1, h2, h3");
  hElements.forEach((h) => {
    h.remove();
  });

  //Pour effacer les anciens classements de la page
  let standingsItems = document.querySelectorAll(".standings");
  for (let i = 1; i < standingsItems.length; i++) {
    standingsItems[i].remove();
  }

  rank_atlantic = 1, rank_central = 1, rank_metropolitan = 1, rank_pacific = 1;

  // Pour afficher la conférence (Est ou Ouest)
  let east_title = document.createElement("h1");
  east_title.textContent = "Eastern";
  east_title.classList.add("h1");

  let west_title = document.createElement("h1");
  west_title.textContent = "Western";
  west_title.classList.add("h1");

  // Pour afficher la division (Atlantique, Métropolitaine, Centrale et Pacifique)
  let metro_title = document.createElement("h2");
  metro_title.textContent = "Metropolitan";

  let atl_title = document.createElement("h2");
  atl_title.textContent = "Atlantic";

  let central_title = document.createElement("h2");
  central_title.textContent = "Central";

  let pac_title = document.createElement("h2");
  pac_title.textContent = "Pacific";

  for (let i = 0; i < 3; i++) {
    //On créer 4 classements distincts en copiant le premier classement
    let div = document.querySelector(".standings");
    let clone = div.cloneNode(true);
    div.before(clone);
  }

  //On vide les classements avant de mettre les données dedans
  let tbody_atlantic = document.querySelectorAll("#table-body")[0];
  let tbody_metropolitan = document.querySelectorAll("#table-body")[1];
  tbody_atlantic.innerHTML = "";
  tbody_metropolitan.innerHTML = "";

  let tbody_central = document.querySelectorAll("#table-body")[2];
  let tbody_pacific = document.querySelectorAll("#table-body")[3];
  tbody_central.innerHTML = "";
  tbody_pacific.innerHTML = "";

  getStandings().then((data) => {
    data.standings.forEach((standing) => {
      if (standing.conferenceName == "Eastern" && standing.divisionName == "Atlantic") {
        document.querySelectorAll(".standings")[0].before(east_title);
        document.querySelectorAll(".standings")[0].before(atl_title);

        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_atlantic++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default
          }</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_atlantic.appendChild(row);
      } else if (standing.conferenceName == "Eastern" && standing.divisionName == "Metropolitan") {
        document.querySelectorAll(".standings")[1].before(metro_title);

        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_metropolitan++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default
          }</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_metropolitan.appendChild(row);
      } else if (standing.conferenceName == "Western" && standing.divisionName == "Central") {
        document.querySelectorAll(".standings")[2].before(west_title);

        document.querySelectorAll(".standings")[2].before(central_title);

        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_central++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default
          }</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td> 
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_central.appendChild(row);
      } else if (standing.conferenceName == "Western" && standing.divisionName == "Pacific") {
        document.querySelectorAll(".standings")[3].before(pac_title);

        //Pour chaque équipe de la conférence Est on créer une ligne dans le tableau
        let row = document.createElement("tr");

        //On regarde si le différentiel de but et + (vert) ou - (rouge) et on applique le style
        // Récupérer la valeur du différentiel de buts et appliquer un signe
        let goalDifferential = standing.goalDifferential;
        let goalDifferentialDisplay = goalDifferential; // Par défaut, afficher la valeur directement
        let goalDifferentialClass = ""; // Variable pour ajouter une classe de style

        // Si le différentiel de buts est positif, ajouter un "+" et définir la couleur (vert)
        if (goalDifferential > 0) {
          goalDifferentialDisplay = `+${goalDifferential}`;
          goalDifferentialClass = "positive"; // Classe pour le style vert
        }
        // Si le différentiel de buts est négatif, il reste avec un "-" et définir la couleur (rouge)
        else if (goalDifferential < 0) {
          goalDifferentialDisplay = `${goalDifferential}`; // Il y a déjà un "-"
          goalDifferentialClass = "negative"; // Classe pour le style rouge
        }
        // Si égal à zéro, on affiche "0" sans couleur spécifique
        else {
          goalDifferentialDisplay = "0";
          goalDifferentialClass = "neutral"; // Classe pour la couleur neutre (si besoin)
        }

        row.innerHTML = `
                <td>${rank_pacific++}</td>
                <td><img src=${standing.teamLogo}>${standing.teamName.default
          }</td>
                <td>${standing.gamesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.losses}</td>
                <td>${standing.otLosses}</td>
                <td>${standing.points}</td>
                <td>${(Math.round(standing.pointPctg * 1000) / 1000).toFixed(3)}</td>
                <td>${standing.regulationWins}</td>
                <td>${standing.regulationPlusOtWins}</td>
                <td>${standing.goalFor}</td>
                <td>${standing.goalAgainst}</td>
                <td class="${goalDifferentialClass}">${goalDifferentialDisplay}</td>
                <td>${standing.homeWins + "-" + standing.homeLosses + "-" + standing.homeOtLosses}</td>
                <td>${standing.roadWins + "-" + standing.roadLosses + "-" + standing.roadOtLosses}</td>
                <td>${standing.shootoutWins + "-" + standing.shootoutLosses}</td>
                <td>${standing.l10Wins + "-" + standing.l10Losses + "-" + standing.l10OtLosses}</td>
                <td>${standing.streakCode + standing.streakCount}</td>
            `;
        tbody_pacific.appendChild(row);
      }
    });
  });
}

getStandings().then((data) => {
  // Do something with the JSON data
  console.log("Standings data:", data);

  data.standings.forEach((standing) => {
    //console.log(standing.placeName.default);
  });
});

division.addEventListener("click", DivisionClick);
league.addEventListener("click", LeagueClick);
conference.addEventListener("click", ConferenceClick);
wild_card.addEventListener("click", WildCardClick);

// Pour afficher le classement des Divisions quand la page se load
window.onload = DivisionClick();