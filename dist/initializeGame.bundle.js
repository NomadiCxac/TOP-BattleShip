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
var gameDriverScript = __webpack_require__(/*! ./gameDriverScript */ "./gameDriverScript.js");

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
function createGameBoard(game, player) {
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
        if (affectedBoxes) {
          previousBoxes = affectedBoxes;
        }
        if (!affectedBoxes) {
          affectedBoxes.forEach(function (box) {
            return box.classList.remove('highlight');
          });
        }
      });
      box.addEventListener("click", function (e) {
        var playerGuess = e.target.id;
        gameDriverScript(game, playerGuess);
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

/***/ "./gameDriverScript.js":
/*!*****************************!*\
  !*** ./gameDriverScript.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var placeBoardMarker = __webpack_require__(/*! ./placeBoardMarker */ "./placeBoardMarker.js");
var phaseUpdater = __webpack_require__(/*! ./updateCurrentPhase */ "./updateCurrentPhase.js");
function gameDriverScript(game, playerGuess) {
  if (game.checkWinner()) {
    alert("WoO");
    return;
  }
  // console.log(game.playTurn(playerGuess));

  if (!game.playTurn(playerGuess)) {
    alert("Invalid Move! Try again.");
    return;
  }
  if (game.currentState =  true && game.currentTurn == "Player Move") {
    placeBoardMarker(game, playerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
  }
  // game.currentState = "Game Play Phase" &&
  if (game.currentTurn == "Computer Move") {
    var computerGuess = game.playTurn();
    placeBoardMarker(game, computerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
  }
  return;
}
module.exports = gameDriverScript;

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
    value: function playTurn(move) {
      if (this.currentTurn === "Player Move") {
        var isValidMove = false;
        var playerMove;
        while (!isValidMove) {
          try {
            playerMove = this.player1.makeAttack(move);
            isValidMove = true;
            this.computer.gameBoard.display();
            this.computer.gameBoard.receiveAttack(playerMove);
            return playerMove;
          } catch (error) {
            this.computer.gameBoard.display();
            console.error(error.message); // Output the error message.
            return false;
          }
        }
        this.computer.gameBoard.display();
      }
      if (this.currentTurn = "Computer Move") {
        var computerChoice = this.computer.easyAiMoves();
        var computerMove = this.computer.makeAttack(computerChoice);
        this.player1.gameBoard.receiveAttack(computerMove);
        this.player1.gameBoard.display();
        return computerChoice;
      }
    }
  }, {
    key: "updateState",
    value: function updateState() {
      if (this.currentState === "Game Set-Up") {
        var turnValue = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        this.currentState = "Game Play Phase";
        if (turnValue === 1) {
          return this.currentTurn = "Player Move";
        } else {
          return this.currentTurn = "Computer Move";
        }
      }
      if (this.currentTurn === "Player Move") {
        return this.currentTurn = "Computer Move";
      }
      if (this.currentTurn === "Computer Move") {
        return this.currentTurn = "Player Move";
      }
    }
  }, {
    key: "checkWinner",
    value: function checkWinner() {
      if (this.player1.gameBoard.gameOver()) {
        console.log("Computer Wins");
        return true;
      }
      if (this.computer.gameBoard.gameOver()) {
        console.log("Player Wins");
        return true;
      }
    }
  }, {
    key: "start",
    value: function start() {
      while (!this.checkWinner()) {
        this.updateState();
        this.playTurn();
      }
    }
  }]);
  return Game;
}();
module.exports = Game;

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

/***/ "./placeBoardMarker.js":
/*!*****************************!*\
  !*** ./placeBoardMarker.js ***!
  \*****************************/
/***/ ((module) => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function placeBoardMarker(game, move, turn) {
  if (turn == "Computer Move") {
    var playerBoard = document.querySelector("div#".concat(game.player1.name, ".gameBoard"));
    for (var shipType in game.player1.gameBoard.ship) {
      var _iterator = _createForOfIteratorHelper(game.player1.gameBoard.ship[shipType].coordinates),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var coordinate = _step.value;
          var shipBox = playerBoard.querySelector("div#".concat(coordinate, ".box"));
          if (move === coordinate) {
            shipBox.classList.add("placed");
            shipBox.classList.add("hit");
            shipBox.dataset.ship = shipType;
            shipBox.id = "player";
            shipBox.textContent = "X";
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    var shipBoxMissed = playerBoard.querySelector("div#".concat(move, ".box"));
    shipBoxMissed.classList.add("miss");
    shipBoxMissed.id = "player";
    shipBoxMissed.textContent = "·";
  }
  if (turn == "Player Move") {
    console.log(move);
    var computerBoard = document.querySelector("div#computer.gameBoard");
    for (var _shipType in game.computer.gameBoard.ship) {
      var _iterator2 = _createForOfIteratorHelper(game.computer.gameBoard.ship[_shipType].coordinates),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _coordinate = _step2.value;
          var _shipBox = computerBoard.querySelector("div#".concat(_coordinate, ".box"));
          if (move === _coordinate) {
            _shipBox.classList.add("placed");
            _shipBox.classList.add("hit");
            _shipBox.dataset.ship = _shipType;
            _shipBox.id = "computer";
            _shipBox.textContent = "X";
            return;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    var _shipBoxMissed = computerBoard.querySelector("div#".concat(move, ".box"));
    _shipBoxMissed.classList.add("miss");
    _shipBoxMissed.id = "computer";
    _shipBoxMissed.textContent = "·";
  }
  return;
}
module.exports = placeBoardMarker;

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
  }, {
    key: "placeAllShipsForAI",
    value: function placeAllShipsForAI() {
      if (!this.Ai) {
        throw new Error("Access to placeAllShipsForAI is restricted.");
      }
      for (var shipName in this.gameBoard.ship) {
        var placed = false;
        while (!placed) {
          // Select a random starting coordinate
          var randomMove = this.easyAiMoves();

          // Choose a random orientation
          var orientation = this.aiShipOrientation();

          // Check if the ship will fit within the bounds based on its starting coordinate, orientation, and length
          if (this.isShipPlacementValid(shipName, randomMove, orientation)) {
            // If it's a valid placement, attempt to place the ship
            placed = this.gameBoard.placeShip(shipName, randomMove, orientation);
          }
          if (placed) {
            // Remove the placed move from completed moves so it can be used by the AI during the game
            this.completedMoves.pop();
          }
        }
      }
    }

    // Helper function to check if a ship will fit within the board
  }, {
    key: "isShipPlacementValid",
    value: function isShipPlacementValid(shipName, startingCoordinate, orientation) {
      var shipLength = this.gameBoard.ship[shipName].instance.length;
      var currentCoordinate = startingCoordinate;
      for (var i = 0; i < shipLength; i++) {
        // Check for out-of-bounds
        if (orientation === "Horizontal" && parseInt(currentCoordinate.substring(1), 10) + shipLength > 10) {
          return false;
        } else if (orientation === "Vertical" && this.gameBoard.charToRowIndex(currentCoordinate.charAt(0)) + shipLength > 9) {
          return false;
        }
        if (i < shipLength - 1) {
          currentCoordinate = orientation === "Vertical" ? this.gameBoard.getBelowAlias(currentCoordinate) : this.gameBoard.getRightAlias(currentCoordinate);
        }
      }
      return true;
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
}

.box.placed.hit {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-weight: 100;
} 

.box.miss {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    font-weight: 100;
    background-color: rgba(128, 128, 128, 0.8);
    color: white;
} `, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.placed {\r\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.placedText {\r\n    display: flex;\r\n    color: greenyellow;\r\n}\r\n\r\n.placedText#horizontal {\r\n    font-size: x-large;\r\n    margin-left: 1.5em;\r\n}\r\n\r\n.placedText#vertical {\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 100%;\r\n    font-size: large;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 60vh;\r\n    width: 60vw;\r\n    border: 3px solid black;\r\n}\r\n\r\n.gameStartContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 100%;\r\n    font-style: italic;\r\n    font-weight: 600;\r\n    \r\n}\r\n\r\n.playerInputNameLabel {\r\n    font-size: xx-large;\r\n}\r\n\r\n.playerInputName {\r\n    height: 50px;    \r\n    margin-top: 0.5em;\r\n    width: 60%;\r\n    font-size: 40px;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    font-size: x-large;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 12em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 8em;\r\n}\r\n\r\n#initPlaceButton {\r\n    background-color: rgb(56, 17, 194);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: xx-large;\r\n}\r\n\r\n#initPlaceButton:hover {\r\n    color: rgb(238, 255, 0);\r\n}\r\n\r\n#initStartButton {\r\n    background-color: rgb(194, 27, 27);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalDraggable {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}\r\n\r\n.box.placed.hit {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 50px;\r\n    font-weight: 100;\r\n} \r\n\r\n.box.miss {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 100px;\r\n    font-weight: 100;\r\n    background-color: rgba(128, 128, 128, 0.8);\r\n    color: white;\r\n} "],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8saUZBQWlGLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFFBQVEsS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFlBQVksYUFBYSxRQUFRLEtBQUssWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFV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QztBQUNyRCxJQUFNcUIsZUFBZSxHQUFJckIsbUJBQU8sQ0FBQywrQ0FBbUIsQ0FBQztBQUNyRCxJQUFNK0gsWUFBWSxHQUFHL0gsbUJBQU8sQ0FBQyxxREFBc0IsQ0FBQztBQUNwREEsbUJBQU8sQ0FBQywwQ0FBa0IsQ0FBQztBQUUzQnVMLFlBQVksQ0FBQzBDLEtBQUssQ0FBQyxDQUFDO0FBRXBCbEcsWUFBWSxDQUFDLElBQUksQ0FBQztBQUNsQixJQUFJbUcsVUFBVSxHQUFHelIsUUFBUSxDQUFDeUUsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0FBQy9ELElBQUlpTixpQkFBaUIsR0FBRzlELFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztBQUN0RDZELFVBQVUsQ0FBQ3pRLFdBQVcsQ0FBQzBRLGlCQUFpQixDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXBQaWVjZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9jcmVhdGVHYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lRHJpdmVyU2NyaXB0LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9uYXZpZ2F0aW9uQ29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3BsYWNlQm9hcmRNYXJrZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zaGlwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vdXBkYXRlQ3VycmVudFBoYXNlLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3MiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcz9lMGZlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9pbml0aWFsaXplR2FtZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZHJhZ0RhdGEgPSB7XHJcbiAgICBkcmFnZ2VkU2hpcDogbnVsbFxyXG59O1xyXG5cclxuZnVuY3Rpb24gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gICAgbGV0IGJveEhlaWdodCA9IDQ4O1xyXG4gICAgbGV0IGlzVmVydGljYWwgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xyXG5cclxuICAgIHBpZWNlc0NvbnRhaW5lci5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lclwiIDogXCJwaWVjZXNDb250YWluZXJcIjtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICBsZXQgc2hpcEF0dHJpYnV0ZSA9IHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2U7XHJcbiAgICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwQ29udGFpbmVyXCIgOiBcInNoaXBDb250YWluZXJcIjtcclxuICAgIFxyXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBOYW1lXCIgOiBcInNoaXBOYW1lXCI7XHJcbiAgICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcbiAgICBcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7IC8vIEFkZCB0aGUgc2hpcFRpdGxlIGZpcnN0IFxyXG4gICAgXHJcbiAgICAgICAgbGV0IHNoaXBQaWVjZTtcclxuICAgIFxyXG4gICAgICAgIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlZERpdik7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoaXNWZXJ0aWNhbCA/IFwidmVydGljYWxEcmFnZ2FibGVcIiA6IFwiZHJhZ2dhYmxlXCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUgOiBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5zdHlsZS53aWR0aCA9IGlzVmVydGljYWwgPyBib3hXaWR0aCArIFwicHhcIiA6IChib3hXaWR0aCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIjtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IGlzVmVydGljYWwgPyAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiIDogYm94SGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogY2xpY2tlZEJveE9mZnNldFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRyYWdEYXRhLmRyYWdnZWRTaGlwID0gc2hpcERhdGE7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicsIEpTT04uc3RyaW5naWZ5KHNoaXBEYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFggPSBzaGlwSGVhZFJlY3QubGVmdCAtIHNoaXBQaWVjZVJlY3QubGVmdCArIChzaGlwSGVhZFJlY3Qud2lkdGggLyAyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShzaGlwUGllY2UsIG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEF0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSBib3hXaWR0aCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwUGllY2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2hpcFBpZWNlLmFwcGVuZENoaWxkKHNoaXBCb3gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFBpZWNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtiYXR0bGVzaGlwUGllY2VzLCBkcmFnRGF0YSB9OyIsImNvbnN0IHsgZHJhZ0RhdGEgfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBnYW1lRHJpdmVyU2NyaXB0ID0gcmVxdWlyZSgnLi9nYW1lRHJpdmVyU2NyaXB0Jyk7XHJcblxyXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcclxuXHJcbmZ1bmN0aW9uIGdldEFmZmVjdGVkQm94ZXMoaGVhZFBvc2l0aW9uLCBsZW5ndGgsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBjb25zdCBib3hlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoaGVhZFBvc2l0aW9uLnNsaWNlKDEpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgaSkgKyBudW1QYXJ0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hlcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGJveElkWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcclxuXHJcbiAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gb2Zmc2V0O1xyXG5cclxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICByZXR1cm4gYWRqdXN0ZWROdW1QYXJ0ID4gMCAmJiBhZGp1c3RlZE51bVBhcnQgKyBsZW5ndGggLSAxIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbZGF0YS1zaGlwLW9yaWVudGF0aW9uXVwiKTtcclxuICAgIHJldHVybiBzaGlwT3JpZW50YXRpb25FbGVtZW50ID8gc2hpcE9yaWVudGF0aW9uRWxlbWVudC5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA6IFwiSG9yaXpvbnRhbFwiO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZUJvYXJkKGdhbWUsIHBsYXllcikge1xyXG4gICAgXHJcblxyXG4gICAgLy8gR2VuZXJhdGUgZGl2IGVsZW1lbnRzIGZvciBHYW1lIEJvYXJkXHJcbiAgICBsZXQgZ2FtZUJvYXJkQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRUb3BDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBhbHBoYUNvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBudW1lcmljQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIFxyXG4gICBcclxuICAgICAvLyBBc3NpZ25pbmcgY2xhc3NlcyB0byB0aGUgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgIGdhbWVCb2FyZENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lclwiO1xyXG4gICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciB0b3BcIjtcclxuICAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgYm90dG9tXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmlkID0gcGxheWVyLm5hbWU7IC8vIEFzc3VtaW5nIHRoZSBwbGF5ZXIgaXMgYSBzdHJpbmcgbGlrZSBcInBsYXllcjFcIlxyXG4gICAgIGFscGhhQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJhbHBoYUNvb3JkaW5hdGVzXCI7XHJcbiAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwibnVtZXJpY0Nvb3JkaW5hdGVzXCI7XHJcblxyXG4gICAgIC8vIENyZWF0ZSBjb2x1bW4gdGl0bGVzIGVxdWFsIHRvIHdpZHRoIG9mIGJvYXJkXHJcbiAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb2x1bW5UaXRsZS50ZXh0Q29udGVudCA9IGk7XHJcbiAgICAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmFwcGVuZENoaWxkKGNvbHVtblRpdGxlKTtcclxuICAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmFwcGVuZENoaWxkKG51bWVyaWNDb29yZGluYXRlcyk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgcm93cyBhbmQgcm93IHRpdGxlcyBlcXVhbCB0byBoZWlnaHRcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7IGkrKykge1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpICsgNjUpO1xyXG5cclxuICAgICAgICBsZXQgcm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvd1RpdGxlLnRleHRDb250ZW50ID0gYWxwaGFDaGFyO1xyXG4gICAgICAgIGFscGhhQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQocm93VGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuICAgICAgICByb3cuaWQgPSBhbHBoYUNoYXI7XHJcblxyXG4gICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgbGV0IHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFtdO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIGNvb3JkaW5hdGUgY29sdW1ucyBmb3IgZWFjaCByb3dcclxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBqKyspIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XHJcbiAgICAgICAgICAgIGJveC5pZCA9IGFscGhhQ2hhciArIGpcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IGRyYWdEYXRhLmRyYWdnZWRTaGlwO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFsuLi5hZmZlY3RlZEJveGVzXTsgLy8gbWFrZSBhIHNoYWxsb3cgY29weSAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoaXBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTaGlwIGRhdGEgaXMgbnVsbCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgb3V0IGlmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkUGxhY2VtZW50ID0gaXNWYWxpZFBsYWNlbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEubGVuZ3RoLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEub2Zmc2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRQbGFjZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcyA9IGdldEFmZmVjdGVkQm94ZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEubGVuZ3RoLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuZHJhZ0FmZmVjdGVkID0gXCJ0cnVlXCI7IC8vIEFkZCB0aGlzIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMCk7IC8vIGRlbGF5IG9mIDAgbXMsIGp1c3QgZW5vdWdoIHRvIGxldCBkcmFnbGVhdmUgaGFwcGVuIGZpcnN0IGlmIGl0J3MgZ29pbmcgdG9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm94W2RhdGEtZHJhZy1hZmZlY3RlZD1cInRydWVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzbHlBZmZlY3RlZEJveGVzLmZvckVhY2gocHJldkJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJyk7IC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXJMZXR0ZXJCb3VuZCA9IDY1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyTGV0dGVyQm91bmQgPSA3NDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94LmlkWzBdOyAgLy8gQXNzdW1pbmcgdGhlIGZvcm1hdCBpcyBhbHdheXMgbGlrZSBcIkE1XCJcclxuICAgICAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3guaWQuc2xpY2UoMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gc2hpcERhdGEub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiA9IGNoYXJQYXJ0ICsgYWRqdXN0ZWROdW1QYXJ0OyAgLy8gVGhlIG5ldyBwb3NpdGlvbiBmb3IgdGhlIGhlYWQgb2YgdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwRGF0YS5sZW5ndGgsIHNoaXBPcmllbnRhdGlvbilcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFkanVzdGVkIHBvc2l0aW9uIGJhc2VkIG9uIHdoZXJlIHRoZSB1c2VyIGNsaWNrZWQgb24gdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRDb29yZGluYXRlID0gKGNoYXJQYXJ0ICsgbnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ2hhciA9IGNoYXJQYXJ0LmNoYXJDb2RlQXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYWNlbWVudCBpcyBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiICYmIChhZGp1c3RlZE51bVBhcnQgPD0gMCB8fCBhZGp1c3RlZE51bVBhcnQgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gcGxheWVyLmdhbWVCb2FyZC53aWR0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiVmVydGljYWxcIiAmJiAoc2VsZWN0ZWRDaGFyICsgc2hpcERhdGEubGVuZ3RoIDwgbG93ZXJMZXR0ZXJCb3VuZCB8fCBzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gdXBwZXJMZXR0ZXJCb3VuZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcERhdGEubmFtZSwgaGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3ZlcmxhcHBpbmcgU2hpcC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuaGl0TWFya2VyID0gXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5zaGlwID0gc2hpcERhdGEubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWZXJ0aWNhbCA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBBdHRlbXB0aW5nIHRvIHBsYWNlICR7c2hpcERhdGEubmFtZX0gd2l0aCBsZW5ndGggJHtzaGlwRGF0YS5sZW5ndGh9IGF0IHBvc2l0aW9uICR7YWRqdXN0ZWRUYXJnZXRQb3NpdGlvbn0uYCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiMke3NoaXBEYXRhLm5hbWV9LmRyYWdnYWJsZS5zaGlwYClcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiVmVydGljYWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2I3ZlcnRpY2FsJHtzaGlwRGF0YS5uYW1lfS52ZXJ0aWNhbERyYWdnYWJsZS5zaGlwYClcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RWxlbWVudCA9IHNoaXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBzaGlwRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYudGV4dENvbnRlbnQgPSBcIlBsYWNlZFwiO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgbmV3IGRpdiB0byB0aGUgcGFyZW50IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGxhY2VkRGl2KTtcclxuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjtcclxuICAgICAgICAgICAgICAgIC8vIGxldCBzaGlwT2JqZWN0TmFtZSA9IHNoaXBEYXRhLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0JveGVzID0gYWZmZWN0ZWRCb3hlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyR3Vlc3MgPSBlLnRhcmdldC5pZDtcclxuICAgICAgICAgICAgICAgIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IHBsYWNlQm9hcmRNYXJrZXIgPSByZXF1aXJlKCcuL3BsYWNlQm9hcmRNYXJrZXInKTtcclxuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpIHtcclxuXHJcbiAgICBpZiAoZ2FtZS5jaGVja1dpbm5lcigpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJXb09cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coZ2FtZS5wbGF5VHVybihwbGF5ZXJHdWVzcykpO1xyXG5cclxuICAgIGlmICghZ2FtZS5wbGF5VHVybihwbGF5ZXJHdWVzcykpIHtcclxuICAgICAgICBhbGVydChcIkludmFsaWQgTW92ZSEgVHJ5IGFnYWluLlwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBpZiAoZ2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiICYmIGdhbWUuY3VycmVudFR1cm4gPT0gXCJQbGF5ZXIgTW92ZVwiKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBwbGF5ZXJHdWVzcywgZ2FtZS5jdXJyZW50VHVybik7XHJcbiAgICAgICAgZ2FtZS51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcclxuICAgIH1cclxuICAgIC8vIGdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFBsYXkgUGhhc2VcIiAmJlxyXG4gICAgaWYgKCBnYW1lLmN1cnJlbnRUdXJuID09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvbXB1dGVyR3Vlc3MgPSBnYW1lLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxyXG4gICAgICAgIGdhbWUudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICBwaGFzZVVwZGF0ZXIoZ2FtZSk7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVEcml2ZXJTY3JpcHQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJylcclxuXHJcbmNsYXNzIEdhbWUge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZUlkLCBwbGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lSWQgPSBnYW1lSWQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihwbGF5ZXJOYW1lKTtcclxuICAgICAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG4gICAgICAgIHRoaXMucGhhc2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE8tRE8gcHJvbXB0VXNlckNvb3JkaW5hdGUoKSwgcHJvbXB0VXNlck9yaWVudGF0aW9uKCksIGNoZWNrV2lubmVyKCk7XHJcblxyXG4gICAgY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGVzIGluIHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZXNdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VDb21wdXRlclNoaXAoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAoY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCBjb21wdXRlckNvb3JkaW5hdGUsIGNvbXB1dGVyT3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGlhbGl6ZUdhbWUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiXHJcbiAgICAgICAgY29uc3Qgc2hpcFR5cGVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xyXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNoaXAgb2Ygc2hpcFR5cGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VQbGF5ZXJTaGlwcyhzaGlwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUNvbXB1dGVyU2hpcChzaGlwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVR1cm4obW92ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWRNb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJNb3ZlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKCFpc1ZhbGlkTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJNb3ZlID0gdGhpcy5wbGF5ZXIxLm1ha2VBdHRhY2sobW92ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllck1vdmU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7IC8vIE91dHB1dCB0aGUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICBcclxuXHJcbiAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFR1cm4gPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IHRoaXMuY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcbiAgICAgICAgICAgICh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLmRpc3BsYXkoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlckNob2ljZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0dXJuVmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSkgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBQbGF5IFBoYXNlXCJcclxuICAgICAgICAgICAgaWYgKHR1cm5WYWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFR1cm4gPSBcIlBsYXllciBNb3ZlXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VHVybiA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUdXJuID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFR1cm4gPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXB1dGVyIFdpbnNcIilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBXaW5zXCIpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHdoaWxlKCF0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTmF2VWkgKCkge1xyXG5cclxuICAgIGxldCBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHBsYXllck5hbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5jbGFzc05hbWUgPSBcInBsYXllck5hbWVDb250YWluZXJcIjtcclxuICAgIGxldCBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyXCI7XHJcbiAgICBsZXQgaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBpbml0aWFsaXplQnV0dG9uQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBwbGF5ZXJOYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwuY2xhc3NOYW1lID0gXCJwbGF5ZXJJbnB1dE5hbWVMYWJlbFwiXHJcbiAgICBwbGF5ZXJOYW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIkVudGVyIHlvdXIgbmFtZTpcIjtcclxuICAgIHBsYXllck5hbWVMYWJlbC5odG1sRm9yID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcclxuICAgIHBsYXllck5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUxhYmVsKTtcclxuXHJcbiAgICBsZXQgaXNWYWxpZElucHV0ID0gZmFsc2U7ICAvLyBUaGlzIHdpbGwgYmUgdXNlZCB0byBzdG9yZSB0aGUgaW5wdXQgdmFsaWRpdHlcclxuICAgIGxldCByYXdJbnB1dDtcclxuXHJcbiAgICBsZXQgcGxheWVySW5wdXROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcGxheWVySW5wdXROYW1lLmNsYXNzTmFtZSA9IFwicGxheWVySW5wdXROYW1lXCI7XHJcbiAgICBwbGF5ZXJJbnB1dE5hbWUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmF3SW5wdXQgPSBwbGF5ZXJJbnB1dE5hbWUudmFsdWU7XHJcbiAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBwbGF5ZXJJbnB1dE5hbWUudmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJjb21wdXRlclwiIHx8IGlucHV0VmFsdWUgPT09IFwiYWlcIikge1xyXG4gICAgICAgICAgICBhbGVydCgnVGhlIG5hbWUgY2Fubm90IGJlIFwiY29tcHV0ZXJcIiBvciBcImFpXCIuJyk7XHJcbiAgICAgICAgICAgIHBsYXllcklucHV0TmFtZS52YWx1ZSA9ICcnOyAvLyBDbGVhciB0aGUgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgaXNWYWxpZElucHV0ID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dFZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaXNWYWxpZElucHV0ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpc1ZhbGlkSW5wdXQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllcklucHV0TmFtZSk7XHJcblxyXG4gICAgbGV0IGVhc3lSYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGVhc3lSYWRpby50eXBlID0gXCJyYWRpb1wiO1xyXG4gICAgZWFzeVJhZGlvLm5hbWUgPSBcImRpZmZpY3VsdHlcIjtcclxuICAgIGVhc3lSYWRpby52YWx1ZSA9IFwiZWFzeVwiO1xyXG4gICAgZWFzeVJhZGlvLmlkID0gXCJlYXN5XCI7XHJcbiAgICBsZXQgZWFzeUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgZWFzeUxhYmVsLmh0bWxGb3IgPSBcImVhc3lcIjtcclxuICAgIGVhc3lMYWJlbC50ZXh0Q29udGVudCA9IFwiRWFzeSBCYXR0bGVzaGlwIEFJXCI7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWFzeVJhZGlvKTtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChlYXN5TGFiZWwpO1xyXG5cclxuICAgIC8vIFJhZGlvIGJ1dHRvbiBmb3IgaGFyZCBkaWZmaWN1bHR5XHJcbiAgICBsZXQgaGFyZFJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaGFyZFJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICBoYXJkUmFkaW8ubmFtZSA9IFwiZGlmZmljdWx0eVwiO1xyXG4gICAgaGFyZFJhZGlvLnZhbHVlID0gXCJoYXJkXCI7XHJcbiAgICBoYXJkUmFkaW8uaWQgPSBcImhhcmRcIjtcclxuICAgIGxldCBoYXJkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBoYXJkTGFiZWwuaHRtbEZvciA9IFwiaGFyZFwiO1xyXG4gICAgaGFyZExhYmVsLnRleHRDb250ZW50ID0gXCJIYXJkIEJhdHRsZXNoaXAgQUlcIjtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkUmFkaW8pO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGhhcmRMYWJlbCk7XHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZSBidXR0b25cclxuICAgIGxldCBpbml0aWFsaXplQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGluaXRpYWxpemVCdXR0b24udGV4dENvbnRlbnQgPSBcIlBsYWNlIFBpZWNlc1wiO1xyXG4gICAgaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpbml0aWFsaXplQnV0dG9uKTtcclxuICAgIGluaXRpYWxpemVCdXR0b24uaWQgPSBcImluaXRQbGFjZUJ1dHRvblwiO1xyXG4gICAgaW5pdGlhbGl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGlzVmFsaWRJbnB1dCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVmFsaWQgaW5wdXQhIEluaXRpYWxpemluZyBnYW1lLi4uJyk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwbGF5ZXJOYW1lJywgcmF3SW5wdXQpO1xyXG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFsc28gZG8gbW9yZSwgbGlrZSBjaGVja2luZyBpZiBhIGRpZmZpY3VsdHkgaXMgc2VsZWN0ZWQgZXRjLlxyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiYmF0dGxlc2hpcC5odG1sXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ludmFsaWQgaW5wdXQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAvLyBBcHBlbmQgdGhlIGNvbnRhaW5lcnMgdG8gdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbml0aWFsaXplQnV0dG9uQ29udGFpbmVyKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVJbml0aWFsaXplckNvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVOYXZVaTsiLCJmdW5jdGlvbiBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIG1vdmUsIHR1cm4pIHtcclxuXHJcbiAgICBpZiAodHVybiA9PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgIGxldCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2dhbWUucGxheWVyMS5uYW1lfS5nYW1lQm9hcmRgKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGUgaW4gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlXS5jb29yZGluYXRlcykge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2Nvb3JkaW5hdGV9LmJveGApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBpZiAobW92ZSA9PT0gY29vcmRpbmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5kYXRhc2V0LnNoaXAgPSBzaGlwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJwbGF5ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3gudGV4dENvbnRlbnQgPSBcIlhcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwQm94TWlzc2VkID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihgZGl2IyR7bW92ZX0uYm94YCk7XHJcbiAgICBcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5pZCA9IFwicGxheWVyXCJcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC50ZXh0Q29udGVudCA9IFwiwrdcIlxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHVybiA9PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhtb3ZlKVxyXG4gICAgICAgIGxldCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdiNjb21wdXRlci5nYW1lQm9hcmRcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHNoaXBUeXBlIGluIGdhbWUuY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiBnYW1lLmNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlXS5jb29yZGluYXRlcykge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvcihgZGl2IyR7Y29vcmRpbmF0ZX0uYm94YCk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBjb29yZGluYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwicGxhY2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmRhdGFzZXQuc2hpcCA9IHNoaXBUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcImNvbXB1dGVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LnRleHRDb250ZW50ID0gXCJYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwQm94TWlzc2VkID0gY29tcHV0ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBkaXYjJHttb3ZlfS5ib3hgKTtcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5pZCA9IFwiY29tcHV0ZXJcIlxyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLnRleHRDb250ZW50ID0gXCLCt1wiXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG5cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcGxhY2VCb2FyZE1hcmtlcjsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9nYW1lQm9hcmRcIik7XHJcblxyXG5cclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLkFpID0gdGhpcy5pc0FpKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBjYXBpdGFsaXplRmlyc3Qoc3RyKSB7XHJcbiAgICAgICAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUF0dGFjayhjb29yZGluYXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpICYmICF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vdmUgaXMgYWxyZWFkeSBtYWRlXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBaShuYW1lKSB7XHJcbiAgICAgICAgbGV0IGNoZWNrID0gdGhpcy5jYXBpdGFsaXplRmlyc3QobmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrID09IFwiQ29tcHV0ZXJcIiB8fCBjaGVjayA9PSBcIkFpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEFsbFBvc3NpYmxlTW92ZXMoKSB7XHJcbiAgICAgICAgbGV0IGFsbE1vdmVzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgY29sdW1uTnVtYmVyID0gMDsgY29sdW1uTnVtYmVyIDwgdGhpcy5nYW1lQm9hcmQud2lkdGg7IGNvbHVtbk51bWJlcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvd051bWJlciA9IDE7IHJvd051bWJlciA8PSB0aGlzLmdhbWVCb2FyZC5oZWlnaHQ7IHJvd051bWJlcisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQWxpYXMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbk51bWJlciArIDY1KTtcclxuICAgICAgICAgICAgICAgIGFsbE1vdmVzLnB1c2goY29sdW1uQWxpYXMgKyByb3dOdW1iZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxNb3ZlcztcclxuICAgIH1cclxuXHJcbiAgICBlYXN5QWlNb3ZlcygpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY2VzcyB0byBlYXN5QWlNb3ZlcyBpcyByZXN0cmljdGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzZXQgb2YgYWxsIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCBhbGxQb3NzaWJsZU1vdmVzID0gdGhpcy5nZXRBbGxQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCB1bnBsYXllZE1vdmVzID0gYWxsUG9zc2libGVNb3Zlcy5maWx0ZXIobW92ZSA9PiAhdGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhtb3ZlKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdW5wbGF5ZWQgbW92ZXMgbGVmdCwgcmFpc2UgYW4gZXJyb3Igb3IgaGFuZGxlIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGlmICh1bnBsYXllZE1vdmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxsIG1vdmVzIGhhdmUgYmVlbiBwbGF5ZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSYW5kb21seSBzZWxlY3QgYSBtb3ZlIGZyb20gdGhlIHNldCBvZiB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSB0aGlzLmdldFJhbmRvbUludCgwLCB1bnBsYXllZE1vdmVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgbW92ZSA9IHVucGxheWVkTW92ZXNbcmFuZG9tSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKG1vdmUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgYWlTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJIb3Jpem9udGFsXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVmVydGljYWxcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VBbGxTaGlwc0ZvckFJKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gcGxhY2VBbGxTaGlwc0ZvckFJIGlzIHJlc3RyaWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGFjZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghcGxhY2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3QgYSByYW5kb20gc3RhcnRpbmcgY29vcmRpbmF0ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tTW92ZSA9IHRoaXMuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQ2hvb3NlIGEgcmFuZG9tIG9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IHRoaXMuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNoaXAgd2lsbCBmaXQgd2l0aGluIHRoZSBib3VuZHMgYmFzZWQgb24gaXRzIHN0YXJ0aW5nIGNvb3JkaW5hdGUsIG9yaWVudGF0aW9uLCBhbmQgbGVuZ3RoXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NoaXBQbGFjZW1lbnRWYWxpZChzaGlwTmFtZSwgcmFuZG9tTW92ZSwgb3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQncyBhIHZhbGlkIHBsYWNlbWVudCwgYXR0ZW1wdCB0byBwbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlZCA9IHRoaXMuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwTmFtZSwgcmFuZG9tTW92ZSwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAocGxhY2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBwbGFjZWQgbW92ZSBmcm9tIGNvbXBsZXRlZCBtb3ZlcyBzbyBpdCBjYW4gYmUgdXNlZCBieSB0aGUgQUkgZHVyaW5nIHRoZSBnYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgaWYgYSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm9hcmRcclxuICAgIGlzU2hpcFBsYWNlbWVudFZhbGlkKHNoaXBOYW1lLCBzdGFydGluZ0Nvb3JkaW5hdGUsIG9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHRoaXMuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICBsZXQgY3VycmVudENvb3JkaW5hdGUgPSBzdGFydGluZ0Nvb3JkaW5hdGU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIiAmJiBwYXJzZUludChjdXJyZW50Q29vcmRpbmF0ZS5zdWJzdHJpbmcoMSksIDEwKSArIHNoaXBMZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCIgJiYgdGhpcy5nYW1lQm9hcmQuY2hhclRvUm93SW5kZXgoY3VycmVudENvb3JkaW5hdGUuY2hhckF0KDApKSArIHNoaXBMZW5ndGggPiA5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb29yZGluYXRlID0gb3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIiBcclxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZ2FtZUJvYXJkLmdldEJlbG93QWxpYXMoY3VycmVudENvb3JkaW5hdGUpIFxyXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5nYW1lQm9hcmQuZ2V0UmlnaHRBbGlhcyhjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7IiwiXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcclxuICAgICAgICAgICAgQ2FycmllcjogNSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDogNCxcclxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IDIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnNoaXBUeXBlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2V0TGVuZ3RoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExlbmd0aChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY2FwaXRhbGl6ZWRTaGlwTmFtZSA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcclxuICAgICAgICB0aGlzLmlzU3VuaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsImZ1bmN0aW9uIHBoYXNlVXBkYXRlcihnYW1lKSB7XHJcblxyXG4gICAgbGV0IGdhbWVQaGFzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVBoYXNlXCIpO1xyXG4gICAgbGV0IHBsYXllclR1cm4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllclR1cm5cIik7XHJcblxyXG4gICAgaWYgKGdhbWUgPT0gbnVsbCkge1xyXG4gICAgICAgIGdhbWVQaGFzZS50ZXh0Q29udGVudCA9IFwiR2FtZSBJbml0aWFsaXp0aW9uXCJcclxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gXCJcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50U3RhdGU7XHJcbiAgICAgICAgcGxheWVyVHVybi50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFR1cm47XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBoYXNlVXBkYXRlcjsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4ucGxhY2VkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxufVxyXG5cclxuLnNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGNvbG9yOiBncmVlbnllbGxvdztcclxufVxyXG5cclxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogNjB2aDtcclxuICAgIHdpZHRoOiA2MHZ3O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lU3RhcnRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDIwMHB4O1xyXG4gICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIFxyXG59XHJcblxyXG4ucGxheWVySW5wdXROYW1lTGFiZWwge1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuLnBsYXllcklucHV0TmFtZSB7XHJcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbiAgICB3aWR0aDogNjAlO1xyXG4gICAgZm9udC1zaXplOiA0MHB4O1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XHJcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcclxuICAgIG1hcmdpbi1yaWdodDogOGVtO1xyXG59XHJcblxyXG4jaW5pdFBsYWNlQnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XHJcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk0LCAyNywgMjcpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxEcmFnZ2FibGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxufVxyXG5cclxuXHJcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxyXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xyXG59XHJcblxyXG4uYm94LnBsYWNlZC5oaXQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogNTBweDtcclxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XHJcbn0gXHJcblxyXG4uYm94Lm1pc3Mge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMTAwcHg7XHJcbiAgICBmb250LXdlaWdodDogMTAwO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMjgsIDEyOCwgMTI4LCAwLjgpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59IGAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vYmF0dGxlc2hpcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLFlBQVk7SUFDWixlQUFlO0FBQ25COztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixVQUFVO0lBQ1YsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsVUFBVTtJQUNWLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsWUFBWTtJQUNaLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25C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QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0FBQ3ZFOztBQUVBO0lBQ0ksZUFBZTtJQUNmLGtCQUFrQjtBQUN0Qjs7O0FBR0E7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0lBQ25FLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFlBQVksR0FBRyxtQ0FBbUM7SUFDbEQsV0FBVztJQUNYLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxzQkFBc0IsRUFBRSxpREFBaUQ7QUFDN0U7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQiwwQ0FBMEM7SUFDMUMsWUFBWTtBQUNoQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUhlYWRlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDE1JTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4jYmF0dGxlc2hpcFRpdGxlIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgaGVpZ2h0OiA3MCU7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLXRvcDogM2VtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW4tTGVmdCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiA4MCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGhlaWdodDogOTAlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XFxyXFxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogNTAwcHg7XFxyXFxuICAgIHdpZHRoOiA1MDBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnJvdywgLnNoaXAge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5zaGlwIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmJveCB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmJveDpob3ZlciB7XFxyXFxuICAgIHdpZHRoOiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uaGlnaGxpZ2h0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAzNTBweDtcXHJcXG4gICAgd2lkdGg6IDQyNXB4O1xcclxcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXHJcXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBib3gge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogNjB2aDtcXHJcXG4gICAgd2lkdGg6IDYwdnc7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMjAwcHg7XFxyXFxuICAgIHdpZHRoOiAyMDBweDtcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gICAgXFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWUge1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxcclxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXHJcXG4gICAgd2lkdGg6IDYwJTtcXHJcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcclxcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b24ge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xcclxcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XFxyXFxuXFxyXFxuLmJveC5wbGFjZWQuaGl0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGZvbnQtc2l6ZTogNTBweDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDEwMDtcXHJcXG59IFxcclxcblxcclxcbi5ib3gubWlzcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBmb250LXNpemU6IDEwMHB4O1xcclxcbiAgICBmb250LXdlaWdodDogMTAwO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuOCk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG59IFwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIlxyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xyXG5jb25zdCBjcmVhdGVOYXZVaSA9IHJlcXVpcmUoJy4vbmF2aWdhdGlvbkNvbXBvbmVudHMnKTtcclxuY29uc3QgY3JlYXRlR2FtZUJvYXJkID0gIHJlcXVpcmUoJy4vY3JlYXRlR2FtZUJvYXJkJyk7XHJcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XHJcbnJlcXVpcmUoJy4vYmF0dGxlc2hpcC5jc3MnKTtcclxuXHJcbmxvY2FsU3RvcmFnZS5jbGVhcigpXHJcblxyXG5waGFzZVVwZGF0ZXIobnVsbCk7XHJcbmxldCBnYW1lU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lU2NyZWVuQ29udGFpbmVyXCIpO1xyXG5sZXQgZ2FtZUluaXRDb21wb25lbnQgPSBjcmVhdGVOYXZVaShcImdhbWVJbml0aWFsaXplclwiKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChnYW1lSW5pdENvbXBvbmVudCk7XHJcblxyXG4iXSwibmFtZXMiOlsiZHJhZ0RhdGEiLCJkcmFnZ2VkU2hpcCIsImJhdHRsZXNoaXBQaWVjZXMiLCJwbGF5ZXIiLCJvcmllbnRhdGlvbiIsInBpZWNlc0NvbnRhaW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJveFdpZHRoIiwiYm94SGVpZ2h0IiwiaXNWZXJ0aWNhbCIsImNsYXNzTmFtZSIsIl9sb29wIiwic2hpcEF0dHJpYnV0ZSIsImdhbWVCb2FyZCIsInNoaXAiLCJzaGlwTmFtZSIsImluc3RhbmNlIiwic2hpcENvbnRhaW5lciIsInNoaXBUaXRsZSIsInRleHRDb250ZW50IiwibmFtZSIsImFwcGVuZENoaWxkIiwic2hpcFBpZWNlIiwiY29vcmRpbmF0ZXMiLCJsZW5ndGgiLCJwbGFjZWREaXYiLCJpZCIsInN0eWxlIiwianVzdGlmeUNvbnRlbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJ3aWR0aCIsImhlaWdodCIsImRyYWdnYWJsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImNsaWNrZWRCb3hPZmZzZXQiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJzaGlwRGF0YSIsIm9mZnNldCIsImRhdGFUcmFuc2ZlciIsInNldERhdGEiLCJKU09OIiwic3RyaW5naWZ5Iiwic2hpcEhlYWRSZWN0IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzaGlwUGllY2VSZWN0Iiwib2Zmc2V0WCIsImxlZnQiLCJvZmZzZXRZIiwidG9wIiwic2V0RHJhZ0ltYWdlIiwiaSIsInNoaXBCb3giLCJzZXRBdHRyaWJ1dGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiX3JlcXVpcmUiLCJyZXF1aXJlIiwiZ2FtZURyaXZlclNjcmlwdCIsImdldEFmZmVjdGVkQm94ZXMiLCJoZWFkUG9zaXRpb24iLCJib3hlcyIsImNoYXJQYXJ0IiwibnVtUGFydCIsInBhcnNlSW50Iiwic2xpY2UiLCJwdXNoIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiY2hhckNvZGVBdCIsImlzVmFsaWRQbGFjZW1lbnQiLCJib3hJZCIsImFkanVzdGVkTnVtUGFydCIsImdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24iLCJzaGlwT3JpZW50YXRpb25FbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImRhdGFzZXQiLCJzaGlwT3JpZW50YXRpb24iLCJjcmVhdGVHYW1lQm9hcmQiLCJnYW1lIiwiZ2FtZUJvYXJkQ29tcG9uZW50IiwiZ2FtZUJvYXJkVG9wQ29tcG9uZW50IiwiZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50IiwiYWxwaGFDb29yZGluYXRlcyIsIm51bWVyaWNDb29yZGluYXRlcyIsImNvbHVtblRpdGxlIiwiYWxwaGFDaGFyIiwicm93VGl0bGUiLCJyb3ciLCJhZmZlY3RlZEJveGVzIiwicHJldmlvdXNBZmZlY3RlZEJveGVzIiwiX2xvb3AyIiwiYm94IiwiaiIsInByZXZlbnREZWZhdWx0Iiwic2V0VGltZW91dCIsIl90b0NvbnN1bWFibGVBcnJheSIsImNvbnNvbGUiLCJlcnJvciIsInZhbGlkUGxhY2VtZW50IiwiZm9yRWFjaCIsImRyYWdBZmZlY3RlZCIsInByZXZpb3VzbHlBZmZlY3RlZEJveGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZCb3giLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJsb3dlckxldHRlckJvdW5kIiwidXBwZXJMZXR0ZXJCb3VuZCIsInBhcnNlIiwiZ2V0RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJoZWFkQ29vcmRpbmF0ZSIsInNlbGVjdGVkQ2hhciIsInBsYWNlU2hpcCIsImhpdE1hcmtlciIsInNoaXBFbGVtZW50IiwiY29uY2F0IiwicGFyZW50RWxlbWVudCIsInByZXZpb3VzQm94ZXMiLCJlIiwicGxheWVyR3Vlc3MiLCJTaGlwIiwiR2FtZWJvYXJkIiwiX2NsYXNzQ2FsbENoZWNrIiwibWlzc0NvdW50IiwibWlzc2VkTW92ZXNBcnJheSIsImhpdE1vdmVzQXJyYXkiLCJDYXJyaWVyIiwiQmF0dGxlc2hpcCIsIkNydWlzZXIiLCJTdWJtYXJpbmUiLCJEZXN0cm95ZXIiLCJib2FyZCIsInN0YXJ0R2FtZSIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiY2hhclRvUm93SW5kZXgiLCJjaGFyIiwidG9VcHBlckNhc2UiLCJzdHJpbmdUb0NvbEluZGV4Iiwic3RyIiwic2V0QXQiLCJhbGlhcyIsInN0cmluZyIsImNoYXJBdCIsInN1YnN0cmluZyIsInJvd0luZGV4IiwiY29sSW5kZXgiLCJjaGVja0F0IiwiRXJyb3IiLCJnZXRCZWxvd0FsaWFzIiwibmV4dENoYXIiLCJuZXdBbGlhcyIsImdldFJpZ2h0QWxpYXMiLCJzaGlwSGVhZENvb3JkaW5hdGUiLCJfdGhpcyIsInNoaXBNYXJrZXIiLCJzaGlwTGVuZ3RoIiwiY3VycmVudENvb3JkaW5hdGUiLCJnZXROZXh0Q29vcmRpbmF0ZSIsImNvb3JkaW5hdGUiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwiZXJyIiwiZiIsInJlY2VpdmVBdHRhY2siLCJzaGlwQ29vcmRpbmF0ZXMiLCJpbmNsdWRlcyIsImhpdCIsInNldEFsbFNoaXBzVG9EZWFkIiwiaXNEZWFkIiwiZ2FtZU92ZXIiLCJkaXNwbGF5IiwiaGVhZGVyIiwibG9nIiwicm93U3RyaW5nIiwiY2VsbFZhbHVlIiwicGxhY2VCb2FyZE1hcmtlciIsInBoYXNlVXBkYXRlciIsImNoZWNrV2lubmVyIiwiYWxlcnQiLCJwbGF5VHVybiIsImN1cnJlbnRTdGF0ZSIsImN1cnJlbnRUdXJuIiwidXBkYXRlU3RhdGUiLCJjb21wdXRlckd1ZXNzIiwiUGxheWVyIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJwbGF5ZXIxIiwiY29tcHV0ZXIiLCJwaGFzZUNvdW50ZXIiLCJjaGVja1BsYXllclJlYWR5R2FtZVN0YXRlIiwic2hpcFR5cGVzIiwicGxhY2VDb21wdXRlclNoaXAiLCJjb21wdXRlckNvb3JkaW5hdGUiLCJlYXN5QWlNb3ZlcyIsImNvbXB1dGVyT3JpZW50YXRpb24iLCJhaVNoaXBPcmllbnRhdGlvbiIsImludGlhbGl6ZUdhbWUiLCJfaSIsIl9zaGlwVHlwZXMiLCJwbGFjZVBsYXllclNoaXBzIiwic3RhcnQiLCJtb3ZlIiwiaXNWYWxpZE1vdmUiLCJwbGF5ZXJNb3ZlIiwibWFrZUF0dGFjayIsIm1lc3NhZ2UiLCJjb21wdXRlckNob2ljZSIsImNvbXB1dGVyTW92ZSIsInR1cm5WYWx1ZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNyZWF0ZU5hdlVpIiwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIiwicGxheWVyTmFtZUNvbnRhaW5lciIsImNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciIsImluaXRpYWxpemVCdXR0b25Db250YWluZXIiLCJwbGF5ZXJOYW1lTGFiZWwiLCJodG1sRm9yIiwiaXNWYWxpZElucHV0IiwicmF3SW5wdXQiLCJwbGF5ZXJJbnB1dE5hbWUiLCJpbnB1dFZhbHVlIiwidG9Mb3dlckNhc2UiLCJlYXN5UmFkaW8iLCJ0eXBlIiwiZWFzeUxhYmVsIiwiaGFyZFJhZGlvIiwiaGFyZExhYmVsIiwiaW5pdGlhbGl6ZUJ1dHRvbiIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJ0dXJuIiwicGxheWVyQm9hcmQiLCJzaGlwVHlwZSIsInNoaXBCb3hNaXNzZWQiLCJjb21wdXRlckJvYXJkIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsIkFpIiwiaXNBaSIsImNvbXBsZXRlZE1vdmVzIiwiY2FwaXRhbGl6ZUZpcnN0IiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwicmFuZG9tSW5kZXgiLCJwbGFjZUFsbFNoaXBzRm9yQUkiLCJwbGFjZWQiLCJyYW5kb21Nb3ZlIiwiaXNTaGlwUGxhY2VtZW50VmFsaWQiLCJwb3AiLCJzdGFydGluZ0Nvb3JkaW5hdGUiLCJpc1ZhbGlkIiwic2V0TGVuZ3RoIiwiaGl0Q291bnQiLCJjYXBpdGFsaXplZFNoaXBOYW1lIiwiaXNTdW5rIiwiZ2FtZVBoYXNlIiwicGxheWVyVHVybiIsImNsZWFyIiwiZ2FtZVNjcmVlbiIsImdhbWVJbml0Q29tcG9uZW50Il0sInNvdXJjZVJvb3QiOiIifQ==