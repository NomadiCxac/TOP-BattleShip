const placeBoardMarker = require('./placeBoardMarker')
const createGameBoard = require("./createGameBoard");
const phaseUpdater = require('./updateCurrentPhase');

function renderGameStartState(game) {

    console.log(typeof(game.computer));

    let gameScreen = document.querySelector(".gameScreenContainer");

    let gameStartContainer = document.querySelector("div.gameStartContainer")
    gameStartContainer.remove();

    let leftGameScreen = document.querySelector("div.gameScreen-Left")
    leftGameScreen.remove();

    let computerGameBoard = createGameBoard(game, game.computer);
    game.computer.placeAllShipsForAI();
    gameScreen.appendChild(computerGameBoard);
    

    if (game.currentTurn == "Computer Move") {
        let computerGuess = game.playTurn();
            placeBoardMarker(game, computerGuess, game.currentTurn)
            game.updateState();
            phaseUpdater(game);
    }
}

module.exports = renderGameStartState;