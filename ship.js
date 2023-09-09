
class Ship {
    constructor(name) {

        this.shipTypes = {
            Carrier: 5,
            Battleship: 4,
            Cruiser: 3,
            Submarine: 3,
            Destroyer: 2,
        }

        this.isValid = typeof name === 'string' && !!this.shipTypes[name];

        this.name = name;
        this.length = this.setLength(this.name);
        this.hitCount = 0;
        this.isDead = false;

    }

    capitalizeFirst(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    setLength(name) {
        const capitalizedShipName = this.capitalizeFirst(name);

        if (this.shipTypes[capitalizedShipName]) {
            return this.shipTypes[capitalizedShipName];
        } else {
            return false;
        }
    }

    isSunk() {
        if (this.hitCount == this.length) {
            return this.isDead = true;
        } 
        return this.isDead;
    }

    hit() {
        this.hitCount += 1;
        this.isSunk();
        return this.hitCount;
    }

}

module.exports = Ship;