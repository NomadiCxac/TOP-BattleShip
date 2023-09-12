const Player = require('./player');


function battleshipPieces (player) {
    
    let piecesContainer = document.createElement("div");
    piecesContainer.className = "piecesContainer";
    let boxWidth = 50;
    let boxHeight = 50;

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
    
        for (let i = 0; i < shipAttribute.length; i++) {
            let shipBox = document.createElement("div");
            shipBox.className = "shipbox";
            shipBox.style.width = (100 / shipAttribute.length) + "%";
            shipPiece.appendChild(shipBox);
        }
        
        shipContainer.appendChild(shipTitle);
        shipContainer.appendChild(shipPiece);
        piecesContainer.appendChild(shipContainer);

    }

    return piecesContainer;
}

module.exports = battleshipPieces;