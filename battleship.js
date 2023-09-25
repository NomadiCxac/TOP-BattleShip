
const Game = require('./gameLoop');
const {battleshipPieces} = require('./battleshipPieces');
const createGameBoard =  require('./createGameBoard');
const createGameStartElement = require('./createStartButton');
const createShipPositionSwitcher = require("./positionSwitcher")
const phaseUpdater = require('./updateCurrentPhase');
const renderGameStartState = require('./renderGameStartState');
const placeBoardMarker = require('./placeBoardMarker')
import './battleship.css';


function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Initialize Player Name 
let playerName = localStorage.getItem('playerName');

// Create a new game from player name and set current state to game set up
let currentGame = new Game (generateRandomString(), playerName)
currentGame.currentState = "Game Set-Up";

// Update the Game Phase HTML accordingly
phaseUpdater(currentGame);

// Define the current player based on the current game class
let currentPlayer = currentGame.player1;

// Define the current computer based on the current game class
let computer = currentGame.computer;

// Generate the battleship pieces default state
let pieces = battleshipPieces(currentPlayer, "Horizontal");



let gameStartButton = createGameStartElement(currentGame);

let gameScreen = document.querySelector(".gameScreenContainer");

let leftGameScreen = document.createElement("div");
leftGameScreen.className="gameScreen-Left"

let currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal"
currentShipOrientation.innerText = `Current Ship Position is: ${currentShipOrientation.dataset.shipOrientation}`
gameScreen.appendChild(leftGameScreen);



let shipPositionSwitcher = createShipPositionSwitcher(currentPlayer);

let board1 = createGameBoard(currentGame, currentPlayer);
// let board2 = createGameBoard(currentGame.computer);




leftGameScreen.appendChild(pieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameStartButton);
// gameScreen.appendChild(board2);
// placeBoardMarker(computer)
// renderGameStartState();

