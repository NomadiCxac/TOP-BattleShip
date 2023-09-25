function placeBoardMarker(game, move, turn) {

    if (turn == "Computer Move") {
        let playerBoard = document.querySelector(`div#${game.player1.name}.gameBoard`);

        for (let shipType in game.player1.gameBoard.ship) {
            for (let coordinate of game.player1.gameBoard.ship[shipType].coordinates) {
    
                let shipBox = playerBoard.querySelector(`div#${coordinate}.box`);
    
                if (move === coordinate) {
                    shipBox.classList.add("placed");
                    shipBox.classList.add("hit");
                    shipBox.dataset.ship = shipType;
                    shipBox.id = "player"
                    shipBox.textContent = "X"
                    return;
                } 
            }
        }

        let shipBoxMissed = playerBoard.querySelector(`div#${move}.box`);
    
            shipBoxMissed.classList.add("miss");
            shipBoxMissed.id = "player"
            shipBoxMissed.textContent = "·"

    }

    if (turn == "Player Move") {
        console.log(move)
        let computerBoard = document.querySelector("div#computer.gameBoard");

        for (let shipType in game.computer.gameBoard.ship) {
            for (let coordinate of game.computer.gameBoard.ship[shipType].coordinates) {
    
                let shipBox = computerBoard.querySelector(`div#${coordinate}.box`);
    
                if (move === coordinate) {
                    shipBox.classList.add("placed");
                    shipBox.classList.add("hit");
                    shipBox.dataset.ship = shipType;
                    shipBox.id = "computer"
                    shipBox.textContent = "X"
                    return;
                }
            }
        }

        let shipBoxMissed = computerBoard.querySelector(`div#${move}.box`);
            shipBoxMissed.classList.add("miss");
            shipBoxMissed.id = "computer"
            shipBoxMissed.textContent = "·"
    }

    return;

}


module.exports = placeBoardMarker;