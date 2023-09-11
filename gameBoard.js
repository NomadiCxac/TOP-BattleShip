const Ship = require('./ship');  // Adjust path accordingly

class Gameboard {
    constructor() {
        this.height = 10;
        this.width = 10;
        this.missCount = 0;
        this.missedMovesArray = [];
        this.hitMovesArray = [];
        this.ship = {
            Carrier: {
                instance: new Ship('Carrier'),
                coordinates: []
            },
            Battleship: {
                instance: new Ship('Battleship'),
                coordinates: []
            },
            Cruiser: {
                instance: new Ship('Cruiser'),
                coordinates: []
            },
            Submarine: {
                instance: new Ship('Submarine'),
                coordinates: []
            },
            Destroyer: {
                instance: new Ship('Destroyer'),
                coordinates: []
            }
        }
        this.board = this.startGame();
    }

    startGame() {
        let board = []
        for (let i = 0; i < this.height; i++) {
            for (let i = 0; i < this.height; i++) {
                let row = [];
                for (let j = 0; j < this.width; j++) {
                    row.push("")
                }
                board.push(row)
            }
        }

            return board;
        }
    
        // This code returns the char value as an int so if it is 'B' (or 'b'), we would get the value 66 - 65 = 1, for the purpose of our array B is rep. by board[1].
        charToRowIndex(char) {
            char = char.toUpperCase(); // Convert the character to uppercase
            return char.charCodeAt(0) - 'A'.charCodeAt(0);
        }
    
        // Returns an int as a str where numbers from 1 to 10, will be understood for array access: from 0 to 9.
        stringToColIndex(str) {
            return parseInt(str) - 1;
        }
    
        setAt(alias, string) {

            // Get the letter from char ex: C10 - charPart = C 
            const charPart = alias.charAt(0);

            // Get the number from char ex: C10 - charPart = 10 
            const numPart = alias.substring(1);
    
            const rowIndex = this.charToRowIndex(charPart);
            const colIndex = this.stringToColIndex(numPart);

            // Check to see if given coordinate is out of bounds like K9 or C18
            if (rowIndex < 0 || rowIndex > 9 || colIndex < 0 || colIndex > 9) {
                return false;
            }

            return this.board[rowIndex][colIndex] = string;
        }

        checkAt(alias) {

            // Get the letter from char ex: C10 - charPart = C 
            const charPart = alias.charAt(0);
        
            // Get the number from char ex: C10 - charPart = 10 
            const numPart = alias.substring(1);
        
            const rowIndex = this.charToRowIndex(charPart);
            const colIndex = this.stringToColIndex(numPart);
        
            // Ensure indices are valid
            if (rowIndex < 0 || rowIndex >= this.height || colIndex < 0 || colIndex >= this.width) {
                throw new Error("Invalid coordinate alias.");
            }

            if (this.board[rowIndex][colIndex] === "Hit") {
                return "Hit";
            }
        
        
            // Check to see if the given coordinate is occupied
            if (this.board[rowIndex][colIndex] !== "") {
                return false;
            }
        
            return true;
        }

        getBelowAlias(alias) {
            const charPart = alias.charAt(0).toUpperCase(); // Ensure it's in uppercase
            const numPart = parseInt(alias.substring(1), 10); // Convert the string to number
        
            // Convert charPart to the next letter
            const nextChar = String.fromCharCode(charPart.charCodeAt(0) + 1);
        
            const newAlias = nextChar + numPart;
        
            // Check for out-of-bounds
            if (this.charToRowIndex(nextChar) > 9) {
                throw new Error("There is no row below this.");
            }
        
            return newAlias;
        }
        
        getRightAlias(alias) {
            const charPart = alias.charAt(0).toUpperCase(); // Ensure it's in uppercase
            let numPart = parseInt(alias.substring(1), 10); // Convert the string to number
        
            // Increase the number by 1
            numPart++;
        
            const newAlias = charPart + numPart;
        
            // Check for out-of-bounds
            if (numPart > 10) {
                throw new Error("There is no column to the right of this.");
            }
        
            return newAlias;
        }

        

        placeShip(shipName, shipHeadCoordinate, shipOrientation) {
            const shipMarker = "Ship";
            const shipLength = this.ship[shipName].instance.length;
            let currentCoordinate = shipHeadCoordinate;
        
            const getNextCoordinate = shipOrientation === "Vertical"
                ? coordinate => this.getBelowAlias(coordinate)
                : coordinate => this.getRightAlias(coordinate);
        
            // Check if ship can be placed
            for (let i = 0; i < shipLength; i++) {
                if (!this.checkAt(currentCoordinate)) {
                    this.ship[shipName].coordinates = []; // Clear any coordinates
                    return false;
                }
        
                this.ship[shipName].coordinates.push(currentCoordinate);
                if (i < shipLength - 1) {
                    currentCoordinate = getNextCoordinate(currentCoordinate);
                }
            }
        
            // Place the ship
            for (let coordinate of this.ship[shipName].coordinates) {
                this.setAt(coordinate, shipMarker);
            }
        
            return this.ship[shipName].coordinates;
        }

        receiveAttack(coordinate) {
    
            if (this.checkAt(coordinate) == false) {

               
                for (let shipName in this.ship) {
                    let shipCoordinates = this.ship[shipName].coordinates;
                    if (shipCoordinates.includes(coordinate)) {
                        this.ship[shipName].instance.hit();
                        this.hitMovesArray.push(coordinate);
                        this.setAt(coordinate, "Hit");
                        return true;
                    }
                }

            } else {
                this.missCount += 1;
                this.missedMovesArray.push(coordinate);
                this.setAt(coordinate, "Miss");
                return false;
            }
        }

        setAllShipsToDead() {
            for (let shipName in this.ship) {
                this.ship[shipName].instance.isDead = true;
            }
        }

        gameOver() {
            for (let shipName in this.ship) {
                if (!this.ship[shipName].instance.isDead) {
                    return false;  // Return false if any ship is not dead.
                }       
            }
            return true;
        }

        display() {
            // Create the header with column numbers
            let header = "    ";
            for (let i = 1; i <= this.width; i++) {
                header += i + " ";
            }
            console.log(header);
        
            // Iterate through each row and print them
            for (let i = 0; i < this.height; i++) {
                let rowString = String.fromCharCode(65 + i) + " | "; // Convert row index to A-J and add the separator
                for (let j = 0; j < this.width; j++) {
                    // Check each cell's value and decide what to print
                    let cellValue = this.board[i][j];
        
                    // Decide the cell's display based on its value
                    switch (cellValue) {
                        case "Ship":
                            rowString += "S "; // S for Ship
                            break;
                        case "Hit":
                            rowString += "X "; // X for Hit
                            break;
                        case "Miss":
                            rowString += "M "; // M for Miss
                            break;
                        default:
                            rowString += "- "; // - for Empty Cell
                            break;
                    }
                }
                console.log(rowString);
            }
        }
}

module.exports = Gameboard;