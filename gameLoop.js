const Ship = require('./ship');  // Adjust path accordingly
const Gameboard = require('./gameBoard');  // Adjust path accordingly
const Player = require('./player')

class Game {
    constructor(gameId, playerName) {
        this.gameId = gameId;
        this.player1 = new Player(playerName);
        this.computer = new Player("computer");
        this.phaseCounter = 0;
        this.currentState = "";
        this.currentTurn = "";
    }

    // TO-DO promptUserCoordinate(), promptUserOrientation(), checkWinner();

    checkPlayerReadyGameState() {

        if (this.currentState != "Game Set-Up") {
           return false;
        }

        // console.log(this.player1.gameBoard.ship);
        for (let shipTypes in this.player1.gameBoard.ship) {
             if (this.player1.gameBoard.ship[shipTypes].coordinates.length == 0) {
                return false;
             } 
        }

        return true;
    }

    placeComputerShip(shipName) {
        while (computer.gameBoard.ship[shipName].coordinates == "") {
            
            let computerCoordinate = this.computer.easyAiMoves();
            let computerOrientation = this.computer.aiShipOrientation();

            while (!computer.gameBoard.placeShip(shipName, computerCoordinate, computerOrientation)) {
                computerCoordinate = this.computer.easyAiMoves();
                computerOrientation = this.computer.aiShipOrientation();
            }
        }
    }

    intializeGame() {

        this.currentState = "Game Set-Up"
        const shipTypes = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
        // Place ship phase - test on random coordinates

        for (const ship of shipTypes) {
            this.placePlayerShips(ship);
            this.placeComputerShip(ship);
        }

        return this.start();
    }

    playTurn(move) {
        if (this.currentTurn === "Player Move") {
            let isValidMove = false;
            let playerMove;
            
            while (!isValidMove) {
                try {
                    playerMove = this.player1.makeAttack(move);
                    isValidMove = true;
                    (this.computer.gameBoard.display());
                    this.computer.gameBoard.receiveAttack(playerMove);
                    return playerMove;
                } catch (error) {
                    (this.computer.gameBoard.display());
                    console.error(error.message); // Output the error message.
                    return false;
                }
            }
        
     

            (this.computer.gameBoard.display());
        }

        if (this.currentTurn = "Computer Move") {
            let computerChoice = this.computer.easyAiMoves()
            let computerMove = this.computer.makeAttack(computerChoice)
            this.player1.gameBoard.receiveAttack(computerMove);
            (this.player1.gameBoard.display());
            return computerChoice;
        }
    }

    updateState() {
        if (this.currentState === "Game Set-Up") {

            let turnValue = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            this.currentState = "Game Play Phase"
            if (turnValue === 1) {
                return this.currentTurn = "Player Move";
            } else {
                return this.currentTurn = "Computer Move"
            }
        }

        if (this.currentTurn === "Player Move") {
                return this.currentTurn = "Computer Move"
            }

        
        if (this.currentTurn === "Computer Move") {
            return this.currentTurn = "Player Move"
        }
    }

    checkWinner() {
        if (this.player1.gameBoard.gameOver()) {
            console.log("Computer Wins")
            return true;
        }

        if (this.computer.gameBoard.gameOver()) {
            console.log("Player Wins")
            return true;
        }
    }



    start() {
        while(!this.checkWinner()) {
            this.updateState();
            this.playTurn();
        }
        
    }

    
}

module.exports = Game;
