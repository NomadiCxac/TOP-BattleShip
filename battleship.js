
const Game = require('./gameLoop');
const {battleshipPieces} = require('./battleshipPieces');
const createGameBoard =  require('./createGameBoard');
const createNavUi = require('./navigationComponents');
const createShipPositionSwitcher = require("./positionSwitcher")
import './battleship.css';

// String to generate game ID
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


let gameInit = createNavUi();

let newGame = new Game(generateRandomString(), "user")

let gameScreen = document.querySelector(".gameScreenContainer");

let leftGameScreen = document.createElement("div");
leftGameScreen.className="gameScreen-Left"

let currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal"
currentShipOrientation.innerText = `Current Ship Position is: ${currentShipOrientation.dataset.shipOrientation}`
gameScreen.appendChild(leftGameScreen);

let pieces = battleshipPieces(newGame.player1, "Horizontal");
leftGameScreen.appendChild(pieces);


let shipPositionSwitcher = createShipPositionSwitcher(newGame.player1);

let board1 = createGameBoard(newGame.player1, currentShipOrientation.dataset.shipOrientation);

let board2 = createGameBoard(newGame.computer);


leftGameScreen.appendChild(pieces);
// leftGameScreen.appendChild(verticalPieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);

