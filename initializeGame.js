
const Game = require('./gameLoop');
const createNavUi = require('./navigationComponents');
const createGameBoard =  require('./createGameBoard');
const phaseUpdater = require('./updateCurrentPhase');
require('./battleship.css');

localStorage.clear()

phaseUpdater(null);
let gameScreen = document.querySelector(".gameScreenContainer");
let gameInitComponent = createNavUi("gameInitializer");
gameScreen.appendChild(gameInitComponent);

