const placePiecesOnComputerBoardFrontEnd = require('./placePiecesOnComputerBoardFrontEnd')

const createGameBoard = require("./createGameBoard");

function renderGameStartState(computer) {

    console.log(computer.gameBoard);

    let gameScreen = document.querySelector(".gameScreenContainer");

    let gameStartContainer = document.querySelector("div.gameStartContainer")
    gameStartContainer.remove();

    let leftGameScreen = document.querySelector("div.gameScreen-Left")
    leftGameScreen.remove();

    let computerGameBoard = createGameBoard(computer);
    computer.placeAllShipsForAI()
    gameScreen.appendChild(computerGameBoard);
    placePiecesOnComputerBoardFrontEnd(computer);
}

module.exports = renderGameStartState;