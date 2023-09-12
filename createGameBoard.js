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


        // Generate coordinate columns for each row
        for (let j = 1; j <= player.gameBoard.width; j++) {
        
        let box = document.createElement("div");
            box.className = "box";
            box.id = alphaChar + j
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