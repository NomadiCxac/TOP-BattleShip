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

    placePlayerShips(shipName) {
        while (player.gameBoard.ship[shipName].coordinates == "") {
            // Prompt User for shipHeadCoordinate
            let userCoordinate = promptUserCoordinate();
            let userShipOrientation = promptUserOrientation();

            while (!player.gameBoard.placeShip(shipName, userCoordinate, userShipOrientation)) {
                userCoordinate = promptUserCoordinate();
                userShipOrientation = promptUserOrientation();
            }
        }
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

    playTurn() {
        if (this.currentState === "Player Move") {
            let isValidMove = false;
            let playerMove;
        
            while (!isValidMove) {
                try {
                    //prompt user for coordinate
                    let prompt = "A1"; // Here you might want to get actual input from the user.
                    playerMove = player.makeAttack(prompt);
                    isValidMove = true;
                } catch (error) {
                    console.error(error.message); // Output the error message.
                    // Optionally, you can prompt the user with a message to enter a new coordinate.
                }
            }
        
            computer.gameBoard.receiveAttack(playerMove);
        }

        if (this.currentState = "Computer Move") {
            let computerChoice = computer.easyAiMoves()
            let computerMove = computer.makeAttack(computerChoice)
            player.gameBoard.receiveAttack(computerMove);
        }
    }

    updateState() {
        if (this.currentState === "Game Set-Up") {
            let turnValue = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            if (turnValue === 1) {
                return this.currentState = "Player Move"
            } else {
                return this.currentState = "Computer Move"
            }
        }

        if (this.currentState === "Player Move") {
                return this.currentState = "Computer Move"
            }

        
        if (this.currentState === "Computer Move") {
            return this.currentState = "Player Move"
        }
    }



    start() {
        while(!checkWinner()) {
            this.updateState();
            this.playTurn();
        }
        
    }
}

// Get player name
let name = "player1"

// Create players
let player = new Player(name);
let computer = new Player("computer");

// Place ship phase - test on random coordinates

    // "Carrier"
    player.gameBoard.placeShip("Carrier", "E5", "Horizontal")
    computer.gameBoard.placeShip("Carrier", "A1", "Horizontal")

    // "Battleship"
    player.gameBoard.placeShip("Battleship", "J7", "Horizontal")
    computer.gameBoard.placeShip("Battleship", "B10", "Vertical")

    // "Cruiser"
    player.gameBoard.placeShip("Cruiser", "A8", "Horizontal")
    computer.gameBoard.placeShip("Cruiser", "F1", "Horizontal")

    // "Submarine"
    player.gameBoard.placeShip("Submarine", "D1", "Horizontal")
    computer.gameBoard.placeShip("Submarine", "H10", "Vertical")

    // "Destroyer"
    player.gameBoard.placeShip("Destroyer", "B2", "Horizontal")
    computer.gameBoard.placeShip("Destroyer", "J1", "Horizontal")

    // player.gameBoard.display();
    computer.gameBoard.display();

// Attack phase 

    // Player attack phase
    let playerMove = player.makeAttack("A1")
    computer.gameBoard.receiveAttack(playerMove);

    computer.gameBoard.display();

    // Computer attack phase
    let computerChoice = computer.easyAiMoves()
    let computerMove = computer.makeAttack(computerChoice)
    player.gameBoard.receiveAttack(computerMove);

    player.gameBoard.display();
