const renderGameStartState = require('./gameDriverScript');

function createGameStartElement (game, computerGameBoard) {
    let gameStartContainer = document.createElement("div");
    gameStartContainer.className = "gameStartContainer";

    let startButtonContainer = document.createElement("div");
    startButtonContainer.className = "startButtonContainer";

    // Start button
    let startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.id = "initStartButton";
    startButtonContainer.appendChild(startButton);
    startButton.addEventListener("click", function() {
        console.log(game.player1.gameBoard.ship);
        console.log(game.checkPlayerReadyGameState());
        if (game.checkPlayerReadyGameState() == false) {
            alert("Please Place All Your Ships in Legal Positions");
            return;
        } 
        
        if (game.checkPlayerReadyGameState() == true) {
            renderGameStartState(computerGameBoard)
            return;
        }
    }) 

    // Append the startButtonContainer to the main container
    gameStartContainer.appendChild(startButtonContainer);

    return gameStartContainer;
}

module.exports = createGameStartElement;