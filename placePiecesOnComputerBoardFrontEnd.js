function placePiecesOnComputerBoardFrontEnd(computer) {
    let computerBoard = document.querySelector("div#computer.gameBoard");

    console.log(computerBoard);

    for (let shipType in computer.gameBoard.ship) {
        for (let coordinate of computer.gameBoard.ship[shipType].coordinates) {
            // Use the template string and interpolation correctly here
            let shipBox = computerBoard.querySelector(`div#${coordinate}.box`);
            
            shipBox.classList.add("placed");
            shipBox.dataset.ship = shipType;
        }
    }
}


module.exports = placePiecesOnComputerBoardFrontEnd;