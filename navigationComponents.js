function createNavUi () {
    let gameInitializerContainer = document.createElement("div");
    gameInitializerContainer.className = "gameInitializerContainer";

    let playerNameContainer = document.createElement("div");
    playerNameContainer.className = "playerNameContainer";
    let computerDifficultyContainer = document.createElement("div");
    computerDifficultyContainer.className = "computerDifficultyContainer";
    let startButtonContainer = document.createElement("div");
    startButtonContainer.className = "startButtonContainer";

    let playerNameLabel = document.createElement("label");
    playerNameLabel.textContent = "Enter your name:";
    playerNameLabel.htmlFor = "playerInputName";
    playerNameContainer.appendChild(playerNameLabel);

    let playerInputName = document.createElement("input");
    playerInputName.className = "playerInputName";
    playerInputName.addEventListener('input', function() {
        let inputValue = playerInputName.value.toLowerCase();
        if (inputValue === "computer" || inputValue === "ai") {
            alert('The name cannot be "computer" or "ai".');
            playerInputName.value = ''; // Clear the input field
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
    easyLabel.textContent = "Easy";
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
    hardLabel.textContent = "Hard";
    computerDifficultyContainer.appendChild(hardRadio);
    computerDifficultyContainer.appendChild(hardLabel);

    // Start button
    let startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButtonContainer.appendChild(startButton);
    startButton.id = "initStartButton";

    // Append the containers to the main container
    gameInitializerContainer.appendChild(playerNameContainer);
    gameInitializerContainer.appendChild(computerDifficultyContainer);
    gameInitializerContainer.appendChild(startButtonContainer);


    return gameInitializerContainer;
}

module.exports = createNavUi;