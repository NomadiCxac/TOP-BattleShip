const Ship = require('./ship');  // Adjust path accordingly

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

describe('Gameboard Class', () => {

    test('height of gb should be equal to 10', () => {
        const gb = new gameBoard();
        expect(gb.height).toBe(10);
    });

    test('width of gb should be equal to 10', () => {
        const gb = new gameBoard();
        expect(gb.width).toBe(10);
    });

    test('gb should be able to place ships at specific coordinates by calling the ship factory function and returing true for valid placement', () => {
        const gb = new gameBoard();
        const ship = new Ship("Cruiser");
        let shipHead = "B7";
        let shipOrientation = "Vertical";
        expect(gb.placeShip(ship, shipHead, shipOrientation)).toBeTruthy();
    });

    test('gb should NOT be able to place ships that exist at an exiting location and return false for invalid placement', () => {
        const gb = new gameBoard();
        const shipOne = new Ship("Cruiser");
        const shipTwo = new Ship("Cruiser");
        let shipHead = "B7";
        let shipOrientation = "Vertical";
        gb.placeShip(shipOne, shipHead, shipOrientation);
        expect(gb.placeShip(shipTwo, shipHead, shipOrientation)).toBeFalsy();
    });

    test('gb should be able to check the coordinates for a ship', () => {
        const gb = new gameBoard();
        const ship = new Ship("Cruiser");
        let shipHead = "B7";
        let shipOrientation = "Horizontal";
        gb.placeShip(ship, shipHead, shipOrientation);
        expect(gb.shipCoordinates(ship)).toBe(["B7, C7, D7"]);
    });

    test('gb should be able to check if attack is successful', () => {
        const gb = new gameBoard();
        const ship = new Ship("Cruiser");
        let shipHead = "B7";
        let shipOrientation = "Horizontal";
        gb.placeShip(ship, shipHead, shipOrientation);
        expect(gb.receieveAttack("B7")).toBeTruthy();
    });

    // test('gb should be able to check if attack is successful', () => {
    //     const gb = new gameBoard();
    //     expect(gb.missedAttack("B7")).toBeTruthy();
    // });

});
