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
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n}\r\n\r\n.playerNameContainer > input {\r\n    height: 50%;    \r\n    margin-top: 0.5em;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 1em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 1em;\r\n}\r\n\r\n#initStartButton {\r\n    background-color: grey;\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalShip {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}"],"sourceRoot":""}]);
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
currentShipOrientation.innerText = "Current Ship Position is: Horizontal";
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
leftGameScreen.appendChild(currentShipOrientation);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QixDQUFDLE9BQU8saUZBQWlGLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFFBQVEsS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksY0FBYyxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxV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TixXQUFXLENBQUNpTixRQUFRLENBQUM7QUFDaEM7O0FBRUEsU0FBU1ksU0FBU0EsQ0FBQ0MsRUFBRSxFQUFFO0VBQ25CQSxFQUFFLENBQUNqTCxjQUFjLENBQUMsQ0FBQztBQUNyQjtBQUVBLFNBQVNrTCxJQUFJQSxDQUFDRCxFQUFFLEVBQUU7RUFDaEJBLEVBQUUsQ0FBQ2hQLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLE1BQU0sRUFBRStPLEVBQUUsQ0FBQ3BQLE1BQU0sQ0FBQ1QsRUFBRSxDQUFDO0FBQy9DO0FBRUEsU0FBUytQLElBQUlBLENBQUNGLEVBQUUsRUFBRTtFQUNoQkEsRUFBRSxDQUFDakwsY0FBYyxDQUFDLENBQUM7RUFDbkIsSUFBSW9MLElBQUksR0FBR0gsRUFBRSxDQUFDaFAsWUFBWSxDQUFDNkUsT0FBTyxDQUFDLE1BQU0sQ0FBQztFQUMxQ21LLEVBQUUsQ0FBQ3BQLE1BQU0sQ0FBQ3NCLFdBQVcsQ0FBQ2pELFFBQVEsQ0FBQ29DLGNBQWMsQ0FBQzhPLElBQUksQ0FBQyxDQUFDO0FBQ3RELEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXBQaWVjZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9jcmVhdGVHYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lTG9vcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25hdmlnYXRpb25Db21wb25lbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3M/ZTBmZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpO1xyXG5cclxubGV0IGRyYWdTdGFydFggPSAwO1xyXG5sZXQgc2hpcEhlYWRPZmZzZXRYID0gMDtcclxubGV0IGRyYWdEYXRhID0ge1xyXG4gICAgZHJhZ2dlZFNoaXA6IG51bGxcclxuICB9O1xyXG5cclxuZnVuY3Rpb24gYmF0dGxlc2hpcFBpZWNlcyAocGxheWVyKSB7XHJcbiAgICBcclxuICAgIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcGllY2VzQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwicGllY2VzQ29udGFpbmVyXCI7XHJcbiAgICBsZXQgYm94V2lkdGggPSA1MDtcclxuICAgIGxldCBib3hIZWlnaHQgPSA0ODtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuXHJcbiAgICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwic2hpcENvbnRhaW5lclwiO1xyXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBcInNoaXBOYW1lXCI7XHJcbiAgICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcblxyXG4gICAgICAgIGxldCBzaGlwUGllY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dhYmxlXCIpO1xyXG4gICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICBzaGlwUGllY2UuaWQgPSBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gKGJveFdpZHRoICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG4gICAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSAoYm94SGVpZ2h0KSArIFwicHhcIjtcclxuXHJcbiAgICAgICBcclxuIFxyXG4gICAgICAgIHNoaXBQaWVjZS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGlja2VkQm94T2Zmc2V0ID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIpO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogc2hpcEF0dHJpYnV0ZS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXQgIC8vIFRoaXMgdGVsbHMgdXMgaG93IGZhciBmcm9tIHRoZSBoZWFkIHRoZSB1c2VyIGNsaWNrZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgZHJhZ0RhdGEuZHJhZ2dlZFNoaXAgPSBzaGlwRGF0YTsgLy8gc3RvcmUgdGhlIGRhdGFcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShzaGlwRGF0YSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHNoaXBIZWFkJ3MgYm91bmRpbmcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBIZWFkUmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBQaWVjZVJlY3QgPSBzaGlwUGllY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFggPSBzaGlwSGVhZFJlY3QubGVmdCAtIHNoaXBQaWVjZVJlY3QubGVmdCArIChzaGlwSGVhZFJlY3Qud2lkdGggLyAyKTs7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBhZGp1c3QgdGhlIGRyYWcgaW1hZ2UncyBzdGFydGluZyBwb3NpdGlvblxyXG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHNoaXBQaWVjZSwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHNoaXBCb3guY2xhc3NOYW1lID0gXCJzaGlwYm94XCI7XHJcbiAgICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSAgYm94V2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgY2xpY2tlZDpcIiwgZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTsgLy8gc2V0IHRoZSBvZmZzZXQgb24gdGhlIHNoaXBQaWVjZSB3aGVuIGEgc2hpcEJveCBpcyBjbGlja2VkXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkgPT0gMCkgeyBcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7ICAvLyBNYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiLVwiICsgaTsgIC8vIE1ha2UgaXQgdW5pcXVlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5hcHBlbmRDaGlsZChzaGlwQm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XHJcbiAgICAgICAgcGllY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBDb250YWluZXIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG4vLyBVc2UgdGhlIHNpbXVsYXRlQ2xpY2tPbkRpdiBmdW5jdGlvbiBJIHByZXZpb3VzbHkgcHJvdmlkZWQ6XHJcbmZ1bmN0aW9uIHNpbXVsYXRlQ2xpY2tPbkRpdihlbGVtZW50LCB4LCB5KSB7XHJcbiAgICBjb25zdCBtb3VzZUV2ZW50SW5pdCA9IHtcclxuICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgIGNsaWVudFg6IHgsXHJcbiAgICAgICAgY2xpZW50WTogeVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGNsaWNrRXZlbnQgPSBuZXcgTW91c2VFdmVudCgnY2xpY2snLCBtb3VzZUV2ZW50SW5pdCk7XHJcbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSB7YmF0dGxlc2hpcFBpZWNlcywgZHJhZ1N0YXJ0WCwgc2hpcEhlYWRPZmZzZXRYLCBkcmFnRGF0YSB9OyIsImNvbnN0IHsgZHJhZ0RhdGEgfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5cclxuLy8gbGV0IGRyYWdnZWRTaGlwRGF0YSA9IG51bGw7ICAvLyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXHJcblxyXG5mdW5jdGlvbiBnZXRBZmZlY3RlZEJveGVzKGhlYWRQb3NpdGlvbiwgbGVuZ3RoLCBvcmllbnRhdGlvbikge1xyXG4gICAgY29uc3QgYm94ZXMgPSBbXTtcclxuICAgIGNvbnN0IGNoYXJQYXJ0ID0gaGVhZFBvc2l0aW9uWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGhlYWRQb3NpdGlvbi5zbGljZSgxKSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjaGFyUGFydCArIChudW1QYXJ0ICsgaSkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIGkpICsgbnVtUGFydCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm94ZXM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkUGxhY2VtZW50KGJveElkLCBsZW5ndGgsIG9mZnNldCwgb3JpZW50YXRpb24sIHBsYXllcikge1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBib3hJZFswXTtcclxuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3hJZC5zbGljZSgxKSk7XHJcblxyXG4gICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIG9mZnNldDtcclxuXHJcbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGFkanVzdGVkTnVtUGFydCA+IDAgJiYgYWRqdXN0ZWROdW1QYXJ0ICsgbGVuZ3RoIC0gMSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ID49IDAgJiYgY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ICsgbGVuZ3RoIDw9IHBsYXllci5nYW1lQm9hcmQuaGVpZ2h0O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmQocGxheWVyKSB7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgZGl2IGVsZW1lbnRzIGZvciBHYW1lIEJvYXJkXHJcbiAgICBsZXQgZ2FtZUJvYXJkQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRUb3BDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBhbHBoYUNvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBudW1lcmljQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIFxyXG4gICBcclxuICAgICAvLyBBc3NpZ25pbmcgY2xhc3NlcyB0byB0aGUgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgIGdhbWVCb2FyZENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lclwiO1xyXG4gICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciB0b3BcIjtcclxuICAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgYm90dG9tXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmlkID0gcGxheWVyLm5hbWU7IC8vIEFzc3VtaW5nIHRoZSBwbGF5ZXIgaXMgYSBzdHJpbmcgbGlrZSBcInBsYXllcjFcIlxyXG4gICAgIGFscGhhQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJhbHBoYUNvb3JkaW5hdGVzXCI7XHJcbiAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwibnVtZXJpY0Nvb3JkaW5hdGVzXCI7XHJcblxyXG4gICAgIC8vIENyZWF0ZSBjb2x1bW4gdGl0bGVzIGVxdWFsIHRvIHdpZHRoIG9mIGJvYXJkXHJcbiAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb2x1bW5UaXRsZS50ZXh0Q29udGVudCA9IGk7XHJcbiAgICAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmFwcGVuZENoaWxkKGNvbHVtblRpdGxlKTtcclxuICAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmFwcGVuZENoaWxkKG51bWVyaWNDb29yZGluYXRlcyk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgcm93cyBhbmQgcm93IHRpdGxlcyBlcXVhbCB0byBoZWlnaHRcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7IGkrKykge1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpICsgNjUpO1xyXG5cclxuICAgICAgICBsZXQgcm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvd1RpdGxlLnRleHRDb250ZW50ID0gYWxwaGFDaGFyO1xyXG4gICAgICAgIGFscGhhQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQocm93VGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuICAgICAgICByb3cuaWQgPSBhbHBoYUNoYXI7XHJcblxyXG4gICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgbGV0IHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFtdO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIGNvb3JkaW5hdGUgY29sdW1ucyBmb3IgZWFjaCByb3dcclxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBqKyspIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XHJcbiAgICAgICAgICAgIGJveC5pZCA9IGFscGhhQ2hhciArIGpcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gZHJhZ0RhdGEuZHJhZ2dlZFNoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2hpcERhdGEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoaXBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTaGlwIGRhdGEgaXMgbnVsbCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgb3V0IGlmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkUGxhY2VtZW50ID0gaXNWYWxpZFBsYWNlbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEubGVuZ3RoLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEub2Zmc2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJIb3Jpem9udGFsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJIb3Jpem9udGFsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhZmZlY3RlZEJveGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJldmlvdXNBZmZlY3RlZEJveGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5kcmFnQWZmZWN0ZWQgPSBcInRydWVcIjsgLy8gQWRkIHRoaXMgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTsgLy8gZGVsYXkgb2YgMCBtcywganVzdCBlbm91Z2ggdG8gbGV0IGRyYWdsZWF2ZSBoYXBwZW4gZmlyc3QgaWYgaXQncyBnb2luZyB0b1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3hbZGF0YS1kcmFnLWFmZmVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMuZm9yRWFjaChwcmV2Qm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKTsgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgdGhlIGNoYXJhY3RlciBhbmQgbnVtZXJpYyBwYXJ0cyBvZiB0aGUgYm94IElEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGJveC5pZFswXTsgIC8vIEFzc3VtaW5nIHRoZSBmb3JtYXQgaXMgYWx3YXlzIGxpa2UgXCJBNVwiXHJcbiAgICAgICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94LmlkLnNsaWNlKDEpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFkanVzdGVkIHBvc2l0aW9uIGJhc2VkIG9uIHdoZXJlIHRoZSB1c2VyIGNsaWNrZWQgb24gdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBzaGlwRGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzaGlwRGF0YS5vZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWRqdXN0ZWROdW1QYXJ0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhd0RhdGEgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEcm9wcGVkIGRhdGE6XCIsIHJhd0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxhY2VtZW50IGlzIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChhZGp1c3RlZE51bVBhcnQgPD0gMCB8fCBhZGp1c3RlZE51bVBhcnQgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gcGxheWVyLmdhbWVCb2FyZC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkVGFyZ2V0UG9zaXRpb24gPSBjaGFyUGFydCArIGFkanVzdGVkTnVtUGFydDsgIC8vIFRoZSBuZXcgcG9zaXRpb24gZm9yIHRoZSBoZWFkIG9mIHRoZSBzaGlwXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gcGxhY2UgJHtzaGlwRGF0YS5uYW1lfSB3aXRoIGxlbmd0aCAke3NoaXBEYXRhLmxlbmd0aH0gYXQgcG9zaXRpb24gJHthZGp1c3RlZFRhcmdldFBvc2l0aW9ufS5gKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSB5b3VyIHNoaXAgYmFzZWQgb24gYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiBhcyB0aGUgaGVhZCdzIHBvc2l0aW9uLCB1c2luZyB5b3VyIGV4aXN0aW5nIGxvZ2ljIG9yIG1ldGhvZHNcclxuICAgICAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5uYW1lLCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwT3JpZW50YXRpb24pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGhpZ2hsaWdodFxyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzQm94ZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQm94ZXMgPSBhZmZlY3RlZEJveGVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdhbWVCb2FyZC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChhbHBoYUNvb3JkaW5hdGVzKTtcclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG5cclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRUb3BDb21wb25lbnQpO1xyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCk7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lQm9hcmRDb21wb25lbnRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVHYW1lQm9hcmQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDEwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAxMDtcclxuICAgICAgICB0aGlzLm1pc3NDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlwID0ge1xyXG4gICAgICAgICAgICBDYXJyaWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NhcnJpZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0JhdHRsZXNoaXAnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDcnVpc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NydWlzZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTdWJtYXJpbmU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnU3VibWFyaW5lJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0Rlc3Ryb3llcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIGxldCBib2FyZCA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIlwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmQucHVzaChyb3cpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gVGhpcyBjb2RlIHJldHVybnMgdGhlIGNoYXIgdmFsdWUgYXMgYW4gaW50IHNvIGlmIGl0IGlzICdCJyAob3IgJ2InKSwgd2Ugd291bGQgZ2V0IHRoZSB2YWx1ZSA2NiAtIDY1ID0gMSwgZm9yIHRoZSBwdXJwb3NlIG9mIG91ciBhcnJheSBCIGlzIHJlcC4gYnkgYm9hcmRbMV0uXHJcbiAgICAgICAgY2hhclRvUm93SW5kZXgoY2hhcikge1xyXG4gICAgICAgICAgICBjaGFyID0gY2hhci50b1VwcGVyQ2FzZSgpOyAvLyBDb252ZXJ0IHRoZSBjaGFyYWN0ZXIgdG8gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBSZXR1cm5zIGFuIGludCBhcyBhIHN0ciB3aGVyZSBudW1iZXJzIGZyb20gMSB0byAxMCwgd2lsbCBiZSB1bmRlcnN0b29kIGZvciBhcnJheSBhY2Nlc3M6IGZyb20gMCB0byA5LlxyXG4gICAgICAgIHN0cmluZ1RvQ29sSW5kZXgoc3RyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChzdHIpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXRBdChhbGlhcywgc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxldHRlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gQyBcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmNoYXJUb1Jvd0luZGV4KGNoYXJQYXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvdXQgb2YgYm91bmRzIGxpa2UgSzkgb3IgQzE4XHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiA5IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9IHN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoZWNrQXQoYWxpYXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gRW5zdXJlIGluZGljZXMgYXJlIHZhbGlkXHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPj0gdGhpcy5oZWlnaHQgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID49IHRoaXMud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZSBhbGlhcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPT09IFwiSGl0XCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkhpdFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvY2N1cGllZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRCZWxvd0FsaWFzKGFsaWFzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFyUGFydCB0byB0aGUgbmV4dCBsZXR0ZXJcclxuICAgICAgICAgICAgY29uc3QgbmV4dENoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyAxKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBuZXh0Q2hhciArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYXJUb1Jvd0luZGV4KG5leHRDaGFyKSA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdyBiZWxvdyB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldFJpZ2h0QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGxldCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIG51bWJlciBieSAxXHJcbiAgICAgICAgICAgIG51bVBhcnQrKztcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBjaGFyUGFydCArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChudW1QYXJ0ID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGNvbHVtbiB0byB0aGUgcmlnaHQgb2YgdGhpcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHBsYWNlU2hpcChzaGlwTmFtZSwgc2hpcEhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcE1hcmtlciA9IFwiU2hpcFwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHNoaXBIZWFkQ29vcmRpbmF0ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZ2V0TmV4dENvb3JkaW5hdGUgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIlxyXG4gICAgICAgICAgICAgICAgPyBjb29yZGluYXRlID0+IHRoaXMuZ2V0QmVsb3dBbGlhcyhjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgOiBjb29yZGluYXRlID0+IHRoaXMuZ2V0UmlnaHRBbGlhcyhjb29yZGluYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tBdChjdXJyZW50Q29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID0gW107IC8vIENsZWFyIGFueSBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMucHVzaChjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBnZXROZXh0Q29vcmRpbmF0ZShjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIHNoaXBNYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBdChjb29yZGluYXRlKSA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaGl0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiSGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzQ291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIk1pc3NcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEFsbFNoaXBzVG9EZWFkKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZU92ZXIoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgIC8vIFJldHVybiBmYWxzZSBpZiBhbnkgc2hpcCBpcyBub3QgZGVhZC5cclxuICAgICAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwbGF5KCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciB3aXRoIGNvbHVtbiBudW1iZXJzXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBcIiAgICBcIjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgKz0gaSArIFwiIFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlYWRlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHJvdyBhbmQgcHJpbnQgdGhlbVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIiB8IFwiOyAvLyBDb252ZXJ0IHJvdyBpbmRleCB0byBBLUogYW5kIGFkZCB0aGUgc2VwYXJhdG9yXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGVhY2ggY2VsbCdzIHZhbHVlIGFuZCBkZWNpZGUgd2hhdCB0byBwcmludFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsVmFsdWUgPSB0aGlzLmJvYXJkW2ldW2pdO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlY2lkZSB0aGUgY2VsbCdzIGRpc3BsYXkgYmFzZWQgb24gaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNoaXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlMgXCI7IC8vIFMgZm9yIFNoaXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSGl0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJYIFwiOyAvLyBYIGZvciBIaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWlzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiTSBcIjsgLy8gTSBmb3IgTWlzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCItIFwiOyAvLyAtIGZvciBFbXB0eSBDZWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3dTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lSWQsIHBsYXllck5hbWUpIHtcclxuICAgICAgICB0aGlzLmdhbWVJZCA9IGdhbWVJZDtcclxuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKHBsYXllck5hbWUpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcbiAgICAgICAgdGhpcy5waGFzZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUTy1ETyBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpLCBwcm9tcHRVc2VyT3JpZW50YXRpb24oKSwgY2hlY2tXaW5uZXIoKTtcclxuXHJcbiAgICBwbGFjZVBsYXllclNoaXBzKHNoaXBOYW1lKSB7XHJcbiAgICAgICAgd2hpbGUgKHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyBQcm9tcHQgVXNlciBmb3Igc2hpcEhlYWRDb29yZGluYXRlXHJcbiAgICAgICAgICAgIGxldCB1c2VyQ29vcmRpbmF0ZSA9IHByb21wdFVzZXJDb29yZGluYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB1c2VyU2hpcE9yaWVudGF0aW9uID0gcHJvbXB0VXNlck9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIXBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCB1c2VyQ29vcmRpbmF0ZSwgdXNlclNoaXBPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIHVzZXJDb29yZGluYXRlID0gcHJvbXB0VXNlckNvb3JkaW5hdGUoKTtcclxuICAgICAgICAgICAgICAgIHVzZXJTaGlwT3JpZW50YXRpb24gPSBwcm9tcHRVc2VyT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwbGFjZUNvbXB1dGVyU2hpcChzaGlwTmFtZSkge1xyXG4gICAgICAgIHdoaWxlIChjb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIGNvbXB1dGVyQ29vcmRpbmF0ZSwgY29tcHV0ZXJPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50aWFsaXplR2FtZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCJcclxuICAgICAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XHJcbiAgICAgICAgLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2hpcCBvZiBzaGlwVHlwZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZVBsYXllclNoaXBzKHNoaXApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlQ29tcHV0ZXJTaGlwKHNoaXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5VHVybigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZE1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHBsYXllck1vdmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9tcHQgdXNlciBmb3IgY29vcmRpbmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9tcHQgPSBcIkExXCI7IC8vIEhlcmUgeW91IG1pZ2h0IHdhbnQgdG8gZ2V0IGFjdHVhbCBpbnB1dCBmcm9tIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhwcm9tcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTsgLy8gT3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gcHJvbXB0IHRoZSB1c2VyIHdpdGggYSBtZXNzYWdlIHRvIGVudGVyIGEgbmV3IGNvb3JkaW5hdGUuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuICAgICAgICAgICAgbGV0IHR1cm5WYWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyIC0gMSArIDEpKSArIDE7XHJcbiAgICAgICAgICAgIGlmICh0dXJuVmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDb21wdXRlciBXaW5zXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGF5ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgd2hpbGUoIWNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcblxyXG4vLyAvLyBHZXQgcGxheWVyIG5hbWVcclxuLy8gbGV0IG5hbWUgPSBcInBsYXllcjFcIlxyXG5cclxuLy8gLy8gQ3JlYXRlIHBsYXllcnNcclxuLy8gbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIobmFtZSk7XHJcbi8vIGxldCBjb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuXHJcbi8vIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuLy8gICAgIC8vIFwiQ2FycmllclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNhcnJpZXJcIiwgXCJFNVwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDYXJyaWVyXCIsIFwiQTFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJCYXR0bGVzaGlwXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQmF0dGxlc2hpcFwiLCBcIko3XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkJhdHRsZXNoaXBcIiwgXCJCMTBcIiwgXCJWZXJ0aWNhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiQ3J1aXNlclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNydWlzZXJcIiwgXCJBOFwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDcnVpc2VyXCIsIFwiRjFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJTdWJtYXJpbmVcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJTdWJtYXJpbmVcIiwgXCJEMVwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJTdWJtYXJpbmVcIiwgXCJIMTBcIiwgXCJWZXJ0aWNhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiRGVzdHJveWVyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiRGVzdHJveWVyXCIsIFwiQjJcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiRGVzdHJveWVyXCIsIFwiSjFcIiwgXCJIb3Jpem9udGFsXCIpXHJcblxyXG4vLyAgICAgLy8gcGxheWVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG5cclxuLy8gLy8gQXR0YWNrIHBoYXNlIFxyXG5cclxuLy8gICAgIC8vIFBsYXllciBhdHRhY2sgcGhhc2VcclxuLy8gICAgIGxldCBwbGF5ZXJNb3ZlID0gcGxheWVyLm1ha2VBdHRhY2soXCJBMVwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcblxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuXHJcbi8vICAgICAvLyBDb21wdXRlciBhdHRhY2sgcGhhc2VcclxuLy8gICAgIGxldCBjb21wdXRlckNob2ljZSA9IGNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuLy8gICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcblxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZU5hdlVpICgpIHtcclxuICAgIGxldCBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHBsYXllck5hbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5jbGFzc05hbWUgPSBcInBsYXllck5hbWVDb250YWluZXJcIjtcclxuICAgIGxldCBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyXCI7XHJcbiAgICBsZXQgc3RhcnRCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBwbGF5ZXJOYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIkVudGVyIHlvdXIgbmFtZTpcIjtcclxuICAgIHBsYXllck5hbWVMYWJlbC5odG1sRm9yID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcclxuICAgIHBsYXllck5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUxhYmVsKTtcclxuXHJcbiAgICBsZXQgcGxheWVySW5wdXROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcGxheWVySW5wdXROYW1lLmNsYXNzTmFtZSA9IFwicGxheWVySW5wdXROYW1lXCI7XHJcbiAgICBwbGF5ZXJJbnB1dE5hbWUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHBsYXllcklucHV0TmFtZS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChpbnB1dFZhbHVlID09PSBcImNvbXB1dGVyXCIgfHwgaW5wdXRWYWx1ZSA9PT0gXCJhaVwiKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdUaGUgbmFtZSBjYW5ub3QgYmUgXCJjb21wdXRlclwiIG9yIFwiYWlcIi4nKTtcclxuICAgICAgICAgICAgcGxheWVySW5wdXROYW1lLnZhbHVlID0gJyc7IC8vIENsZWFyIHRoZSBpbnB1dCBmaWVsZFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHBsYXllck5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVySW5wdXROYW1lKTtcclxuXHJcbiAgICBsZXQgZWFzeVJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgZWFzeVJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICBlYXN5UmFkaW8ubmFtZSA9IFwiZGlmZmljdWx0eVwiO1xyXG4gICAgZWFzeVJhZGlvLnZhbHVlID0gXCJlYXN5XCI7XHJcbiAgICBlYXN5UmFkaW8uaWQgPSBcImVhc3lcIjtcclxuICAgIGxldCBlYXN5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBlYXN5TGFiZWwuaHRtbEZvciA9IFwiZWFzeVwiO1xyXG4gICAgZWFzeUxhYmVsLnRleHRDb250ZW50ID0gXCJFYXN5XCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWFzeVJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChlYXN5TGFiZWwpO1xyXG5cclxuICAgIC8vIFJhZGlvIGJ1dHRvbiBmb3IgaGFyZCBkaWZmaWN1bHR5XHJcbiAgICBsZXQgaGFyZFJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaGFyZFJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICBoYXJkUmFkaW8ubmFtZSA9IFwiZGlmZmljdWx0eVwiO1xyXG4gICAgaGFyZFJhZGlvLnZhbHVlID0gXCJoYXJkXCI7XHJcbiAgICBoYXJkUmFkaW8uaWQgPSBcImhhcmRcIjtcclxuICAgIGxldCBoYXJkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBoYXJkTGFiZWwuaHRtbEZvciA9IFwiaGFyZFwiO1xyXG4gICAgaGFyZExhYmVsLnRleHRDb250ZW50ID0gXCJIYXJkXCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZFJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkTGFiZWwpO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJ1dHRvblxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XHJcbiAgICBzdGFydEJ1dHRvbi5pZCA9IFwiaW5pdFN0YXJ0QnV0dG9uXCI7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXJzIHRvIHRoZSBtYWluIGNvbnRhaW5lclxyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVDb250YWluZXIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRCdXR0b25Db250YWluZXIpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU5hdlVpOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL2dhbWVCb2FyZFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLkFpID0gdGhpcy5pc0FpKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBjYXBpdGFsaXplRmlyc3Qoc3RyKSB7XHJcbiAgICAgICAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUF0dGFjayhjb29yZGluYXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpICYmICF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vdmUgaXMgYWxyZWFkeSBtYWRlXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBaShuYW1lKSB7XHJcbiAgICAgICAgbGV0IGNoZWNrID0gdGhpcy5jYXBpdGFsaXplRmlyc3QobmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrID09IFwiQ29tcHV0ZXJcIiB8fCBjaGVjayA9PSBcIkFpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEFsbFBvc3NpYmxlTW92ZXMoKSB7XHJcbiAgICAgICAgbGV0IGFsbE1vdmVzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgY29sdW1uTnVtYmVyID0gMDsgY29sdW1uTnVtYmVyIDwgdGhpcy5nYW1lQm9hcmQud2lkdGg7IGNvbHVtbk51bWJlcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvd051bWJlciA9IDE7IHJvd051bWJlciA8PSB0aGlzLmdhbWVCb2FyZC5oZWlnaHQ7IHJvd051bWJlcisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQWxpYXMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbk51bWJlciArIDY1KTtcclxuICAgICAgICAgICAgICAgIGFsbE1vdmVzLnB1c2goY29sdW1uQWxpYXMgKyByb3dOdW1iZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxNb3ZlcztcclxuICAgIH1cclxuXHJcbiAgICBlYXN5QWlNb3ZlcygpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY2VzcyB0byBlYXN5QWlNb3ZlcyBpcyByZXN0cmljdGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzZXQgb2YgYWxsIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCBhbGxQb3NzaWJsZU1vdmVzID0gdGhpcy5nZXRBbGxQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCB1bnBsYXllZE1vdmVzID0gYWxsUG9zc2libGVNb3Zlcy5maWx0ZXIobW92ZSA9PiAhdGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhtb3ZlKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdW5wbGF5ZWQgbW92ZXMgbGVmdCwgcmFpc2UgYW4gZXJyb3Igb3IgaGFuZGxlIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGlmICh1bnBsYXllZE1vdmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxsIG1vdmVzIGhhdmUgYmVlbiBwbGF5ZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSYW5kb21seSBzZWxlY3QgYSBtb3ZlIGZyb20gdGhlIHNldCBvZiB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSB0aGlzLmdldFJhbmRvbUludCgwLCB1bnBsYXllZE1vdmVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgbW92ZSA9IHVucGxheWVkTW92ZXNbcmFuZG9tSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKG1vdmUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgYWlTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJIb3Jpem9udGFsXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVmVydGljYWxcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsIlxyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwVHlwZXMgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXHJcbiAgICAgICAgICAgIENydWlzZXI6IDMsXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZW5ndGgobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3VuaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRDb3VudCA9PSB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XHJcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaXRDb3VudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xyXG59XHJcblxyXG4ucGllY2VzQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XHJcbn1cclxuXHJcbi5zaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDUwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbn1cclxuXHJcbi5zaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xyXG59XHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyID4gaW5wdXQge1xyXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxTaGlwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG59XHJcblxyXG4udmVydGljYWxTaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XHJcbn1cclxuXHJcblxyXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcclxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vYmF0dGxlc2hpcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLFlBQVk7SUFDWixlQUFlO0FBQ25COztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixVQUFVO0lBQ1YsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsVUFBVTtJQUNWLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsWUFBWTtJQUNaLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixZQUFZO0lBQ1osVUFBVTtJQUNWLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtJQUN2QixXQUFXO0lBQ1gsVUFBVTtBQUNkOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsVUFBVTtJQUNWLFlBQVk7SUFDWiw0QkFBNEI7SUFDNUIsb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixZQUFZO0FBQ2hCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsVUFBVTtBQUNkOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDhCQUE4QjtJQUM5QixlQUFlO0lBQ2YsZUFBZTtJQUNmLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDhCQUE4QjtJQUM5QixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsZUFBZTtJQUNmLG1CQUFtQjtJQUNuQixvQkFBb0I7QUFDeEI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLHdCQUF3QjtBQUM1Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixXQUFXO0lBQ1gsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksaUJBQWlCO0lBQ2pCLHNCQUFzQjtJQUN0QixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsdUJBQXVCO0lBQ3ZCLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLFVBQVU7SUFDVix1QkFBdUI7SUFDdkIsNEJBQTRCO0FBQ2hDOztBQUVBO0lBQ0ksb0NBQW9DLEVBQUUsOENBQThDO0FBQ3hGOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsVUFBVTtJQUNWLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsWUFBWTtJQUNaLFdBQVc7SUFDWCxtQkFBbUI7SUFDbkIsOEJBQThCO0lBQzlCLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksdUJBQXVCO0lBQ3ZCLHNDQUFzQztJQUN0QyxZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7O0FBRXZCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7QUFDdkU7O0FBRUE7SUFDSSxlQUFlO0lBQ2Ysa0JBQWtCO0FBQ3RCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUhlYWRlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDE1JTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4jYmF0dGxlc2hpcFRpdGxlIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgaGVpZ2h0OiA3MCU7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLXRvcDogM2VtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW4tTGVmdCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiA4MCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGhlaWdodDogOTAlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XFxyXFxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogNTAwcHg7XFxyXFxuICAgIHdpZHRoOiA1MDBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnJvdywgLnNoaXAge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5zaGlwIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmJveCB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmJveDpob3ZlciB7XFxyXFxuICAgIHdpZHRoOiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uaGlnaGxpZ2h0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxyXFxufVxcclxcblxcclxcbi5waWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcGJveCB7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDIwMHB4O1xcclxcbiAgICB3aWR0aDogMjAwcHg7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyTmFtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIFxcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyTmFtZUNvbnRhaW5lciA+IGlucHV0IHtcXHJcXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxcclxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFN0YXJ0QnV0dG9uIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlTmF2VWkgPSByZXF1aXJlKCcuL25hdmlnYXRpb25Db21wb25lbnRzJyk7XHJcbmltcG9ydCAnLi9iYXR0bGVzaGlwLmNzcyc7XHJcblxyXG4vLyBTdHJpbmcgdG8gZ2VuZXJhdGUgZ2FtZSBJRFxyXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpIHtcclxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVWZXJ0aWNhbFBpZWNlc0NvbnRhaW5lcihwbGF5ZXIpIHtcclxuICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gXCJ2ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lclwiO1xyXG4gIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gIGxldCBib3hIZWlnaHQgPSA0ODtcclxuXHJcbiAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcclxuICAgICAgXHJcbiAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc2hpcENvbnRhaW5lci5jbGFzc05hbWUgPSBcInZlcnRpY2FsU2hpcENvbnRhaW5lclwiO1xyXG5cclxuICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBcInZlcnRpY2FsU2hpcE5hbWVcIjtcclxuICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcblxyXG4gICAgICBsZXQgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbERyYWdnYWJsZVwiKTtcclxuICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJ2ZXJ0aWNhbFNoaXBcIik7XHJcbiAgICAgIHNoaXBQaWVjZS5pZCA9IFwidmVydGljYWxcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gYm94V2lkdGggKyBcInB4XCI7XHJcbiAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG5cclxuICAgICAgXHJcbiAgICAgIHNoaXBQaWVjZS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XHJcbiAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiBzaGlwQXR0cmlidXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXQgIC8vIFRoaXMgdGVsbHMgdXMgaG93IGZhciBmcm9tIHRoZSBoZWFkIHRoZSB1c2VyIGNsaWNrZWRcclxuICAgICAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICAgICAgZHJhZ0RhdGEuZHJhZ2dlZFNoaXAgPSBzaGlwRGF0YTsgLy8gc3RvcmUgdGhlIGRhdGFcclxuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcclxuICAgICAgXHJcbiAgICAgICAgICAvLyBnZXQgdGhlIHNoaXBIZWFkJ3MgYm91bmRpbmcgcmVjdGFuZ2xlXHJcbiAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgXHJcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG9mZnNldFxyXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpOztcclxuICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICBcclxuICAgICAgICAgIC8vIGFkanVzdCB0aGUgZHJhZyBpbWFnZSdzIHN0YXJ0aW5nIHBvc2l0aW9uXHJcbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHNoaXBQaWVjZSwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSAgYm94V2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWxlbWVudCBjbGlja2VkOlwiLCBldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTsgLy8gc2V0IHRoZSBvZmZzZXQgb24gdGhlIHNoaXBQaWVjZSB3aGVuIGEgc2hpcEJveCBpcyBjbGlja2VkXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoaSA9PSAwKSB7IFxyXG4gICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7ICAvLyBNYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpOyAgLy8gTWFrZSBpdCB1bmlxdWVcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xyXG4gICAgICBwaWVjZXNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcENvbnRhaW5lcik7XHJcblxyXG4gIH1cclxuICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5cclxuXHJcbmxldCBnYW1lSW5pdCA9IGNyZWF0ZU5hdlVpKCk7XHJcblxyXG5sZXQgcGxheWVyMSA9IG5ldyBQbGF5ZXI7XHJcblxyXG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGdlbmVyYXRlUmFuZG9tU3RyaW5nKCksIHBsYXllcjEpXHJcblxyXG5sZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcclxuXHJcbmxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmxlZnRHYW1lU2NyZWVuLmNsYXNzTmFtZT1cImdhbWVTY3JlZW4tTGVmdFwiXHJcblxyXG5sZXQgY3VycmVudFNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uY2xhc3NOYW1lID0gXCJjdXJyZW50U2hpcE9yaWVudGF0aW9uXCI7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uaW5uZXJUZXh0ID0gXCJDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6IEhvcml6b250YWxcIlxyXG5cclxuXHJcbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbnNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xyXG5zaGlwUG9zaXRpb25Td2l0Y2hlci5pbm5lclRleHQgPSBcIlN3aXRjaCBPcmllbnRhdGlvblwiXHJcblxyXG5cclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChsZWZ0R2FtZVNjcmVlbik7XHJcblxyXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUucGxheWVyMSk7XHJcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllcjEpO1xyXG5sZXQgYm9hcmQyID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUuY29tcHV0ZXIpO1xyXG5cclxubGV0IHZlcnRpY2FsUGllY2VzID0gY3JlYXRlVmVydGljYWxQaWVjZXNDb250YWluZXIocGxheWVyMSk7XHJcblxyXG4vLyBsZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZCh2ZXJ0aWNhbFBpZWNlcyk7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKGN1cnJlbnRTaGlwT3JpZW50YXRpb24pO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChzaGlwUG9zaXRpb25Td2l0Y2hlcik7XHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoYm9hcmQxKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChnYW1lSW5pdCk7XHJcbi8vIGdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoYm9hcmQyKTtcclxuXHJcbmZ1bmN0aW9uIGFsbG93RHJvcChldikge1xyXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZHJhZyhldikge1xyXG4gICAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0XCIsIGV2LnRhcmdldC5pZCk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGRyb3AoZXYpIHtcclxuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKTtcclxuICAgIGV2LnRhcmdldC5hcHBlbmRDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKSk7XHJcbiAgfSJdLCJuYW1lcyI6WyJQbGF5ZXIiLCJyZXF1aXJlIiwiZHJhZ1N0YXJ0WCIsInNoaXBIZWFkT2Zmc2V0WCIsImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJzaGlwUGllY2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJpZCIsInN0eWxlIiwid2lkdGgiLCJsZW5ndGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94IiwiY29uc29sZSIsImxvZyIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwic2ltdWxhdGVDbGlja09uRGl2IiwiZWxlbWVudCIsIngiLCJ5IiwibW91c2VFdmVudEluaXQiLCJidWJibGVzIiwiY2xpZW50WCIsImNsaWVudFkiLCJjbGlja0V2ZW50IiwiTW91c2VFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJtb2R1bGUiLCJleHBvcnRzIiwiX3JlcXVpcmUiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwib3JpZW50YXRpb24iLCJib3hlcyIsImNoYXJQYXJ0IiwibnVtUGFydCIsInBhcnNlSW50Iiwic2xpY2UiLCJwdXNoIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiY2hhckNvZGVBdCIsImlzVmFsaWRQbGFjZW1lbnQiLCJib3hJZCIsImFkanVzdGVkTnVtUGFydCIsImNyZWF0ZUdhbWVCb2FyZCIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJlcnJvciIsInZhbGlkUGxhY2VtZW50IiwiZm9yRWFjaCIsImRhdGFzZXQiLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwicGFyc2UiLCJnZXREYXRhIiwicmF3RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJjb25jYXQiLCJwcmV2aW91c0JveGVzIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsImNvb3JkaW5hdGVzIiwiQmF0dGxlc2hpcCIsIkNydWlzZXIiLCJTdWJtYXJpbmUiLCJEZXN0cm95ZXIiLCJib2FyZCIsInN0YXJ0R2FtZSIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiY2hhclRvUm93SW5kZXgiLCJjaGFyIiwidG9VcHBlckNhc2UiLCJzdHJpbmdUb0NvbEluZGV4Iiwic3RyIiwic2V0QXQiLCJhbGlhcyIsInN0cmluZyIsImNoYXJBdCIsInN1YnN0cmluZyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJjaGVja0F0IiwiRXJyb3IiLCJnZXRCZWxvd0FsaWFzIiwibmV4dENoYXIiLCJuZXdBbGlhcyIsImdldFJpZ2h0QWxpYXMiLCJwbGFjZVNoaXAiLCJzaGlwSGVhZENvb3JkaW5hdGUiLCJzaGlwT3JpZW50YXRpb24iLCJfdGhpcyIsInNoaXBNYXJrZXIiLCJzaGlwTGVuZ3RoIiwiY3VycmVudENvb3JkaW5hdGUiLCJnZXROZXh0Q29vcmRpbmF0ZSIsImNvb3JkaW5hdGUiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwiZXJyIiwiZSIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsIkdhbWUiLCJnYW1lSWQiLCJwbGF5ZXJOYW1lIiwicGxheWVyMSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY3VycmVudFN0YXRlIiwiY3VycmVudFR1cm4iLCJwbGFjZVBsYXllclNoaXBzIiwidXNlckNvb3JkaW5hdGUiLCJwcm9tcHRVc2VyQ29vcmRpbmF0ZSIsInVzZXJTaGlwT3JpZW50YXRpb24iLCJwcm9tcHRVc2VyT3JpZW50YXRpb24iLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsInNoaXBUeXBlcyIsIl9pIiwiX3NoaXBUeXBlcyIsInN0YXJ0IiwicGxheVR1cm4iLCJpc1ZhbGlkTW92ZSIsInBsYXllck1vdmUiLCJwcm9tcHQiLCJtYWtlQXR0YWNrIiwibWVzc2FnZSIsImNvbXB1dGVyQ2hvaWNlIiwiY29tcHV0ZXJNb3ZlIiwidXBkYXRlU3RhdGUiLCJ0dXJuVmFsdWUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGVja1dpbm5lciIsImNyZWF0ZU5hdlVpIiwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIiwicGxheWVyTmFtZUNvbnRhaW5lciIsImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciIsInN0YXJ0QnV0dG9uQ29udGFpbmVyIiwicGxheWVyTmFtZUxhYmVsIiwiaHRtbEZvciIsInBsYXllcklucHV0TmFtZSIsImlucHV0VmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImFsZXJ0IiwiZWFzeVJhZGlvIiwidHlwZSIsImVhc3lMYWJlbCIsImhhcmRSYWRpbyIsImhhcmRMYWJlbCIsInN0YXJ0QnV0dG9uIiwiQWkiLCJpc0FpIiwiY29tcGxldGVkTW92ZXMiLCJjYXBpdGFsaXplRmlyc3QiLCJjaGVjayIsImdldFJhbmRvbUludCIsIm1pbiIsIm1heCIsImdldEFsbFBvc3NpYmxlTW92ZXMiLCJhbGxNb3ZlcyIsImNvbHVtbk51bWJlciIsInJvd051bWJlciIsImNvbHVtbkFsaWFzIiwiYWxsUG9zc2libGVNb3ZlcyIsInVucGxheWVkTW92ZXMiLCJmaWx0ZXIiLCJtb3ZlIiwicmFuZG9tSW5kZXgiLCJpc1ZhbGlkIiwic2V0TGVuZ3RoIiwiaGl0Q291bnQiLCJjYXBpdGFsaXplZFNoaXBOYW1lIiwiaXNTdW5rIiwiZ2VuZXJhdGVSYW5kb21TdHJpbmciLCJjaGFyYWN0ZXJzIiwicmVzdWx0IiwiY3JlYXRlVmVydGljYWxQaWVjZXNDb250YWluZXIiLCJnYW1lSW5pdCIsIm5ld0dhbWUiLCJnYW1lU2NyZWVuIiwicXVlcnlTZWxlY3RvciIsImxlZnRHYW1lU2NyZWVuIiwiY3VycmVudFNoaXBPcmllbnRhdGlvbiIsImlubmVyVGV4dCIsInNoaXBQb3NpdGlvblN3aXRjaGVyIiwiYm9hcmQxIiwicGllY2VzIiwiYm9hcmQyIiwidmVydGljYWxQaWVjZXMiLCJhbGxvd0Ryb3AiLCJldiIsImRyYWciLCJkcm9wIiwiZGF0YSJdLCJzb3VyY2VSb290IjoiIn0=