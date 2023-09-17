const Player = require('./player');

let dragData = {
    draggedShip: null
  };

function battleshipPieces (player) {
    
    let piecesContainer = document.createElement("div");
    piecesContainer.className = "piecesContainer";
    let boxWidth = 50;
    let boxHeight = 48;

    for (let shipName in player.gameBoard.ship) {

        let shipAttribute = player.gameBoard.ship[shipName].instance;
        
        let shipContainer = document.createElement("div");
        shipContainer.className = "shipContainer";
        let shipTitle = document.createElement("div");
        shipTitle.className = "shipName";
        shipTitle.textContent = shipAttribute.name + ":";

        let shipPiece = document.createElement("div");
        shipPiece.classList.add("draggable");
        shipPiece.classList.add("ship");
        shipPiece.id = shipAttribute.name;
        shipPiece.style.width = (boxWidth * shipAttribute.length) + "px";
        shipPiece.style.height = (boxHeight) + "px";

       
 
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


module.exports = {battleshipPieces, dragData };