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

    
}

module.exports = Player;