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

    generateRandomMove() {
        let columnNumber = this.getRandomInt(0, this.gameBoard.width - 1);
        let rowNumber = this.getRandomInt(1, this.gameBoard.height);
        let columnAlias = String.fromCharCode(columnNumber + 65);
    
        return columnAlias + rowNumber;
    }

    easyAiMoves() {
        if (!this.Ai) {
            throw new Error("Access to easyAiMoves is restricted.");
        }
    
        let retryCount = 0; 
        const MAX_RETRIES = this.gameBoard.width ** this.gameBoard.height; // maximum number of retries before giving up
    
        let move = this.generateRandomMove();
    
        while (this.completedMoves.includes(move)) {
            if (retryCount >= MAX_RETRIES) {
                throw new Error("Maximum retries reached. Unable to find a unique move.");
            }
            move = this.generateRandomMove();
            retryCount++;
        }
    
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

    
}

module.exports = Player;