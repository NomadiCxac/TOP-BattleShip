const Ship = require('./ship');  // Adjust path accordingly
const Gameboard = require('./gameBoard');  // Adjust path accordingly
const Player = require('./player');
const Game = require('./gameLoop');
const createGameBoard =  require('./createGameBoard');
const piecesContainer = require('./battleshipPieces');
const createNavUi = require('./navigationComponents');
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

let player1 = new Player;

let newGame = new Game(generateRandomString(), player1)

let gameScreen = document.querySelector(".gameScreenContainer");

let board1 = createGameBoard(newGame.player1);
let pieces = piecesContainer(player1);
let board2 = createGameBoard(newGame.computer);


gameScreen.appendChild(pieces);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);

