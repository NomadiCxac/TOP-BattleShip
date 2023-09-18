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
        // let shipObjectName = shipData.name;
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
      if (this.currentState != "Game Set-Up") {
        return false;
      }

      // console.log(this.player1.gameBoard.ship);
      for (var shipTypes in this.player1.gameBoard.ship) {
        if (this.player1.gameBoard.ship[shipTypes].coordinates.length == 0) {
          return false;
        }
      }
      return true;
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
console.log(game.checkPlayerReadyGameState());

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Game = __webpack_require__(/*! ./gameLoop */ "./gameLoop.js");
function createNavUi() {
  var gameInitializerContainer = document.createElement("div");
  gameInitializerContainer.className = "gameInitializerContainer";
  var playerNameContainer = document.createElement("div");
  playerNameContainer.className = "playerNameContainer";
  var computerDifficultyContainer = document.createElement("div");
  computerDifficultyContainer.className = "computerDifficultyContainer";
  var initializeButtonContainer = document.createElement("div");
  initializeButtonContainer.className = "initializeButtonContainer";
  var playerNameLabel = document.createElement("label");
  playerNameLabel.className = "playerInputNameLabel";
  playerNameLabel.textContent = "Enter your name:";
  playerNameLabel.htmlFor = "playerInputName";
  playerNameContainer.appendChild(playerNameLabel);
  var isValidInput = false; // This will be used to store the input validity
  var rawInput;
  var playerInputName = document.createElement("input");
  playerInputName.className = "playerInputName";
  playerInputName.addEventListener('input', function () {
    rawInput = playerInputName.value;
    var inputValue = playerInputName.value.toLowerCase();
    if (inputValue === "computer" || inputValue === "ai") {
      alert('The name cannot be "computer" or "ai".');
      playerInputName.value = ''; // Clear the input field
      isValidInput = false;
    } else if (inputValue.length > 0) {
      isValidInput = true;
    } else {
      isValidInput = false;
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
  easyLabel.textContent = "Easy Battleship AI";
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
  hardLabel.textContent = "Hard Battleship AI";
  computerDifficultyContainer.appendChild(hardRadio);
  computerDifficultyContainer.appendChild(hardLabel);

  // initialize button
  var initializeButton = document.createElement("button");
  initializeButton.textContent = "Place Pieces";
  initializeButtonContainer.appendChild(initializeButton);
  initializeButton.id = "initPlaceButton";
  initializeButton.addEventListener("click", function () {
    if (isValidInput) {
      console.log('Valid input! Initializing game...');
      localStorage.setItem('playerName', rawInput);
      // You can also do more, like checking if a difficulty is selected etc.
      window.location.href = "battleship.html";
    } else {
      console.log('Invalid input.');
      return false;
    }
  });

  // Append the containers to the main container
  gameInitializerContainer.appendChild(playerNameContainer);
  gameInitializerContainer.appendChild(computerDifficultyContainer);
  gameInitializerContainer.appendChild(initializeButtonContainer);
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

/***/ "./updateCurrentPhase.js":
/*!*******************************!*\
  !*** ./updateCurrentPhase.js ***!
  \*******************************/
/***/ ((module) => {

function phaseUpdater(game) {
  var gamePhase = document.querySelector(".gamePhase");
  var playerTurn = document.querySelector(".playerTurn");
  if (game == null) {
    gamePhase.textContent = "Game Initializtion";
    playerTurn.textContent = "";
  } else {
    gamePhase.textContent = game.currentState;
    playerTurn.textContent = game.currentTurn;
  }
}
module.exports = phaseUpdater;

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
    height: 60vh;
    width: 60vw;
    border: 3px solid black;
}

.gameStartContainer {
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
    width: 100%;
    font-style: italic;
    font-weight: 600;
    
}

.playerInputNameLabel {
    font-size: xx-large;
}

.playerInputName {
    height: 50px;    
    margin-top: 0.5em;
    width: 60%;
    font-size: 40px;
}

.computerDifficultyContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: x-large;
    width: 100%;
}

.computerDifficultyContainer > #easy, #hard {
    margin-left: 12em;
}

.computerDifficultyContainer > label {
    margin-right: 8em;
}

#initPlaceButton {
    background-color: rgb(56, 17, 194);
    color: white;
    font-weight: 700;
    font-size: xx-large;
}

#initPlaceButton:hover {
    color: rgb(238, 255, 0);
}

#initStartButton {
    background-color: rgb(194, 27, 27);
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
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.placed {\r\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.placedText {\r\n    display: flex;\r\n    color: greenyellow;\r\n}\r\n\r\n.placedText#horizontal {\r\n    font-size: x-large;\r\n    margin-left: 1.5em;\r\n}\r\n\r\n.placedText#vertical {\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 100%;\r\n    font-size: large;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 60vh;\r\n    width: 60vw;\r\n    border: 3px solid black;\r\n}\r\n\r\n.gameStartContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 100%;\r\n    font-style: italic;\r\n    font-weight: 600;\r\n    \r\n}\r\n\r\n.playerInputNameLabel {\r\n    font-size: xx-large;\r\n}\r\n\r\n.playerInputName {\r\n    height: 50px;    \r\n    margin-top: 0.5em;\r\n    width: 60%;\r\n    font-size: 40px;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    font-size: x-large;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 12em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 8em;\r\n}\r\n\r\n#initPlaceButton {\r\n    background-color: rgb(56, 17, 194);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: xx-large;\r\n}\r\n\r\n#initPlaceButton:hover {\r\n    color: rgb(238, 255, 0);\r\n}\r\n\r\n#initStartButton {\r\n    background-color: rgb(194, 27, 27);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalDraggable {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}"],"sourceRoot":""}]);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./initializeGame.js ***!
  \***************************/
var Game = __webpack_require__(/*! ./gameLoop */ "./gameLoop.js");
var createNavUi = __webpack_require__(/*! ./navigationComponents */ "./navigationComponents.js");
var createGameBoard = __webpack_require__(/*! ./createGameBoard */ "./createGameBoard.js");
var phaseUpdater = __webpack_require__(/*! ./updateCurrentPhase */ "./updateCurrentPhase.js");
__webpack_require__(/*! ./battleship.css */ "./battleship.css");
localStorage.clear();
phaseUpdater(null);
var gameScreen = document.querySelector(".gameScreenContainer");
var gameInitComponent = createNavUi("gameInitializer");
gameScreen.appendChild(gameInitComponent);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUIsQ0FBQyxPQUFPLGlGQUFpRixVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxRQUFRLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyx3QkFBd0IsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGNBQWMsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSx3QkFBd0IsT0FBTyxLQUFLLFVBQVUsWUFBWSxRQUFRLEtBQUssVUFBVSx3QkFBd0IsYUFBYSxPQUFPLEtBQUssc0JBQXNCLFdBQVcsd0JBQXdCLHlCQUF5Qiw2QkFBNkIs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QUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7O0FDQ0EsSUFBTWxGLElBQUksR0FBRzFILG1CQUFPLENBQUMsaUNBQVksQ0FBQztBQUNsQyxJQUFNNkosV0FBVyxHQUFHN0osbUJBQU8sQ0FBQyx5REFBd0IsQ0FBQztBQUNyRCxJQUFNb0IsZUFBZSxHQUFJcEIsbUJBQU8sQ0FBQywrQ0FBbUIsQ0FBQztBQUNyRCxJQUFNNE0sWUFBWSxHQUFHNU0sbUJBQU8sQ0FBQyxxREFBc0IsQ0FBQztBQUNwREEsbUJBQU8sQ0FBQywwQ0FBa0IsQ0FBQztBQUUzQmdMLFlBQVksQ0FBQytCLEtBQUssQ0FBQyxDQUFDO0FBRXBCSCxZQUFZLENBQUMsSUFBSSxDQUFDO0FBQ2xCLElBQUlJLFVBQVUsR0FBR3pRLFFBQVEsQ0FBQzBFLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztBQUMvRCxJQUFJZ00saUJBQWlCLEdBQUdwRCxXQUFXLENBQUMsaUJBQWlCLENBQUM7QUFDdERtRCxVQUFVLENBQUN6UCxXQUFXLENBQUMwUCxpQkFBaUIsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwUGllY2VzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlR2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9uYXZpZ2F0aW9uQ29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi91cGRhdGVDdXJyZW50UGhhc2UuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzP2UwZmUiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2luaXRpYWxpemVHYW1lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBkcmFnRGF0YSA9IHtcclxuICAgIGRyYWdnZWRTaGlwOiBudWxsXHJcbn07XHJcblxyXG5mdW5jdGlvbiBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgb3JpZW50YXRpb24pIHtcclxuICAgIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGJveFdpZHRoID0gNTA7XHJcbiAgICBsZXQgYm94SGVpZ2h0ID0gNDg7XHJcbiAgICBsZXQgaXNWZXJ0aWNhbCA9IG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XHJcblxyXG4gICAgcGllY2VzQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsUGllY2VzQ29udGFpbmVyXCIgOiBcInBpZWNlc0NvbnRhaW5lclwiO1xyXG5cclxuICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHBsYXllci5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcclxuICAgICAgICBsZXQgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBDb250YWluZXJcIiA6IFwic2hpcENvbnRhaW5lclwiO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcFRpdGxlLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsU2hpcE5hbWVcIiA6IFwic2hpcE5hbWVcIjtcclxuICAgICAgICBzaGlwVGl0bGUudGV4dENvbnRlbnQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIjpcIjtcclxuICAgIFxyXG4gICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTsgLy8gQWRkIHRoZSBzaGlwVGl0bGUgZmlyc3QgXHJcbiAgICBcclxuICAgICAgICBsZXQgc2hpcFBpZWNlO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LmNsYXNzTmFtZSA9IFwicGxhY2VkVGV4dFwiO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYudGV4dENvbnRlbnQgPSBcIlBsYWNlZFwiO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQocGxhY2VkRGl2KTtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiOyAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzaGlwUGllY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbERyYWdnYWJsZVwiIDogXCJkcmFnZ2FibGVcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSA6IHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gaXNWZXJ0aWNhbCA/IGJveFdpZHRoICsgXCJweFwiIDogKGJveFdpZHRoICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUuaGVpZ2h0ID0gaXNWZXJ0aWNhbCA/IChib3hIZWlnaHQgKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCIgOiBib3hIZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGlja2VkQm94T2Zmc2V0ID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2hpcEF0dHJpYnV0ZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogc2hpcEF0dHJpYnV0ZS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBjbGlja2VkQm94T2Zmc2V0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZHJhZ0RhdGEuZHJhZ2dlZFNoaXAgPSBzaGlwRGF0YTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBIZWFkUmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwUGllY2VSZWN0ID0gc2hpcFBpZWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHNoaXBIZWFkUmVjdC50b3AgLSBzaGlwUGllY2VSZWN0LnRvcCArIChzaGlwSGVhZFJlY3QuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHNoaXBQaWVjZSwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5zdHlsZS53aWR0aCA9IGJveFdpZHRoICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWxlbWVudCBjbGlja2VkOlwiLCBldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIi1cIiArIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgcGllY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwaWVjZXNDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2JhdHRsZXNoaXBQaWVjZXMsIGRyYWdEYXRhIH07IiwiY29uc3QgeyBkcmFnRGF0YSB9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcblxyXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcclxuXHJcbmZ1bmN0aW9uIGdldEFmZmVjdGVkQm94ZXMoaGVhZFBvc2l0aW9uLCBsZW5ndGgsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBjb25zdCBib3hlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoaGVhZFBvc2l0aW9uLnNsaWNlKDEpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgaSkgKyBudW1QYXJ0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hlcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGJveElkWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcclxuXHJcbiAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gb2Zmc2V0O1xyXG5cclxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICByZXR1cm4gYWRqdXN0ZWROdW1QYXJ0ID4gMCAmJiBhZGp1c3RlZE51bVBhcnQgKyBsZW5ndGggLSAxIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbZGF0YS1zaGlwLW9yaWVudGF0aW9uXVwiKTtcclxuICAgIHJldHVybiBzaGlwT3JpZW50YXRpb25FbGVtZW50ID8gc2hpcE9yaWVudGF0aW9uRWxlbWVudC5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA6IFwiSG9yaXpvbnRhbFwiO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZUJvYXJkKHBsYXllcikge1xyXG4gICAgXHJcblxyXG4gICAgLy8gR2VuZXJhdGUgZGl2IGVsZW1lbnRzIGZvciBHYW1lIEJvYXJkXHJcbiAgICBsZXQgZ2FtZUJvYXJkQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRUb3BDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBhbHBoYUNvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBudW1lcmljQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIFxyXG4gICBcclxuICAgICAvLyBBc3NpZ25pbmcgY2xhc3NlcyB0byB0aGUgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgIGdhbWVCb2FyZENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lclwiO1xyXG4gICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciB0b3BcIjtcclxuICAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgYm90dG9tXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmlkID0gcGxheWVyLm5hbWU7IC8vIEFzc3VtaW5nIHRoZSBwbGF5ZXIgaXMgYSBzdHJpbmcgbGlrZSBcInBsYXllcjFcIlxyXG4gICAgIGFscGhhQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJhbHBoYUNvb3JkaW5hdGVzXCI7XHJcbiAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwibnVtZXJpY0Nvb3JkaW5hdGVzXCI7XHJcblxyXG4gICAgIC8vIENyZWF0ZSBjb2x1bW4gdGl0bGVzIGVxdWFsIHRvIHdpZHRoIG9mIGJvYXJkXHJcbiAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb2x1bW5UaXRsZS50ZXh0Q29udGVudCA9IGk7XHJcbiAgICAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmFwcGVuZENoaWxkKGNvbHVtblRpdGxlKTtcclxuICAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmFwcGVuZENoaWxkKG51bWVyaWNDb29yZGluYXRlcyk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgcm93cyBhbmQgcm93IHRpdGxlcyBlcXVhbCB0byBoZWlnaHRcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7IGkrKykge1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpICsgNjUpO1xyXG5cclxuICAgICAgICBsZXQgcm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvd1RpdGxlLnRleHRDb250ZW50ID0gYWxwaGFDaGFyO1xyXG4gICAgICAgIGFscGhhQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQocm93VGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuICAgICAgICByb3cuaWQgPSBhbHBoYUNoYXI7XHJcblxyXG4gICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgbGV0IHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFtdO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIGNvb3JkaW5hdGUgY29sdW1ucyBmb3IgZWFjaCByb3dcclxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBqKyspIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XHJcbiAgICAgICAgICAgIGJveC5pZCA9IGFscGhhQ2hhciArIGpcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IGRyYWdEYXRhLmRyYWdnZWRTaGlwO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFsuLi5hZmZlY3RlZEJveGVzXTsgLy8gbWFrZSBhIHNoYWxsb3cgY29weSAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoaXBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTaGlwIGRhdGEgaXMgbnVsbCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgb3V0IGlmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkUGxhY2VtZW50ID0gaXNWYWxpZFBsYWNlbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEubGVuZ3RoLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEub2Zmc2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRQbGFjZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcyA9IGdldEFmZmVjdGVkQm94ZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEubGVuZ3RoLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuZHJhZ0FmZmVjdGVkID0gXCJ0cnVlXCI7IC8vIEFkZCB0aGlzIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMCk7IC8vIGRlbGF5IG9mIDAgbXMsIGp1c3QgZW5vdWdoIHRvIGxldCBkcmFnbGVhdmUgaGFwcGVuIGZpcnN0IGlmIGl0J3MgZ29pbmcgdG9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm94W2RhdGEtZHJhZy1hZmZlY3RlZD1cInRydWVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzbHlBZmZlY3RlZEJveGVzLmZvckVhY2gocHJldkJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJyk7IC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXJMZXR0ZXJCb3VuZCA9IDY1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyTGV0dGVyQm91bmQgPSA3NDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94LmlkWzBdOyAgLy8gQXNzdW1pbmcgdGhlIGZvcm1hdCBpcyBhbHdheXMgbGlrZSBcIkE1XCJcclxuICAgICAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3guaWQuc2xpY2UoMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gc2hpcERhdGEub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiA9IGNoYXJQYXJ0ICsgYWRqdXN0ZWROdW1QYXJ0OyAgLy8gVGhlIG5ldyBwb3NpdGlvbiBmb3IgdGhlIGhlYWQgb2YgdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwRGF0YS5sZW5ndGgsIHNoaXBPcmllbnRhdGlvbilcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFkanVzdGVkIHBvc2l0aW9uIGJhc2VkIG9uIHdoZXJlIHRoZSB1c2VyIGNsaWNrZWQgb24gdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRDb29yZGluYXRlID0gKGNoYXJQYXJ0ICsgbnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ2hhciA9IGNoYXJQYXJ0LmNoYXJDb2RlQXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYWNlbWVudCBpcyBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiICYmIChhZGp1c3RlZE51bVBhcnQgPD0gMCB8fCBhZGp1c3RlZE51bVBhcnQgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gcGxheWVyLmdhbWVCb2FyZC53aWR0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiVmVydGljYWxcIiAmJiAoc2VsZWN0ZWRDaGFyICsgc2hpcERhdGEubGVuZ3RoIDwgbG93ZXJMZXR0ZXJCb3VuZCB8fCBzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gdXBwZXJMZXR0ZXJCb3VuZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcERhdGEubmFtZSwgaGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3ZlcmxhcHBpbmcgU2hpcC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuaGl0TWFya2VyID0gXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5zaGlwID0gc2hpcERhdGEubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWZXJ0aWNhbCA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBBdHRlbXB0aW5nIHRvIHBsYWNlICR7c2hpcERhdGEubmFtZX0gd2l0aCBsZW5ndGggJHtzaGlwRGF0YS5sZW5ndGh9IGF0IHBvc2l0aW9uICR7YWRqdXN0ZWRUYXJnZXRQb3NpdGlvbn0uYCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiMke3NoaXBEYXRhLm5hbWV9LmRyYWdnYWJsZS5zaGlwYClcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiVmVydGljYWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2I3ZlcnRpY2FsJHtzaGlwRGF0YS5uYW1lfS52ZXJ0aWNhbERyYWdnYWJsZS5zaGlwYClcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RWxlbWVudCA9IHNoaXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBzaGlwRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYudGV4dENvbnRlbnQgPSBcIlBsYWNlZFwiO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgbmV3IGRpdiB0byB0aGUgcGFyZW50IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGxhY2VkRGl2KTtcclxuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjtcclxuICAgICAgICAgICAgICAgIC8vIGxldCBzaGlwT2JqZWN0TmFtZSA9IHNoaXBEYXRhLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGhpZ2hsaWdodFxyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzQm94ZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQm94ZXMgPSBhZmZlY3RlZEJveGVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdhbWVCb2FyZC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChhbHBoYUNvb3JkaW5hdGVzKTtcclxuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG5cclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRUb3BDb21wb25lbnQpO1xyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCk7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lQm9hcmRDb21wb25lbnRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVHYW1lQm9hcmQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDEwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAxMDtcclxuICAgICAgICB0aGlzLm1pc3NDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlwID0ge1xyXG4gICAgICAgICAgICBDYXJyaWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NhcnJpZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0JhdHRsZXNoaXAnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDcnVpc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NydWlzZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTdWJtYXJpbmU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnU3VibWFyaW5lJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0Rlc3Ryb3llcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIGxldCBib2FyZCA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIlwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmQucHVzaChyb3cpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gVGhpcyBjb2RlIHJldHVybnMgdGhlIGNoYXIgdmFsdWUgYXMgYW4gaW50IHNvIGlmIGl0IGlzICdCJyAob3IgJ2InKSwgd2Ugd291bGQgZ2V0IHRoZSB2YWx1ZSA2NiAtIDY1ID0gMSwgZm9yIHRoZSBwdXJwb3NlIG9mIG91ciBhcnJheSBCIGlzIHJlcC4gYnkgYm9hcmRbMV0uXHJcbiAgICAgICAgY2hhclRvUm93SW5kZXgoY2hhcikge1xyXG4gICAgICAgICAgICBjaGFyID0gY2hhci50b1VwcGVyQ2FzZSgpOyAvLyBDb252ZXJ0IHRoZSBjaGFyYWN0ZXIgdG8gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBSZXR1cm5zIGFuIGludCBhcyBhIHN0ciB3aGVyZSBudW1iZXJzIGZyb20gMSB0byAxMCwgd2lsbCBiZSB1bmRlcnN0b29kIGZvciBhcnJheSBhY2Nlc3M6IGZyb20gMCB0byA5LlxyXG4gICAgICAgIHN0cmluZ1RvQ29sSW5kZXgoc3RyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChzdHIpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXRBdChhbGlhcywgc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxldHRlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gQyBcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmNoYXJUb1Jvd0luZGV4KGNoYXJQYXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvdXQgb2YgYm91bmRzIGxpa2UgSzkgb3IgQzE4XHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiA5IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9IHN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoZWNrQXQoYWxpYXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gRW5zdXJlIGluZGljZXMgYXJlIHZhbGlkXHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPj0gdGhpcy5oZWlnaHQgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID49IHRoaXMud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZSBhbGlhcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPT09IFwiSGl0XCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkhpdFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvY2N1cGllZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRCZWxvd0FsaWFzKGFsaWFzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFyUGFydCB0byB0aGUgbmV4dCBsZXR0ZXJcclxuICAgICAgICAgICAgY29uc3QgbmV4dENoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyAxKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBuZXh0Q2hhciArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYXJUb1Jvd0luZGV4KG5leHRDaGFyKSA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdyBiZWxvdyB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldFJpZ2h0QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGxldCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIG51bWJlciBieSAxXHJcbiAgICAgICAgICAgIG51bVBhcnQrKztcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBjaGFyUGFydCArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChudW1QYXJ0ID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGNvbHVtbiB0byB0aGUgcmlnaHQgb2YgdGhpcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHBsYWNlU2hpcChzaGlwTmFtZSwgc2hpcEhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcE1hcmtlciA9IFwiU2hpcFwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHNoaXBIZWFkQ29vcmRpbmF0ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZ2V0TmV4dENvb3JkaW5hdGUgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIlxyXG4gICAgICAgICAgICAgICAgPyBjb29yZGluYXRlID0+IHRoaXMuZ2V0QmVsb3dBbGlhcyhjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgOiBjb29yZGluYXRlID0+IHRoaXMuZ2V0UmlnaHRBbGlhcyhjb29yZGluYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tBdChjdXJyZW50Q29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID0gW107IC8vIENsZWFyIGFueSBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMucHVzaChjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBnZXROZXh0Q29vcmRpbmF0ZShjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIHNoaXBNYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBdChjb29yZGluYXRlKSA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaGl0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiSGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzQ291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIk1pc3NcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEFsbFNoaXBzVG9EZWFkKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZU92ZXIoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgIC8vIFJldHVybiBmYWxzZSBpZiBhbnkgc2hpcCBpcyBub3QgZGVhZC5cclxuICAgICAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwbGF5KCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciB3aXRoIGNvbHVtbiBudW1iZXJzXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBcIiAgICBcIjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgKz0gaSArIFwiIFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlYWRlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHJvdyBhbmQgcHJpbnQgdGhlbVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIiB8IFwiOyAvLyBDb252ZXJ0IHJvdyBpbmRleCB0byBBLUogYW5kIGFkZCB0aGUgc2VwYXJhdG9yXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGVhY2ggY2VsbCdzIHZhbHVlIGFuZCBkZWNpZGUgd2hhdCB0byBwcmludFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsVmFsdWUgPSB0aGlzLmJvYXJkW2ldW2pdO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlY2lkZSB0aGUgY2VsbCdzIGRpc3BsYXkgYmFzZWQgb24gaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNoaXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlMgXCI7IC8vIFMgZm9yIFNoaXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSGl0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJYIFwiOyAvLyBYIGZvciBIaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWlzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiTSBcIjsgLy8gTSBmb3IgTWlzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCItIFwiOyAvLyAtIGZvciBFbXB0eSBDZWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3dTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lSWQsIHBsYXllck5hbWUpIHtcclxuICAgICAgICB0aGlzLmdhbWVJZCA9IGdhbWVJZDtcclxuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKHBsYXllck5hbWUpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcbiAgICAgICAgdGhpcy5waGFzZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUTy1ETyBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpLCBwcm9tcHRVc2VyT3JpZW50YXRpb24oKSwgY2hlY2tXaW5uZXIoKTtcclxuXHJcbiAgICBjaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgIT0gXCJHYW1lIFNldC1VcFwiKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKTtcclxuICAgICAgICBmb3IgKGxldCBzaGlwVHlwZXMgaW4gdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlc10uY29vcmRpbmF0ZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGFjZUNvbXB1dGVyU2hpcChzaGlwTmFtZSkge1xyXG4gICAgICAgIHdoaWxlIChjb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIGNvbXB1dGVyQ29vcmRpbmF0ZSwgY29tcHV0ZXJPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50aWFsaXplR2FtZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCJcclxuICAgICAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XHJcbiAgICAgICAgLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2hpcCBvZiBzaGlwVHlwZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZVBsYXllclNoaXBzKHNoaXApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlQ29tcHV0ZXJTaGlwKHNoaXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5VHVybigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZE1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHBsYXllck1vdmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9tcHQgdXNlciBmb3IgY29vcmRpbmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9tcHQgPSBcIkExXCI7IC8vIEhlcmUgeW91IG1pZ2h0IHdhbnQgdG8gZ2V0IGFjdHVhbCBpbnB1dCBmcm9tIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhwcm9tcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTsgLy8gT3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gcHJvbXB0IHRoZSB1c2VyIHdpdGggYSBtZXNzYWdlIHRvIGVudGVyIGEgbmV3IGNvb3JkaW5hdGUuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuICAgICAgICAgICAgbGV0IHR1cm5WYWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyIC0gMSArIDEpKSArIDE7XHJcbiAgICAgICAgICAgIGlmICh0dXJuVmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDb21wdXRlciBXaW5zXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGF5ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgd2hpbGUoIWNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcblxyXG4vLyAvLyBHZXQgcGxheWVyIG5hbWVcclxuLy8gbGV0IG5hbWUgPSBcInBsYXllcjFcIlxyXG5cclxuLy8gLy8gQ3JlYXRlIHBsYXllcnNcclxubGV0IGdhbWUgPSBuZXcgR2FtZShudWxsLCBcInBsYXllclwiKVxyXG5cclxuY29uc29sZS5sb2coZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkpXHJcblxyXG4vLyBsZXQgY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbi8vICAgICAvLyBcIkNhcnJpZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDYXJyaWVyXCIsIFwiRTVcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkExXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiQmF0dGxlc2hpcFwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkJhdHRsZXNoaXBcIiwgXCJKN1wiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiQjEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkNydWlzZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDcnVpc2VyXCIsIFwiQThcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkYxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiU3VibWFyaW5lXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiRDFcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiSDEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkRlc3Ryb3llclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkIyXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkoxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuXHJcbi8vIC8vIEF0dGFjayBwaGFzZSBcclxuXHJcbi8vICAgICAvLyBQbGF5ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgcGxheWVyTW92ZSA9IHBsYXllci5tYWtlQXR0YWNrKFwiQTFcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllck1vdmUpO1xyXG5cclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAgICAgLy8gQ29tcHV0ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbi8vICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhjb21wdXRlck1vdmUpO1xyXG5cclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5hdlVpICgpIHtcclxuXHJcbiAgICBsZXQgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5jbGFzc05hbWUgPSBcImdhbWVJbml0aWFsaXplckNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBwbGF5ZXJOYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHBsYXllck5hbWVDb250YWluZXIuY2xhc3NOYW1lID0gXCJwbGF5ZXJOYW1lQ29udGFpbmVyXCI7XHJcbiAgICBsZXQgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lclwiO1xyXG4gICAgbGV0IGluaXRpYWxpemVCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcImluaXRpYWxpemVCdXR0b25Db250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgcGxheWVyTmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgcGxheWVyTmFtZUxhYmVsLmNsYXNzTmFtZSA9IFwicGxheWVySW5wdXROYW1lTGFiZWxcIlxyXG4gICAgcGxheWVyTmFtZUxhYmVsLnRleHRDb250ZW50ID0gXCJFbnRlciB5b3VyIG5hbWU6XCI7XHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwuaHRtbEZvciA9IFwicGxheWVySW5wdXROYW1lXCI7XHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVMYWJlbCk7XHJcblxyXG4gICAgbGV0IGlzVmFsaWRJbnB1dCA9IGZhbHNlOyAgLy8gVGhpcyB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgdGhlIGlucHV0IHZhbGlkaXR5XHJcbiAgICBsZXQgcmF3SW5wdXQ7XHJcblxyXG4gICAgbGV0IHBsYXllcklucHV0TmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHBsYXllcklucHV0TmFtZS5jbGFzc05hbWUgPSBcInBsYXllcklucHV0TmFtZVwiO1xyXG4gICAgcGxheWVySW5wdXROYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJhd0lucHV0ID0gcGxheWVySW5wdXROYW1lLnZhbHVlO1xyXG4gICAgICAgIGxldCBpbnB1dFZhbHVlID0gcGxheWVySW5wdXROYW1lLnZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiY29tcHV0ZXJcIiB8fCBpbnB1dFZhbHVlID09PSBcImFpXCIpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ1RoZSBuYW1lIGNhbm5vdCBiZSBcImNvbXB1dGVyXCIgb3IgXCJhaVwiLicpO1xyXG4gICAgICAgICAgICBwbGF5ZXJJbnB1dE5hbWUudmFsdWUgPSAnJzsgLy8gQ2xlYXIgdGhlIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgIGlzVmFsaWRJbnB1dCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlzVmFsaWRJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXNWYWxpZElucHV0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJJbnB1dE5hbWUpO1xyXG5cclxuICAgIGxldCBlYXN5UmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBlYXN5UmFkaW8udHlwZSA9IFwicmFkaW9cIjtcclxuICAgIGVhc3lSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XHJcbiAgICBlYXN5UmFkaW8udmFsdWUgPSBcImVhc3lcIjtcclxuICAgIGVhc3lSYWRpby5pZCA9IFwiZWFzeVwiO1xyXG4gICAgbGV0IGVhc3lMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGVhc3lMYWJlbC5odG1sRm9yID0gXCJlYXN5XCI7XHJcbiAgICBlYXN5TGFiZWwudGV4dENvbnRlbnQgPSBcIkVhc3kgQmF0dGxlc2hpcCBBSVwiO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lSYWRpbyk7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWFzeUxhYmVsKTtcclxuXHJcbiAgICAvLyBSYWRpbyBidXR0b24gZm9yIGhhcmQgZGlmZmljdWx0eVxyXG4gICAgbGV0IGhhcmRSYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGhhcmRSYWRpby50eXBlID0gXCJyYWRpb1wiO1xyXG4gICAgaGFyZFJhZGlvLm5hbWUgPSBcImRpZmZpY3VsdHlcIjtcclxuICAgIGhhcmRSYWRpby52YWx1ZSA9IFwiaGFyZFwiO1xyXG4gICAgaGFyZFJhZGlvLmlkID0gXCJoYXJkXCI7XHJcbiAgICBsZXQgaGFyZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgaGFyZExhYmVsLmh0bWxGb3IgPSBcImhhcmRcIjtcclxuICAgIGhhcmRMYWJlbC50ZXh0Q29udGVudCA9IFwiSGFyZCBCYXR0bGVzaGlwIEFJXCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZFJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkTGFiZWwpO1xyXG5cclxuICAgIC8vIGluaXRpYWxpemUgYnV0dG9uXHJcbiAgICBsZXQgaW5pdGlhbGl6ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBpbml0aWFsaXplQnV0dG9uLnRleHRDb250ZW50ID0gXCJQbGFjZSBQaWVjZXNcIjtcclxuICAgIGluaXRpYWxpemVCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoaW5pdGlhbGl6ZUJ1dHRvbik7XHJcbiAgICBpbml0aWFsaXplQnV0dG9uLmlkID0gXCJpbml0UGxhY2VCdXR0b25cIjtcclxuICAgIGluaXRpYWxpemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChpc1ZhbGlkSW5wdXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1ZhbGlkIGlucHV0ISBJbml0aWFsaXppbmcgZ2FtZS4uLicpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGxheWVyTmFtZScsIHJhd0lucHV0KTtcclxuICAgICAgICAgICAgLy8gWW91IGNhbiBhbHNvIGRvIG1vcmUsIGxpa2UgY2hlY2tpbmcgaWYgYSBkaWZmaWN1bHR5IGlzIHNlbGVjdGVkIGV0Yy5cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImJhdHRsZXNoaXAuaHRtbFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnZhbGlkIGlucHV0LicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXJzIHRvIHRoZSBtYWluIGNvbnRhaW5lclxyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVDb250YWluZXIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTmF2VWk7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IG5ldyBHYW1lYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW92ZSBpcyBhbHJlYWR5IG1hZGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FpKG5hbWUpIHtcclxuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuICAgICAgICByZXR1cm4gY2hlY2sgPT0gXCJDb21wdXRlclwiIHx8IGNoZWNrID09IFwiQWlcIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcclxuICAgICAgICBsZXQgYWxsTW92ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBjb2x1bW5OdW1iZXIgPSAwOyBjb2x1bW5OdW1iZXIgPCB0aGlzLmdhbWVCb2FyZC53aWR0aDsgY29sdW1uTnVtYmVyKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5BbGlhcyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sdW1uTnVtYmVyICsgNjUpO1xyXG4gICAgICAgICAgICAgICAgYWxsTW92ZXMucHVzaChjb2x1bW5BbGlhcyArIHJvd051bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFsbE1vdmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVhc3lBaU1vdmVzKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIGVhc3lBaU1vdmVzIGlzIHJlc3RyaWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNldCBvZiBhbGwgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IHVucGxheWVkTW92ZXMgPSBhbGxQb3NzaWJsZU1vdmVzLmZpbHRlcihtb3ZlID0+ICF0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKG1vdmUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgaWYgKHVucGxheWVkTW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbGwgbW92ZXMgaGF2ZSBiZWVuIHBsYXllZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIG1vdmUgZnJvbSB0aGUgc2V0IG9mIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdW5wbGF5ZWRNb3Zlc1tyYW5kb21JbmRleF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBhaVNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkhvcml6b250YWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7IiwiXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcclxuICAgICAgICAgICAgQ2FycmllcjogNSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDogNCxcclxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IDIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnNoaXBUeXBlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2V0TGVuZ3RoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExlbmd0aChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY2FwaXRhbGl6ZWRTaGlwTmFtZSA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcclxuICAgICAgICB0aGlzLmlzU3VuaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsImZ1bmN0aW9uIHBoYXNlVXBkYXRlcihnYW1lKSB7XHJcblxyXG4gICAgbGV0IGdhbWVQaGFzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVBoYXNlXCIpO1xyXG4gICAgbGV0IHBsYXllclR1cm4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllclR1cm5cIik7XHJcblxyXG4gICAgaWYgKGdhbWUgPT0gbnVsbCkge1xyXG4gICAgICAgIGdhbWVQaGFzZS50ZXh0Q29udGVudCA9IFwiR2FtZSBJbml0aWFsaXp0aW9uXCJcclxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gXCJcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50U3RhdGU7XHJcbiAgICAgICAgcGxheWVyVHVybi50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFR1cm47XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBoYXNlVXBkYXRlcjsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4ucGxhY2VkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxufVxyXG5cclxuLnNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGNvbG9yOiBncmVlbnllbGxvdztcclxufVxyXG5cclxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogNjB2aDtcclxuICAgIHdpZHRoOiA2MHZ3O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lU3RhcnRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDIwMHB4O1xyXG4gICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIFxyXG59XHJcblxyXG4ucGxheWVySW5wdXROYW1lTGFiZWwge1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuLnBsYXllcklucHV0TmFtZSB7XHJcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbiAgICB3aWR0aDogNjAlO1xyXG4gICAgZm9udC1zaXplOiA0MHB4O1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XHJcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcclxuICAgIG1hcmdpbi1yaWdodDogOGVtO1xyXG59XHJcblxyXG4jaW5pdFBsYWNlQnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XHJcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk0LCAyNywgMjcpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxEcmFnZ2FibGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxufVxyXG5cclxuXHJcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxyXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNuQixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFVBQVU7SUFDVixXQUFXO0lBQ1gsc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixVQUFVO0lBQ1YsV0FBVztJQUNYLDRCQUE0QjtJQUM1QixlQUFlO0FBQ25COztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0FBQ2pDOztBQUVB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O0lBQ1osaUJBQWlCO0lBQ2pCLFVBQVU7SUFDVixlQUFlO0FBQ25COztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGtDQUFrQztJQUNsQyxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGtDQUFrQztJQUNsQyxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7QUFDdkU7O0FBRUE7SUFDSSxlQUFlO0lBQ2Ysa0JBQWtCO0FBQ3RCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUhlYWRlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDE1JTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4jYmF0dGxlc2hpcFRpdGxlIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgaGVpZ2h0OiA3MCU7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLXRvcDogM2VtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW4tTGVmdCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiA4MCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGhlaWdodDogOTAlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XFxyXFxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogNTAwcHg7XFxyXFxuICAgIHdpZHRoOiA1MDBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnJvdywgLnNoaXAge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5zaGlwIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmJveCB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmJveDpob3ZlciB7XFxyXFxuICAgIHdpZHRoOiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uaGlnaGxpZ2h0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAzNTBweDtcXHJcXG4gICAgd2lkdGg6IDQyNXB4O1xcclxcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXHJcXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBib3gge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogNjB2aDtcXHJcXG4gICAgd2lkdGg6IDYwdnc7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMjAwcHg7XFxyXFxuICAgIHdpZHRoOiAyMDBweDtcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gICAgXFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWUge1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxcclxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXHJcXG4gICAgd2lkdGg6IDYwJTtcXHJcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcclxcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b24ge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xcclxcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IGNyZWF0ZU5hdlVpID0gcmVxdWlyZSgnLi9uYXZpZ2F0aW9uQ29tcG9uZW50cycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcclxucmVxdWlyZSgnLi9iYXR0bGVzaGlwLmNzcycpO1xyXG5cclxubG9jYWxTdG9yYWdlLmNsZWFyKClcclxuXHJcbnBoYXNlVXBkYXRlcihudWxsKTtcclxubGV0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW5Db250YWluZXJcIik7XHJcbmxldCBnYW1lSW5pdENvbXBvbmVudCA9IGNyZWF0ZU5hdlVpKFwiZ2FtZUluaXRpYWxpemVyXCIpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0Q29tcG9uZW50KTtcclxuXHJcbiJdLCJuYW1lcyI6WyJkcmFnRGF0YSIsImRyYWdnZWRTaGlwIiwiYmF0dGxlc2hpcFBpZWNlcyIsInBsYXllciIsIm9yaWVudGF0aW9uIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJpc1ZlcnRpY2FsIiwiY2xhc3NOYW1lIiwiX2xvb3AiLCJzaGlwQXR0cmlidXRlIiwiZ2FtZUJvYXJkIiwic2hpcCIsInNoaXBOYW1lIiwiaW5zdGFuY2UiLCJzaGlwQ29udGFpbmVyIiwic2hpcFRpdGxlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwiYXBwZW5kQ2hpbGQiLCJzaGlwUGllY2UiLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInBsYWNlZERpdiIsImlkIiwic3R5bGUiLCJqdXN0aWZ5Q29udGVudCIsImNsYXNzTGlzdCIsImFkZCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhZ2dhYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiY2xpY2tlZEJveE9mZnNldCIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInNoaXBEYXRhIiwib2Zmc2V0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzaGlwSGVhZFJlY3QiLCJnZXRFbGVtZW50QnlJZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNoaXBQaWVjZVJlY3QiLCJvZmZzZXRYIiwibGVmdCIsIm9mZnNldFkiLCJ0b3AiLCJzZXREcmFnSW1hZ2UiLCJpIiwic2hpcEJveCIsImNvbnNvbGUiLCJsb2ciLCJzZXRBdHRyaWJ1dGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiX3JlcXVpcmUiLCJyZXF1aXJlIiwiZ2V0QWZmZWN0ZWRCb3hlcyIsImhlYWRQb3NpdGlvbiIsImJveGVzIiwiY2hhclBhcnQiLCJudW1QYXJ0IiwicGFyc2VJbnQiLCJzbGljZSIsInB1c2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiaXNWYWxpZFBsYWNlbWVudCIsImJveElkIiwiYWRqdXN0ZWROdW1QYXJ0IiwiZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbiIsInNoaXBPcmllbnRhdGlvbkVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZGF0YXNldCIsInNoaXBPcmllbnRhdGlvbiIsImNyZWF0ZUdhbWVCb2FyZCIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJlcnJvciIsInZhbGlkUGxhY2VtZW50IiwiZm9yRWFjaCIsImRyYWdBZmZlY3RlZCIsInByZXZpb3VzbHlBZmZlY3RlZEJveGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZCb3giLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJsb3dlckxldHRlckJvdW5kIiwidXBwZXJMZXR0ZXJCb3VuZCIsInBhcnNlIiwiZ2V0RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJoZWFkQ29vcmRpbmF0ZSIsInNlbGVjdGVkQ2hhciIsInBsYWNlU2hpcCIsImhpdE1hcmtlciIsInNoaXBFbGVtZW50IiwiY29uY2F0IiwicGFyZW50RWxlbWVudCIsInByZXZpb3VzQm94ZXMiLCJTaGlwIiwiR2FtZWJvYXJkIiwiX2NsYXNzQ2FsbENoZWNrIiwibWlzc0NvdW50IiwibWlzc2VkTW92ZXNBcnJheSIsImhpdE1vdmVzQXJyYXkiLCJDYXJyaWVyIiwiQmF0dGxlc2hpcCIsIkNydWlzZXIiLCJTdWJtYXJpbmUiLCJEZXN0cm95ZXIiLCJib2FyZCIsInN0YXJ0R2FtZSIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiY2hhclRvUm93SW5kZXgiLCJjaGFyIiwidG9VcHBlckNhc2UiLCJzdHJpbmdUb0NvbEluZGV4Iiwic3RyIiwic2V0QXQiLCJhbGlhcyIsInN0cmluZyIsImNoYXJBdCIsInN1YnN0cmluZyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJjaGVja0F0IiwiRXJyb3IiLCJnZXRCZWxvd0FsaWFzIiwibmV4dENoYXIiLCJuZXdBbGlhcyIsImdldFJpZ2h0QWxpYXMiLCJzaGlwSGVhZENvb3JkaW5hdGUiLCJfdGhpcyIsInNoaXBNYXJrZXIiLCJzaGlwTGVuZ3RoIiwiY3VycmVudENvb3JkaW5hdGUiLCJnZXROZXh0Q29vcmRpbmF0ZSIsImNvb3JkaW5hdGUiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwiZXJyIiwiZSIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsIlBsYXllciIsIkdhbWUiLCJnYW1lSWQiLCJwbGF5ZXJOYW1lIiwicGxheWVyMSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY3VycmVudFN0YXRlIiwiY3VycmVudFR1cm4iLCJjaGVja1BsYXllclJlYWR5R2FtZVN0YXRlIiwic2hpcFR5cGVzIiwicGxhY2VDb21wdXRlclNoaXAiLCJjb21wdXRlckNvb3JkaW5hdGUiLCJlYXN5QWlNb3ZlcyIsImNvbXB1dGVyT3JpZW50YXRpb24iLCJhaVNoaXBPcmllbnRhdGlvbiIsImludGlhbGl6ZUdhbWUiLCJfaSIsIl9zaGlwVHlwZXMiLCJwbGFjZVBsYXllclNoaXBzIiwic3RhcnQiLCJwbGF5VHVybiIsImlzVmFsaWRNb3ZlIiwicGxheWVyTW92ZSIsInByb21wdCIsIm1ha2VBdHRhY2siLCJtZXNzYWdlIiwiY29tcHV0ZXJDaG9pY2UiLCJjb21wdXRlck1vdmUiLCJ1cGRhdGVTdGF0ZSIsInR1cm5WYWx1ZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoZWNrV2lubmVyIiwiZ2FtZSIsImNyZWF0ZU5hdlVpIiwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIiwicGxheWVyTmFtZUNvbnRhaW5lciIsImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciIsImluaXRpYWxpemVCdXR0b25Db250YWluZXIiLCJwbGF5ZXJOYW1lTGFiZWwiLCJodG1sRm9yIiwiaXNWYWxpZElucHV0IiwicmF3SW5wdXQiLCJwbGF5ZXJJbnB1dE5hbWUiLCJpbnB1dFZhbHVlIiwidG9Mb3dlckNhc2UiLCJhbGVydCIsImVhc3lSYWRpbyIsInR5cGUiLCJlYXN5TGFiZWwiLCJoYXJkUmFkaW8iLCJoYXJkTGFiZWwiLCJpbml0aWFsaXplQnV0dG9uIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIkFpIiwiaXNBaSIsImNvbXBsZXRlZE1vdmVzIiwiY2FwaXRhbGl6ZUZpcnN0IiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwibW92ZSIsInJhbmRvbUluZGV4IiwiaXNWYWxpZCIsInNldExlbmd0aCIsImhpdENvdW50IiwiY2FwaXRhbGl6ZWRTaGlwTmFtZSIsImlzU3VuayIsInBoYXNlVXBkYXRlciIsImdhbWVQaGFzZSIsInBsYXllclR1cm4iLCJjbGVhciIsImdhbWVTY3JlZW4iLCJnYW1lSW5pdENvbXBvbmVudCJdLCJzb3VyY2VSb290IjoiIn0=