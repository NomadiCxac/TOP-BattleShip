function phaseUpdater(game) {

    let gamePhase = document.querySelector(".gamePhase");
    let playerTurn = document.querySelector(".playerTurn");

    if (game == null) {
        gamePhase.textContent = "Game Initializtion"
        playerTurn.textContent = "";
    } else {
        gamePhase.textContent = game.currentState;
        playerTurn.textContent = game.currentTurn;
    }

}

module.exports = phaseUpdater;