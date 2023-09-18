const Ship = require('./ship');  // Adjust path accordingly
const Gameboard = require('./gameBoard');  // Adjust path accordingly
const Player = require('./player');
const Game = require('./gameLoop');
const createGameBoard =  require('./createGameBoard');
import './battleship.css';

let player1 = new Player("player1")

let gameScreen = document.querySelector(".gameScreenContainer");

let board1 = createGameBoard(player1);

gameScreen.appendChild(board1);