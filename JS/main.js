const datepicker = document.querySelector('.datepicker');
const dateInput = document.querySelector('#datepicker');
const yearInput = datepicker.querySelector(".year-input");
const monthInput = datepicker.querySelector(".month-input");
const cancelBtn = datepicker.querySelector(".cancel");
const applyBtn = datepicker.querySelector(".apply");
const nextBtn = datepicker.querySelector(".next");
const prevBtn = datepicker.querySelector(".prev");
const dates = datepicker.querySelector(".dates");
const proxy = "https://corsproxy.io/?url=";

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = selectedDate.getMonth();
let day = selectedDate.getDate();

//Show datepicker
dateInput.addEventListener("click", () => {
    datepicker.hidden = false;
});

//Hide datepicker
cancelBtn.addEventListener("click", () => {
    datepicker.hidden = true;
});

//Handle the previous day button
document.getElementById("previous-day").addEventListener("click", () => {
    const currentDateElement = document.getElementById("current-date");
    let currentDateString = currentDateElement.textContent;

    // Retirer le symbole "🢓" à la fin
    currentDateString = currentDateString.replace(" 🢓", "");

    // Convertir la chaîne en objet Date
    const currentDate = new Date(currentDateString);

    // Soustraire un jour
    currentDate.setDate(currentDate.getDate() - 0);

    // Mettre à jour l'élément avec la nouvelle date formatée
    currentDateElement.textContent = currentDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }) + " 🢓";

    displayScores();
});

//Handle the next day button
document.getElementById("next-day").addEventListener("click", () => {
    const currentDateElement = document.getElementById("current-date");
    let currentDateString = currentDateElement.textContent;

    // Retirer le symbole "🢓" à la fin
    currentDateString = currentDateString.replace(" 🢓", "");

    // Convertir la chaîne en objet Date
    const currentDate = new Date(currentDateString);

    // Soustraire un jour
    currentDate.setDate(currentDate.getDate() + 2);

    // Mettre à jour l'élément avec la nouvelle date formatée
    currentDateElement.textContent = currentDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }) + " 🢓";

    displayScores();

});



//Handle apply button click event
applyBtn.addEventListener("click", () => {
    //set the selected date
    dateInput.value = selectedDate.toLocaleDateString(
        'en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    //Hide datepicker
    datepicker.hidden = true;
    document.getElementById("current-date").textContent = dateInput.value + " 🢓";
    displayScores();

});

// handle next month nav
nextBtn.addEventListener("click", () => {
    if (month === 11) year++;
    month = (month + 1) % 12;
    displayDates();
});

// handle prev month nav
prevBtn.addEventListener("click", () => {
    if (month === 0) year--;
    month = (month - 1 + 12) % 12;
    displayDates();
});


//Handle month input change
monthInput.addEventListener("change", () => {
    month = monthInput.selectedIndex;
    displayDates();
});

//Handle year input change
yearInput.addEventListener("change", () => {
    year = yearInput.value;
    displayDates();
});

const updateYearMonth = () => {
    monthInput.selectedIndex = month;
    yearInput.value = year;
}

const handleDateClick = (e) => {
    const button = e.target;

    //remove the selected class from other buttons
    const selected = dates.querySelector(".selected");
    selected && selected.classList.remove("selected");

    //add the selected class to current button
    button.classList.add("selected");

    //set the selected date
    selectedDate = new Date(year, month, parseInt(button.textContent));
}


const displayDates = () => {
    //Update year and month when the dates are updated
    updateYearMonth();

    //clear the dates
    dates.innerHTML = "";

    //* display the last week of previous month

    //get the last date of previous month
    const lastOfPrevMonth = new Date(year, month, 0);

    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
        const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
        const button = createButton(text, true);
        dates.appendChild(button);
    }

    //* display the current month

    // get the last date of the month
    const lastOfMonth = new Date(year, month + 1, 0);

    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
        const button = createButton(i, false);
        button.addEventListener("click", handleDateClick)
        dates.appendChild(button);
    }

    //*display the first week of next month

    const firsOfNextMonth = new Date(year, month + 1, 1);

    for (let i = firsOfNextMonth.getDay(); i < 7; i++) {
        const text = firsOfNextMonth.getDate() - firsOfNextMonth.getDay() + i;
        const button = createButton(text, true);
        dates.appendChild(button);
    }

}

const createButton = (text, isDisabled = false) => {
    //Display current date in the central button
    const currentDate = new Date();
    document.getElementById("current-date").textContent = currentDate.toLocaleDateString(
        'en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }) + " 🢓";

    //Check if the current button is today
    const isToday = currentDate.getDate() === text && currentDate.getFullYear() === year && currentDate.getMonth() === month;

    //Check if current button is selected
    const selected = selectedDate.getDate() === text && selectedDate.getFullYear() === year && selectedDate.getMonth() === month;

    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = isDisabled;
    button.classList.toggle("today", isToday);
    button.classList.toggle("selected", selected);
    return button;
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


function getAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
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

function searchPlayer() {
    let inputValue = document.getElementById("SearchBar").value.trim();
    let resultsContainer = document.getElementById("player-results");

    resultsContainer.innerHTML = ""; // Effacer les anciens résultats
    if (inputValue === "") {
        resultsContainer.style.display = "none"; // Cacher la liste si l'input est vide
        return;
    }

    fetch('https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=20&q=' + inputValue)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                resultsContainer.innerHTML = "<p class='player-item'>Aucun joueur trouvé.</p>";
                resultsContainer.style.display = "block";
                return;
            }

            data.forEach(player => {
                let playerDiv = document.createElement("div");
                playerDiv.classList.add("player-item");
                playerDiv.innerHTML = `
                        <strong>${player.name}</strong><br>                
                    `;

                playerDiv.addEventListener("click", () => {
                    document.getElementById("SearchBar").value = player.name;
                    resultsContainer.style.display = "none"; // Cacher la liste après sélection            
                    getPlayers(player.playerId).then(data => {
                        console.log(data);
                        playerDiv.innerHTML = `                       
                        <strong>${player.name}</strong><br>                
                    `;
                        let search = document.querySelector(".search-results");
                        search.style.display = "block";
                        let bio = document.querySelector(".search-results .bio");
                        bio.innerHTML = '';
                        if (data.isActive == true && data.draftDetails) {
                            if (data.position == "C") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Center</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "L") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Left Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "R") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Right Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "D") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Defensemen</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "G") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Goalie</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            }
                        }
                        if (data.isActive == false && data.draftDetails) {
                            if (data.position == "C") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default}</h1>
                                <span>Center</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>    
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>                          
                            `;
                            } else if (data.position == "L") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Left Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                                `;
                            } else if (data.position == "R") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Right Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                                `;
                            } else if (data.position == "D") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Defensemen</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                                `;
                            } else if (data.position == "G") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Goalie</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                               `;
                            }
                        } else if (data.isActive == true && !data.draftDetails) {
                            if (data.position == "C") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Center</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Undrafted</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "L") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Left Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Undrafted</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "R") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Right Wing</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Draft by ${data.draftDetails.teamAbbrev}</span>
                                <span>Round ${data.draftDetails.round} #${data.draftDetails.overallPick} in the ${data.draftDetails.year} NHL Entry Draft</span>
                                <span>Undrafted</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "D") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Defensemen</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Undrafted</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            } else if (data.position == "G") {
                                bio.innerHTML = `
                                <img src="${data.headshot}" alt="">
                                <h1>${data.firstName.default} ${data.lastName.default} #${data.sweaterNumber}</h1>
                                <span>Goalie</span>                            
                                <span>Born  ${data.birthDate}, ${data.birthCity.default}, ${data.birthCountry}</span>
                                <span>${getAge(data.birthDate)} years old</span>
                                <span>${convertirPoucesEnPiedsEtPouces(data.heightInInches)} (${data.heightInCentimeters} cm)</span>
                                <span>${data.weightInPounds} lbs (${data.weightInKilograms} kg)</span>
                                <span>Undrafted</span>
                                <span>More info about this player: <a href="https://www.nhl.com/" target="_blank">https://www.nhl.com/</a></span>
                            `;
                            }
                        }
                    });

                });

                resultsContainer.appendChild(playerDiv);
            });

            resultsContainer.style.display = "block"; // Afficher les résultats
        })
        .catch(error => {
            console.error("Erreur lors de la recherche :", error);
            resultsContainer.innerHTML = "<p class='player-item'>Erreur de chargement.</p>";
            resultsContainer.style.display = "block";
        });
}

/**
 * Dès qu'on écrit dans la barre de recherche, on appel la fonction qui cherhce les joueurs et qui affichent les résultats
 */
document.getElementById("SearchBar").addEventListener("keydown", function (event) {
    searchPlayer();
});


/**
 * Pour cacher la div des stats du joueur recherché quand elle est ouverte lorsqu'on clique en dehors
 */
document.addEventListener("click", function (event) {
    let playerInfo = document.querySelector(".search-results");

    // Vérifie si la div .player-info est visible
    if (playerInfo.style.display === "block") {
        // Vérifie si l'élément cliqué est en dehors de .search-results
        if (!playerInfo.contains(event.target) && !event.target.closest(".bio")) {
            playerInfo.style.display = "none"; // Cache la div
        }
    }
});

displayDates();
