const Gameboard = require("./gameBoard");



class Player {
    constructor(name) {
        this.name = name;
        this.Ai = this.isAi(this.name);
        this.gameBoard = new Gameboard;
        this.completedMoves = [];
    }

    capitalizeFirst(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    makeAttack(coordinate) {

        if (this.completedMoves.includes(coordinate) && !this.Ai) {
            throw new Error("Move is already made")
        }

        this.completedMoves.push(coordinate);
        return coordinate;
    }

    isAi(name) {
        let check = this.capitalizeFirst(name);
        return check == "Computer" || check == "Ai";
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    getAllPossibleMoves() {
        let allMoves = [];
        for (let columnNumber = 0; columnNumber < this.gameBoard.width; columnNumber++) {
            for (let rowNumber = 1; rowNumber <= this.gameBoard.height; rowNumber++) {
                let columnAlias = String.fromCharCode(columnNumber + 65);
                allMoves.push(columnAlias + rowNumber);
            }
        }
        return allMoves;
    }

    easyAiMoves() {

        if (!this.Ai) {
            throw new Error("Access to easyAiMoves is restricted.");
        }
    
            // Get the set of all unplayed moves
            let allPossibleMoves = this.getAllPossibleMoves();
            let unplayedMoves = allPossibleMoves.filter(move => !this.completedMoves.includes(move));

            // If there are no unplayed moves left, raise an error or handle accordingly
            if (unplayedMoves.length === 0) {
                throw new Error("All moves have been played.");
            }

            // Randomly select a move from the set of unplayed moves
            let randomIndex = this.getRandomInt(0, unplayedMoves.length - 1);
            let move = unplayedMoves[randomIndex];

            this.completedMoves.push(move);

            return move;
    }

    aiShipOrientation() {
        let value = Math.floor(Math.random() * 2) + 1;
        if (value === 1) {
            return "Horizontal";
        } else {
            return "Vertical";
        }
    }

    placeAllShipsForAI() {
        if (!this.Ai) {
            throw new Error("Access to placeAllShipsForAI is restricted.");
        }
        
        for (let shipName in this.gameBoard.ship) {
            let placed = false;
            
            while (!placed) {
                // Select a random starting coordinate
                const randomMove = this.easyAiMoves();
                
                // Choose a random orientation
                const orientation = this.aiShipOrientation();
                
                // Check if the ship will fit within the bounds based on its starting coordinate, orientation, and length
                if (this.isShipPlacementValid(shipName, randomMove, orientation)) {
                    // If it's a valid placement, attempt to place the ship
                    placed = this.gameBoard.placeShip(shipName, randomMove, orientation);
                }
                
                if (placed) {
                    // Remove the placed move from completed moves so it can be used by the AI during the game
                    this.completedMoves.pop();
                }
            }
        }
    }

    // Helper function to check if a ship will fit within the board
    isShipPlacementValid(shipName, startingCoordinate, orientation) {
        const shipLength = this.gameBoard.ship[shipName].instance.length;
        let currentCoordinate = startingCoordinate;

        for (let i = 0; i < shipLength; i++) {
        // Check for out-of-bounds
            if (orientation === "Horizontal" && parseInt(currentCoordinate.substring(1), 10) + shipLength > 10) {
                return false;
            } else if (orientation === "Vertical" && this.gameBoard.charToRowIndex(currentCoordinate.charAt(0)) + shipLength > 9) {
                return false;
            }

            if (i < shipLength - 1) {
                currentCoordinate = orientation === "Vertical" 
                    ? this.gameBoard.getBelowAlias(currentCoordinate) 
                    : this.gameBoard.getRightAlias(currentCoordinate);
                }
        }
        return true;
    }
    
    
}

module.exports = Player;