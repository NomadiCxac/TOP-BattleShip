/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./battleshipPieces.js":
/*!*****************************!*\
  !*** ./battleshipPieces.js ***!
  \*****************************/
/***/ ((module) => {

var dragData = {
  draggedShip: null
};
function battleshipPieces(player, orientation) {
  var piecesContainer = document.createElement("div");
  var boxWidth = 50;
  var boxHeight = 48;
  var isVertical = orientation === "Vertical";
  piecesContainer.className = isVertical ? "verticalPiecesContainer" : "piecesContainer";
  var _loop = function _loop() {
    var shipAttribute = player.gameBoard.ship[shipName].instance;
    var shipContainer = document.createElement("div");
    shipContainer.className = isVertical ? "verticalShipContainer" : "shipContainer";
    var shipTitle = document.createElement("div");
    shipTitle.className = isVertical ? "verticalShipName" : "shipName";
    shipTitle.textContent = shipAttribute.name + ":";
    shipContainer.appendChild(shipTitle); // Add the shipTitle first 

    var shipPiece;
    if (player.gameBoard.ship[shipName].coordinates.length > 0) {
      var placedDiv = document.createElement("div");
      placedDiv.className = "placedText";
      placedDiv.textContent = "Placed";
      placedDiv.id = isVertical ? "vertical" : "horizontal";
      shipContainer.appendChild(placedDiv);
      shipContainer.style.justifyContent = "flex-start";
    } else {
      shipPiece = document.createElement("div");
      shipPiece.classList.add(isVertical ? "verticalDraggable" : "draggable");
      shipPiece.classList.add("ship");
      shipPiece.id = isVertical ? "vertical" + shipAttribute.name : shipAttribute.name;
      shipPiece.style.width = isVertical ? boxWidth + "px" : boxWidth * shipAttribute.length + "px";
      shipPiece.style.height = isVertical ? boxHeight * shipAttribute.length + "px" : boxHeight + "px";
      shipPiece.draggable = true;
      shipPiece.addEventListener('dragstart', function (event) {
        var clickedBoxOffset = event.target.getAttribute("data-offset");
        var shipData = {
          name: shipAttribute.name,
          length: shipAttribute.length,
          offset: clickedBoxOffset
        };
        dragData.draggedShip = shipData;
        event.dataTransfer.setData('application/json', JSON.stringify(shipData));
        var shipHeadRect = document.getElementById("shipHead" + shipAttribute.name).getBoundingClientRect();
        var shipPieceRect = shipPiece.getBoundingClientRect();
        var offsetX = shipHeadRect.left - shipPieceRect.left + shipHeadRect.width / 2;
        var offsetY = shipHeadRect.top - shipPieceRect.top + shipHeadRect.height / 2;
        event.dataTransfer.setDragImage(shipPiece, offsetX, offsetY);
      });
      for (var i = 0; i < shipAttribute.length; i++) {
        var shipBox = document.createElement("div");
        shipBox.className = "shipbox";
        shipBox.style.width = boxWidth + "px";
        shipBox.addEventListener('mousedown', function (event) {
          console.log("Element clicked:", event.target);
          shipPiece.setAttribute("data-offset", 0);
        });
        if (i == 0) {
          shipBox.id = "shipHead" + shipAttribute.name;
        } else {
          shipBox.id = shipAttribute.name + "-" + i;
        }
        shipPiece.appendChild(shipBox);
      }
      shipContainer.appendChild(shipTitle);
      shipContainer.appendChild(shipPiece);
    }
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
function getCurrentShipOrientation() {
  var shipOrientationElement = document.querySelector("div[data-ship-orientation]");
  return shipOrientationElement ? shipOrientationElement.dataset.shipOrientation : "Horizontal";
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
          var shipOrientation = getCurrentShipOrientation();
          if (!shipData) {
            console.error("Ship data is null!");
            return;
          }

          // Find out if the ship can be placed here
          var validPlacement = isValidPlacement(box.id, shipData.length, shipData.offset, shipOrientation, player);
          if (validPlacement) {
            affectedBoxes = getAffectedBoxes(box.id, shipData.length, shipOrientation);
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
        var shipOrientation = getCurrentShipOrientation();
        var lowerLetterBound = 65;
        var upperLetterBound = 74;
        var charPart = box.id[0]; // Assuming the format is always like "A5"
        var numPart = parseInt(box.id.slice(1));
        var shipData = JSON.parse(event.dataTransfer.getData('application/json'));
        var adjustedNumPart = numPart - shipData.offset;
        var adjustedTargetPosition = charPart + adjustedNumPart; // The new position for the head of the ship
        var affectedBoxes = getAffectedBoxes(adjustedTargetPosition, shipData.length, shipOrientation);

        // Calculate the adjusted position based on where the user clicked on the ship
        var headCoordinate = charPart + numPart;
        var selectedChar = charPart.charCodeAt();

        // Check if the placement is out of bounds
        if (shipOrientation == "Horizontal" && (adjustedNumPart <= 0 || adjustedNumPart + shipData.length - 1 > player.gameBoard.width)) {
          console.error("Invalid ship placement: Out of bounds.");
          box.classList.remove('highlight');
          return;
        } else if (shipOrientation == "Vertical" && (selectedChar + shipData.length < lowerLetterBound || selectedChar + shipData.length - 1 > upperLetterBound)) {
          console.error("Invalid ship placement: Out of bounds.");
          box.classList.remove('highlight');
          return;
        } else if (player.gameBoard.placeShip(shipData.name, headCoordinate, shipOrientation) == false) {
          console.error("Invalid ship placement: Overlapping Ship.");
          affectedBoxes.forEach(function (box) {
            box.classList.remove('highlight');
          });
          return;
        } else {
          affectedBoxes.forEach(function (box) {
            box.classList.remove('highlight');
            box.removeAttribute('data-drag-affected');
            box.classList.add('placed');
            box.dataset.hitMarker = "false";
            box.dataset.ship = shipData.name;
          });
        }
        var isVertical = shipOrientation === "Vertical";
        var shipElement;

        // console.log(`Attempting to place ${shipData.name} with length ${shipData.length} at position ${adjustedTargetPosition}.`);

        if (shipOrientation == "Horizontal") {
          shipElement = document.querySelector("div#".concat(shipData.name, ".draggable.ship"));
        }
        if (shipOrientation == "Vertical") {
          shipElement = document.querySelector("div#vertical".concat(shipData.name, ".verticalDraggable.ship"));
        }
        var parentElement = shipElement.parentElement;
        shipElement.remove();
        var placedDiv = document.createElement("div");
        placedDiv.className = "placedText";
        placedDiv.textContent = "Placed";
        placedDiv.id = isVertical ? "vertical" : "horizontal";

        // Append the new div to the parent element
        parentElement.appendChild(placedDiv);
        parentElement.style.justifyContent = "flex-start";
        var shipObjectName = shipData.name;
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
    key: "checkPlayerReadyGameState",
    value: function checkPlayerReadyGameState() {
      var gameReady = false;
      var shipTypes = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];

      // if (this.currentState != "Game Set-Up") {
      //     return gameReady;
      // }

      for (var ship in this.player1.Gameboard.ship[shipTypes]) {
        console.log(ship);
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
var game = new Game(null, "player");
game.checkPlayerReadyGameState();

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

/***/ "./positionSwitcher.js":
/*!*****************************!*\
  !*** ./positionSwitcher.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(/*! ./battleshipPieces */ "./battleshipPieces.js"),
  battleshipPieces = _require.battleshipPieces;
function createShipPositionSwitcher(player) {
  var shipPositionSwitcher = document.createElement("button");
  shipPositionSwitcher.className = "shipPositionSwitcher";
  shipPositionSwitcher.innerText = "Switch Orientation";
  shipPositionSwitcher.addEventListener("click", function () {
    var shipOrientation = document.querySelector(".currentShipOrientation");
    var leftGameScreen = document.querySelector(".gameScreen-Left");
    if (shipOrientation.dataset.shipOrientation == "Horizontal") {
      shipOrientation.dataset.shipOrientation = "Vertical";
      var updatedVertBoard = battleshipPieces(player, "Vertical");
      console.log(player.gameBoard.ship);
      leftGameScreen.removeChild(leftGameScreen.firstChild);
      leftGameScreen.insertBefore(updatedVertBoard, leftGameScreen.firstChild);
    } else {
      shipOrientation.dataset.shipOrientation = "Horizontal";
      var updatedHorBoard = battleshipPieces(player, "Horizontal");
      console.log(player.gameBoard.ship);
      leftGameScreen.removeChild(leftGameScreen.firstChild);
      leftGameScreen.insertBefore(updatedHorBoard, leftGameScreen.firstChild);
    }
    shipOrientation.innerText = "Current Ship Position is: ".concat(shipOrientation.dataset.shipOrientation);
  });
  return shipPositionSwitcher;
}
module.exports = createShipPositionSwitcher;

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

.placedText {
    display: flex;
    color: greenyellow;
}

.placedText#horizontal {
    font-size: x-large;
    margin-left: 1.5em;
}

.placedText#vertical {
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: large;
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

.verticalDraggable {
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
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.placed {\r\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.placedText {\r\n    display: flex;\r\n    color: greenyellow;\r\n}\r\n\r\n.placedText#horizontal {\r\n    font-size: x-large;\r\n    margin-left: 1.5em;\r\n}\r\n\r\n.placedText#vertical {\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 100%;\r\n    font-size: large;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n}\r\n\r\n.playerNameContainer > input {\r\n    height: 50%;    \r\n    margin-top: 0.5em;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 1em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 1em;\r\n}\r\n\r\n#initStartButton {\r\n    background-color: grey;\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalDraggable {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}"],"sourceRoot":""}]);
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
var Game = __webpack_require__(/*! ./gameLoop */ "./gameLoop.js");
var _require = __webpack_require__(/*! ./battleshipPieces */ "./battleshipPieces.js"),
  battleshipPieces = _require.battleshipPieces;
var createGameBoard = __webpack_require__(/*! ./createGameBoard */ "./createGameBoard.js");
var createNavUi = __webpack_require__(/*! ./navigationComponents */ "./navigationComponents.js");
var createShipPositionSwitcher = __webpack_require__(/*! ./positionSwitcher */ "./positionSwitcher.js");


// String to generate game ID
function generateRandomString() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
var gameInit = createNavUi();
var newGame = new Game(generateRandomString(), "user");
var gameScreen = document.querySelector(".gameScreenContainer");
var leftGameScreen = document.createElement("div");
leftGameScreen.className = "gameScreen-Left";
var currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal";
currentShipOrientation.innerText = "Current Ship Position is: ".concat(currentShipOrientation.dataset.shipOrientation);
gameScreen.appendChild(leftGameScreen);
var pieces = battleshipPieces(newGame.player1, "Horizontal");
leftGameScreen.appendChild(pieces);
var shipPositionSwitcher = createShipPositionSwitcher(newGame.player1);
var board1 = createGameBoard(newGame.player1, currentShipOrientation.dataset.shipOrientation);
var board2 = createGameBoard(newGame.computer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0FBZ0M2SixzQkFBc0IsQ0FBQ3BNLE9BQU8sQ0FBQ0MsZUFBZSxDQUFFO0FBQ2hIa00sVUFBVSxDQUFDOVAsV0FBVyxDQUFDOE8sY0FBYyxDQUFDO0FBRXRDLElBQUlrQixNQUFNLEdBQUdwUixnQkFBZ0IsQ0FBQ2lSLE9BQU8sQ0FBQ3RGLE9BQU8sRUFBRSxZQUFZLENBQUM7QUFDNUR1RSxjQUFjLENBQUM5TyxXQUFXLENBQUNnUSxNQUFNLENBQUM7QUFHbEMsSUFBSXBCLG9CQUFvQixHQUFHRCwwQkFBMEIsQ0FBQ2tCLE9BQU8sQ0FBQ3RGLE9BQU8sQ0FBQztBQUV0RSxJQUFJMEYsTUFBTSxHQUFHcE0sZUFBZSxDQUFDZ00sT0FBTyxDQUFDdEYsT0FBTyxFQUFFd0Ysc0JBQXNCLENBQUNwTSxPQUFPLENBQUNDLGVBQWUsQ0FBQztBQUU3RixJQUFJc00sTUFBTSxHQUFHck0sZUFBZSxDQUFDZ00sT0FBTyxDQUFDckYsUUFBUSxDQUFDO0FBRzlDc0UsY0FBYyxDQUFDOU8sV0FBVyxDQUFDZ1EsTUFBTSxDQUFDO0FBQ2xDO0FBQ0FsQixjQUFjLENBQUM5TyxXQUFXLENBQUMrUCxzQkFBc0IsQ0FBQztBQUNsRGpCLGNBQWMsQ0FBQzlPLFdBQVcsQ0FBQzRPLG9CQUFvQixDQUFDO0FBQ2hEa0IsVUFBVSxDQUFDOVAsV0FBVyxDQUFDaVEsTUFBTSxDQUFDO0FBQzlCSCxVQUFVLENBQUM5UCxXQUFXLENBQUM0UCxRQUFRLENBQUM7QUFDaEMsa0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXBQaWVjZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9jcmVhdGVHYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lTG9vcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25hdmlnYXRpb25Db21wb25lbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcG9zaXRpb25Td2l0Y2hlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzP2UwZmUiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRyYWdEYXRhID0ge1xyXG4gICAgZHJhZ2dlZFNoaXA6IG51bGxcclxufTtcclxuXHJcbmZ1bmN0aW9uIGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBvcmllbnRhdGlvbikge1xyXG4gICAgbGV0IHBpZWNlc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgYm94V2lkdGggPSA1MDtcclxuICAgIGxldCBib3hIZWlnaHQgPSA0ODtcclxuICAgIGxldCBpc1ZlcnRpY2FsID0gb3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIjtcclxuXHJcbiAgICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxQaWVjZXNDb250YWluZXJcIiA6IFwicGllY2VzQ29udGFpbmVyXCI7XHJcblxyXG4gICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xyXG4gICAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsU2hpcENvbnRhaW5lclwiIDogXCJzaGlwQ29udGFpbmVyXCI7XHJcbiAgICBcclxuICAgICAgICBsZXQgc2hpcFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwVGl0bGUuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwTmFtZVwiIDogXCJzaGlwTmFtZVwiO1xyXG4gICAgICAgIHNoaXBUaXRsZS50ZXh0Q29udGVudCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiOlwiO1xyXG4gICAgXHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpOyAvLyBBZGQgdGhlIHNoaXBUaXRsZSBmaXJzdCBcclxuICAgIFxyXG4gICAgICAgIGxldCBzaGlwUGllY2U7XHJcbiAgICBcclxuICAgICAgICBpZiAocGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGFjZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7ICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKGlzVmVydGljYWwgPyBcInZlcnRpY2FsRHJhZ2dhYmxlXCIgOiBcImRyYWdnYWJsZVwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lIDogc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUud2lkdGggPSBpc1ZlcnRpY2FsID8gYm94V2lkdGggKyBcInB4XCIgOiAoYm94V2lkdGggKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSBpc1ZlcnRpY2FsID8gKGJveEhlaWdodCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIiA6IGJveEhlaWdodCArIFwicHhcIjtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzaGlwQXR0cmlidXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBkcmFnRGF0YS5kcmFnZ2VkU2hpcCA9IHNoaXBEYXRhO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShzaGlwRGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcEhlYWRSZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBQaWVjZVJlY3QgPSBzaGlwUGllY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gc2hpcEhlYWRSZWN0LmxlZnQgLSBzaGlwUGllY2VSZWN0LmxlZnQgKyAoc2hpcEhlYWRSZWN0LndpZHRoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXRZID0gc2hpcEhlYWRSZWN0LnRvcCAtIHNoaXBQaWVjZVJlY3QudG9wICsgKHNoaXBIZWFkUmVjdC5oZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcFBpZWNlLCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NOYW1lID0gXCJzaGlwYm94XCI7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LnN0eWxlLndpZHRoID0gYm94V2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IGNsaWNrZWQ6XCIsIGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcFBpZWNlLnNldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiLVwiICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5hcHBlbmRDaGlsZChzaGlwQm94KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBwaWVjZXNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcENvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBpZWNlc0NvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7YmF0dGxlc2hpcFBpZWNlcywgZHJhZ0RhdGEgfTsiLCJjb25zdCB7IGRyYWdEYXRhIH0gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuXHJcbi8vIGxldCBkcmFnZ2VkU2hpcERhdGEgPSBudWxsOyAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxyXG5cclxuZnVuY3Rpb24gZ2V0QWZmZWN0ZWRCb3hlcyhoZWFkUG9zaXRpb24sIGxlbmd0aCwgb3JpZW50YXRpb24pIHtcclxuICAgIGNvbnN0IGJveGVzID0gW107XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGhlYWRQb3NpdGlvblswXTtcclxuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChoZWFkUG9zaXRpb24uc2xpY2UoMSkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhclBhcnQgKyAobnVtUGFydCArIGkpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyBpKSArIG51bVBhcnQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJveGVzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNWYWxpZFBsYWNlbWVudChib3hJZCwgbGVuZ3RoLCBvZmZzZXQsIG9yaWVudGF0aW9uLCBwbGF5ZXIpIHtcclxuICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94SWRbMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94SWQuc2xpY2UoMSkpO1xyXG5cclxuICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBvZmZzZXQ7XHJcblxyXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHJldHVybiBhZGp1c3RlZE51bVBhcnQgPiAwICYmIGFkanVzdGVkTnVtUGFydCArIGxlbmd0aCAtIDEgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCA+PSAwICYmIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCArIGxlbmd0aCA8PSBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgIGxldCBzaGlwT3JpZW50YXRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXNoaXAtb3JpZW50YXRpb25dXCIpO1xyXG4gICAgcmV0dXJuIHNoaXBPcmllbnRhdGlvbkVsZW1lbnQgPyBzaGlwT3JpZW50YXRpb25FbGVtZW50LmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uIDogXCJIb3Jpem9udGFsXCI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmQocGxheWVyKSB7XHJcbiAgICBcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcclxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZFRvcENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGFscGhhQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgXHJcbiAgIFxyXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XHJcbiAgICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIHRvcFwiO1xyXG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcclxuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcclxuICAgICBnYW1lQm9hcmQuaWQgPSBwbGF5ZXIubmFtZTsgLy8gQXNzdW1pbmcgdGhlIHBsYXllciBpcyBhIHN0cmluZyBsaWtlIFwicGxheWVyMVwiXHJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcclxuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcclxuXHJcbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcclxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29sdW1uVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcclxuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xyXG4gICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XHJcblxyXG4gICAgICAgIGxldCByb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XHJcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG4gICAgICAgIHJvdy5pZCA9IGFscGhhQ2hhcjtcclxuXHJcbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICBsZXQgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gZHJhZ0RhdGEuZHJhZ2dlZFNoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNoaXAgZGF0YSBpcyBudWxsIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5kcmFnQWZmZWN0ZWQgPSBcInRydWVcIjsgLy8gQWRkIHRoaXMgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTsgLy8gZGVsYXkgb2YgMCBtcywganVzdCBlbm91Z2ggdG8gbGV0IGRyYWdsZWF2ZSBoYXBwZW4gZmlyc3QgaWYgaXQncyBnb2luZyB0b1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3hbZGF0YS1kcmFnLWFmZmVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMuZm9yRWFjaChwcmV2Qm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKTsgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlckxldHRlckJvdW5kID0gNjU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXBwZXJMZXR0ZXJCb3VuZCA9IDc0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBib3guaWRbMF07ICAvLyBBc3N1bWluZyB0aGUgZm9ybWF0IGlzIGFsd2F5cyBsaWtlIFwiQTVcIlxyXG4gICAgICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveC5pZC5zbGljZSgxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBzaGlwRGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uID0gY2hhclBhcnQgKyBhZGp1c3RlZE51bVBhcnQ7ICAvLyBUaGUgbmV3IHBvc2l0aW9uIGZvciB0aGUgaGVhZCBvZiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKGFkanVzdGVkVGFyZ2V0UG9zaXRpb24sIHNoaXBEYXRhLmxlbmd0aCwgc2hpcE9yaWVudGF0aW9uKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0ZWQgcG9zaXRpb24gYmFzZWQgb24gd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCBvbiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZENvb3JkaW5hdGUgPSAoY2hhclBhcnQgKyBudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDaGFyID0gY2hhclBhcnQuY2hhckNvZGVBdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxhY2VtZW50IGlzIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIgJiYgKGFkanVzdGVkTnVtUGFydCA8PSAwIHx8IGFkanVzdGVkTnVtUGFydCArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiICYmIChzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggPCBsb3dlckxldHRlckJvdW5kIHx8IHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiB1cHBlckxldHRlckJvdW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5uYW1lLCBoZWFkQ29vcmRpbmF0ZSwgc2hpcE9yaWVudGF0aW9uKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdmVybGFwcGluZyBTaGlwLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5oaXRNYXJrZXIgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LnNoaXAgPSBzaGlwRGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpc1ZlcnRpY2FsID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gcGxhY2UgJHtzaGlwRGF0YS5uYW1lfSB3aXRoIGxlbmd0aCAke3NoaXBEYXRhLmxlbmd0aH0gYXQgcG9zaXRpb24gJHthZGp1c3RlZFRhcmdldFBvc2l0aW9ufS5gKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2IyR7c2hpcERhdGEubmFtZX0uZHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjdmVydGljYWwke3NoaXBEYXRhLm5hbWV9LnZlcnRpY2FsRHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFbGVtZW50ID0gc2hpcEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgZGl2IHRvIHRoZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPYmplY3ROYW1lID0gc2hpcERhdGEubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgaGlnaGxpZ2h0XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJldmlvdXNCb3hlcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNCb3hlcyA9IGFmZmVjdGVkQm94ZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4gYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpXHJcblxyXG5jbGFzcyBHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVJZCwgcGxheWVyTmFtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUlkID0gZ2FtZUlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuICAgICAgICB0aGlzLnBoYXNlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPLURPIHByb21wdFVzZXJDb29yZGluYXRlKCksIHByb21wdFVzZXJPcmllbnRhdGlvbigpLCBjaGVja1dpbm5lcigpO1xyXG5cclxuICAgIGNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IGdhbWVSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHNoaXBUeXBlcyA9IFtcIkNhcnJpZXJcIiwgXCJCYXR0bGVzaGlwXCIsIFwiQ3J1aXNlclwiLCBcIlN1Ym1hcmluZVwiLCBcIkRlc3Ryb3llclwiXTtcclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuY3VycmVudFN0YXRlICE9IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZ2FtZVJlYWR5O1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcCBpbiB0aGlzLnBsYXllcjEuR2FtZWJvYXJkLnNoaXBbc2hpcFR5cGVzXSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzaGlwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VDb21wdXRlclNoaXAoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAoY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCBjb21wdXRlckNvb3JkaW5hdGUsIGNvbXB1dGVyT3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGlhbGl6ZUdhbWUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiXHJcbiAgICAgICAgY29uc3Qgc2hpcFR5cGVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xyXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNoaXAgb2Ygc2hpcFR5cGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VQbGF5ZXJTaGlwcyhzaGlwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUNvbXB1dGVyU2hpcChzaGlwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVR1cm4oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWRNb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJNb3ZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZSAoIWlzVmFsaWRNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcHJvbXB0IHVzZXIgZm9yIGNvb3JkaW5hdGVcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvbXB0ID0gXCJBMVwiOyAvLyBIZXJlIHlvdSBtaWdodCB3YW50IHRvIGdldCBhY3R1YWwgaW5wdXQgZnJvbSB0aGUgdXNlci5cclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJNb3ZlID0gcGxheWVyLm1ha2VBdHRhY2socHJvbXB0KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkTW92ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7IC8vIE91dHB1dCB0aGUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIHByb21wdCB0aGUgdXNlciB3aXRoIGEgbWVzc2FnZSB0byBlbnRlciBhIG5ldyBjb29yZGluYXRlLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllck1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuICAgICAgICAgICAgcGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN0YXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJHYW1lIFNldC1VcFwiKSB7XHJcbiAgICAgICAgICAgIGxldCB0dXJuVmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSkgKyAxO1xyXG4gICAgICAgICAgICBpZiAodHVyblZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJQbGF5ZXIgTW92ZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrV2lubmVyKCkge1xyXG4gICAgICAgIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQ29tcHV0ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29tcHV0ZXIuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUGxheWVyIFdpbnNcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHdoaWxlKCFjaGVja1dpbm5lcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5VHVybigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG5cclxuLy8gLy8gR2V0IHBsYXllciBuYW1lXHJcbi8vIGxldCBuYW1lID0gXCJwbGF5ZXIxXCJcclxuXHJcbi8vIC8vIENyZWF0ZSBwbGF5ZXJzXHJcbmxldCBnYW1lID0gbmV3IEdhbWUobnVsbCwgXCJwbGF5ZXJcIilcclxuXHJcbmdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpXHJcblxyXG4vLyBsZXQgY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbi8vICAgICAvLyBcIkNhcnJpZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDYXJyaWVyXCIsIFwiRTVcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkExXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiQmF0dGxlc2hpcFwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkJhdHRsZXNoaXBcIiwgXCJKN1wiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiQjEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkNydWlzZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDcnVpc2VyXCIsIFwiQThcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkYxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiU3VibWFyaW5lXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiRDFcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiSDEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkRlc3Ryb3llclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkIyXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkoxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuXHJcbi8vIC8vIEF0dGFjayBwaGFzZSBcclxuXHJcbi8vICAgICAvLyBQbGF5ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgcGxheWVyTW92ZSA9IHBsYXllci5tYWtlQXR0YWNrKFwiQTFcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllck1vdmUpO1xyXG5cclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAgICAgLy8gQ29tcHV0ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbi8vICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhjb21wdXRlck1vdmUpO1xyXG5cclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVOYXZVaSAoKSB7XHJcbiAgICBsZXQgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5jbGFzc05hbWUgPSBcImdhbWVJbml0aWFsaXplckNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBwbGF5ZXJOYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHBsYXllck5hbWVDb250YWluZXIuY2xhc3NOYW1lID0gXCJwbGF5ZXJOYW1lQ29udGFpbmVyXCI7XHJcbiAgICBsZXQgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lclwiO1xyXG4gICAgbGV0IHN0YXJ0QnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHN0YXJ0QnV0dG9uQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwic3RhcnRCdXR0b25Db250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgcGxheWVyTmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgcGxheWVyTmFtZUxhYmVsLnRleHRDb250ZW50ID0gXCJFbnRlciB5b3VyIG5hbWU6XCI7XHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwuaHRtbEZvciA9IFwicGxheWVySW5wdXROYW1lXCI7XHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVMYWJlbCk7XHJcblxyXG4gICAgbGV0IHBsYXllcklucHV0TmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHBsYXllcklucHV0TmFtZS5jbGFzc05hbWUgPSBcInBsYXllcklucHV0TmFtZVwiO1xyXG4gICAgcGxheWVySW5wdXROYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBwbGF5ZXJJbnB1dE5hbWUudmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJjb21wdXRlclwiIHx8IGlucHV0VmFsdWUgPT09IFwiYWlcIikge1xyXG4gICAgICAgICAgICBhbGVydCgnVGhlIG5hbWUgY2Fubm90IGJlIFwiY29tcHV0ZXJcIiBvciBcImFpXCIuJyk7XHJcbiAgICAgICAgICAgIHBsYXllcklucHV0TmFtZS52YWx1ZSA9ICcnOyAvLyBDbGVhciB0aGUgaW5wdXQgZmllbGRcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllcklucHV0TmFtZSk7XHJcblxyXG4gICAgbGV0IGVhc3lSYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGVhc3lSYWRpby50eXBlID0gXCJyYWRpb1wiO1xyXG4gICAgZWFzeVJhZGlvLm5hbWUgPSBcImRpZmZpY3VsdHlcIjtcclxuICAgIGVhc3lSYWRpby52YWx1ZSA9IFwiZWFzeVwiO1xyXG4gICAgZWFzeVJhZGlvLmlkID0gXCJlYXN5XCI7XHJcbiAgICBsZXQgZWFzeUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgZWFzeUxhYmVsLmh0bWxGb3IgPSBcImVhc3lcIjtcclxuICAgIGVhc3lMYWJlbC50ZXh0Q29udGVudCA9IFwiRWFzeVwiO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lSYWRpbyk7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWFzeUxhYmVsKTtcclxuXHJcbiAgICAvLyBSYWRpbyBidXR0b24gZm9yIGhhcmQgZGlmZmljdWx0eVxyXG4gICAgbGV0IGhhcmRSYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGhhcmRSYWRpby50eXBlID0gXCJyYWRpb1wiO1xyXG4gICAgaGFyZFJhZGlvLm5hbWUgPSBcImRpZmZpY3VsdHlcIjtcclxuICAgIGhhcmRSYWRpby52YWx1ZSA9IFwiaGFyZFwiO1xyXG4gICAgaGFyZFJhZGlvLmlkID0gXCJoYXJkXCI7XHJcbiAgICBsZXQgaGFyZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgaGFyZExhYmVsLmh0bWxGb3IgPSBcImhhcmRcIjtcclxuICAgIGhhcmRMYWJlbC50ZXh0Q29udGVudCA9IFwiSGFyZFwiO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGhhcmRSYWRpbyk7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZExhYmVsKTtcclxuXHJcbiAgICAvLyBTdGFydCBidXR0b25cclxuICAgIGxldCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgR2FtZVwiO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRCdXR0b24pO1xyXG4gICAgc3RhcnRCdXR0b24uaWQgPSBcImluaXRTdGFydEJ1dHRvblwiO1xyXG5cclxuICAgIC8vIEFwcGVuZCB0aGUgY29udGFpbmVycyB0byB0aGUgbWFpbiBjb250YWluZXJcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJOYW1lQ29udGFpbmVyKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uQ29udGFpbmVyKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVJbml0aWFsaXplckNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVOYXZVaTsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9nYW1lQm9hcmRcIik7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5BaSA9IHRoaXMuaXNBaSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VBdHRhY2soY29vcmRpbmF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhjb29yZGluYXRlKSAmJiAhdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3ZlIGlzIGFscmVhZHkgbWFkZVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQWkobmFtZSkge1xyXG4gICAgICAgIGxldCBjaGVjayA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjaGVjayA9PSBcIkNvbXB1dGVyXCIgfHwgY2hlY2sgPT0gXCJBaVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBbGxQb3NzaWJsZU1vdmVzKCkge1xyXG4gICAgICAgIGxldCBhbGxNb3ZlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3dOdW1iZXIgPSAxOyByb3dOdW1iZXIgPD0gdGhpcy5nYW1lQm9hcmQuaGVpZ2h0OyByb3dOdW1iZXIrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbkFsaWFzID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW5OdW1iZXIgKyA2NSk7XHJcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZWFzeUFpTW92ZXMoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgYWxsUG9zc2libGVNb3ZlcyA9IHRoaXMuZ2V0QWxsUG9zc2libGVNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgdW5wbGF5ZWRNb3ZlcyA9IGFsbFBvc3NpYmxlTW92ZXMuZmlsdGVyKG1vdmUgPT4gIXRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMobW92ZSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHVucGxheWVkIG1vdmVzIGxlZnQsIHJhaXNlIGFuIGVycm9yIG9yIGhhbmRsZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBpZiAodW5wbGF5ZWRNb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gdGhpcy5nZXRSYW5kb21JbnQoMCwgdW5wbGF5ZWRNb3Zlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB1bnBsYXllZE1vdmVzW3JhbmRvbUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpICsgMTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJjb25zdCB7YmF0dGxlc2hpcFBpZWNlc30gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKHBsYXllcikge1xyXG4gICAgbGV0IHNoaXBQb3NpdGlvblN3aXRjaGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuaW5uZXJUZXh0ID0gXCJTd2l0Y2ggT3JpZW50YXRpb25cIlxyXG5cclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xyXG5cclxuICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRTaGlwT3JpZW50YXRpb25cIik7XHJcbiAgICBsZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW4tTGVmdFwiKTtcclxuXHJcblxyXG4gICAgaWYgKHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICBsZXQgdXBkYXRlZFZlcnRCb2FyZCA9IGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBcIlZlcnRpY2FsXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZFZlcnRCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIGxldCB1cGRhdGVkSG9yQm9hcmQgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApXHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlQ2hpbGQobGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4uaW5zZXJ0QmVmb3JlKHVwZGF0ZWRIb3JCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7c2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9ufWBcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHNoaXBQb3NpdGlvblN3aXRjaGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyOyIsIlxyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwVHlwZXMgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXHJcbiAgICAgICAgICAgIENydWlzZXI6IDMsXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZW5ndGgobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3VuaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRDb3VudCA9PSB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XHJcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaXRDb3VudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4ucGxhY2VkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxufVxyXG5cclxuLnNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGNvbG9yOiBncmVlbnllbGxvdztcclxufVxyXG5cclxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyID4gaW5wdXQge1xyXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxEcmFnZ2FibGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxufVxyXG5cclxuXHJcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxyXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNuQixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFVBQVU7SUFDVixXQUFXO0lBQ1gsc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7SUFD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QUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsYUFBYTtJQUNiLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjs7QUFFdkI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztBQUNmOztBQUVBO0lBQ0ksZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksc0JBQXNCO0lBQ3RCLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsYUFBYTtJQUNiLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQixHQUFHLDBDQUEwQztBQUN2RTs7QUFFQTtJQUNJLGVBQWU7SUFDZixrQkFBa0I7QUFDdEI7OztBQUdBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQixHQUFHLDBDQUEwQztJQUNuRSxtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxZQUFZLEdBQUcsbUNBQW1DO0lBQ2xELFdBQVc7SUFDWCxzQkFBc0IsRUFBRSxzQkFBc0I7SUFDOUMsc0JBQXNCLEVBQUUsaURBQWlEO0FBQzdFXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSGVhZGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMTUlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbiNiYXR0bGVzaGlwVGl0bGUge1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhdGVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBoZWlnaHQ6IDcwJTtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXIge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgaGVpZ2h0OiA5MCU7XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gICAgd2lkdGg6IDUwMHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucm93LCAuc2hpcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5oaWdobGlnaHQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5wbGFjZWQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxyXFxufVxcclxcblxcclxcbi5waWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uc2hpcGJveCB7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQjdmVydGljYWwge1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIgPiBpbnB1dCB7XFxyXFxuICAgIGhlaWdodDogNTAlOyAgICBcXHJcXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlTmF2VWkgPSByZXF1aXJlKCcuL25hdmlnYXRpb25Db21wb25lbnRzJyk7XHJcbmNvbnN0IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyID0gcmVxdWlyZShcIi4vcG9zaXRpb25Td2l0Y2hlclwiKVxyXG5pbXBvcnQgJy4vYmF0dGxlc2hpcC5jc3MnO1xyXG5cclxuLy8gU3RyaW5nIHRvIGdlbmVyYXRlIGdhbWUgSURcclxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XHJcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcclxuICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuXHJcbmxldCBnYW1lSW5pdCA9IGNyZWF0ZU5hdlVpKCk7XHJcblxyXG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGdlbmVyYXRlUmFuZG9tU3RyaW5nKCksIFwidXNlclwiKVxyXG5cclxubGV0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW5Db250YWluZXJcIik7XHJcblxyXG5sZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5jbGFzc05hbWU9XCJnYW1lU2NyZWVuLUxlZnRcIlxyXG5cclxubGV0IGN1cnJlbnRTaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmNsYXNzTmFtZSA9IFwiY3VycmVudFNoaXBPcmllbnRhdGlvblwiO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCJcclxuY3VycmVudFNoaXBPcmllbnRhdGlvbi5pbm5lclRleHQgPSBgQ3VycmVudCBTaGlwIFBvc2l0aW9uIGlzOiAke2N1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb259YFxyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGxlZnRHYW1lU2NyZWVuKTtcclxuXHJcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKG5ld0dhbWUucGxheWVyMSwgXCJIb3Jpem9udGFsXCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5cclxuXHJcbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKG5ld0dhbWUucGxheWVyMSk7XHJcblxyXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUucGxheWVyMSwgY3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbik7XHJcblxyXG5sZXQgYm9hcmQyID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUuY29tcHV0ZXIpO1xyXG5cclxuXHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHBpZWNlcyk7XHJcbi8vIGxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHZlcnRpY2FsUGllY2VzKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY3VycmVudFNoaXBPcmllbnRhdGlvbik7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHNoaXBQb3NpdGlvblN3aXRjaGVyKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0KTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG5cclxuIl0sIm5hbWVzIjpbImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwib3JpZW50YXRpb24iLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib3hXaWR0aCIsImJveEhlaWdodCIsImlzVmVydGljYWwiLCJjbGFzc05hbWUiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJhcHBlbmRDaGlsZCIsInNoaXBQaWVjZSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwicGxhY2VkRGl2IiwiaWQiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwid2lkdGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94IiwiY29uc29sZSIsImxvZyIsInNldEF0dHJpYnV0ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJfcmVxdWlyZSIsInJlcXVpcmUiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uIiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhc2V0Iiwic2hpcE9yaWVudGF0aW9uIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZUJvYXJkQ29tcG9uZW50IiwiZ2FtZUJvYXJkVG9wQ29tcG9uZW50IiwiZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50IiwiYWxwaGFDb29yZGluYXRlcyIsIm51bWVyaWNDb29yZGluYXRlcyIsImNvbHVtblRpdGxlIiwiYWxwaGFDaGFyIiwicm93VGl0bGUiLCJyb3ciLCJhZmZlY3RlZEJveGVzIiwicHJldmlvdXNBZmZlY3RlZEJveGVzIiwiX2xvb3AyIiwiYm94IiwiaiIsInByZXZlbnREZWZhdWx0Iiwic2V0VGltZW91dCIsIl90b0NvbnN1bWFibGVBcnJheSIsImVycm9yIiwidmFsaWRQbGFjZW1lbnQiLCJmb3JFYWNoIiwiZHJhZ0FmZmVjdGVkIiwicHJldmlvdXNseUFmZmVjdGVkQm94ZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicHJldkJveCIsInJlbW92ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImxvd2VyTGV0dGVyQm91bmQiLCJ1cHBlckxldHRlckJvdW5kIiwicGFyc2UiLCJnZXREYXRhIiwiYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiIsImhlYWRDb29yZGluYXRlIiwic2VsZWN0ZWRDaGFyIiwicGxhY2VTaGlwIiwiaGl0TWFya2VyIiwic2hpcEVsZW1lbnQiLCJjb25jYXQiLCJwYXJlbnRFbGVtZW50Iiwic2hpcE9iamVjdE5hbWUiLCJwcmV2aW91c0JveGVzIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJDcnVpc2VyIiwiU3VibWFyaW5lIiwiRGVzdHJveWVyIiwiYm9hcmQiLCJzdGFydEdhbWUiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwic3RyaW5nVG9Db2xJbmRleCIsInN0ciIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwic2hpcEhlYWRDb29yZGluYXRlIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImUiLCJmIiwicmVjZWl2ZUF0dGFjayIsInNoaXBDb29yZGluYXRlcyIsImluY2x1ZGVzIiwiaGl0Iiwic2V0QWxsU2hpcHNUb0RlYWQiLCJpc0RlYWQiLCJnYW1lT3ZlciIsImRpc3BsYXkiLCJoZWFkZXIiLCJyb3dTdHJpbmciLCJjZWxsVmFsdWUiLCJQbGF5ZXIiLCJHYW1lIiwiZ2FtZUlkIiwicGxheWVyTmFtZSIsInBsYXllcjEiLCJjb21wdXRlciIsInBoYXNlQ291bnRlciIsImN1cnJlbnRTdGF0ZSIsImN1cnJlbnRUdXJuIiwiY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSIsImdhbWVSZWFkeSIsInNoaXBUeXBlcyIsInBsYWNlQ29tcHV0ZXJTaGlwIiwiY29tcHV0ZXJDb29yZGluYXRlIiwiZWFzeUFpTW92ZXMiLCJjb21wdXRlck9yaWVudGF0aW9uIiwiYWlTaGlwT3JpZW50YXRpb24iLCJpbnRpYWxpemVHYW1lIiwiX2kiLCJfc2hpcFR5cGVzIiwicGxhY2VQbGF5ZXJTaGlwcyIsInN0YXJ0IiwicGxheVR1cm4iLCJpc1ZhbGlkTW92ZSIsInBsYXllck1vdmUiLCJwcm9tcHQiLCJtYWtlQXR0YWNrIiwibWVzc2FnZSIsImNvbXB1dGVyQ2hvaWNlIiwiY29tcHV0ZXJNb3ZlIiwidXBkYXRlU3RhdGUiLCJ0dXJuVmFsdWUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGVja1dpbm5lciIsImdhbWUiLCJjcmVhdGVOYXZVaSIsImdhbWVJbml0aWFsaXplckNvbnRhaW5lciIsInBsYXllck5hbWVDb250YWluZXIiLCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIiLCJzdGFydEJ1dHRvbkNvbnRhaW5lciIsInBsYXllck5hbWVMYWJlbCIsImh0bWxGb3IiLCJwbGF5ZXJJbnB1dE5hbWUiLCJpbnB1dFZhbHVlIiwidG9Mb3dlckNhc2UiLCJhbGVydCIsImVhc3lSYWRpbyIsInR5cGUiLCJlYXN5TGFiZWwiLCJoYXJkUmFkaW8iLCJoYXJkTGFiZWwiLCJzdGFydEJ1dHRvbiIsIkFpIiwiaXNBaSIsImNvbXBsZXRlZE1vdmVzIiwiY2FwaXRhbGl6ZUZpcnN0IiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwibW92ZSIsInJhbmRvbUluZGV4IiwiY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIiLCJzaGlwUG9zaXRpb25Td2l0Y2hlciIsImlubmVyVGV4dCIsImxlZnRHYW1lU2NyZWVuIiwidXBkYXRlZFZlcnRCb2FyZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsInVwZGF0ZWRIb3JCb2FyZCIsImlzVmFsaWQiLCJzZXRMZW5ndGgiLCJoaXRDb3VudCIsImNhcGl0YWxpemVkU2hpcE5hbWUiLCJpc1N1bmsiLCJnZW5lcmF0ZVJhbmRvbVN0cmluZyIsImNoYXJhY3RlcnMiLCJyZXN1bHQiLCJnYW1lSW5pdCIsIm5ld0dhbWUiLCJnYW1lU2NyZWVuIiwiY3VycmVudFNoaXBPcmllbnRhdGlvbiIsInBpZWNlcyIsImJvYXJkMSIsImJvYXJkMiJdLCJzb3VyY2VSb290IjoiIn0=