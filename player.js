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
        return coordinate;
    }

    isAi(name) {
        let check = this.capitalizeFirst(name);
        return check == "Computer" || check == "Ai";
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    easyAiMoves() {
        if (!this.Ai) {
            throw new Error("Access to easyAiMoves is restricted.");
        }

        let columnNumber = this.getRandomInt(0, this.gameBoard.width - 1);
        let rowNumber = this.getRandomInt(1, this.gameBoard.height);
        let columnAlias = String.fromCharCode(columnNumber + 65);

        let move = columnAlias + rowNumber

        if (this.completedMoves.includes(move)) {
            return this.easyAiMoves();
        }

        this.completedMoves.push(move);

        return move;

    }
}

module.exports = Player;