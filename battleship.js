const Ship = require('./ship');  // Adjust path accordingly
const Gameboard = require('./gameBoard');  // Adjust path accordingly
const Player = require('./player');
const Game = require('./gameLoop');
const {battleshipPieces} = require('./battleshipPieces');
const createGameBoard =  require('./createGameBoard');
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

function createVerticalPiecesContainer(player) {
  let piecesContainer = document.createElement("div");
  piecesContainer.className = "verticalPiecesContainer";
  let boxWidth = 50;
  let boxHeight = 48;

  for (let shipName in player.gameBoard.ship) {
      let shipAttribute = player.gameBoard.ship[shipName].instance;
      
      let shipContainer = document.createElement("div");
      shipContainer.className = "verticalShipContainer";

      let shipTitle = document.createElement("div");
      shipTitle.className = "verticalShipName";
      shipTitle.textContent = shipAttribute.name + ":";

      let shipPiece = document.createElement("div");
      shipPiece.classList.add("verticalDraggable");
      shipPiece.classList.add("verticalShip");
      shipPiece.id = "vertical" + shipAttribute.name;
      shipPiece.style.width = boxWidth + "px";
      shipPiece.style.height = (boxHeight * shipAttribute.length) + "px";

      
      shipPiece.draggable = true;
      shipPiece.addEventListener('dragstart', function(event) {
          const clickedBoxOffset = event.target.getAttribute("data-offset");
          const shipData = {
              name: shipAttribute.name,
              length: shipAttribute.length,
              offset: clickedBoxOffset  // This tells us how far from the head the user clicked
          };
      
          dragData.draggedShip = shipData; // store the data
          event.dataTransfer.setData('application/json', JSON.stringify(shipData));
      
          // get the shipHead's bounding rectangle
          const shipHeadRect = document.getElementById("shipHead" + shipAttribute.name).getBoundingClientRect();
          const shipPieceRect = shipPiece.getBoundingClientRect();
      
          // calculate the offset
          const offsetX = shipHeadRect.left - shipPieceRect.left + (shipHeadRect.width / 2);;
          const offsetY = shipHeadRect.top - shipPieceRect.top + (shipHeadRect.height / 2);
      
          // adjust the drag image's starting position
          event.dataTransfer.setDragImage(shipPiece, offsetX, offsetY);
      });
      
      for (let i = 0; i < shipAttribute.length; i++) {

          let shipBox = document.createElement("div");
          shipBox.className = "shipbox";
          shipBox.style.width =  boxWidth + "px";

          shipBox.addEventListener('mousedown', function(event) {
              console.log("Element clicked:", event.target);
              shipPiece.setAttribute("data-offset", 0); // set the offset on the shipPiece when a shipBox is clicked
          });

          if (i == 0) { 
              shipBox.id = "shipHead" + shipAttribute.name;  // Make it unique
          } else {
              shipBox.id = shipAttribute.name + "-" + i;  // Make it unique
          }

          shipPiece.appendChild(shipBox);
      }

      shipContainer.appendChild(shipTitle);
      shipContainer.appendChild(shipPiece);
      piecesContainer.appendChild(shipContainer);

  }
  return piecesContainer;
}



let gameInit = createNavUi();

let player1 = new Player;

let newGame = new Game(generateRandomString(), player1)

let gameScreen = document.querySelector(".gameScreenContainer");

let leftGameScreen = document.createElement("div");
leftGameScreen.className="gameScreen-Left"

let currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal"
currentShipOrientation.innerText = `Current Ship Position is: ${currentShipOrientation.dataset.shipOrientation}`
gameScreen.appendChild(leftGameScreen);
let pieces = battleshipPieces(player1);
leftGameScreen.appendChild(pieces);


let shipPositionSwitcher = document.createElement("button");
shipPositionSwitcher.className ="shipPositionSwitcher";
shipPositionSwitcher.innerText = "Switch Orientation"
shipPositionSwitcher.addEventListener("click", function(){
    let shipOrientation = document.querySelector(".currentShipOrientation");

    if (shipOrientation.dataset.shipOrientation == "Horizontal") {
        shipOrientation.dataset.shipOrientation = "Vertical";
        leftGameScreen.removeChild(pieces);
        leftGameScreen.insertBefore(verticalPieces, leftGameScreen.firstChild);
    } else {
        shipOrientation.dataset.shipOrientation = "Horizontal";
        leftGameScreen.removeChild(verticalPieces);
        leftGameScreen.insertBefore(pieces, leftGameScreen.firstChild);
    }

    shipOrientation.innerText = `Current Ship Position is: ${currentShipOrientation.dataset.shipOrientation}`
})




let board1 = createGameBoard(newGame.player1, currentShipOrientation.dataset.shipOrientation);

let board2 = createGameBoard(newGame.computer);

let verticalPieces = createVerticalPiecesContainer(player1);

leftGameScreen.appendChild(pieces);
// leftGameScreen.appendChild(verticalPieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);
