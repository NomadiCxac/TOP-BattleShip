/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./battleshipPieces.js":
/*!*****************************!*\
  !*** ./battleshipPieces.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Player = __webpack_require__(/*! ./player */ "./player.js");
var dragStartX = 0;
var shipHeadOffsetX = 0;
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

// Use the simulateClickOnDiv function I previously provided:
function simulateClickOnDiv(element, x, y) {
  var mouseEventInit = {
    bubbles: true,
    clientX: x,
    clientY: y
  };
  var clickEvent = new MouseEvent('click', mouseEventInit);
  element.dispatchEvent(clickEvent);
}
module.exports = {
  battleshipPieces: battleshipPieces,
  dragStartX: dragStartX,
  shipHeadOffsetX: shipHeadOffsetX,
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
      box.addEventListener('dragenter', function (event) {
        setTimeout(function () {
          var shipData = dragData.draggedShip;
          previousAffectedBoxes = _toConsumableArray(affectedBoxes); // make a shallow copy   

          console.log(shipData);
          if (!shipData) {
            console.error("Ship data is null!");
            return;
          }

          // Find out if the ship can be placed here
          var validPlacement = isValidPlacement(box.id, shipData.length, shipData.offset, "Horizontal", player);
          if (validPlacement) {
            affectedBoxes = getAffectedBoxes(box.id, shipData.length, "Horizontal");
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
    margin-top: 1.5em;
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
    margin-top: 1.5em;
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
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 1.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n}\r\n\r\n.playerNameContainer > input {\r\n    height: 50%;    \r\n    margin-top: 0.5em;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 1em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 1em;\r\n}\r\n\r\n#initStartButton {\r\n    background-color: grey;\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 1.5em;\r\n}\r\n\r\n.verticalShip {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}"],"sourceRoot":""}]);
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
var shipPositionSwitcher = document.createElement("button");
shipPositionSwitcher.className = "shipPositionSwitcher";
shipPositionSwitcher.innerText = "Switch Orientation";
gameScreen.appendChild(leftGameScreen);
var board1 = createGameBoard(newGame.player1);
var pieces = battleshipPieces(player1);
var board2 = createGameBoard(newGame.computer);
var verticalPieces = createVerticalPiecesContainer(player1);

// leftGameScreen.appendChild(pieces);
leftGameScreen.appendChild(verticalPieces);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);

function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QixDQUFDLE9BQU8saUZBQWlGLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLFFBQVEsS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsUUFBUSxLQUFLLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxjQUFjLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxL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QUFHSCxFQUFFLENBQUMvTyxZQUFZLENBQUM2RSxPQUFPLENBQUMsTUFBTSxDQUFDO0VBQzFDa0ssRUFBRSxDQUFDblAsTUFBTSxDQUFDc0IsV0FBVyxDQUFDakQsUUFBUSxDQUFDb0MsY0FBYyxDQUFDNk8sSUFBSSxDQUFDLENBQUM7QUFDdEQsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcFBpZWNlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZUdhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVMb29wLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbmF2aWdhdGlvbkNvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zaGlwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3MiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcz9lMGZlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XHJcblxyXG5sZXQgZHJhZ1N0YXJ0WCA9IDA7XHJcbmxldCBzaGlwSGVhZE9mZnNldFggPSAwO1xyXG5sZXQgZHJhZ0RhdGEgPSB7XHJcbiAgICBkcmFnZ2VkU2hpcDogbnVsbFxyXG4gIH07XHJcblxyXG5mdW5jdGlvbiBiYXR0bGVzaGlwUGllY2VzIChwbGF5ZXIpIHtcclxuICAgIFxyXG4gICAgbGV0IHBpZWNlc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gXCJwaWVjZXNDb250YWluZXJcIjtcclxuICAgIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gICAgbGV0IGJveEhlaWdodCA9IDQ4O1xyXG5cclxuICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHBsYXllci5nYW1lQm9hcmQuc2hpcCkge1xyXG5cclxuICAgICAgICBsZXQgc2hpcEF0dHJpYnV0ZSA9IHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBDb250YWluZXIuY2xhc3NOYW1lID0gXCJzaGlwQ29udGFpbmVyXCI7XHJcbiAgICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcFRpdGxlLmNsYXNzTmFtZSA9IFwic2hpcE5hbWVcIjtcclxuICAgICAgICBzaGlwVGl0bGUudGV4dENvbnRlbnQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIjpcIjtcclxuXHJcbiAgICAgICAgbGV0IHNoaXBQaWVjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2FibGVcIik7XHJcbiAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgIHNoaXBQaWVjZS5pZCA9IHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgICBzaGlwUGllY2Uuc3R5bGUud2lkdGggPSAoYm94V2lkdGggKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IChib3hIZWlnaHQpICsgXCJweFwiO1xyXG5cclxuICAgICAgIFxyXG4gXHJcbiAgICAgICAgc2hpcFBpZWNlLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgc2hpcFBpZWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogc2hpcEF0dHJpYnV0ZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIG9mZnNldDogY2xpY2tlZEJveE9mZnNldCAgLy8gVGhpcyB0ZWxscyB1cyBob3cgZmFyIGZyb20gdGhlIGhlYWQgdGhlIHVzZXIgY2xpY2tlZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkcmFnRGF0YS5kcmFnZ2VkU2hpcCA9IHNoaXBEYXRhOyAvLyBzdG9yZSB0aGUgZGF0YVxyXG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicsIEpTT04uc3RyaW5naWZ5KHNoaXBEYXRhKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgc2hpcEhlYWQncyBib3VuZGluZyByZWN0YW5nbGVcclxuICAgICAgICAgICAgY29uc3Qgc2hpcEhlYWRSZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBvZmZzZXRcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpOztcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHNoaXBIZWFkUmVjdC50b3AgLSBzaGlwUGllY2VSZWN0LnRvcCArIChzaGlwSGVhZFJlY3QuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGFkanVzdCB0aGUgZHJhZyBpbWFnZSdzIHN0YXJ0aW5nIHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcFBpZWNlLCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaGlwQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgICAgc2hpcEJveC5zdHlsZS53aWR0aCA9ICBib3hXaWR0aCArIFwicHhcIjtcclxuXHJcbiAgICAgICAgICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWxlbWVudCBjbGlja2VkOlwiLCBldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgc2hpcFBpZWNlLnNldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIsIDApOyAvLyBzZXQgdGhlIG9mZnNldCBvbiB0aGUgc2hpcFBpZWNlIHdoZW4gYSBzaGlwQm94IGlzIGNsaWNrZWRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB7IFxyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTsgIC8vIE1ha2UgaXQgdW5pcXVlXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpOyAgLy8gTWFrZSBpdCB1bmlxdWVcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hpcFBpZWNlLmFwcGVuZENoaWxkKHNoaXBCb3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpO1xyXG4gICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFBpZWNlKTtcclxuICAgICAgICBwaWVjZXNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcENvbnRhaW5lcik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwaWVjZXNDb250YWluZXI7XHJcbn1cclxuXHJcbi8vIFVzZSB0aGUgc2ltdWxhdGVDbGlja09uRGl2IGZ1bmN0aW9uIEkgcHJldmlvdXNseSBwcm92aWRlZDpcclxuZnVuY3Rpb24gc2ltdWxhdGVDbGlja09uRGl2KGVsZW1lbnQsIHgsIHkpIHtcclxuICAgIGNvbnN0IG1vdXNlRXZlbnRJbml0ID0ge1xyXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgY2xpZW50WDogeCxcclxuICAgICAgICBjbGllbnRZOiB5XHJcbiAgICB9O1xyXG4gICAgY29uc3QgY2xpY2tFdmVudCA9IG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIG1vdXNlRXZlbnRJbml0KTtcclxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IHtiYXR0bGVzaGlwUGllY2VzLCBkcmFnU3RhcnRYLCBzaGlwSGVhZE9mZnNldFgsIGRyYWdEYXRhIH07IiwiY29uc3QgeyBkcmFnRGF0YSB9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcblxyXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcclxuXHJcbmZ1bmN0aW9uIGdldEFmZmVjdGVkQm94ZXMoaGVhZFBvc2l0aW9uLCBsZW5ndGgsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBjb25zdCBib3hlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoaGVhZFBvc2l0aW9uLnNsaWNlKDEpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgaSkgKyBudW1QYXJ0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hlcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGJveElkWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcclxuXHJcbiAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gb2Zmc2V0O1xyXG5cclxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICByZXR1cm4gYWRqdXN0ZWROdW1QYXJ0ID4gMCAmJiBhZGp1c3RlZE51bVBhcnQgKyBsZW5ndGggLSAxIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZChwbGF5ZXIpIHtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcclxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZFRvcENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGFscGhhQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgXHJcbiAgIFxyXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XHJcbiAgICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIHRvcFwiO1xyXG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcclxuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcclxuICAgICBnYW1lQm9hcmQuaWQgPSBwbGF5ZXIubmFtZTsgLy8gQXNzdW1pbmcgdGhlIHBsYXllciBpcyBhIHN0cmluZyBsaWtlIFwicGxheWVyMVwiXHJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcclxuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcclxuXHJcbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcclxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29sdW1uVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcclxuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xyXG4gICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XHJcblxyXG4gICAgICAgIGxldCByb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XHJcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG4gICAgICAgIHJvdy5pZCA9IGFscGhhQ2hhcjtcclxuXHJcbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICBsZXQgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBkcmFnRGF0YS5kcmFnZ2VkU2hpcDtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbLi4uYWZmZWN0ZWRCb3hlc107IC8vIG1ha2UgYSBzaGFsbG93IGNvcHkgICBcclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzaGlwRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNoaXAgZGF0YSBpcyBudWxsIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkhvcml6b250YWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUGxhY2VtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkhvcml6b250YWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFmZmVjdGVkQm94ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91c0FmZmVjdGVkQm94ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LmRyYWdBZmZlY3RlZCA9IFwidHJ1ZVwiOyAvLyBBZGQgdGhpcyBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApOyAvLyBkZWxheSBvZiAwIG1zLCBqdXN0IGVub3VnaCB0byBsZXQgZHJhZ2xlYXZlIGhhcHBlbiBmaXJzdCBpZiBpdCdzIGdvaW5nIHRvXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlBZmZlY3RlZEJveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJveFtkYXRhLWRyYWctYWZmZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcy5mb3JFYWNoKHByZXZCb3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpOyAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gRXh0cmFjdCB0aGUgY2hhcmFjdGVyIGFuZCBudW1lcmljIHBhcnRzIG9mIHRoZSBib3ggSURcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94LmlkWzBdOyAgLy8gQXNzdW1pbmcgdGhlIGZvcm1hdCBpcyBhbHdheXMgbGlrZSBcIkE1XCJcclxuICAgICAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3guaWQuc2xpY2UoMSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0ZWQgcG9zaXRpb24gYmFzZWQgb24gd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCBvbiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIHNoaXBEYXRhLm9mZnNldDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNoaXBEYXRhLm9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhZGp1c3RlZE51bVBhcnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRyb3BwZWQgZGF0YTpcIiwgcmF3RGF0YSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGFjZW1lbnQgaXMgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgaWYgKGFkanVzdGVkTnVtUGFydCA8PSAwIHx8IGFkanVzdGVkTnVtUGFydCArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiA9IGNoYXJQYXJ0ICsgYWRqdXN0ZWROdW1QYXJ0OyAgLy8gVGhlIG5ldyBwb3NpdGlvbiBmb3IgdGhlIGhlYWQgb2YgdGhlIHNoaXBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBwbGFjZSAke3NoaXBEYXRhLm5hbWV9IHdpdGggbGVuZ3RoICR7c2hpcERhdGEubGVuZ3RofSBhdCBwb3NpdGlvbiAke2FkanVzdGVkVGFyZ2V0UG9zaXRpb259LmApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIHlvdXIgc2hpcCBiYXNlZCBvbiBhZGp1c3RlZFRhcmdldFBvc2l0aW9uIGFzIHRoZSBoZWFkJ3MgcG9zaXRpb24sIHVzaW5nIHlvdXIgZXhpc3RpbmcgbG9naWMgb3IgbWV0aG9kc1xyXG4gICAgICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLm5hbWUsIGFkanVzdGVkVGFyZ2V0UG9zaXRpb24sIHNoaXBPcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgaGlnaGxpZ2h0XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJldmlvdXNCb3hlcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNCb3hlcyA9IGFmZmVjdGVkQm94ZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4gYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpXHJcblxyXG5jbGFzcyBHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVJZCwgcGxheWVyTmFtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUlkID0gZ2FtZUlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuICAgICAgICB0aGlzLnBoYXNlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPLURPIHByb21wdFVzZXJDb29yZGluYXRlKCksIHByb21wdFVzZXJPcmllbnRhdGlvbigpLCBjaGVja1dpbm5lcigpO1xyXG5cclxuICAgIHBsYWNlUGxheWVyU2hpcHMoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAocGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vIFByb21wdCBVc2VyIGZvciBzaGlwSGVhZENvb3JkaW5hdGVcclxuICAgICAgICAgICAgbGV0IHVzZXJDb29yZGluYXRlID0gcHJvbXB0VXNlckNvb3JkaW5hdGUoKTtcclxuICAgICAgICAgICAgbGV0IHVzZXJTaGlwT3JpZW50YXRpb24gPSBwcm9tcHRVc2VyT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHVzZXJDb29yZGluYXRlLCB1c2VyU2hpcE9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgdXNlckNvb3JkaW5hdGUgPSBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdXNlclNoaXBPcmllbnRhdGlvbiA9IHByb21wdFVzZXJPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlQ29tcHV0ZXJTaGlwKHNoaXBOYW1lKSB7XHJcbiAgICAgICAgd2hpbGUgKGNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwTmFtZSwgY29tcHV0ZXJDb29yZGluYXRlLCBjb21wdXRlck9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbnRpYWxpemVHYW1lKCkge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBTZXQtVXBcIlxyXG4gICAgICAgIGNvbnN0IHNoaXBUeXBlcyA9IFtcIkNhcnJpZXJcIiwgXCJCYXR0bGVzaGlwXCIsIFwiQ3J1aXNlclwiLCBcIlN1Ym1hcmluZVwiLCBcIkRlc3Ryb3llclwiXTtcclxuICAgICAgICAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzaGlwIG9mIHNoaXBUeXBlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlUGxheWVyU2hpcHMoc2hpcCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VDb21wdXRlclNoaXAoc2hpcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlUdXJuKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyTW92ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKCFpc1ZhbGlkTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvL3Byb21wdCB1c2VyIGZvciBjb29yZGluYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21wdCA9IFwiQTFcIjsgLy8gSGVyZSB5b3UgbWlnaHQgd2FudCB0byBnZXQgYWN0dWFsIGlucHV0IGZyb20gdGhlIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyTW92ZSA9IHBsYXllci5tYWtlQXR0YWNrKHByb21wdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOyAvLyBPdXRwdXQgdGhlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBwcm9tcHQgdGhlIHVzZXIgd2l0aCBhIG1lc3NhZ2UgdG8gZW50ZXIgYSBuZXcgY29vcmRpbmF0ZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNob2ljZSA9IGNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IGNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXHJcbiAgICAgICAgICAgIHBsYXllci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhjb21wdXRlck1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgICBsZXQgdHVyblZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkpICsgMTtcclxuICAgICAgICAgICAgaWYgKHR1cm5WYWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJQbGF5ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja1dpbm5lcigpIHtcclxuICAgICAgICBpZiAocGxheWVyLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkNvbXB1dGVyIFdpbnNcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbXB1dGVyLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlBsYXllciBXaW5zXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB3aGlsZSghY2hlY2tXaW5uZXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheVR1cm4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuXHJcbi8vIC8vIEdldCBwbGF5ZXIgbmFtZVxyXG4vLyBsZXQgbmFtZSA9IFwicGxheWVyMVwiXHJcblxyXG4vLyAvLyBDcmVhdGUgcGxheWVyc1xyXG4vLyBsZXQgcGxheWVyID0gbmV3IFBsYXllcihuYW1lKTtcclxuLy8gbGV0IGNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4vLyAgICAgLy8gXCJDYXJyaWVyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkU1XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNhcnJpZXJcIiwgXCJBMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIkJhdHRsZXNoaXBcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiSjdcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQmF0dGxlc2hpcFwiLCBcIkIxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJDcnVpc2VyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkE4XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNydWlzZXJcIiwgXCJGMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIlN1Ym1hcmluZVwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkQxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkgxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJEZXN0cm95ZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJCMlwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJKMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAvLyBBdHRhY2sgcGhhc2UgXHJcblxyXG4vLyAgICAgLy8gUGxheWVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhcIkExXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG5cclxuLy8gICAgIC8vIENvbXB1dGVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IGNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuIiwiZnVuY3Rpb24gY3JlYXRlTmF2VWkgKCkge1xyXG4gICAgbGV0IGdhbWVJbml0aWFsaXplckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lSW5pdGlhbGl6ZXJDb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgcGxheWVyTmFtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwicGxheWVyTmFtZUNvbnRhaW5lclwiO1xyXG4gICAgbGV0IGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuY2xhc3NOYW1lID0gXCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXJcIjtcclxuICAgIGxldCBzdGFydEJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInN0YXJ0QnV0dG9uQ29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHBsYXllck5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIHBsYXllck5hbWVMYWJlbC50ZXh0Q29udGVudCA9IFwiRW50ZXIgeW91ciBuYW1lOlwiO1xyXG4gICAgcGxheWVyTmFtZUxhYmVsLmh0bWxGb3IgPSBcInBsYXllcklucHV0TmFtZVwiO1xyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJOYW1lTGFiZWwpO1xyXG5cclxuICAgIGxldCBwbGF5ZXJJbnB1dE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBwbGF5ZXJJbnB1dE5hbWUuY2xhc3NOYW1lID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcclxuICAgIHBsYXllcklucHV0TmFtZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBpbnB1dFZhbHVlID0gcGxheWVySW5wdXROYW1lLnZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiY29tcHV0ZXJcIiB8fCBpbnB1dFZhbHVlID09PSBcImFpXCIpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ1RoZSBuYW1lIGNhbm5vdCBiZSBcImNvbXB1dGVyXCIgb3IgXCJhaVwiLicpO1xyXG4gICAgICAgICAgICBwbGF5ZXJJbnB1dE5hbWUudmFsdWUgPSAnJzsgLy8gQ2xlYXIgdGhlIGlucHV0IGZpZWxkXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJJbnB1dE5hbWUpO1xyXG5cclxuICAgIGxldCBlYXN5UmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBlYXN5UmFkaW8udHlwZSA9IFwicmFkaW9cIjtcclxuICAgIGVhc3lSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XHJcbiAgICBlYXN5UmFkaW8udmFsdWUgPSBcImVhc3lcIjtcclxuICAgIGVhc3lSYWRpby5pZCA9IFwiZWFzeVwiO1xyXG4gICAgbGV0IGVhc3lMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGVhc3lMYWJlbC5odG1sRm9yID0gXCJlYXN5XCI7XHJcbiAgICBlYXN5TGFiZWwudGV4dENvbnRlbnQgPSBcIkVhc3lcIjtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChlYXN5UmFkaW8pO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lMYWJlbCk7XHJcblxyXG4gICAgLy8gUmFkaW8gYnV0dG9uIGZvciBoYXJkIGRpZmZpY3VsdHlcclxuICAgIGxldCBoYXJkUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBoYXJkUmFkaW8udHlwZSA9IFwicmFkaW9cIjtcclxuICAgIGhhcmRSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XHJcbiAgICBoYXJkUmFkaW8udmFsdWUgPSBcImhhcmRcIjtcclxuICAgIGhhcmRSYWRpby5pZCA9IFwiaGFyZFwiO1xyXG4gICAgbGV0IGhhcmRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGhhcmRMYWJlbC5odG1sRm9yID0gXCJoYXJkXCI7XHJcbiAgICBoYXJkTGFiZWwudGV4dENvbnRlbnQgPSBcIkhhcmRcIjtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkUmFkaW8pO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGhhcmRMYWJlbCk7XHJcblxyXG4gICAgLy8gU3RhcnQgYnV0dG9uXHJcbiAgICBsZXQgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IEdhbWVcIjtcclxuICAgIHN0YXJ0QnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uKTtcclxuICAgIHN0YXJ0QnV0dG9uLmlkID0gXCJpbml0U3RhcnRCdXR0b25cIjtcclxuXHJcbiAgICAvLyBBcHBlbmQgdGhlIGNvbnRhaW5lcnMgdG8gdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTmF2VWk7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IG5ldyBHYW1lYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW92ZSBpcyBhbHJlYWR5IG1hZGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FpKG5hbWUpIHtcclxuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuICAgICAgICByZXR1cm4gY2hlY2sgPT0gXCJDb21wdXRlclwiIHx8IGNoZWNrID09IFwiQWlcIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcclxuICAgICAgICBsZXQgYWxsTW92ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBjb2x1bW5OdW1iZXIgPSAwOyBjb2x1bW5OdW1iZXIgPCB0aGlzLmdhbWVCb2FyZC53aWR0aDsgY29sdW1uTnVtYmVyKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5BbGlhcyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sdW1uTnVtYmVyICsgNjUpO1xyXG4gICAgICAgICAgICAgICAgYWxsTW92ZXMucHVzaChjb2x1bW5BbGlhcyArIHJvd051bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFsbE1vdmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVhc3lBaU1vdmVzKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIGVhc3lBaU1vdmVzIGlzIHJlc3RyaWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNldCBvZiBhbGwgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IHVucGxheWVkTW92ZXMgPSBhbGxQb3NzaWJsZU1vdmVzLmZpbHRlcihtb3ZlID0+ICF0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKG1vdmUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgaWYgKHVucGxheWVkTW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbGwgbW92ZXMgaGF2ZSBiZWVuIHBsYXllZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIG1vdmUgZnJvbSB0aGUgc2V0IG9mIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdW5wbGF5ZWRNb3Zlc1tyYW5kb21JbmRleF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBhaVNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkhvcml6b250YWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7IiwiXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcclxuICAgICAgICAgICAgQ2FycmllcjogNSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDogNCxcclxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IDIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnNoaXBUeXBlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2V0TGVuZ3RoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExlbmd0aChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY2FwaXRhbGl6ZWRTaGlwTmFtZSA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcclxuICAgICAgICB0aGlzLmlzU3VuaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLmdhbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDEwMHZoO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmVkO1xyXG59XHJcblxyXG4uZ2FtZUhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMTUlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xyXG59XHJcblxyXG4jYmF0dGxlc2hpcFRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5nYW1lU3RhdGVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBoZWlnaHQ6IDcwJTtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA1JTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcclxuICAgIG1hcmdpbi10b3A6IDNlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVTY3JlZW4tTGVmdCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xyXG59XHJcblxyXG4ucGllY2VzQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMS41ZW07XHJcbn1cclxuXHJcbi5zaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDUwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbn1cclxuXHJcbi5zaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xyXG59XHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyID4gaW5wdXQge1xyXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDEuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxTaGlwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG59XHJcblxyXG4udmVydGljYWxTaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XHJcbn1cclxuXHJcblxyXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcclxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vYmF0dGxlc2hpcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIs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dEMsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1COztBQUV2Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxzQkFBc0I7SUFDdEIsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0FBQ3ZFOztBQUVBO0lBQ0ksZUFBZTtJQUNmLGtCQUFrQjtBQUN0Qjs7O0FBR0E7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0lBQ25FLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFlBQVksR0FBRyxtQ0FBbUM7SUFDbEQsV0FBVztJQUNYLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxzQkFBc0IsRUFBRSxpREFBaUQ7QUFDN0VcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVIZWFkZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAxNSU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcXHJcXG59XFxyXFxuXFxyXFxuI2JhdHRsZXNoaXBUaXRsZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTdGF0ZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGhlaWdodDogNzAlO1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRlbnRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi10b3A6IDNlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlciB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW5Db250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuLUxlZnQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgaGVpZ2h0OiA5MCU7XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gICAgd2lkdGg6IDUwMHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucm93LCAuc2hpcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5oaWdobGlnaHQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogNTBweDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94IHtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMjAwcHg7XFxyXFxuICAgIHdpZHRoOiAyMDBweDtcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgXFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyID4gaW5wdXQge1xcclxcbiAgICBoZWlnaHQ6IDUwJTsgICAgXFxyXFxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxyXFxufVxcclxcblxcclxcbiNpbml0U3RhcnRCdXR0b24ge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAzNTBweDtcXHJcXG4gICAgd2lkdGg6IDQyNXB4O1xcclxcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXHJcXG4gICAgbWFyZ2luLXRvcDogMS41ZW07XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFNoaXAge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcXHJcXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2JhdHRsZXNoaXAuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2JhdHRsZXNoaXAuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZUxvb3AnKTtcclxuY29uc3Qge2JhdHRsZXNoaXBQaWVjZXN9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcbmNvbnN0IGNyZWF0ZUdhbWVCb2FyZCA9ICByZXF1aXJlKCcuL2NyZWF0ZUdhbWVCb2FyZCcpO1xyXG5jb25zdCBjcmVhdGVOYXZVaSA9IHJlcXVpcmUoJy4vbmF2aWdhdGlvbkNvbXBvbmVudHMnKTtcclxuaW1wb3J0ICcuL2JhdHRsZXNoaXAuY3NzJztcclxuXHJcbi8vIFN0cmluZyB0byBnZW5lcmF0ZSBnYW1lIElEXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xyXG4gICAgY29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVZlcnRpY2FsUGllY2VzQ29udGFpbmVyKHBsYXllcikge1xyXG4gIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIHBpZWNlc0NvbnRhaW5lci5jbGFzc05hbWUgPSBcInZlcnRpY2FsUGllY2VzQ29udGFpbmVyXCI7XHJcbiAgbGV0IGJveFdpZHRoID0gNTA7XHJcbiAgbGV0IGJveEhlaWdodCA9IDQ4O1xyXG5cclxuICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xyXG4gICAgICBcclxuICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwidmVydGljYWxTaGlwQ29udGFpbmVyXCI7XHJcblxyXG4gICAgICBsZXQgc2hpcFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc2hpcFRpdGxlLmNsYXNzTmFtZSA9IFwidmVydGljYWxTaGlwTmFtZVwiO1xyXG4gICAgICBzaGlwVGl0bGUudGV4dENvbnRlbnQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIjpcIjtcclxuXHJcbiAgICAgIGxldCBzaGlwUGllY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInZlcnRpY2FsRHJhZ2dhYmxlXCIpO1xyXG4gICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInZlcnRpY2FsU2hpcFwiKTtcclxuICAgICAgc2hpcFBpZWNlLmlkID0gXCJ2ZXJ0aWNhbFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICBzaGlwUGllY2Uuc3R5bGUud2lkdGggPSBib3hXaWR0aCArIFwicHhcIjtcclxuICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IChib3hIZWlnaHQgKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCI7XHJcblxyXG4gICAgICBcclxuICAgICAgc2hpcFBpZWNlLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcclxuICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcclxuICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIG9mZnNldDogY2xpY2tlZEJveE9mZnNldCAgLy8gVGhpcyB0ZWxscyB1cyBob3cgZmFyIGZyb20gdGhlIGhlYWQgdGhlIHVzZXIgY2xpY2tlZFxyXG4gICAgICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgICAgICBkcmFnRGF0YS5kcmFnZ2VkU2hpcCA9IHNoaXBEYXRhOyAvLyBzdG9yZSB0aGUgZGF0YVxyXG4gICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShzaGlwRGF0YSkpO1xyXG4gICAgICBcclxuICAgICAgICAgIC8vIGdldCB0aGUgc2hpcEhlYWQncyBib3VuZGluZyByZWN0YW5nbGVcclxuICAgICAgICAgIGNvbnN0IHNoaXBIZWFkUmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICBjb25zdCBzaGlwUGllY2VSZWN0ID0gc2hpcFBpZWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICBcclxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0XHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRYID0gc2hpcEhlYWRSZWN0LmxlZnQgLSBzaGlwUGllY2VSZWN0LmxlZnQgKyAoc2hpcEhlYWRSZWN0LndpZHRoIC8gMik7O1xyXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHNoaXBIZWFkUmVjdC50b3AgLSBzaGlwUGllY2VSZWN0LnRvcCArIChzaGlwSGVhZFJlY3QuaGVpZ2h0IC8gMik7XHJcbiAgICAgIFxyXG4gICAgICAgICAgLy8gYWRqdXN0IHRoZSBkcmFnIGltYWdlJ3Mgc3RhcnRpbmcgcG9zaXRpb25cclxuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcFBpZWNlLCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICBsZXQgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xyXG4gICAgICAgICAgc2hpcEJveC5zdHlsZS53aWR0aCA9ICBib3hXaWR0aCArIFwicHhcIjtcclxuXHJcbiAgICAgICAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IGNsaWNrZWQ6XCIsIGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgc2hpcFBpZWNlLnNldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIsIDApOyAvLyBzZXQgdGhlIG9mZnNldCBvbiB0aGUgc2hpcFBpZWNlIHdoZW4gYSBzaGlwQm94IGlzIGNsaWNrZWRcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChpID09IDApIHsgXHJcbiAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTsgIC8vIE1ha2UgaXQgdW5pcXVlXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIi1cIiArIGk7ICAvLyBNYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNoaXBQaWVjZS5hcHBlbmRDaGlsZChzaGlwQm94KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpO1xyXG4gICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XHJcbiAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcclxuXHJcbiAgfVxyXG4gIHJldHVybiBwaWVjZXNDb250YWluZXI7XHJcbn1cclxuXHJcblxyXG5cclxubGV0IGdhbWVJbml0ID0gY3JlYXRlTmF2VWkoKTtcclxuXHJcbmxldCBwbGF5ZXIxID0gbmV3IFBsYXllcjtcclxuXHJcbmxldCBuZXdHYW1lID0gbmV3IEdhbWUoZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSwgcGxheWVyMSlcclxuXHJcbmxldCBnYW1lU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lU2NyZWVuQ29udGFpbmVyXCIpO1xyXG5cclxubGV0IGxlZnRHYW1lU2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxubGVmdEdhbWVTY3JlZW4uY2xhc3NOYW1lPVwiZ2FtZVNjcmVlbi1MZWZ0XCJcclxuXHJcbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbnNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xyXG5zaGlwUG9zaXRpb25Td2l0Y2hlci5pbm5lclRleHQgPSBcIlN3aXRjaCBPcmllbnRhdGlvblwiXHJcblxyXG5cclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChsZWZ0R2FtZVNjcmVlbik7XHJcblxyXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUucGxheWVyMSk7XHJcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllcjEpO1xyXG5sZXQgYm9hcmQyID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUuY29tcHV0ZXIpO1xyXG5cclxubGV0IHZlcnRpY2FsUGllY2VzID0gY3JlYXRlVmVydGljYWxQaWVjZXNDb250YWluZXIocGxheWVyMSk7XHJcblxyXG4vLyBsZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZCh2ZXJ0aWNhbFBpZWNlcyk7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHNoaXBQb3NpdGlvblN3aXRjaGVyKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0KTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG5cclxuZnVuY3Rpb24gYWxsb3dEcm9wKGV2KSB7XHJcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBkcmFnKGV2KSB7XHJcbiAgICBldi5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHRcIiwgZXYudGFyZ2V0LmlkKTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZHJvcChldikge1xyXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xyXG4gICAgZXYudGFyZ2V0LmFwcGVuZENoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpKTtcclxuICB9Il0sIm5hbWVzIjpbIlBsYXllciIsInJlcXVpcmUiLCJkcmFnU3RhcnRYIiwic2hpcEhlYWRPZmZzZXRYIiwiZHJhZ0RhdGEiLCJkcmFnZ2VkU2hpcCIsImJhdHRsZXNoaXBQaWVjZXMiLCJwbGF5ZXIiLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJib3hXaWR0aCIsImJveEhlaWdodCIsIl9sb29wIiwic2hpcEF0dHJpYnV0ZSIsImdhbWVCb2FyZCIsInNoaXAiLCJzaGlwTmFtZSIsImluc3RhbmNlIiwic2hpcENvbnRhaW5lciIsInNoaXBUaXRsZSIsInRleHRDb250ZW50IiwibmFtZSIsInNoaXBQaWVjZSIsImNsYXNzTGlzdCIsImFkZCIsImlkIiwic3R5bGUiLCJ3aWR0aCIsImxlbmd0aCIsImhlaWdodCIsImRyYWdnYWJsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImNsaWNrZWRCb3hPZmZzZXQiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJzaGlwRGF0YSIsIm9mZnNldCIsImRhdGFUcmFuc2ZlciIsInNldERhdGEiLCJKU09OIiwic3RyaW5naWZ5Iiwic2hpcEhlYWRSZWN0IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzaGlwUGllY2VSZWN0Iiwib2Zmc2V0WCIsImxlZnQiLCJvZmZzZXRZIiwidG9wIiwic2V0RHJhZ0ltYWdlIiwiaSIsInNoaXBCb3giLCJjb25zb2xlIiwibG9nIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJzaW11bGF0ZUNsaWNrT25EaXYiLCJlbGVtZW50IiwieCIsInkiLCJtb3VzZUV2ZW50SW5pdCIsImJ1YmJsZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsImNsaWNrRXZlbnQiLCJNb3VzZUV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIm1vZHVsZSIsImV4cG9ydHMiLCJfcmVxdWlyZSIsImdldEFmZmVjdGVkQm94ZXMiLCJoZWFkUG9zaXRpb24iLCJvcmllbnRhdGlvbiIsImJveGVzIiwiY2hhclBhcnQiLCJudW1QYXJ0IiwicGFyc2VJbnQiLCJzbGljZSIsInB1c2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiaXNWYWxpZFBsYWNlbWVudCIsImJveElkIiwiYWRqdXN0ZWROdW1QYXJ0IiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZUJvYXJkQ29tcG9uZW50IiwiZ2FtZUJvYXJkVG9wQ29tcG9uZW50IiwiZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50IiwiYWxwaGFDb29yZGluYXRlcyIsIm51bWVyaWNDb29yZGluYXRlcyIsImNvbHVtblRpdGxlIiwiYWxwaGFDaGFyIiwicm93VGl0bGUiLCJyb3ciLCJhZmZlY3RlZEJveGVzIiwicHJldmlvdXNBZmZlY3RlZEJveGVzIiwiX2xvb3AyIiwiYm94IiwiaiIsInByZXZlbnREZWZhdWx0Iiwic2V0VGltZW91dCIsIl90b0NvbnN1bWFibGVBcnJheSIsImVycm9yIiwidmFsaWRQbGFjZW1lbnQiLCJmb3JFYWNoIiwiZGF0YXNldCIsImRyYWdBZmZlY3RlZCIsInByZXZpb3VzbHlBZmZlY3RlZEJveGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZCb3giLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJwYXJzZSIsImdldERhdGEiLCJyYXdEYXRhIiwiYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiIsImNvbmNhdCIsInByZXZpb3VzQm94ZXMiLCJTaGlwIiwiR2FtZWJvYXJkIiwiX2NsYXNzQ2FsbENoZWNrIiwibWlzc0NvdW50IiwibWlzc2VkTW92ZXNBcnJheSIsImhpdE1vdmVzQXJyYXkiLCJDYXJyaWVyIiwiY29vcmRpbmF0ZXMiLCJCYXR0bGVzaGlwIiwiQ3J1aXNlciIsIlN1Ym1hcmluZSIsIkRlc3Ryb3llciIsImJvYXJkIiwic3RhcnRHYW1lIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJjaGFyVG9Sb3dJbmRleCIsImNoYXIiLCJ0b1VwcGVyQ2FzZSIsInN0cmluZ1RvQ29sSW5kZXgiLCJzdHIiLCJzZXRBdCIsImFsaWFzIiwic3RyaW5nIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwicm93SW5kZXgiLCJjb2xJbmRleCIsImNoZWNrQXQiLCJFcnJvciIsImdldEJlbG93QWxpYXMiLCJuZXh0Q2hhciIsIm5ld0FsaWFzIiwiZ2V0UmlnaHRBbGlhcyIsInBsYWNlU2hpcCIsInNoaXBIZWFkQ29vcmRpbmF0ZSIsInNoaXBPcmllbnRhdGlvbiIsIl90aGlzIiwic2hpcE1hcmtlciIsInNoaXBMZW5ndGgiLCJjdXJyZW50Q29vcmRpbmF0ZSIsImdldE5leHRDb29yZGluYXRlIiwiY29vcmRpbmF0ZSIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJlcnIiLCJlIiwiZiIsInJlY2VpdmVBdHRhY2siLCJzaGlwQ29vcmRpbmF0ZXMiLCJpbmNsdWRlcyIsImhpdCIsInNldEFsbFNoaXBzVG9EZWFkIiwiaXNEZWFkIiwiZ2FtZU92ZXIiLCJkaXNwbGF5IiwiaGVhZGVyIiwicm93U3RyaW5nIiwiY2VsbFZhbHVlIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJwbGF5ZXIxIiwiY29tcHV0ZXIiLCJwaGFzZUNvdW50ZXIiLCJjdXJyZW50U3RhdGUiLCJjdXJyZW50VHVybiIsInBsYWNlUGxheWVyU2hpcHMiLCJ1c2VyQ29vcmRpbmF0ZSIsInByb21wdFVzZXJDb29yZGluYXRlIiwidXNlclNoaXBPcmllbnRhdGlvbiIsInByb21wdFVzZXJPcmllbnRhdGlvbiIsInBsYWNlQ29tcHV0ZXJTaGlwIiwiY29tcHV0ZXJDb29yZGluYXRlIiwiZWFzeUFpTW92ZXMiLCJjb21wdXRlck9yaWVudGF0aW9uIiwiYWlTaGlwT3JpZW50YXRpb24iLCJpbnRpYWxpemVHYW1lIiwic2hpcFR5cGVzIiwiX2kiLCJfc2hpcFR5cGVzIiwic3RhcnQiLCJwbGF5VHVybiIsImlzVmFsaWRNb3ZlIiwicGxheWVyTW92ZSIsInByb21wdCIsIm1ha2VBdHRhY2siLCJtZXNzYWdlIiwiY29tcHV0ZXJDaG9pY2UiLCJjb21wdXRlck1vdmUiLCJ1cGRhdGVTdGF0ZSIsInR1cm5WYWx1ZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoZWNrV2lubmVyIiwiY3JlYXRlTmF2VWkiLCJnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIiLCJwbGF5ZXJOYW1lQ29udGFpbmVyIiwiY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIiwic3RhcnRCdXR0b25Db250YWluZXIiLCJwbGF5ZXJOYW1lTGFiZWwiLCJodG1sRm9yIiwicGxheWVySW5wdXROYW1lIiwiaW5wdXRWYWx1ZSIsInRvTG93ZXJDYXNlIiwiYWxlcnQiLCJlYXN5UmFkaW8iLCJ0eXBlIiwiZWFzeUxhYmVsIiwiaGFyZFJhZGlvIiwiaGFyZExhYmVsIiwic3RhcnRCdXR0b24iLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsImNoZWNrIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiZ2V0QWxsUG9zc2libGVNb3ZlcyIsImFsbE1vdmVzIiwiY29sdW1uTnVtYmVyIiwicm93TnVtYmVyIiwiY29sdW1uQWxpYXMiLCJhbGxQb3NzaWJsZU1vdmVzIiwidW5wbGF5ZWRNb3ZlcyIsImZpbHRlciIsIm1vdmUiLCJyYW5kb21JbmRleCIsImlzVmFsaWQiLCJzZXRMZW5ndGgiLCJoaXRDb3VudCIsImNhcGl0YWxpemVkU2hpcE5hbWUiLCJpc1N1bmsiLCJnZW5lcmF0ZVJhbmRvbVN0cmluZyIsImNoYXJhY3RlcnMiLCJyZXN1bHQiLCJjcmVhdGVWZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciIsImdhbWVJbml0IiwibmV3R2FtZSIsImdhbWVTY3JlZW4iLCJxdWVyeVNlbGVjdG9yIiwibGVmdEdhbWVTY3JlZW4iLCJzaGlwUG9zaXRpb25Td2l0Y2hlciIsImlubmVyVGV4dCIsImJvYXJkMSIsInBpZWNlcyIsImJvYXJkMiIsInZlcnRpY2FsUGllY2VzIiwiYWxsb3dEcm9wIiwiZXYiLCJkcmFnIiwiZHJvcCIsImRhdGEiXSwic291cmNlUm9vdCI6IiJ9