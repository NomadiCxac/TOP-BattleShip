const Ship = require('./ship');  // Adjust path accordingly
const Gameboard = require('./gameBoard');  // Adjust path accordingly
const Player = require('./player')

describe('Ship Class', () => {

    
    test('should recognize "DestRoYer" and assign correct length', () => {
        const ship = new Ship("DestRoYer");
        expect(ship.length).toBe(2);
    });

    test('should recognize "CruisEr" and assign correct length', () => {
        const ship = new Ship("CruisEr");
        expect(ship.length).toBe(3);
    });

    test('should return false for a non-existent ship', () => {
        const ship = new Ship('NonExistentShip');
        expect(ship.length).toBeFalsy();  // Assumes an invalid ship name results in no length set.
    });

    test('should not create a valid ship with an invalid name', () => {
        const ship = new Ship(3);
        expect(ship.isValid).toBeFalsy();
    });
    
    test('should increment hitCount when hit() is called', () => {
        const ship = new Ship('Cruiser');
        ship.hit();
        expect(ship.hitCount).toBe(1);
    });
    
    test('ship should not be sunk if hitCount is less than length', () => {
        const ship = new Ship('CARRIER');
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isDead).toBeFalsy();
    });

    test('ship should be sunk if hitCount is equal to length', () => {
        const ship = new Ship('bATTLESHIP');
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isDead).toBeTruthy();   
    });

});

describe('GameBoard Class', () => {

    let gb;  // Declare gb outside to make it available for all tests.

    beforeEach(() => {
        gb = new Gameboard();  // Re-initialize gb before each test
    });
      

    test('height of gb should be equal to 10', () => {
        expect(gb.height).toBe(10);
    });

    test('width of gb should be equal to 10', () => {
        expect(gb.width).toBe(10);
    });

    test.only('checkAt should return true for an empty cell', () => {
        expect(gb.checkAt("J10")).toBeTruthy();
    });

    test('checkAt should be able to check if ship already exists on coordinate', () => {
        let coordinate = "B7";
        gb.setAt(coordinate, "Ship");
        expect(gb.checkAt("B7")).toBeFalsy();
    });


    test('checkAt should throw an error for an out-of-bounds cell', () => {
         expect(() => gb.checkAt("K10")).toThrow("Invalid coordinate alias.");
    });

    test('getBelowAlias should return the cell below', () => {
        expect(gb.getBelowAlias("A1")).toBe("B1");
        expect(gb.getBelowAlias("B5")).toBe("C5");
    });
    
    test('getBelowAlias should throw an error for a bottom-row cell', () => {
        expect(() => gb.getBelowAlias("J10")).toThrow("There is no row below this.");
    });

    test('getRightAlias should return the cell to the right', () => {
        expect(gb.getRightAlias("A1")).toBe("A2");
        expect(gb.getRightAlias("B5")).toBe("B6");
    });
    
    test('getRightAlias should throw an error for a rightmost-column cell', () => {
        expect(() => gb.getRightAlias("A10")).toThrow("There is no column to the right of this.");
    });

    test('placeShip should place a vertical ship correctly', () => {
        expect(gb.placeShip("Cruiser", "A1", "Vertical")).toEqual(["A1", "B1", "C1"]);
        // Add more assertions to check that board state was modified correctly
    });
    
    test('placeShip should place a horizontal ship correctly', () => {
        expect(gb.placeShip("Cruiser", "A1", "Horizontal")).toEqual(["A1", "A2", "A3"]);
        // Add more assertions to check that board state was modified correctly
    });
    
    test('placeShip should return false if ship cannot be placed due to existing ship', () => {
        gb.placeShip("Submarine", "A1", "Vertical");
        expect(gb.placeShip("Cruiser", "A1", "Vertical")).toBeFalsy();
        expect(gb.ship["Cruiser"].coordinates).toEqual([]);
    });
    
    test('receiveAttack should call the "hit()" function to the correct ship if true and update gameboard', () =>{
        gb.placeShip("Submarine", "A1", "Vertical");
        expect(gb.receiveAttack("A1")).toBeTruthy();
        expect(gb.ship["Submarine"].instance.hitCount).toBe(1);
        expect(gb.hitMovesArray).toEqual(["A1"]);
    });

    test('receiveAttack should push a move to the missedMovesArray if false and update gameboard', () =>{
        gb.placeShip("Submarine", "A1", "Vertical");
        expect(gb.receiveAttack("A2")).toBeFalsy();
        expect(gb.receiveAttack("C3")).toBeFalsy();
        expect(gb.missedMovesArray).toEqual(["A2", "C3"]);
    });

    test('gameOver should return true if all ships sank', () => {
        gb.setAllShipsToDead();
        expect(gb.gameOver()).toBeTruthy();
    });

    test('gameOver should return false if not ships sank', () => {
        gb.setAllShipsToDead();
        gb.ship["Battleship"].instance.isDead = false;
        expect(gb.gameOver()).toBeFalsy();
    });
  
});

describe('Player Class', () => {

    let computer;
    let getRandomIntSpy;

    beforeEach(() => {
        computer = new Player ("computer");  // Re-initialize computer before each test
        getRandomIntSpy = jest.spyOn(computer, 'getRandomInt');
    });

    afterEach(() => {
        getRandomIntSpy.mockRestore(); // clean up the spy after each test
    });


    test('easyAiMoves returns a random "legal" coordinate', () => {
        
        expect(computer.Ai).toBeTruthy();
        const coordinate = computer.easyAiMoves();
    
        // Check if first character is between A to I
        const validColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        expect(validColumns.includes(coordinate[0])).toBeTruthy();
    
        // Check if second character is between 1 to 10
        const validRows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const rowValue = coordinate.slice(1); // This will account for both single and double digit row values
        expect(validRows.includes(rowValue)).toBeTruthy();
    });


    test('easyAiMoves returns a new coordinate if move has already been made', () => {
        
        expect(computer.Ai).toBeTruthy();
        getRandomIntSpy
            .mockReturnValueOnce(0)   // first call for column
            .mockReturnValueOnce(1)   // first call for row
            .mockReturnValueOnce(1)   // Second call for column
            .mockReturnValueOnce(2);  // Second call for row

        // Manually add A1 to completedMoves
        computer.completedMoves.push('A1');

        // Spy on the easyAiMoves method
        const easyAiMovesSpy = jest.spyOn(computer, 'easyAiMoves');

        // Call the method
        const result = computer.easyAiMoves();;

        // Check if easyAiMoves was called twice: 
        // Once for the original call and once because of recursion.
        expect(easyAiMovesSpy).toHaveBeenCalledTimes(2);
        expect(result).toBe("B2");
        expect(computer.completedMoves).toEqual(["A1", "B2"]);

        // Clean up the spy
        easyAiMovesSpy.mockRestore();
    });
  
});
