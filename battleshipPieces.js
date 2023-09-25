let dragData = {
    draggedShip: null
};

function battleshipPieces(player, orientation) {
    let piecesContainer = document.createElement("div");
    let boxWidth = 50;
    let boxHeight = 48;
    let isVertical = orientation === "Vertical";

    piecesContainer.className = isVertical ? "verticalPiecesContainer" : "piecesContainer";

    for (let shipName in player.gameBoard.ship) {
        let shipAttribute = player.gameBoard.ship[shipName].instance;
        let shipContainer = document.createElement("div");
        shipContainer.className = isVertical ? "verticalShipContainer" : "shipContainer";
    
        let shipTitle = document.createElement("div");
        shipTitle.className = isVertical ? "verticalShipName" : "shipName";
        shipTitle.textContent = shipAttribute.name + ":";
    
        shipContainer.appendChild(shipTitle); // Add the shipTitle first 
    
        let shipPiece;
    
        if (player.gameBoard.ship[shipName].coordinates.length > 0) {
            let placedDiv = document.createElement("div");
            placedDiv.className = "placedText";
            placedDiv.textContent = "Placed";
            placedDiv.id = isVertical ? "vertical" : "horizontal";
            shipContainer.appendChild(placedDiv);
            shipContainer.style.justifyContent = "flex-start";    
        } else {
            shipPiece = document.createElement("div");
            shipPiece.classList.add(isVertical ? "verticalDraggable" : "draggable");
            shipPiece.classList.add("ship");
            shipPiece.id = isVertical ? "vertical" + shipAttribute.name : shipAttribute.name;
            shipPiece.style.width = isVertical ? boxWidth + "px" : (boxWidth * shipAttribute.length) + "px";
            shipPiece.style.height = isVertical ? (boxHeight * shipAttribute.length) + "px" : boxHeight + "px";
            shipPiece.draggable = true;
            
            shipPiece.addEventListener('dragstart', function(event) {
                const clickedBoxOffset = event.target.getAttribute("data-offset");
                const shipData = {
                    name: shipAttribute.name,
                    length: shipAttribute.length,
                    offset: clickedBoxOffset
                };
                dragData.draggedShip = shipData;
                event.dataTransfer.setData('application/json', JSON.stringify(shipData));
                const shipHeadRect = document.getElementById("shipHead" + shipAttribute.name).getBoundingClientRect();
                const shipPieceRect = shipPiece.getBoundingClientRect();
                const offsetX = shipHeadRect.left - shipPieceRect.left + (shipHeadRect.width / 2);
                const offsetY = shipHeadRect.top - shipPieceRect.top + (shipHeadRect.height / 2);
                event.dataTransfer.setDragImage(shipPiece, offsetX, offsetY);
            });

            for (let i = 0; i < shipAttribute.length; i++) {
                let shipBox = document.createElement("div");
                shipBox.className = "shipbox";
                shipBox.style.width = boxWidth + "px";
                shipBox.addEventListener('mousedown', function(event) {
                    shipPiece.setAttribute("data-offset", 0);
                });
                if (i == 0) {
                    shipBox.id = "shipHead" + shipAttribute.name;
                } else {
                    shipBox.id = shipAttribute.name + "-" + i;
                }
                shipPiece.appendChild(shipBox);
            }

            shipContainer.appendChild(shipTitle);
            shipContainer.appendChild(shipPiece);
        }

        
        piecesContainer.appendChild(shipContainer);
    }

    return piecesContainer;
}

module.exports = {battleshipPieces, dragData };