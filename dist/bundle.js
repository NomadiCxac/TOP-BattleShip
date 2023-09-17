/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./battleshipPieces.js":
/*!*****************************!*\
  !*** ./battleshipPieces.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Player = __webpack_require__(/*! ./player */ "./player.js");
var dragData = {
  draggedShip: null
};
function battleshipPieces(player) {
  var piecesContainer = document.createElement("div");
  piecesContainer.className = "piecesContainer";
  var boxWidth = 50;
  var boxHeight = 48;
  var _loop = function _loop() {
    var shipAttribute = player.gameBoard.ship[shipName].instance;
    var shipContainer = document.createElement("div");
    shipContainer.className = "shipContainer";
    var shipTitle = document.createElement("div");
    shipTitle.className = "shipName";
    shipTitle.textContent = shipAttribute.name + ":";
    var shipPiece = document.createElement("div");
    shipPiece.classList.add("draggable");
    shipPiece.classList.add("ship");
    shipPiece.id = shipAttribute.name;
    shipPiece.style.width = boxWidth * shipAttribute.length + "px";
    shipPiece.style.height = boxHeight + "px";
    shipPiece.draggable = true;
    shipPiece.addEventListener('dragstart', function (event) {
      var clickedBoxOffset = event.target.getAttribute("data-offset");
      var shipData = {
        name: shipAttribute.name,
        length: shipAttribute.length,
        offset: clickedBoxOffset // This tells us how far from the head the user clicked
      };

      dragData.draggedShip = shipData; // store the data
      event.dataTransfer.setData('application/json', JSON.stringify(shipData));

      // get the shipHead's bounding rectangle
      var shipHeadRect = document.getElementById("shipHead" + shipAttribute.name).getBoundingClientRect();
      var shipPieceRect = shipPiece.getBoundingClientRect();

      // calculate the offset
      var offsetX = shipHeadRect.left - shipPieceRect.left + shipHeadRect.width / 2;
      ;
      var offsetY = shipHeadRect.top - shipPieceRect.top + shipHeadRect.height / 2;

      // adjust the drag image's starting position
      event.dataTransfer.setDragImage(shipPiece, offsetX, offsetY);
    });
    for (var i = 0; i < shipAttribute.length; i++) {
      var shipBox = document.createElement("div");
      shipBox.className = "shipbox";
      shipBox.style.width = boxWidth + "px";
      shipBox.addEventListener('mousedown', function (event) {
        console.log("Element clicked:", event.target);
        shipPiece.setAttribute("data-offset", 0); // set the offset on the shipPiece when a shipBox is clicked
      });

      if (i == 0) {
        shipBox.id = "shipHead" + shipAttribute.name; // Make it unique
      } else {
        shipBox.id = shipAttribute.name + "-" + i; // Make it unique
      }

      shipPiece.appendChild(shipBox);
    }
    shipContainer.appendChild(shipTitle);
    shipContainer.appendChild(shipPiece);
    piecesContainer.appendChild(shipContainer);
  };
  for (var shipName in player.gameBoard.ship) {
    _loop();
  }
  return piecesContainer;
}
module.exports = {
  battleshipPieces: battleshipPieces,
  dragData: dragData
};

/***/ }),

/***/ "./createGameBoard.js":
/*!****************************!*\
  !*** ./createGameBoard.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ./battleshipPieces */ "./battleshipPieces.js"),
  dragData = _require.dragData;

// let draggedShipData = null;  // at the beginning of the file

function getAffectedBoxes(headPosition, length, orientation) {
  var boxes = [];
  var charPart = headPosition[0];
  var numPart = parseInt(headPosition.slice(1));
  for (var i = 0; i < length; i++) {
    if (orientation === "Horizontal") {
      boxes.push(document.getElementById(charPart + (numPart + i)));
    } else {
      boxes.push(document.getElementById(String.fromCharCode(charPart.charCodeAt(0) + i) + numPart));
    }
  }
  return boxes;
}
function isValidPlacement(boxId, length, offset, orientation, player) {
  var charPart = boxId[0];
  var numPart = parseInt(boxId.slice(1));
  var adjustedNumPart = numPart - offset;
  if (orientation === "Horizontal") {
    return adjustedNumPart > 0 && adjustedNumPart + length - 1 <= player.gameBoard.width;
  } else {
    return charPart.charCodeAt(0) - 65 - offset >= 0 && charPart.charCodeAt(0) - 65 - offset + length <= player.gameBoard.height;
  }
}
function createGameBoard(player) {
  // Generate div elements for Game Board
  var gameBoardComponent = document.createElement("div");
  var gameBoardTopComponent = document.createElement("div");
  var gameBoardBottomComponent = document.createElement("div");
  var gameBoard = document.createElement("div");
  var alphaCoordinates = document.createElement("div");
  var numericCoordinates = document.createElement("div");

  // Assigning classes to the created elements
  gameBoardComponent.className = "gameBoardContainer";
  gameBoardTopComponent.className = "gameBoardContainer top";
  gameBoardBottomComponent.className = "gameBoardContainer bottom";
  gameBoard.className = "gameBoard";
  gameBoard.id = player.name; // Assuming the player is a string like "player1"
  alphaCoordinates.className = "alphaCoordinates";
  numericCoordinates.className = "numericCoordinates";

  // Create column titles equal to width of board
  for (var i = 1; i <= player.gameBoard.width; i++) {
    var columnTitle = document.createElement("div");
    columnTitle.textContent = i;
    numericCoordinates.appendChild(columnTitle);
  }
  gameBoardTopComponent.appendChild(numericCoordinates);

  // Generate rows and row titles equal to height
  var _loop = function _loop() {
    var alphaChar = String.fromCharCode(_i + 65);
    var rowTitle = document.createElement("div");
    rowTitle.textContent = alphaChar;
    alphaCoordinates.appendChild(rowTitle);
    var row = document.createElement("div");
    row.className = "row";
    row.id = alphaChar;
    var affectedBoxes = [];
    var previousAffectedBoxes = [];
    // Generate coordinate columns for each row
    var _loop2 = function _loop2() {
      var box = document.createElement("div");
      box.className = "box";
      box.id = alphaChar + j;
      box.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      box.addEventListener('dragenter', function () {
        setTimeout(function () {
          var shipData = dragData.draggedShip;
          previousAffectedBoxes = _toConsumableArray(affectedBoxes); // make a shallow copy   
          var shipOrientationElement = document.querySelector("div[data-ship-orientation]");
          var shipOrientation = shipOrientationElement.dataset.shipOrientation;
          console.log(shipOrientation);
          if (!shipData) {
            console.error("Ship data is null!");
            return;
          }

          // Find out if the ship can be placed here
          var validPlacement = isValidPlacement(box.id, shipData.length, shipData.offset, shipOrientation, player);
          if (validPlacement) {
            affectedBoxes = getAffectedBoxes(box.id, shipData.length, shipOrientation);
            console.log(affectedBoxes);
            console.log(previousAffectedBoxes);
            affectedBoxes.forEach(function (box) {
              box.classList.add('highlight');
              box.dataset.dragAffected = "true"; // Add this line
            });
          }
        }, 0); // delay of 0 ms, just enough to let dragleave happen first if it's going to
      });

      box.addEventListener('dragleave', function () {
        var previouslyAffectedBoxes = document.querySelectorAll('.box[data-drag-affected="true"]');
        previouslyAffectedBoxes.forEach(function (prevBox) {
          prevBox.classList.remove('highlight');
          prevBox.removeAttribute('data-drag-affected'); // Remove the attribute
        });
      });

      box.addEventListener('drop', function (event) {
        event.preventDefault();
        var shipOrientationElement = document.querySelector("div[data-ship-orientation]");
        var shipOrientation = shipOrientationElement.dataset.shipOrientation;
        var shipData = JSON.parse(event.dataTransfer.getData('application/json'));

        // Extract the character and numeric parts of the box ID
        var charPart = box.id[0]; // Assuming the format is always like "A5"
        var numPart = parseInt(box.id.slice(1));

        // Calculate the adjusted position based on where the user clicked on the ship
        var adjustedNumPart = numPart - shipData.offset;
        console.log(shipData.offset);
        console.log(adjustedNumPart);
        var rawData = event.dataTransfer.getData('application/json');
        console.log("Dropped data:", rawData);

        // Check if the placement is out of bounds
        if (adjustedNumPart <= 0 || adjustedNumPart + shipData.length - 1 > player.gameBoard.width) {
          console.error("Invalid ship placement: Out of bounds.");
          box.classList.remove('highlight');
          return;
        }
        var adjustedTargetPosition = charPart + adjustedNumPart; // The new position for the head of the ship

        var affectedBoxes = getAffectedBoxes(adjustedTargetPosition, shipData.length, shipOrientation);
        affectedBoxes.forEach(function (box) {
          box.classList.remove('highlight');
          box.classList.add('placed');
        });
        console.log("Attempting to place ".concat(shipData.name, " with length ").concat(shipData.length, " at position ").concat(adjustedTargetPosition, "."));

        // Place your ship based on adjustedTargetPosition as the head's position, using your existing logic or methods
        // For example: player.gameBoard.placeShip(shipData.name, adjustedTargetPosition, shipOrientation);
      });

      box.addEventListener('dragleave', function () {
        // Remove the highlight
        var previousBoxes;
        if (affectedBoxes) {
          previousBoxes = affectedBoxes;
        }
        if (!affectedBoxes) {
          affectedBoxes.forEach(function (box) {
            return box.classList.remove('highlight');
          });
        }
      });
      row.appendChild(box);
    };
    for (var j = 1; j <= player.gameBoard.width; j++) {
      _loop2();
    }
    gameBoard.appendChild(row);
  };
  for (var _i = 0; _i < player.gameBoard.height; _i++) {
    _loop();
  }
  gameBoardBottomComponent.appendChild(alphaCoordinates);
  gameBoardBottomComponent.appendChild(gameBoard);
  gameBoardComponent.appendChild(gameBoardTopComponent);
  gameBoardComponent.appendChild(gameBoardBottomComponent);
  return gameBoardComponent;
}
module.exports = createGameBoard;

/***/ }),

/***/ "./gameBoard.js":
/*!**********************!*\
  !*** ./gameBoard.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Ship = __webpack_require__(/*! ./ship */ "./ship.js"); // Adjust path accordingly
var Gameboard = /*#__PURE__*/function () {
  function Gameboard() {
    _classCallCheck(this, Gameboard);
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
    };
    this.board = this.startGame();
  }
  _createClass(Gameboard, [{
    key: "startGame",
    value: function startGame() {
      var board = [];
      for (var i = 0; i < this.height; i++) {
        for (var _i = 0; _i < this.height; _i++) {
          var row = [];
          for (var j = 0; j < this.width; j++) {
            row.push("");
          }
          board.push(row);
        }
      }
      return board;
    }

    // This code returns the char value as an int so if it is 'B' (or 'b'), we would get the value 66 - 65 = 1, for the purpose of our array B is rep. by board[1].
  }, {
    key: "charToRowIndex",
    value: function charToRowIndex(_char) {
      _char = _char.toUpperCase(); // Convert the character to uppercase
      return _char.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    // Returns an int as a str where numbers from 1 to 10, will be understood for array access: from 0 to 9.
  }, {
    key: "stringToColIndex",
    value: function stringToColIndex(str) {
      return parseInt(str) - 1;
    }
  }, {
    key: "setAt",
    value: function setAt(alias, string) {
      // Get the letter from char ex: C10 - charPart = C 
      var charPart = alias.charAt(0);

      // Get the number from char ex: C10 - charPart = 10 
      var numPart = alias.substring(1);
      var rowIndex = this.charToRowIndex(charPart);
      var colIndex = this.stringToColIndex(numPart);

      // Check to see if given coordinate is out of bounds like K9 or C18
      if (rowIndex < 0 || rowIndex > 9 || colIndex < 0 || colIndex > 9) {
        return false;
      }
      return this.board[rowIndex][colIndex] = string;
    }
  }, {
    key: "checkAt",
    value: function checkAt(alias) {
      // Get the letter from char ex: C10 - charPart = C 
      var charPart = alias.charAt(0);

      // Get the number from char ex: C10 - charPart = 10 
      var numPart = alias.substring(1);
      var rowIndex = this.charToRowIndex(charPart);
      var colIndex = this.stringToColIndex(numPart);

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
  }, {
    key: "getBelowAlias",
    value: function getBelowAlias(alias) {
      var charPart = alias.charAt(0).toUpperCase(); // Ensure it's in uppercase
      var numPart = parseInt(alias.substring(1), 10); // Convert the string to number

      // Convert charPart to the next letter
      var nextChar = String.fromCharCode(charPart.charCodeAt(0) + 1);
      var newAlias = nextChar + numPart;

      // Check for out-of-bounds
      if (this.charToRowIndex(nextChar) > 9) {
        throw new Error("There is no row below this.");
      }
      return newAlias;
    }
  }, {
    key: "getRightAlias",
    value: function getRightAlias(alias) {
      var charPart = alias.charAt(0).toUpperCase(); // Ensure it's in uppercase
      var numPart = parseInt(alias.substring(1), 10); // Convert the string to number

      // Increase the number by 1
      numPart++;
      var newAlias = charPart + numPart;

      // Check for out-of-bounds
      if (numPart > 10) {
        throw new Error("There is no column to the right of this.");
      }
      return newAlias;
    }
  }, {
    key: "placeShip",
    value: function placeShip(shipName, shipHeadCoordinate, shipOrientation) {
      var _this = this;
      var shipMarker = "Ship";
      var shipLength = this.ship[shipName].instance.length;
      var currentCoordinate = shipHeadCoordinate;
      var getNextCoordinate = shipOrientation === "Vertical" ? function (coordinate) {
        return _this.getBelowAlias(coordinate);
      } : function (coordinate) {
        return _this.getRightAlias(coordinate);
      };

      // Check if ship can be placed
      for (var i = 0; i < shipLength; i++) {
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
      var _iterator = _createForOfIteratorHelper(this.ship[shipName].coordinates),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var coordinate = _step.value;
          this.setAt(coordinate, shipMarker);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return this.ship[shipName].coordinates;
    }
  }, {
    key: "receiveAttack",
    value: function receiveAttack(coordinate) {
      if (this.checkAt(coordinate) == false) {
        for (var shipName in this.ship) {
          var shipCoordinates = this.ship[shipName].coordinates;
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
  }, {
    key: "setAllShipsToDead",
    value: function setAllShipsToDead() {
      for (var shipName in this.ship) {
        this.ship[shipName].instance.isDead = true;
      }
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      for (var shipName in this.ship) {
        if (!this.ship[shipName].instance.isDead) {
          return false; // Return false if any ship is not dead.
        }
      }

      return true;
    }
  }, {
    key: "display",
    value: function display() {
      // Create the header with column numbers
      var header = "    ";
      for (var i = 1; i <= this.width; i++) {
        header += i + " ";
      }
      console.log(header);

      // Iterate through each row and print them
      for (var _i2 = 0; _i2 < this.height; _i2++) {
        var rowString = String.fromCharCode(65 + _i2) + " | "; // Convert row index to A-J and add the separator
        for (var j = 0; j < this.width; j++) {
          // Check each cell's value and decide what to print
          var cellValue = this.board[_i2][j];

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
  }]);
  return Gameboard;
}();
module.exports = Gameboard;

/***/ }),

/***/ "./gameLoop.js":
/*!*********************!*\
  !*** ./gameLoop.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Ship = __webpack_require__(/*! ./ship */ "./ship.js"); // Adjust path accordingly
var Gameboard = __webpack_require__(/*! ./gameBoard */ "./gameBoard.js"); // Adjust path accordingly
var Player = __webpack_require__(/*! ./player */ "./player.js");
var Game = /*#__PURE__*/function () {
  function Game(gameId, playerName) {
    _classCallCheck(this, Game);
    this.gameId = gameId;
    this.player1 = new Player(playerName);
    this.computer = new Player("computer");
    this.phaseCounter = 0;
    this.currentState = "";
    this.currentTurn = "";
  }

  // TO-DO promptUserCoordinate(), promptUserOrientation(), checkWinner();
  _createClass(Game, [{
    key: "placePlayerShips",
    value: function placePlayerShips(shipName) {
      while (player.gameBoard.ship[shipName].coordinates == "") {
        // Prompt User for shipHeadCoordinate
        var userCoordinate = promptUserCoordinate();
        var userShipOrientation = promptUserOrientation();
        while (!player.gameBoard.placeShip(shipName, userCoordinate, userShipOrientation)) {
          userCoordinate = promptUserCoordinate();
          userShipOrientation = promptUserOrientation();
        }
      }
    }
  }, {
    key: "placeComputerShip",
    value: function placeComputerShip(shipName) {
      while (computer.gameBoard.ship[shipName].coordinates == "") {
        var computerCoordinate = this.computer.easyAiMoves();
        var computerOrientation = this.computer.aiShipOrientation();
        while (!computer.gameBoard.placeShip(shipName, computerCoordinate, computerOrientation)) {
          computerCoordinate = this.computer.easyAiMoves();
          computerOrientation = this.computer.aiShipOrientation();
        }
      }
    }
  }, {
    key: "intializeGame",
    value: function intializeGame() {
      this.currentState = "Game Set-Up";
      var shipTypes = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
      // Place ship phase - test on random coordinates

      for (var _i = 0, _shipTypes = shipTypes; _i < _shipTypes.length; _i++) {
        var ship = _shipTypes[_i];
        this.placePlayerShips(ship);
        this.placeComputerShip(ship);
      }
      return this.start();
    }
  }, {
    key: "playTurn",
    value: function playTurn() {
      if (this.currentState === "Player Move") {
        var isValidMove = false;
        var playerMove;
        while (!isValidMove) {
          try {
            //prompt user for coordinate
            var prompt = "A1"; // Here you might want to get actual input from the user.
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
        var computerChoice = computer.easyAiMoves();
        var computerMove = computer.makeAttack(computerChoice);
        player.gameBoard.receiveAttack(computerMove);
      }
    }
  }, {
    key: "updateState",
    value: function updateState() {
      if (this.currentState === "Game Set-Up") {
        var turnValue = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        if (turnValue === 1) {
          return this.currentState = "Player Move";
        } else {
          return this.currentState = "Computer Move";
        }
      }
      if (this.currentState === "Player Move") {
        return this.currentState = "Computer Move";
      }
      if (this.currentState === "Computer Move") {
        return this.currentState = "Player Move";
      }
    }
  }, {
    key: "checkWinner",
    value: function checkWinner() {
      if (player.gameBoard.gameOver()) {
        return "Computer Wins";
      }
      if (computer.gameBoard.gameOver()) {
        return "Player Wins";
      }
    }
  }, {
    key: "start",
    value: function start() {
      while (!checkWinner()) {
        this.updateState();
        this.playTurn();
      }
    }
  }]);
  return Game;
}();
module.exports = Game;

// // Get player name
// let name = "player1"

// // Create players
// let player = new Player(name);
// let computer = new Player("computer");

// // Place ship phase - test on random coordinates

//     // "Carrier"
//     player.gameBoard.placeShip("Carrier", "E5", "Horizontal")
//     computer.gameBoard.placeShip("Carrier", "A1", "Horizontal")

//     // "Battleship"
//     player.gameBoard.placeShip("Battleship", "J7", "Horizontal")
//     computer.gameBoard.placeShip("Battleship", "B10", "Vertical")

//     // "Cruiser"
//     player.gameBoard.placeShip("Cruiser", "A8", "Horizontal")
//     computer.gameBoard.placeShip("Cruiser", "F1", "Horizontal")

//     // "Submarine"
//     player.gameBoard.placeShip("Submarine", "D1", "Horizontal")
//     computer.gameBoard.placeShip("Submarine", "H10", "Vertical")

//     // "Destroyer"
//     player.gameBoard.placeShip("Destroyer", "B2", "Horizontal")
//     computer.gameBoard.placeShip("Destroyer", "J1", "Horizontal")

//     // player.gameBoard.display();
//     computer.gameBoard.display();

// // Attack phase 

//     // Player attack phase
//     let playerMove = player.makeAttack("A1")
//     computer.gameBoard.receiveAttack(playerMove);

//     computer.gameBoard.display();

//     // Computer attack phase
//     let computerChoice = computer.easyAiMoves()
//     let computerMove = computer.makeAttack(computerChoice)
//     player.gameBoard.receiveAttack(computerMove);

//     player.gameBoard.display();

/***/ }),

/***/ "./navigationComponents.js":
/*!*********************************!*\
  !*** ./navigationComponents.js ***!
  \*********************************/
/***/ ((module) => {

function createNavUi() {
  var gameInitializerContainer = document.createElement("div");
  gameInitializerContainer.className = "gameInitializerContainer";
  var playerNameContainer = document.createElement("div");
  playerNameContainer.className = "playerNameContainer";
  var computerDifficultyContainer = document.createElement("div");
  computerDifficultyContainer.className = "computerDifficultyContainer";
  var startButtonContainer = document.createElement("div");
  startButtonContainer.className = "startButtonContainer";
  var playerNameLabel = document.createElement("label");
  playerNameLabel.textContent = "Enter your name:";
  playerNameLabel.htmlFor = "playerInputName";
  playerNameContainer.appendChild(playerNameLabel);
  var playerInputName = document.createElement("input");
  playerInputName.className = "playerInputName";
  playerInputName.addEventListener('input', function () {
    var inputValue = playerInputName.value.toLowerCase();
    if (inputValue === "computer" || inputValue === "ai") {
      alert('The name cannot be "computer" or "ai".');
      playerInputName.value = ''; // Clear the input field
    }
  });

  playerNameContainer.appendChild(playerInputName);
  var easyRadio = document.createElement("input");
  easyRadio.type = "radio";
  easyRadio.name = "difficulty";
  easyRadio.value = "easy";
  easyRadio.id = "easy";
  var easyLabel = document.createElement("label");
  easyLabel.htmlFor = "easy";
  easyLabel.textContent = "Easy";
  computerDifficultyContainer.appendChild(easyRadio);
  computerDifficultyContainer.appendChild(easyLabel);

  // Radio button for hard difficulty
  var hardRadio = document.createElement("input");
  hardRadio.type = "radio";
  hardRadio.name = "difficulty";
  hardRadio.value = "hard";
  hardRadio.id = "hard";
  var hardLabel = document.createElement("label");
  hardLabel.htmlFor = "hard";
  hardLabel.textContent = "Hard";
  computerDifficultyContainer.appendChild(hardRadio);
  computerDifficultyContainer.appendChild(hardLabel);

  // Start button
  var startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButtonContainer.appendChild(startButton);
  startButton.id = "initStartButton";

  // Append the containers to the main container
  gameInitializerContainer.appendChild(playerNameContainer);
  gameInitializerContainer.appendChild(computerDifficultyContainer);
  gameInitializerContainer.appendChild(startButtonContainer);
  return gameInitializerContainer;
}
module.exports = createNavUi;

/***/ }),

/***/ "./player.js":
/*!*******************!*\
  !*** ./player.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Gameboard = __webpack_require__(/*! ./gameBoard */ "./gameBoard.js");
var Player = /*#__PURE__*/function () {
  function Player(name) {
    _classCallCheck(this, Player);
    this.name = name;
    this.Ai = this.isAi(this.name);
    this.gameBoard = new Gameboard();
    this.completedMoves = [];
  }
  _createClass(Player, [{
    key: "capitalizeFirst",
    value: function capitalizeFirst(str) {
      if (!str || typeof str !== 'string') return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  }, {
    key: "makeAttack",
    value: function makeAttack(coordinate) {
      if (this.completedMoves.includes(coordinate) && !this.Ai) {
        throw new Error("Move is already made");
      }
      this.completedMoves.push(coordinate);
      return coordinate;
    }
  }, {
    key: "isAi",
    value: function isAi(name) {
      var check = this.capitalizeFirst(name);
      return check == "Computer" || check == "Ai";
    }
  }, {
    key: "getRandomInt",
    value: function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }, {
    key: "getAllPossibleMoves",
    value: function getAllPossibleMoves() {
      var allMoves = [];
      for (var columnNumber = 0; columnNumber < this.gameBoard.width; columnNumber++) {
        for (var rowNumber = 1; rowNumber <= this.gameBoard.height; rowNumber++) {
          var columnAlias = String.fromCharCode(columnNumber + 65);
          allMoves.push(columnAlias + rowNumber);
        }
      }
      return allMoves;
    }
  }, {
    key: "easyAiMoves",
    value: function easyAiMoves() {
      var _this = this;
      if (!this.Ai) {
        throw new Error("Access to easyAiMoves is restricted.");
      }

      // Get the set of all unplayed moves
      var allPossibleMoves = this.getAllPossibleMoves();
      var unplayedMoves = allPossibleMoves.filter(function (move) {
        return !_this.completedMoves.includes(move);
      });

      // If there are no unplayed moves left, raise an error or handle accordingly
      if (unplayedMoves.length === 0) {
        throw new Error("All moves have been played.");
      }

      // Randomly select a move from the set of unplayed moves
      var randomIndex = this.getRandomInt(0, unplayedMoves.length - 1);
      var move = unplayedMoves[randomIndex];
      this.completedMoves.push(move);
      return move;
    }
  }, {
    key: "aiShipOrientation",
    value: function aiShipOrientation() {
      var value = Math.floor(Math.random() * 2) + 1;
      if (value === 1) {
        return "Horizontal";
      } else {
        return "Vertical";
      }
    }
  }]);
  return Player;
}();
module.exports = Player;

/***/ }),

/***/ "./ship.js":
/*!*****************!*\
  !*** ./ship.js ***!
  \*****************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Ship = /*#__PURE__*/function () {
  function Ship(name) {
    _classCallCheck(this, Ship);
    this.shipTypes = {
      Carrier: 5,
      Battleship: 4,
      Cruiser: 3,
      Submarine: 3,
      Destroyer: 2
    };
    this.isValid = typeof name === 'string' && !!this.shipTypes[name];
    this.name = name;
    this.length = this.setLength(this.name);
    this.hitCount = 0;
    this.isDead = false;
  }
  _createClass(Ship, [{
    key: "capitalizeFirst",
    value: function capitalizeFirst(str) {
      if (!str || typeof str !== 'string') return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  }, {
    key: "setLength",
    value: function setLength(name) {
      var capitalizedShipName = this.capitalizeFirst(name);
      if (this.shipTypes[capitalizedShipName]) {
        return this.shipTypes[capitalizedShipName];
      } else {
        return false;
      }
    }
  }, {
    key: "isSunk",
    value: function isSunk() {
      if (this.hitCount == this.length) {
        return this.isDead = true;
      }
      return this.isDead;
    }
  }, {
    key: "hit",
    value: function hit() {
      this.hitCount += 1;
      this.isSunk();
      return this.hitCount;
    }
  }]);
  return Ship;
}();
module.exports = Ship;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./battleship.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./battleship.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.gameContainer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background: red;
}

.gameHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    height: 15%;
    background: rgb(47, 0, 255);
}

#battleshipTitle {
    font-size: xx-large;
    color: white;
}

.gameStateContainer {
    display: flex;
    width: 20%;
    height: 70%;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    font-size: x-large;
    color: white;
    border: 1px solid black;
}

.gameContentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 85%;
    width: 100vw;
    background: rgb(31, 147, 155);
}

.gameBoardHeaderContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 5%;
    width: 100%;
    background: rgb(83, 180, 59);
    margin-top: 3em;
}

.gameBoardHeader {
    font-size: x-large;
}

.gameScreenContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 85%;
    width: 100vw;
    background: rgb(31, 147, 155);
}

.gameScreen-Left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 20%;
    background: rgb(31, 147, 155);
}

.currentShipOrientation {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    height: 10%;
    width: 80%;
}


.shipPositionSwitcher {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 10%;
    width: 80%;
    color: white;
    background: rgb(22, 39, 189);
    margin-bottom: 1.5em;
}

.gameBoardContainer {
    display: flex;
    flex-direction: column;
    height: 100%;
}


.gameBoardContainer.top {
    display: flex;
    flex-direction: row;
    height: 5%;
}


.numericCoordinates {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 36px;
    margin-top: 1em;
    margin-left: 0.85em;
}

.numericCoordinates > div{
    margin-left: 0.85em;
}

.gameBoardContainer.bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 90%;
}

.alphaCoordinates {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    font-size: 36px;
    margin-right: 0.5em;
    margin-bottom: 0.2em;
}

.alphaCoordinates > div {
    margin-top: 0.25em;
}

.gameBoard {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 500px;
    border: 1px solid black;
    /* margin-bottom: 7em; */
}

.row, .ship {
    display: flex;
    height: 10%;
    border: 1px solid black;
}

.ship {
    margin-right: 1em;
    box-sizing: border-box;
    position: relative;
}

.box {
    width: 50px;
    border: 1px solid black;
    box-sizing: border-box;
}

.box:hover {
    width: 10%;
    border: 1px solid black;
    background-color: lightgreen;
}

.highlight {
    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */
}

.placed {
    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */
}

.gameBoardResultContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 5%;
    width: 100%;
    background: rgb(83, 180, 59);
    margin-bottom: 4em;
}

.piecesContainer {
    display: flex;
    flex-direction: column;
    height: 350px;
    width: 425px;
    border: 2px solid black;
    margin-top: 3.5em;
}

.shipContainer {
    display: flex;
    height: 50px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-top: 1em;
}

.shipName {
    font-size: x-large;
    margin-left: 1em;
}

.shipbox {
    border: 1px solid green;
    background-color: rgba(0, 128, 0, 0.2); 
    height: 100%;
}

.gameInitializerContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 200px;
    width: 200px;
    border: 3px solid black;
}

.playerNameContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    
}

.playerNameContainer > input {
    height: 50%;    
    margin-top: 0.5em;
}

.computerDifficultyContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}

.computerDifficultyContainer > #easy, #hard {
    margin-left: 1em;
}

.computerDifficultyContainer > label {
    margin-right: 1em;
}

#initStartButton {
    background-color: grey;
    color: white;
    font-weight: 700;
    font-size: larger;
}

.verticalPiecesContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 350px;
    width: 425px;
    border: 2px solid black;
    margin-top: 3.5em;
}

.verticalShip {
    display: flex;
    flex-direction: column;  /* this stacks the ship boxes vertically */
}

.verticalShipName {
    font-size: 16px;
    margin-bottom: 1em;
}


.verticalShipContainer {
    display: flex;
    flex-direction: column;  /* this stacks the ship boxes vertically */
    align-items: center;
}

.shipbox, .verticalShipbox { 
    height: 48px;  /* adjust this as per your design */
    width: 50px;
    border: 1px solid #000; /* for visualization */
    box-sizing: border-box; /* to ensure border doesn't add to width/height */
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.placed {\r\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n}\r\n\r\n.playerNameContainer > input {\r\n    height: 50%;    \r\n    margin-top: 0.5em;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 1em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 1em;\r\n}\r\n\r\n#initStartButton {\r\n    background-color: grey;\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalShip {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./battleship.css":
/*!************************!*\
  !*** ./battleship.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_battleship_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./battleship.css */ "./node_modules/css-loader/dist/cjs.js!./battleship.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_battleship_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_battleship_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_battleship_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_battleship_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./battleship.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _battleship_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./battleship.css */ "./battleship.css");
var Ship = __webpack_require__(/*! ./ship */ "./ship.js"); // Adjust path accordingly
var Gameboard = __webpack_require__(/*! ./gameBoard */ "./gameBoard.js"); // Adjust path accordingly
var Player = __webpack_require__(/*! ./player */ "./player.js");
var Game = __webpack_require__(/*! ./gameLoop */ "./gameLoop.js");
var _require = __webpack_require__(/*! ./battleshipPieces */ "./battleshipPieces.js"),
  battleshipPieces = _require.battleshipPieces;
var createGameBoard = __webpack_require__(/*! ./createGameBoard */ "./createGameBoard.js");
var createNavUi = __webpack_require__(/*! ./navigationComponents */ "./navigationComponents.js");


// String to generate game ID
function generateRandomString() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function createVerticalPiecesContainer(player) {
  var piecesContainer = document.createElement("div");
  piecesContainer.className = "verticalPiecesContainer";
  var boxWidth = 50;
  var boxHeight = 48;
  var _loop = function _loop() {
    var shipAttribute = player.gameBoard.ship[shipName].instance;
    var shipContainer = document.createElement("div");
    shipContainer.className = "verticalShipContainer";
    var shipTitle = document.createElement("div");
    shipTitle.className = "verticalShipName";
    shipTitle.textContent = shipAttribute.name + ":";
    var shipPiece = document.createElement("div");
    shipPiece.classList.add("verticalDraggable");
    shipPiece.classList.add("verticalShip");
    shipPiece.id = "vertical" + shipAttribute.name;
    shipPiece.style.width = boxWidth + "px";
    shipPiece.style.height = boxHeight * shipAttribute.length + "px";
    shipPiece.draggable = true;
    shipPiece.addEventListener('dragstart', function (event) {
      var clickedBoxOffset = event.target.getAttribute("data-offset");
      var shipData = {
        name: shipAttribute.name,
        length: shipAttribute.length,
        offset: clickedBoxOffset // This tells us how far from the head the user clicked
      };

      dragData.draggedShip = shipData; // store the data
      event.dataTransfer.setData('application/json', JSON.stringify(shipData));

      // get the shipHead's bounding rectangle
      var shipHeadRect = document.getElementById("shipHead" + shipAttribute.name).getBoundingClientRect();
      var shipPieceRect = shipPiece.getBoundingClientRect();

      // calculate the offset
      var offsetX = shipHeadRect.left - shipPieceRect.left + shipHeadRect.width / 2;
      ;
      var offsetY = shipHeadRect.top - shipPieceRect.top + shipHeadRect.height / 2;

      // adjust the drag image's starting position
      event.dataTransfer.setDragImage(shipPiece, offsetX, offsetY);
    });
    for (var i = 0; i < shipAttribute.length; i++) {
      var shipBox = document.createElement("div");
      shipBox.className = "shipbox";
      shipBox.style.width = boxWidth + "px";
      shipBox.addEventListener('mousedown', function (event) {
        console.log("Element clicked:", event.target);
        shipPiece.setAttribute("data-offset", 0); // set the offset on the shipPiece when a shipBox is clicked
      });

      if (i == 0) {
        shipBox.id = "shipHead" + shipAttribute.name; // Make it unique
      } else {
        shipBox.id = shipAttribute.name + "-" + i; // Make it unique
      }

      shipPiece.appendChild(shipBox);
    }
    shipContainer.appendChild(shipTitle);
    shipContainer.appendChild(shipPiece);
    piecesContainer.appendChild(shipContainer);
  };
  for (var shipName in player.gameBoard.ship) {
    _loop();
  }
  return piecesContainer;
}
var gameInit = createNavUi();
var player1 = new Player();
var newGame = new Game(generateRandomString(), player1);
var gameScreen = document.querySelector(".gameScreenContainer");
var leftGameScreen = document.createElement("div");
leftGameScreen.className = "gameScreen-Left";
var currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal";
currentShipOrientation.innerText = "Current Ship Position is: ".concat(currentShipOrientation.dataset.shipOrientation);
gameScreen.appendChild(leftGameScreen);
var pieces = battleshipPieces(player1);
leftGameScreen.appendChild(pieces);
var shipPositionSwitcher = document.createElement("button");
shipPositionSwitcher.className = "shipPositionSwitcher";
shipPositionSwitcher.innerText = "Switch Orientation";
shipPositionSwitcher.addEventListener("click", function () {
  var shipOrientation = document.querySelector(".currentShipOrientation");
  if (shipOrientation.dataset.shipOrientation == "Horizontal") {
    shipOrientation.dataset.shipOrientation = "Vertical";
    leftGameScreen.removeChild(pieces);
    leftGameScreen.insertBefore(verticalPieces, leftGameScreen.firstChild);
  } else {
    shipOrientation.dataset.shipOrientation = "Horizontal";
    leftGameScreen.removeChild(verticalPieces);
    leftGameScreen.insertBefore(pieces, leftGameScreen.firstChild);
  }
  shipOrientation.innerText = "Current Ship Position is: ".concat(currentShipOrientation.dataset.shipOrientation);
});
var board1 = createGameBoard(newGame.player1, currentShipOrientation.dataset.shipOrientation);
var board2 = createGameBoard(newGame.computer);
var verticalPieces = createVerticalPiecesContainer(player1);
leftGameScreen.appendChild(pieces);
// leftGameScreen.appendChild(verticalPieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sQ0FBQ0MsT0FBTyxHQUFHc0QsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25EckI7QUFDeUc7QUFDakI7QUFDeEYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QixDQUFDLE9BQU8saUZBQWlGLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFFBQVEsS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFh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QlYsVUFBVSxDQUFDMU0sV0FBVyxDQUFDd00sUUFBUSxDQUFDO0FBQ2hDLGtDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwUGllY2VzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlR2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9uYXZpZ2F0aW9uQ29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzP2UwZmUiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcclxuXHJcbmxldCBkcmFnRGF0YSA9IHtcclxuICAgIGRyYWdnZWRTaGlwOiBudWxsXHJcbiAgfTtcclxuXHJcbmZ1bmN0aW9uIGJhdHRsZXNoaXBQaWVjZXMgKHBsYXllcikge1xyXG4gICAgXHJcbiAgICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHBpZWNlc0NvbnRhaW5lci5jbGFzc05hbWUgPSBcInBpZWNlc0NvbnRhaW5lclwiO1xyXG4gICAgbGV0IGJveFdpZHRoID0gNTA7XHJcbiAgICBsZXQgYm94SGVpZ2h0ID0gNDg7XHJcblxyXG4gICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcblxyXG4gICAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5jbGFzc05hbWUgPSBcInNoaXBDb250YWluZXJcIjtcclxuICAgICAgICBsZXQgc2hpcFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwVGl0bGUuY2xhc3NOYW1lID0gXCJzaGlwTmFtZVwiO1xyXG4gICAgICAgIHNoaXBUaXRsZS50ZXh0Q29udGVudCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiOlwiO1xyXG5cclxuICAgICAgICBsZXQgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcImRyYWdnYWJsZVwiKTtcclxuICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgc2hpcFBpZWNlLmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgIHNoaXBQaWVjZS5zdHlsZS53aWR0aCA9IChib3hXaWR0aCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIjtcclxuICAgICAgICBzaGlwUGllY2Uuc3R5bGUuaGVpZ2h0ID0gKGJveEhlaWdodCkgKyBcInB4XCI7XHJcblxyXG4gICAgICAgXHJcbiBcclxuICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzaGlwQXR0cmlidXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBjbGlja2VkQm94T2Zmc2V0ICAvLyBUaGlzIHRlbGxzIHVzIGhvdyBmYXIgZnJvbSB0aGUgaGVhZCB0aGUgdXNlciBjbGlja2VkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRyYWdEYXRhLmRyYWdnZWRTaGlwID0gc2hpcERhdGE7IC8vIHN0b3JlIHRoZSBkYXRhXHJcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBzaGlwSGVhZCdzIGJvdW5kaW5nIHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwUGllY2VSZWN0ID0gc2hpcFBpZWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG9mZnNldFxyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gc2hpcEhlYWRSZWN0LmxlZnQgLSBzaGlwUGllY2VSZWN0LmxlZnQgKyAoc2hpcEhlYWRSZWN0LndpZHRoIC8gMik7O1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRZID0gc2hpcEhlYWRSZWN0LnRvcCAtIHNoaXBQaWVjZVJlY3QudG9wICsgKHNoaXBIZWFkUmVjdC5oZWlnaHQgLyAyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSBkcmFnIGltYWdlJ3Mgc3RhcnRpbmcgcG9zaXRpb25cclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShzaGlwUGllY2UsIG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEF0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xyXG4gICAgICAgICAgICBzaGlwQm94LnN0eWxlLndpZHRoID0gIGJveFdpZHRoICsgXCJweFwiO1xyXG5cclxuICAgICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IGNsaWNrZWQ6XCIsIGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBzaGlwUGllY2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIiwgMCk7IC8vIHNldCB0aGUgb2Zmc2V0IG9uIHRoZSBzaGlwUGllY2Ugd2hlbiBhIHNoaXBCb3ggaXMgY2xpY2tlZFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpID09IDApIHsgXHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lOyAgLy8gTWFrZSBpdCB1bmlxdWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIi1cIiArIGk7ICAvLyBNYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7XHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xyXG4gICAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBpZWNlc0NvbnRhaW5lcjtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2JhdHRsZXNoaXBQaWVjZXMsIGRyYWdEYXRhIH07IiwiY29uc3QgeyBkcmFnRGF0YSB9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcblxyXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcclxuXHJcbmZ1bmN0aW9uIGdldEFmZmVjdGVkQm94ZXMoaGVhZFBvc2l0aW9uLCBsZW5ndGgsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBjb25zdCBib3hlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoaGVhZFBvc2l0aW9uLnNsaWNlKDEpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgaSkgKyBudW1QYXJ0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hlcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGJveElkWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcclxuXHJcbiAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gb2Zmc2V0O1xyXG5cclxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICByZXR1cm4gYWRqdXN0ZWROdW1QYXJ0ID4gMCAmJiBhZGp1c3RlZE51bVBhcnQgKyBsZW5ndGggLSAxIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZChwbGF5ZXIpIHtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcclxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZFRvcENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGFscGhhQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgXHJcbiAgIFxyXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XHJcbiAgICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIHRvcFwiO1xyXG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcclxuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcclxuICAgICBnYW1lQm9hcmQuaWQgPSBwbGF5ZXIubmFtZTsgLy8gQXNzdW1pbmcgdGhlIHBsYXllciBpcyBhIHN0cmluZyBsaWtlIFwicGxheWVyMVwiXHJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcclxuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcclxuXHJcbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcclxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29sdW1uVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcclxuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xyXG4gICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XHJcblxyXG4gICAgICAgIGxldCByb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XHJcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG4gICAgICAgIHJvdy5pZCA9IGFscGhhQ2hhcjtcclxuXHJcbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICBsZXQgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gZHJhZ0RhdGEuZHJhZ2dlZFNoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2W2RhdGEtc2hpcC1vcmllbnRhdGlvbl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQuZGF0YXNldC5zaGlwT3JpZW50YXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2hpcE9yaWVudGF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNoaXAgZGF0YSBpcyBudWxsIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWZmZWN0ZWRCb3hlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZXZpb3VzQWZmZWN0ZWRCb3hlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuZHJhZ0FmZmVjdGVkID0gXCJ0cnVlXCI7IC8vIEFkZCB0aGlzIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMCk7IC8vIGRlbGF5IG9mIDAgbXMsIGp1c3QgZW5vdWdoIHRvIGxldCBkcmFnbGVhdmUgaGFwcGVuIGZpcnN0IGlmIGl0J3MgZ29pbmcgdG9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm94W2RhdGEtZHJhZy1hZmZlY3RlZD1cInRydWVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzbHlBZmZlY3RlZEJveGVzLmZvckVhY2gocHJldkJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJyk7IC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXNoaXAtb3JpZW50YXRpb25dXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQuZGF0YXNldC5zaGlwT3JpZW50YXRpb247XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgdGhlIGNoYXJhY3RlciBhbmQgbnVtZXJpYyBwYXJ0cyBvZiB0aGUgYm94IElEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGJveC5pZFswXTsgIC8vIEFzc3VtaW5nIHRoZSBmb3JtYXQgaXMgYWx3YXlzIGxpa2UgXCJBNVwiXHJcbiAgICAgICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94LmlkLnNsaWNlKDEpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFkanVzdGVkIHBvc2l0aW9uIGJhc2VkIG9uIHdoZXJlIHRoZSB1c2VyIGNsaWNrZWQgb24gdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBzaGlwRGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzaGlwRGF0YS5vZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWRqdXN0ZWROdW1QYXJ0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhd0RhdGEgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEcm9wcGVkIGRhdGE6XCIsIHJhd0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxhY2VtZW50IGlzIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChhZGp1c3RlZE51bVBhcnQgPD0gMCB8fCBhZGp1c3RlZE51bVBhcnQgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gcGxheWVyLmdhbWVCb2FyZC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uID0gY2hhclBhcnQgKyBhZGp1c3RlZE51bVBhcnQ7ICAvLyBUaGUgbmV3IHBvc2l0aW9uIGZvciB0aGUgaGVhZCBvZiB0aGUgc2hpcFxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwRGF0YS5sZW5ndGgsIHNoaXBPcmllbnRhdGlvbilcclxuICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBwbGFjZSAke3NoaXBEYXRhLm5hbWV9IHdpdGggbGVuZ3RoICR7c2hpcERhdGEubGVuZ3RofSBhdCBwb3NpdGlvbiAke2FkanVzdGVkVGFyZ2V0UG9zaXRpb259LmApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSB5b3VyIHNoaXAgYmFzZWQgb24gYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiBhcyB0aGUgaGVhZCdzIHBvc2l0aW9uLCB1c2luZyB5b3VyIGV4aXN0aW5nIGxvZ2ljIG9yIG1ldGhvZHNcclxuICAgICAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5uYW1lLCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwT3JpZW50YXRpb24pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGhpZ2hsaWdodFxyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzQm94ZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQm94ZXMgPSBhZmZlY3RlZEJveGVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdhbWVCb2FyZC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChhbHBoYUNvb3JkaW5hdGVzKTtcclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG5cclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRUb3BDb21wb25lbnQpO1xyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCk7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lQm9hcmRDb21wb25lbnRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVHYW1lQm9hcmQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDEwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAxMDtcclxuICAgICAgICB0aGlzLm1pc3NDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlwID0ge1xyXG4gICAgICAgICAgICBDYXJyaWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NhcnJpZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0JhdHRsZXNoaXAnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDcnVpc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NydWlzZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTdWJtYXJpbmU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnU3VibWFyaW5lJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0Rlc3Ryb3llcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIGxldCBib2FyZCA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIlwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmQucHVzaChyb3cpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gVGhpcyBjb2RlIHJldHVybnMgdGhlIGNoYXIgdmFsdWUgYXMgYW4gaW50IHNvIGlmIGl0IGlzICdCJyAob3IgJ2InKSwgd2Ugd291bGQgZ2V0IHRoZSB2YWx1ZSA2NiAtIDY1ID0gMSwgZm9yIHRoZSBwdXJwb3NlIG9mIG91ciBhcnJheSBCIGlzIHJlcC4gYnkgYm9hcmRbMV0uXHJcbiAgICAgICAgY2hhclRvUm93SW5kZXgoY2hhcikge1xyXG4gICAgICAgICAgICBjaGFyID0gY2hhci50b1VwcGVyQ2FzZSgpOyAvLyBDb252ZXJ0IHRoZSBjaGFyYWN0ZXIgdG8gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBSZXR1cm5zIGFuIGludCBhcyBhIHN0ciB3aGVyZSBudW1iZXJzIGZyb20gMSB0byAxMCwgd2lsbCBiZSB1bmRlcnN0b29kIGZvciBhcnJheSBhY2Nlc3M6IGZyb20gMCB0byA5LlxyXG4gICAgICAgIHN0cmluZ1RvQ29sSW5kZXgoc3RyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChzdHIpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXRBdChhbGlhcywgc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxldHRlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gQyBcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmNoYXJUb1Jvd0luZGV4KGNoYXJQYXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvdXQgb2YgYm91bmRzIGxpa2UgSzkgb3IgQzE4XHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiA5IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9IHN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoZWNrQXQoYWxpYXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gRW5zdXJlIGluZGljZXMgYXJlIHZhbGlkXHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPj0gdGhpcy5oZWlnaHQgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID49IHRoaXMud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZSBhbGlhcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPT09IFwiSGl0XCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkhpdFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvY2N1cGllZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRCZWxvd0FsaWFzKGFsaWFzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFyUGFydCB0byB0aGUgbmV4dCBsZXR0ZXJcclxuICAgICAgICAgICAgY29uc3QgbmV4dENoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyAxKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBuZXh0Q2hhciArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYXJUb1Jvd0luZGV4KG5leHRDaGFyKSA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdyBiZWxvdyB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldFJpZ2h0QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGxldCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIG51bWJlciBieSAxXHJcbiAgICAgICAgICAgIG51bVBhcnQrKztcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBjaGFyUGFydCArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChudW1QYXJ0ID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGNvbHVtbiB0byB0aGUgcmlnaHQgb2YgdGhpcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHBsYWNlU2hpcChzaGlwTmFtZSwgc2hpcEhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcE1hcmtlciA9IFwiU2hpcFwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHNoaXBIZWFkQ29vcmRpbmF0ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZ2V0TmV4dENvb3JkaW5hdGUgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIlxyXG4gICAgICAgICAgICAgICAgPyBjb29yZGluYXRlID0+IHRoaXMuZ2V0QmVsb3dBbGlhcyhjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgOiBjb29yZGluYXRlID0+IHRoaXMuZ2V0UmlnaHRBbGlhcyhjb29yZGluYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tBdChjdXJyZW50Q29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID0gW107IC8vIENsZWFyIGFueSBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMucHVzaChjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBnZXROZXh0Q29vcmRpbmF0ZShjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIHNoaXBNYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBdChjb29yZGluYXRlKSA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaGl0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiSGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzQ291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIk1pc3NcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEFsbFNoaXBzVG9EZWFkKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZU92ZXIoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgIC8vIFJldHVybiBmYWxzZSBpZiBhbnkgc2hpcCBpcyBub3QgZGVhZC5cclxuICAgICAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwbGF5KCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciB3aXRoIGNvbHVtbiBudW1iZXJzXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBcIiAgICBcIjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgKz0gaSArIFwiIFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlYWRlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHJvdyBhbmQgcHJpbnQgdGhlbVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIiB8IFwiOyAvLyBDb252ZXJ0IHJvdyBpbmRleCB0byBBLUogYW5kIGFkZCB0aGUgc2VwYXJhdG9yXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGVhY2ggY2VsbCdzIHZhbHVlIGFuZCBkZWNpZGUgd2hhdCB0byBwcmludFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsVmFsdWUgPSB0aGlzLmJvYXJkW2ldW2pdO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlY2lkZSB0aGUgY2VsbCdzIGRpc3BsYXkgYmFzZWQgb24gaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNoaXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlMgXCI7IC8vIFMgZm9yIFNoaXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSGl0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJYIFwiOyAvLyBYIGZvciBIaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWlzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiTSBcIjsgLy8gTSBmb3IgTWlzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCItIFwiOyAvLyAtIGZvciBFbXB0eSBDZWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3dTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lSWQsIHBsYXllck5hbWUpIHtcclxuICAgICAgICB0aGlzLmdhbWVJZCA9IGdhbWVJZDtcclxuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKHBsYXllck5hbWUpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcbiAgICAgICAgdGhpcy5waGFzZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUTy1ETyBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpLCBwcm9tcHRVc2VyT3JpZW50YXRpb24oKSwgY2hlY2tXaW5uZXIoKTtcclxuXHJcbiAgICBwbGFjZVBsYXllclNoaXBzKHNoaXBOYW1lKSB7XHJcbiAgICAgICAgd2hpbGUgKHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyBQcm9tcHQgVXNlciBmb3Igc2hpcEhlYWRDb29yZGluYXRlXHJcbiAgICAgICAgICAgIGxldCB1c2VyQ29vcmRpbmF0ZSA9IHByb21wdFVzZXJDb29yZGluYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB1c2VyU2hpcE9yaWVudGF0aW9uID0gcHJvbXB0VXNlck9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIXBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCB1c2VyQ29vcmRpbmF0ZSwgdXNlclNoaXBPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIHVzZXJDb29yZGluYXRlID0gcHJvbXB0VXNlckNvb3JkaW5hdGUoKTtcclxuICAgICAgICAgICAgICAgIHVzZXJTaGlwT3JpZW50YXRpb24gPSBwcm9tcHRVc2VyT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwbGFjZUNvbXB1dGVyU2hpcChzaGlwTmFtZSkge1xyXG4gICAgICAgIHdoaWxlIChjb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIGNvbXB1dGVyQ29vcmRpbmF0ZSwgY29tcHV0ZXJPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50aWFsaXplR2FtZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCJcclxuICAgICAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XHJcbiAgICAgICAgLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2hpcCBvZiBzaGlwVHlwZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZVBsYXllclNoaXBzKHNoaXApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlQ29tcHV0ZXJTaGlwKHNoaXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5VHVybigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZE1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHBsYXllck1vdmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9tcHQgdXNlciBmb3IgY29vcmRpbmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9tcHQgPSBcIkExXCI7IC8vIEhlcmUgeW91IG1pZ2h0IHdhbnQgdG8gZ2V0IGFjdHVhbCBpbnB1dCBmcm9tIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhwcm9tcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTsgLy8gT3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gcHJvbXB0IHRoZSB1c2VyIHdpdGggYSBtZXNzYWdlIHRvIGVudGVyIGEgbmV3IGNvb3JkaW5hdGUuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuICAgICAgICAgICAgbGV0IHR1cm5WYWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyIC0gMSArIDEpKSArIDE7XHJcbiAgICAgICAgICAgIGlmICh0dXJuVmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDb21wdXRlciBXaW5zXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGF5ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgd2hpbGUoIWNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcblxyXG4vLyAvLyBHZXQgcGxheWVyIG5hbWVcclxuLy8gbGV0IG5hbWUgPSBcInBsYXllcjFcIlxyXG5cclxuLy8gLy8gQ3JlYXRlIHBsYXllcnNcclxuLy8gbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIobmFtZSk7XHJcbi8vIGxldCBjb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuXHJcbi8vIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuLy8gICAgIC8vIFwiQ2FycmllclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNhcnJpZXJcIiwgXCJFNVwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDYXJyaWVyXCIsIFwiQTFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJCYXR0bGVzaGlwXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQmF0dGxlc2hpcFwiLCBcIko3XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkJhdHRsZXNoaXBcIiwgXCJCMTBcIiwgXCJWZXJ0aWNhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiQ3J1aXNlclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNydWlzZXJcIiwgXCJBOFwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDcnVpc2VyXCIsIFwiRjFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJTdWJtYXJpbmVcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJTdWJtYXJpbmVcIiwgXCJEMVwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJTdWJtYXJpbmVcIiwgXCJIMTBcIiwgXCJWZXJ0aWNhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiRGVzdHJveWVyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiRGVzdHJveWVyXCIsIFwiQjJcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiRGVzdHJveWVyXCIsIFwiSjFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gcGxheWVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG5cclxuLy8gLy8gQXR0YWNrIHBoYXNlIFxyXG5cclxuLy8gICAgIC8vIFBsYXllciBhdHRhY2sgcGhhc2VcclxuLy8gICAgIGxldCBwbGF5ZXJNb3ZlID0gcGxheWVyLm1ha2VBdHRhY2soXCJBMVwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcblxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuXHJcbi8vICAgICAvLyBDb21wdXRlciBhdHRhY2sgcGhhc2VcclxuLy8gICAgIGxldCBjb21wdXRlckNob2ljZSA9IGNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuLy8gICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcblxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZU5hdlVpICgpIHtcclxuICAgIGxldCBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHBsYXllck5hbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5jbGFzc05hbWUgPSBcInBsYXllck5hbWVDb250YWluZXJcIjtcclxuICAgIGxldCBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyXCI7XHJcbiAgICBsZXQgc3RhcnRCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBwbGF5ZXJOYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIkVudGVyIHlvdXIgbmFtZTpcIjtcclxuICAgIHBsYXllck5hbWVMYWJlbC5odG1sRm9yID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcclxuICAgIHBsYXllck5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUxhYmVsKTtcclxuXHJcbiAgICBsZXQgcGxheWVySW5wdXROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcGxheWVySW5wdXROYW1lLmNsYXNzTmFtZSA9IFwicGxheWVySW5wdXROYW1lXCI7XHJcbiAgICBwbGF5ZXJJbnB1dE5hbWUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHBsYXllcklucHV0TmFtZS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChpbnB1dFZhbHVlID09PSBcImNvbXB1dGVyXCIgfHwgaW5wdXRWYWx1ZSA9PT0gXCJhaVwiKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdUaGUgbmFtZSBjYW5ub3QgYmUgXCJjb21wdXRlclwiIG9yIFwiYWlcIi4nKTtcclxuICAgICAgICAgICAgcGxheWVySW5wdXROYW1lLnZhbHVlID0gJyc7IC8vIENsZWFyIHRoZSBpbnB1dCBmaWVsZFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHBsYXllck5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVySW5wdXROYW1lKTtcclxuXHJcbiAgICBsZXQgZWFzeVJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgZWFzeVJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICBlYXN5UmFkaW8ubmFtZSA9IFwiZGlmZmljdWx0eVwiO1xyXG4gICAgZWFzeVJhZGlvLnZhbHVlID0gXCJlYXN5XCI7XHJcbiAgICBlYXN5UmFkaW8uaWQgPSBcImVhc3lcIjtcclxuICAgIGxldCBlYXN5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBlYXN5TGFiZWwuaHRtbEZvciA9IFwiZWFzeVwiO1xyXG4gICAgZWFzeUxhYmVsLnRleHRDb250ZW50ID0gXCJFYXN5XCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWFzeVJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChlYXN5TGFiZWwpO1xyXG5cclxuICAgIC8vIFJhZGlvIGJ1dHRvbiBmb3IgaGFyZCBkaWZmaWN1bHR5XHJcbiAgICBsZXQgaGFyZFJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaGFyZFJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICBoYXJkUmFkaW8ubmFtZSA9IFwiZGlmZmljdWx0eVwiO1xyXG4gICAgaGFyZFJhZGlvLnZhbHVlID0gXCJoYXJkXCI7XHJcbiAgICBoYXJkUmFkaW8uaWQgPSBcImhhcmRcIjtcclxuICAgIGxldCBoYXJkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBoYXJkTGFiZWwuaHRtbEZvciA9IFwiaGFyZFwiO1xyXG4gICAgaGFyZExhYmVsLnRleHRDb250ZW50ID0gXCJIYXJkXCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZFJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkTGFiZWwpO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJ1dHRvblxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XHJcbiAgICBzdGFydEJ1dHRvbi5pZCA9IFwiaW5pdFN0YXJ0QnV0dG9uXCI7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXJzIHRvIHRoZSBtYWluIGNvbnRhaW5lclxyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVDb250YWluZXIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRCdXR0b25Db250YWluZXIpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU5hdlVpOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL2dhbWVCb2FyZFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLkFpID0gdGhpcy5pc0FpKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBjYXBpdGFsaXplRmlyc3Qoc3RyKSB7XHJcbiAgICAgICAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUF0dGFjayhjb29yZGluYXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpICYmICF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vdmUgaXMgYWxyZWFkeSBtYWRlXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBaShuYW1lKSB7XHJcbiAgICAgICAgbGV0IGNoZWNrID0gdGhpcy5jYXBpdGFsaXplRmlyc3QobmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrID09IFwiQ29tcHV0ZXJcIiB8fCBjaGVjayA9PSBcIkFpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEFsbFBvc3NpYmxlTW92ZXMoKSB7XHJcbiAgICAgICAgbGV0IGFsbE1vdmVzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgY29sdW1uTnVtYmVyID0gMDsgY29sdW1uTnVtYmVyIDwgdGhpcy5nYW1lQm9hcmQud2lkdGg7IGNvbHVtbk51bWJlcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvd051bWJlciA9IDE7IHJvd051bWJlciA8PSB0aGlzLmdhbWVCb2FyZC5oZWlnaHQ7IHJvd051bWJlcisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQWxpYXMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbk51bWJlciArIDY1KTtcclxuICAgICAgICAgICAgICAgIGFsbE1vdmVzLnB1c2goY29sdW1uQWxpYXMgKyByb3dOdW1iZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxNb3ZlcztcclxuICAgIH1cclxuXHJcbiAgICBlYXN5QWlNb3ZlcygpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY2VzcyB0byBlYXN5QWlNb3ZlcyBpcyByZXN0cmljdGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzZXQgb2YgYWxsIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCBhbGxQb3NzaWJsZU1vdmVzID0gdGhpcy5nZXRBbGxQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCB1bnBsYXllZE1vdmVzID0gYWxsUG9zc2libGVNb3Zlcy5maWx0ZXIobW92ZSA9PiAhdGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhtb3ZlKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdW5wbGF5ZWQgbW92ZXMgbGVmdCwgcmFpc2UgYW4gZXJyb3Igb3IgaGFuZGxlIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGlmICh1bnBsYXllZE1vdmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxsIG1vdmVzIGhhdmUgYmVlbiBwbGF5ZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSYW5kb21seSBzZWxlY3QgYSBtb3ZlIGZyb20gdGhlIHNldCBvZiB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSB0aGlzLmdldFJhbmRvbUludCgwLCB1bnBsYXllZE1vdmVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgbW92ZSA9IHVucGxheWVkTW92ZXNbcmFuZG9tSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKG1vdmUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgYWlTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJIb3Jpem9udGFsXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVmVydGljYWxcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsIlxyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwVHlwZXMgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXHJcbiAgICAgICAgICAgIENydWlzZXI6IDMsXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZW5ndGgobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3VuaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRDb3VudCA9PSB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XHJcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaXRDb3VudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4ucGxhY2VkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxufVxyXG5cclxuLnNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcbi5zaGlwYm94IHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAyMDBweDtcclxuICAgIHdpZHRoOiAyMDBweDtcclxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4ucGxheWVyTmFtZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIgPiBpbnB1dCB7XHJcbiAgICBoZWlnaHQ6IDUwJTsgICAgXHJcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcclxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xyXG59XHJcblxyXG4jaW5pdFN0YXJ0QnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XHJcbn1cclxuXHJcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXAge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxufVxyXG5cclxuXHJcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxyXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNuQixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFVBQVU7SUFDVixXQUFXO0lBQ1gsc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixVQUFVO0lBQ1YsV0FBVztJQUNYLDRCQUE0QjtJQUM1Qixl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SUFDWixnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsYUFBYTtJQUNiLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQixHQUFHLDBDQUEwQztBQUN2RTs7QUFFQTtJQUNJLGVBQWU7SUFDZixrQkFBa0I7QUFDdEI7OztBQUdBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQixHQUFHLDBDQUEwQztJQUNuRSxtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxZQUFZLEdBQUcsbUNBQW1DO0lBQ2xELFdBQVc7SUFDWCxzQkFBc0IsRUFBRSxzQkFBc0I7SUFDOUMsc0JBQXNCLEVBQUUsaURBQWlEO0FBQzdFXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSGVhZGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMTUlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbiNiYXR0bGVzaGlwVGl0bGUge1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhdGVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBoZWlnaHQ6IDcwJTtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXIge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgaGVpZ2h0OiA5MCU7XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gICAgd2lkdGg6IDUwMHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucm93LCAuc2hpcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5oaWdobGlnaHQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5wbGFjZWQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxyXFxufVxcclxcblxcclxcbi5waWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcGJveCB7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDIwMHB4O1xcclxcbiAgICB3aWR0aDogMjAwcHg7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyTmFtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIFxcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyTmFtZUNvbnRhaW5lciA+IGlucHV0IHtcXHJcXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxcclxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFN0YXJ0QnV0dG9uIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlTmF2VWkgPSByZXF1aXJlKCcuL25hdmlnYXRpb25Db21wb25lbnRzJyk7XHJcbmltcG9ydCAnLi9iYXR0bGVzaGlwLmNzcyc7XHJcblxyXG4vLyBTdHJpbmcgdG8gZ2VuZXJhdGUgZ2FtZSBJRFxyXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpIHtcclxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVWZXJ0aWNhbFBpZWNlc0NvbnRhaW5lcihwbGF5ZXIpIHtcclxuICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gXCJ2ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lclwiO1xyXG4gIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gIGxldCBib3hIZWlnaHQgPSA0ODtcclxuXHJcbiAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcclxuICAgICAgXHJcbiAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc2hpcENvbnRhaW5lci5jbGFzc05hbWUgPSBcInZlcnRpY2FsU2hpcENvbnRhaW5lclwiO1xyXG5cclxuICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBcInZlcnRpY2FsU2hpcE5hbWVcIjtcclxuICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcblxyXG4gICAgICBsZXQgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbERyYWdnYWJsZVwiKTtcclxuICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbFNoaXBcIik7XHJcbiAgICAgIHNoaXBQaWVjZS5pZCA9IFwidmVydGljYWxcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gYm94V2lkdGggKyBcInB4XCI7XHJcbiAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG5cclxuICAgICAgXHJcbiAgICAgIHNoaXBQaWVjZS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XHJcbiAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiBzaGlwQXR0cmlidXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXQgIC8vIFRoaXMgdGVsbHMgdXMgaG93IGZhciBmcm9tIHRoZSBoZWFkIHRoZSB1c2VyIGNsaWNrZWRcclxuICAgICAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICAgICAgZHJhZ0RhdGEuZHJhZ2dlZFNoaXAgPSBzaGlwRGF0YTsgLy8gc3RvcmUgdGhlIGRhdGFcclxuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcclxuICAgICAgXHJcbiAgICAgICAgICAvLyBnZXQgdGhlIHNoaXBIZWFkJ3MgYm91bmRpbmcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgXHJcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG9mZnNldFxyXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpOztcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICBcclxuICAgICAgICAgIC8vIGFkanVzdCB0aGUgZHJhZyBpbWFnZSdzIHN0YXJ0aW5nIHBvc2l0aW9uXHJcbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHNoaXBQaWVjZSwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSAgYm94V2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWxlbWVudCBjbGlja2VkOlwiLCBldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTsgLy8gc2V0IHRoZSBvZmZzZXQgb24gdGhlIHNoaXBQaWVjZSB3aGVuIGEgc2hpcEJveCBpcyBjbGlja2VkXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoaSA9PSAwKSB7IFxyXG4gICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7ICAvLyBNYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpOyAgLy8gTWFrZSBpdCB1bmlxdWVcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xyXG4gICAgICBwaWVjZXNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcENvbnRhaW5lcik7XHJcblxyXG4gIH1cclxuICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5cclxuXHJcbmxldCBnYW1lSW5pdCA9IGNyZWF0ZU5hdlVpKCk7XHJcblxyXG5sZXQgcGxheWVyMSA9IG5ldyBQbGF5ZXI7XHJcblxyXG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGdlbmVyYXRlUmFuZG9tU3RyaW5nKCksIHBsYXllcjEpXHJcblxyXG5sZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcclxuXHJcbmxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmxlZnRHYW1lU2NyZWVuLmNsYXNzTmFtZT1cImdhbWVTY3JlZW4tTGVmdFwiXHJcblxyXG5sZXQgY3VycmVudFNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uY2xhc3NOYW1lID0gXCJjdXJyZW50U2hpcE9yaWVudGF0aW9uXCI7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb24gPSBcIkhvcml6b250YWxcIlxyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7Y3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbn1gXHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQobGVmdEdhbWVTY3JlZW4pO1xyXG5sZXQgcGllY2VzID0gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIxKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQocGllY2VzKTtcclxuXHJcblxyXG5sZXQgc2hpcFBvc2l0aW9uU3dpdGNoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG5zaGlwUG9zaXRpb25Td2l0Y2hlci5jbGFzc05hbWUgPVwic2hpcFBvc2l0aW9uU3dpdGNoZXJcIjtcclxuc2hpcFBvc2l0aW9uU3dpdGNoZXIuaW5uZXJUZXh0ID0gXCJTd2l0Y2ggT3JpZW50YXRpb25cIlxyXG5zaGlwUG9zaXRpb25Td2l0Y2hlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcclxuICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRTaGlwT3JpZW50YXRpb25cIik7XHJcblxyXG4gICAgaWYgKHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChwaWVjZXMpO1xyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLmluc2VydEJlZm9yZSh2ZXJ0aWNhbFBpZWNlcywgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLnJlbW92ZUNoaWxkKHZlcnRpY2FsUGllY2VzKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUocGllY2VzLCBsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzaGlwT3JpZW50YXRpb24uaW5uZXJUZXh0ID0gYEN1cnJlbnQgU2hpcCBQb3NpdGlvbiBpczogJHtjdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9ufWBcclxufSlcclxuXHJcblxyXG5cclxuXHJcbmxldCBib2FyZDEgPSBjcmVhdGVHYW1lQm9hcmQobmV3R2FtZS5wbGF5ZXIxLCBjdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uKTtcclxuXHJcbmxldCBib2FyZDIgPSBjcmVhdGVHYW1lQm9hcmQobmV3R2FtZS5jb21wdXRlcik7XHJcblxyXG5sZXQgdmVydGljYWxQaWVjZXMgPSBjcmVhdGVWZXJ0aWNhbFBpZWNlc0NvbnRhaW5lcihwbGF5ZXIxKTtcclxuXHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHBpZWNlcyk7XHJcbi8vIGxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHZlcnRpY2FsUGllY2VzKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY3VycmVudFNoaXBPcmllbnRhdGlvbik7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHNoaXBQb3NpdGlvblN3aXRjaGVyKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0KTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG4iXSwibmFtZXMiOlsiUGxheWVyIiwicmVxdWlyZSIsImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJzaGlwUGllY2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJpZCIsInN0eWxlIiwid2lkdGgiLCJsZW5ndGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94IiwiY29uc29sZSIsImxvZyIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZXF1aXJlIiwiZ2V0QWZmZWN0ZWRCb3hlcyIsImhlYWRQb3NpdGlvbiIsIm9yaWVudGF0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJjcmVhdGVHYW1lQm9hcmQiLCJnYW1lQm9hcmRDb21wb25lbnQiLCJnYW1lQm9hcmRUb3BDb21wb25lbnQiLCJnYW1lQm9hcmRCb3R0b21Db21wb25lbnQiLCJhbHBoYUNvb3JkaW5hdGVzIiwibnVtZXJpY0Nvb3JkaW5hdGVzIiwiY29sdW1uVGl0bGUiLCJhbHBoYUNoYXIiLCJyb3dUaXRsZSIsInJvdyIsImFmZmVjdGVkQm94ZXMiLCJwcmV2aW91c0FmZmVjdGVkQm94ZXMiLCJfbG9vcDIiLCJib3giLCJqIiwicHJldmVudERlZmF1bHQiLCJzZXRUaW1lb3V0IiwiX3RvQ29uc3VtYWJsZUFycmF5Iiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJzaGlwT3JpZW50YXRpb24iLCJkYXRhc2V0IiwiZXJyb3IiLCJ2YWxpZFBsYWNlbWVudCIsImZvckVhY2giLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwicGFyc2UiLCJnZXREYXRhIiwicmF3RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJjb25jYXQiLCJwcmV2aW91c0JveGVzIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsImNvb3JkaW5hdGVzIiwiQmF0dGxlc2hpcCIsIkNydWlzZXIiLCJTdWJtYXJpbmUiLCJEZXN0cm95ZXIiLCJib2FyZCIsInN0YXJ0R2FtZSIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiY2hhclRvUm93SW5kZXgiLCJjaGFyIiwidG9VcHBlckNhc2UiLCJzdHJpbmdUb0NvbEluZGV4Iiwic3RyIiwic2V0QXQiLCJhbGlhcyIsInN0cmluZyIsImNoYXJBdCIsInN1YnN0cmluZyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJjaGVja0F0IiwiRXJyb3IiLCJnZXRCZWxvd0FsaWFzIiwibmV4dENoYXIiLCJuZXdBbGlhcyIsImdldFJpZ2h0QWxpYXMiLCJwbGFjZVNoaXAiLCJzaGlwSGVhZENvb3JkaW5hdGUiLCJfdGhpcyIsInNoaXBNYXJrZXIiLCJzaGlwTGVuZ3RoIiwiY3VycmVudENvb3JkaW5hdGUiLCJnZXROZXh0Q29vcmRpbmF0ZSIsImNvb3JkaW5hdGUiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwiZXJyIiwiZSIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsIkdhbWUiLCJnYW1lSWQiLCJwbGF5ZXJOYW1lIiwicGxheWVyMSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY3VycmVudFN0YXRlIiwiY3VycmVudFR1cm4iLCJwbGFjZVBsYXllclNoaXBzIiwidXNlckNvb3JkaW5hdGUiLCJwcm9tcHRVc2VyQ29vcmRpbmF0ZSIsInVzZXJTaGlwT3JpZW50YXRpb24iLCJwcm9tcHRVc2VyT3JpZW50YXRpb24iLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsInNoaXBUeXBlcyIsIl9pIiwiX3NoaXBUeXBlcyIsInN0YXJ0IiwicGxheVR1cm4iLCJpc1ZhbGlkTW92ZSIsInBsYXllck1vdmUiLCJwcm9tcHQiLCJtYWtlQXR0YWNrIiwibWVzc2FnZSIsImNvbXB1dGVyQ2hvaWNlIiwiY29tcHV0ZXJNb3ZlIiwidXBkYXRlU3RhdGUiLCJ0dXJuVmFsdWUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGVja1dpbm5lciIsImNyZWF0ZU5hdlVpIiwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIiwicGxheWVyTmFtZUNvbnRhaW5lciIsImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciIsInN0YXJ0QnV0dG9uQ29udGFpbmVyIiwicGxheWVyTmFtZUxhYmVsIiwiaHRtbEZvciIsInBsYXllcklucHV0TmFtZSIsImlucHV0VmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImFsZXJ0IiwiZWFzeVJhZGlvIiwidHlwZSIsImVhc3lMYWJlbCIsImhhcmRSYWRpbyIsImhhcmRMYWJlbCIsInN0YXJ0QnV0dG9uIiwiQWkiLCJpc0FpIiwiY29tcGxldGVkTW92ZXMiLCJjYXBpdGFsaXplRmlyc3QiLCJjaGVjayIsImdldFJhbmRvbUludCIsIm1pbiIsIm1heCIsImdldEFsbFBvc3NpYmxlTW92ZXMiLCJhbGxNb3ZlcyIsImNvbHVtbk51bWJlciIsInJvd051bWJlciIsImNvbHVtbkFsaWFzIiwiYWxsUG9zc2libGVNb3ZlcyIsInVucGxheWVkTW92ZXMiLCJmaWx0ZXIiLCJtb3ZlIiwicmFuZG9tSW5kZXgiLCJpc1ZhbGlkIiwic2V0TGVuZ3RoIiwiaGl0Q291bnQiLCJjYXBpdGFsaXplZFNoaXBOYW1lIiwiaXNTdW5rIiwiZ2VuZXJhdGVSYW5kb21TdHJpbmciLCJjaGFyYWN0ZXJzIiwicmVzdWx0IiwiY3JlYXRlVmVydGljYWxQaWVjZXNDb250YWluZXIiLCJnYW1lSW5pdCIsIm5ld0dhbWUiLCJnYW1lU2NyZWVuIiwibGVmdEdhbWVTY3JlZW4iLCJjdXJyZW50U2hpcE9yaWVudGF0aW9uIiwiaW5uZXJUZXh0IiwicGllY2VzIiwic2hpcFBvc2l0aW9uU3dpdGNoZXIiLCJyZW1vdmVDaGlsZCIsImluc2VydEJlZm9yZSIsInZlcnRpY2FsUGllY2VzIiwiZmlyc3RDaGlsZCIsImJvYXJkMSIsImJvYXJkMiJdLCJzb3VyY2VSb290IjoiIn0=