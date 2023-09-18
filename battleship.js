
const Game = require('./gameLoop');
const {battleshipPieces} = require('./battleshipPieces');
const createGameBoard =  require('./createGameBoard');
const createGameStartElement = require('./createStartButton');
const createShipPositionSwitcher = require("./positionSwitcher")
const phaseUpdater = require('./updateCurrentPhase');
const placePiecesOnComputerBoardFrontEnd = require('./placePiecesOnComputerBoardFrontEnd')
import './battleship.css';


function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


let playerName = localStorage.getItem('playerName');
let currentGame = new Game (generateRandomString(), playerName)
currentGame.currentState = "Game Set-Up";
let currentPlayer = currentGame.player1;

phaseUpdater(currentGame);

let gameStart = createGameStartElement(currentGame);

let gameScreen = document.querySelector(".gameScreenContainer");

let leftGameScreen = document.createElement("div");
leftGameScreen.className="gameScreen-Left"

let currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal"
currentShipOrientation.innerText = `Current Ship Position is: ${currentShipOrientation.dataset.shipOrientation}`
gameScreen.appendChild(leftGameScreen);

let pieces = battleshipPieces(currentPlayer, "Horizontal");
leftGameScreen.appendChild(pieces);


let shipPositionSwitcher = createShipPositionSwitcher(currentPlayer);

let board1 = createGameBoard(currentPlayer, currentShipOrientation.dataset.shipOrientation);

let computer = currentGame.computer;
computer.placeAllShipsForAI()

console.log(computer.gameBoard.ship)
console.log(computer.gameBoard.ship["Carrier"].coordinates)

let board2 = createGameBoard(currentGame.computer);




leftGameScreen.appendChild(pieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
// gameScreen.appendChild(gameStart);
gameScreen.appendChild(board2);
placePiecesOnComputerBoardFrontEnd(computer)

