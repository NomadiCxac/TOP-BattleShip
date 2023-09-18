const Game = require('./gameLoop');


function createNavUi () {

    let gameInitializerContainer = document.createElement("div");
    gameInitializerContainer.className = "gameInitializerContainer";

    let playerNameContainer = document.createElement("div");
    playerNameContainer.className = "playerNameContainer";
    let computerDifficultyContainer = document.createElement("div");
    computerDifficultyContainer.className = "computerDifficultyContainer";
    let initializeButtonContainer = document.createElement("div");
    initializeButtonContainer.className = "initializeButtonContainer";

    let playerNameLabel = document.createElement("label");
    playerNameLabel.className = "playerInputNameLabel"
    playerNameLabel.textContent = "Enter your name:";
    playerNameLabel.htmlFor = "playerInputName";
    playerNameContainer.appendChild(playerNameLabel);

    let isValidInput = false;  // This will be used to store the input validity
    let rawInput;

    let playerInputName = document.createElement("input");
    playerInputName.className = "playerInputName";
    playerInputName.addEventListener('input', function() {

        rawInput = playerInputName.value;
        let inputValue = playerInputName.value.toLowerCase();
        
        if (inputValue === "computer" || inputValue === "ai") {
            alert('The name cannot be "computer" or "ai".');
            playerInputName.value = ''; // Clear the input field
            isValidInput = false;
        } else if (inputValue.length > 0) {
            isValidInput = true;
        } else {
            isValidInput = false;
        }
    });

    playerNameContainer.appendChild(playerInputName);

    let easyRadio = document.createElement("input");
    easyRadio.type = "radio";
    easyRadio.name = "difficulty";
    easyRadio.value = "easy";
    easyRadio.id = "easy";
    let easyLabel = document.createElement("label");
    easyLabel.htmlFor = "easy";
    easyLabel.textContent = "Easy Battleship AI";
    computerDifficultyContainer.appendChild(easyRadio);
    computerDifficultyContainer.appendChild(easyLabel);

    // Radio button for hard difficulty
    let hardRadio = document.createElement("input");
    hardRadio.type = "radio";
    hardRadio.name = "difficulty";
    hardRadio.value = "hard";
    hardRadio.id = "hard";
    let hardLabel = document.createElement("label");
    hardLabel.htmlFor = "hard";
    hardLabel.textContent = "Hard Battleship AI";
    computerDifficultyContainer.appendChild(hardRadio);
    computerDifficultyContainer.appendChild(hardLabel);

    // initialize button
    let initializeButton = document.createElement("button");
    initializeButton.textContent = "Place Pieces";
    initializeButtonContainer.appendChild(initializeButton);
    initializeButton.id = "initPlaceButton";
    initializeButton.addEventListener("click", function() {
        if (isValidInput) {
            console.log('Valid input! Initializing game...');
            localStorage.setItem('playerName', rawInput);
            // You can also do more, like checking if a difficulty is selected etc.
            window.location.href = "battleship.html";
        } else {
            console.log('Invalid input.');
            return false;
        }
    })


    // Append the containers to the main container
    gameInitializerContainer.appendChild(playerNameContainer);
    gameInitializerContainer.appendChild(computerDifficultyContainer);
    gameInitializerContainer.appendChild(initializeButtonContainer);


    return gameInitializerContainer;
}

module.exports = createNavUi;