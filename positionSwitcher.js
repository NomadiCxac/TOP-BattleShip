const {battleshipPieces} = require('./battleshipPieces');

function createShipPositionSwitcher(player) {
    let shipPositionSwitcher = document.createElement("button");
    shipPositionSwitcher.className ="shipPositionSwitcher";
    shipPositionSwitcher.innerText = "Switch Orientation"

    shipPositionSwitcher.addEventListener("click", function(){

    let shipOrientation = document.querySelector(".currentShipOrientation");
    let leftGameScreen = document.querySelector(".gameScreen-Left");


    if (shipOrientation.dataset.shipOrientation == "Horizontal") {
        shipOrientation.dataset.shipOrientation = "Vertical";
        let updatedVertBoard = battleshipPieces(player, "Vertical");
        
        console.log(player.gameBoard.ship)
        leftGameScreen.removeChild(leftGameScreen.firstChild);
        leftGameScreen.insertBefore(updatedVertBoard, leftGameScreen.firstChild);
    } else {
        shipOrientation.dataset.shipOrientation = "Horizontal";
        let updatedHorBoard = battleshipPieces(player, "Horizontal");

        console.log(player.gameBoard.ship)
        leftGameScreen.removeChild(leftGameScreen.firstChild);
        leftGameScreen.insertBefore(updatedHorBoard, leftGameScreen.firstChild);
    }

    shipOrientation.innerText = `Current Ship Position is: ${shipOrientation.dataset.shipOrientation}`
    })

    return shipPositionSwitcher;
}

module.exports = createShipPositionSwitcher;