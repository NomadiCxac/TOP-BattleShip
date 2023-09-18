const { dragData } = require('./battleshipPieces');

// let draggedShipData = null;  // at the beginning of the file

function getAffectedBoxes(headPosition, length, orientation) {
    const boxes = [];
    const charPart = headPosition[0];
    const numPart = parseInt(headPosition.slice(1));

    for (let i = 0; i < length; i++) {
        if (orientation === "Horizontal") {
            boxes.push(document.getElementById(charPart + (numPart + i)));
        } else {
            boxes.push(document.getElementById(String.fromCharCode(charPart.charCodeAt(0) + i) + numPart));
        }
    }

    return boxes;
}


function isValidPlacement(boxId, length, offset, orientation, player) {
    const charPart = boxId[0];
    const numPart = parseInt(boxId.slice(1));

    const adjustedNumPart = numPart - offset;

    if (orientation === "Horizontal") {
        return adjustedNumPart > 0 && adjustedNumPart + length - 1 <= player.gameBoard.width;
    } else {
        return charPart.charCodeAt(0) - 65 - offset >= 0 && charPart.charCodeAt(0) - 65 - offset + length <= player.gameBoard.height;
    }
}

function getCurrentShipOrientation() {
    let shipOrientationElement = document.querySelector("div[data-ship-orientation]");
    return shipOrientationElement ? shipOrientationElement.dataset.shipOrientation : "Horizontal";
}


function createGameBoard(player) {
    

    // Generate div elements for Game Board
    let gameBoardComponent = document.createElement("div");
    let gameBoardTopComponent = document.createElement("div");
    let gameBoardBottomComponent = document.createElement("div");
    let gameBoard = document.createElement("div");
    let alphaCoordinates = document.createElement("div");
    let numericCoordinates = document.createElement("div");
  
   
     // Assigning classes to the created elements
     gameBoardComponent.className = "gameBoardContainer";
     gameBoardTopComponent.className = "gameBoardContainer top";
     gameBoardBottomComponent.className = "gameBoardContainer bottom";
     gameBoard.className = "gameBoard";
     gameBoard.id = player.name; // Assuming the player is a string like "player1"
     alphaCoordinates.className = "alphaCoordinates";
     numericCoordinates.className = "numericCoordinates";

     // Create column titles equal to width of board
     for (let i = 1; i <= player.gameBoard.width; i++) {
        let columnTitle = document.createElement("div");
        columnTitle.textContent = i;
        numericCoordinates.appendChild(columnTitle);
     }

    gameBoardTopComponent.appendChild(numericCoordinates);

    // Generate rows and row titles equal to height
    for (let i = 0; i < player.gameBoard.height; i++) {

        let alphaChar = String.fromCharCode(i + 65);

        let rowTitle = document.createElement("div");
        rowTitle.textContent = alphaChar;
        alphaCoordinates.appendChild(rowTitle);

        let row = document.createElement("div");
        row.className = "row";
        row.id = alphaChar;

        let affectedBoxes = [];
        let previousAffectedBoxes = [];
        // Generate coordinate columns for each row
        for (let j = 1; j <= player.gameBoard.width; j++) {
        
        let box = document.createElement("div");
            box.className = "box";
            box.id = alphaChar + j

            box.addEventListener('dragover', function(event) {
                event.preventDefault();
            });

            box.addEventListener('dragenter', function() {
                setTimeout(() => {

                    const shipData = dragData.draggedShip;
                    previousAffectedBoxes = [...affectedBoxes]; // make a shallow copy   
                    let shipOrientation = getCurrentShipOrientation();

            
                    if (!shipData) {
                        console.error("Ship data is null!");
                        return;
                    }
            
                    // Find out if the ship can be placed here
                    const validPlacement = isValidPlacement(
                        box.id, 
                        shipData.length, 
                        shipData.offset, 
                        shipOrientation,
                        player
                    );
            
                    if (validPlacement) {
                        affectedBoxes = getAffectedBoxes(
                            box.id, 
                            shipData.length, 
                            shipOrientation
                        );
            
                        
                        affectedBoxes.forEach(box => {
                            box.classList.add('highlight');
                            box.dataset.dragAffected = "true"; // Add this line
                        });
                    }
                }, 0); // delay of 0 ms, just enough to let dragleave happen first if it's going to
            });


            box.addEventListener('dragleave', function() {
                const previouslyAffectedBoxes = document.querySelectorAll('.box[data-drag-affected="true"]');
                previouslyAffectedBoxes.forEach(prevBox => {
                    prevBox.classList.remove('highlight');
                    prevBox.removeAttribute('data-drag-affected'); // Remove the attribute
                });
            });
    
            

            box.addEventListener('drop', function(event) {
                event.preventDefault();

                let shipOrientation = getCurrentShipOrientation();
                let lowerLetterBound = 65;
                let upperLetterBound = 74;
                const charPart = box.id[0];  // Assuming the format is always like "A5"
                const numPart = parseInt(box.id.slice(1));

                const shipData = JSON.parse(event.dataTransfer.getData('application/json'));

                const adjustedNumPart = numPart - shipData.offset;
                const adjustedTargetPosition = charPart + adjustedNumPart;  // The new position for the head of the ship
                let affectedBoxes = getAffectedBoxes(adjustedTargetPosition, shipData.length, shipOrientation)

                // Calculate the adjusted position based on where the user clicked on the ship
                const headCoordinate = (charPart + numPart);

                let selectedChar = charPart.charCodeAt();
                            
                // Check if the placement is out of bounds
                if (shipOrientation == "Horizontal" && (adjustedNumPart <= 0 || adjustedNumPart + shipData.length - 1 > player.gameBoard.width)) {
                    console.error("Invalid ship placement: Out of bounds.");
                    box.classList.remove('highlight');
                    return;
                } else if (shipOrientation == "Vertical" && (selectedChar + shipData.length < lowerLetterBound || selectedChar + shipData.length - 1 > upperLetterBound)) {
                    console.error("Invalid ship placement: Out of bounds.");
                    box.classList.remove('highlight');
                    return;
                } else if (player.gameBoard.placeShip(shipData.name, headCoordinate, shipOrientation) == false) {
                    console.error("Invalid ship placement: Overlapping Ship.");
                    affectedBoxes.forEach(box => {
                        box.classList.remove('highlight');
                    });
                    return;
                } else {
                    affectedBoxes.forEach(box => {
                        box.classList.remove('highlight');
                        box.removeAttribute('data-drag-affected')
                        box.classList.add('placed');
                        box.dataset.hitMarker = "false";
                        box.dataset.ship = shipData.name;
                    });
                }

                let isVertical = shipOrientation === "Vertical";
                let shipElement;

                // console.log(`Attempting to place ${shipData.name} with length ${shipData.length} at position ${adjustedTargetPosition}.`);
                
                if (shipOrientation == "Horizontal") {
                    shipElement = document.querySelector(`div#${shipData.name}.draggable.ship`)
                }

                if (shipOrientation == "Vertical") {
                    shipElement = document.querySelector(`div#vertical${shipData.name}.verticalDraggable.ship`)
                }

                let parentElement = shipElement.parentElement;
                shipElement.remove();
                
                let placedDiv = document.createElement("div");
                placedDiv.className = "placedText";
                placedDiv.textContent = "Placed";
                placedDiv.id = isVertical ? "vertical" : "horizontal";

                // Append the new div to the parent element
                parentElement.appendChild(placedDiv);
                parentElement.style.justifyContent = "flex-start";
                // let shipObjectName = shipData.name;

               
            });
            
            box.addEventListener('dragleave', function() {
                // Remove the highlight
                let previousBoxes;

                      
                if (affectedBoxes) {
                    previousBoxes = affectedBoxes;
                }
               

                if (!affectedBoxes) {
                    affectedBoxes.forEach(box => box.classList.remove('highlight'));
                }
                
            });
            
            row.appendChild(box);
        }

        gameBoard.appendChild(row);
    }

    gameBoardBottomComponent.appendChild(alphaCoordinates);
    gameBoardBottomComponent.appendChild(gameBoard);

    gameBoardComponent.appendChild(gameBoardTopComponent);
    gameBoardComponent.appendChild(gameBoardBottomComponent);


    return gameBoardComponent
}

module.exports = createGameBoard;