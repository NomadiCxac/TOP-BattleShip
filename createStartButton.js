const renderGameStartState = require('./renderGameStartState');
const phaseUpdater = require('./updateCurrentPhase');

function createGameStartElement (game) {
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

        console.log(game.checkPlayerReadyGameState())

        if (game.checkPlayerReadyGameState() == false) {
            alert("Please Place All Your Ships in Legal Positions");
            return;
        } 
        
        if (game.checkPlayerReadyGameState() == true) {
            // game.updateState();
            game.currentTurn = "Computer Move";
            game.currentState = "Game Play Phase"
            phaseUpdater(game);
            renderGameStartState(game)      
            // game.player1.gameBoard.display()
            return;
        }
    }) 

    // Append the startButtonContainer to the main container
    gameStartContainer.appendChild(startButtonContainer);

    return gameStartContainer;
}

module.exports = createGameStartElement;