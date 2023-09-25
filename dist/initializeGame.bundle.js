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
      // console.log(header);

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
        // console.log(rowString);
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
  console.log(game.currentState);
  console.log(playerGuess);
  if (game.currentState === "Game Set-Up") {
    console.log("Stepped into 1");
    alert("Cannot click boxes till game has started");
    return;
  }
  if (game.checkWinner()) {
    console.log("Stepped into 2");
    alert("WoO");
    return;
  }
  // console.log(game.playTurn(playerGuess));

  if (!game.playTurn(playerGuess)) {
    console.log("Stepped into 3");
    alert("Invalid Move! Try again.");
    return;
  }
  if (game.currentState == "Game Play Phase" && game.currentTurn === "Player Move") {
    console.log("Stepped into 4");
    placeBoardMarker(game, playerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
    var computerGuess = game.playTurn();
    placeBoardMarker(game, computerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
    game.checkWinner();
    return;
  }
  // game.currentState = "Game Play Phase" &&
  if (game.currentTurn === "Computer Move") {
    console.log("Stepped into 5");
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
      console.log(move);
      if (this.currentTurn === "Player Move") {
        var isValidMove = false;
        var playerMove;
        while (!isValidMove) {
          try {
            playerMove = this.player1.makeAttack(move);
            isValidMove = true;
            return playerMove;
          } catch (error) {
            this.computer.gameBoard.display();
            console.error(error.message); // Output the error message.
            return false;
          }
        }
      }
      if (this.currentTurn === "Computer Move") {
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
        var turnValue = Math.floor(Math.random() * 2) + 1;
        this.currentState = "Game Play Phase";
        this.currentTurn = turnValue === 1 ? "Player Move" : "Computer Move";
      } else if (this.currentTurn === "Player Move") {
        this.currentTurn = "Computer Move";
      } else if (this.currentTurn === "Computer Move") {
        this.currentTurn = "Player Move";
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
  console.log(game.currentState);
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
    font-size: 20px;
    font-weight: 100;
    background-color: rgba(128, 128, 128, 0.8);
    color: white;
} `, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n.gameContainer {\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n    width: 100vw;\n    background: red;\n}\n\n.gameHeader {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-evenly;\n    height: 15%;\n    background: rgb(47, 0, 255);\n}\n\n#battleshipTitle {\n    font-size: xx-large;\n    color: white;\n}\n\n.gameStateContainer {\n    display: flex;\n    width: 20%;\n    height: 70%;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    font-size: x-large;\n    color: white;\n    border: 1px solid black;\n}\n\n.gameContentContainer {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-around;\n    height: 85%;\n    width: 100vw;\n    background: rgb(31, 147, 155);\n}\n\n.gameBoardHeaderContainer {\n    display: flex;\n    align-items: center;\n    justify-content: space-around;\n    height: 5%;\n    width: 100%;\n    background: rgb(83, 180, 59);\n    margin-top: 3em;\n}\n\n.gameBoardHeader {\n    font-size: x-large;\n}\n\n.gameScreenContainer {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-around;\n    height: 85%;\n    width: 100vw;\n    background: rgb(31, 147, 155);\n}\n\n.gameScreen-Left {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-around;\n    height: 100%;\n    width: 20%;\n    background: rgb(31, 147, 155);\n}\n\n.currentShipOrientation {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border: 1px solid black;\n    height: 10%;\n    width: 80%;\n}\n\n\n.shipPositionSwitcher {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-around;\n    height: 10%;\n    width: 80%;\n    color: white;\n    background: rgb(22, 39, 189);\n    margin-bottom: 1.5em;\n}\n\n.gameBoardContainer {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n}\n\n\n.gameBoardContainer.top {\n    display: flex;\n    flex-direction: row;\n    height: 5%;\n}\n\n\n.numericCoordinates {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n    font-size: 36px;\n    margin-top: 1em;\n    margin-left: 0.85em;\n}\n\n.numericCoordinates > div{\n    margin-left: 0.85em;\n}\n\n.gameBoardContainer.bottom {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n    height: 90%;\n}\n\n.alphaCoordinates {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    font-size: 36px;\n    margin-right: 0.5em;\n    margin-bottom: 0.2em;\n}\n\n.alphaCoordinates > div {\n    margin-top: 0.25em;\n}\n\n.gameBoard {\n    display: flex;\n    flex-direction: column;\n    height: 500px;\n    width: 500px;\n    border: 1px solid black;\n    /* margin-bottom: 7em; */\n}\n\n.row, .ship {\n    display: flex;\n    height: 10%;\n    border: 1px solid black;\n}\n\n.ship {\n    margin-right: 1em;\n    box-sizing: border-box;\n    position: relative;\n}\n\n.box {\n    width: 50px;\n    border: 1px solid black;\n    box-sizing: border-box;\n}\n\n.box:hover {\n    width: 10%;\n    border: 1px solid black;\n    background-color: lightgreen;\n}\n\n.highlight {\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\n}\n\n.placed {\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\n}\n\n.gameBoardResultContainer {\n    display: flex;\n    align-items: center;\n    justify-content: space-around;\n    height: 5%;\n    width: 100%;\n    background: rgb(83, 180, 59);\n    margin-bottom: 4em;\n}\n\n.piecesContainer {\n    display: flex;\n    flex-direction: column;\n    height: 350px;\n    width: 425px;\n    border: 2px solid black;\n    margin-top: 3.5em;\n}\n\n.shipContainer {\n    display: flex;\n    height: 50px;\n    width: 100%;\n    align-items: center;\n    justify-content: space-between;\n    margin-top: 1em;\n}\n\n.shipName {\n    font-size: x-large;\n    margin-left: 1em;\n}\n\n\n.shipbox {\n    border: 1px solid green;\n    background-color: rgba(0, 128, 0, 0.2); \n    height: 100%;\n}\n\n.placedText {\n    display: flex;\n    color: greenyellow;\n}\n\n.placedText#horizontal {\n    font-size: x-large;\n    margin-left: 1.5em;\n}\n\n.placedText#vertical {\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    font-size: large;\n}\n\n.gameInitializerContainer {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    height: 60vh;\n    width: 60vw;\n    border: 3px solid black;\n}\n\n.gameStartContainer {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    height: 200px;\n    width: 200px;\n    border: 3px solid black;\n}\n\n.playerNameContainer {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 100%;\n    font-style: italic;\n    font-weight: 600;\n    \n}\n\n.playerInputNameLabel {\n    font-size: xx-large;\n}\n\n.playerInputName {\n    height: 50px;    \n    margin-top: 0.5em;\n    width: 60%;\n    font-size: 40px;\n}\n\n.computerDifficultyContainer {\n    display: flex;\n    align-items: center;\n    justify-content: space-around;\n    font-size: x-large;\n    width: 100%;\n}\n\n.computerDifficultyContainer > #easy, #hard {\n    margin-left: 12em;\n}\n\n.computerDifficultyContainer > label {\n    margin-right: 8em;\n}\n\n#initPlaceButton {\n    background-color: rgb(56, 17, 194);\n    color: white;\n    font-weight: 700;\n    font-size: xx-large;\n}\n\n#initPlaceButton:hover {\n    color: rgb(238, 255, 0);\n}\n\n#initStartButton {\n    background-color: rgb(194, 27, 27);\n    color: white;\n    font-weight: 700;\n    font-size: larger;\n}\n\n.verticalPiecesContainer {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-evenly;\n    height: 350px;\n    width: 425px;\n    border: 2px solid black;\n    margin-top: 3.5em;\n}\n\n.verticalDraggable {\n    display: flex;\n    flex-direction: column;  /* this stacks the ship boxes vertically */\n}\n\n.verticalShipName {\n    font-size: 16px;\n    margin-bottom: 1em;\n}\n\n\n.verticalShipContainer {\n    display: flex;\n    flex-direction: column;  /* this stacks the ship boxes vertically */\n    align-items: center;\n}\n\n.shipbox, .verticalShipbox { \n    height: 48px;  /* adjust this as per your design */\n    width: 50px;\n    border: 1px solid #000; /* for visualization */\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\n}\n\n.box.placed.hit {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 50px;\n    font-weight: 100; \n} \n\n.box.miss {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 20px;\n    font-weight: 100;\n    background-color: rgba(128, 128, 128, 0.8);\n    color: white;\n} "],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0EsOENBQThDO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlGQUFpRixVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxRQUFRLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyx3QkFBd0IsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGNBQWMsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVB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QyxJQUFJLENBQUM7QUFDbEIsSUFBSW9HLFVBQVUsR0FBR3pSLFFBQVEsQ0FBQ3lFLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztBQUMvRCxJQUFJaU4saUJBQWlCLEdBQUc5RCxXQUFXLENBQUMsaUJBQWlCLENBQUM7QUFDdEQ2RCxVQUFVLENBQUN6USxXQUFXLENBQUMwUSxpQkFBaUIsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwUGllY2VzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlR2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZURyaXZlclNjcmlwdC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVMb29wLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbmF2aWdhdGlvbkNvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGFjZUJvYXJkTWFya2VyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3VwZGF0ZUN1cnJlbnRQaGFzZS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3M/ZTBmZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vaW5pdGlhbGl6ZUdhbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRyYWdEYXRhID0ge1xuICAgIGRyYWdnZWRTaGlwOiBudWxsXG59O1xuXG5mdW5jdGlvbiBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgYm94V2lkdGggPSA1MDtcbiAgICBsZXQgYm94SGVpZ2h0ID0gNDg7XG4gICAgbGV0IGlzVmVydGljYWwgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xuXG4gICAgcGllY2VzQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsUGllY2VzQ29udGFpbmVyXCIgOiBcInBpZWNlc0NvbnRhaW5lclwiO1xuXG4gICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcbiAgICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsU2hpcENvbnRhaW5lclwiIDogXCJzaGlwQ29udGFpbmVyXCI7XG4gICAgXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzaGlwVGl0bGUuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwTmFtZVwiIDogXCJzaGlwTmFtZVwiO1xuICAgICAgICBzaGlwVGl0bGUudGV4dENvbnRlbnQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIjpcIjtcbiAgICBcbiAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpOyAvLyBBZGQgdGhlIHNoaXBUaXRsZSBmaXJzdCBcbiAgICBcbiAgICAgICAgbGV0IHNoaXBQaWVjZTtcbiAgICBcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XG4gICAgICAgICAgICBwbGFjZWREaXYudGV4dENvbnRlbnQgPSBcIlBsYWNlZFwiO1xuICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiOyAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNoaXBQaWVjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbERyYWdnYWJsZVwiIDogXCJkcmFnZ2FibGVcIik7XG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICBzaGlwUGllY2UuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lIDogc2hpcEF0dHJpYnV0ZS5uYW1lO1xuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gaXNWZXJ0aWNhbCA/IGJveFdpZHRoICsgXCJweFwiIDogKGJveFdpZHRoICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IGlzVmVydGljYWwgPyAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiIDogYm94SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgc2hpcFBpZWNlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBjbGlja2VkQm94T2Zmc2V0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkcmFnRGF0YS5kcmFnZ2VkU2hpcCA9IHNoaXBEYXRhO1xuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBQaWVjZVJlY3QgPSBzaGlwUGllY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcFBpZWNlLCBvZmZzZXRYLCBvZmZzZXRZKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcbiAgICAgICAgICAgICAgICBzaGlwQm94LnN0eWxlLndpZHRoID0gYm94V2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBzaGlwUGllY2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIiwgMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIi1cIiArIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5hcHBlbmRDaGlsZChzaGlwQm94KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpO1xuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtiYXR0bGVzaGlwUGllY2VzLCBkcmFnRGF0YSB9OyIsImNvbnN0IHsgZHJhZ0RhdGEgfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xuY29uc3QgZ2FtZURyaXZlclNjcmlwdCA9IHJlcXVpcmUoJy4vZ2FtZURyaXZlclNjcmlwdCcpO1xuXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcblxuZnVuY3Rpb24gZ2V0QWZmZWN0ZWRCb3hlcyhoZWFkUG9zaXRpb24sIGxlbmd0aCwgb3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBib3hlcyA9IFtdO1xuICAgIGNvbnN0IGNoYXJQYXJ0ID0gaGVhZFBvc2l0aW9uWzBdO1xuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChoZWFkUG9zaXRpb24uc2xpY2UoMSkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyBpKSArIG51bVBhcnQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBib3hlcztcbn1cblxuXG5mdW5jdGlvbiBpc1ZhbGlkUGxhY2VtZW50KGJveElkLCBsZW5ndGgsIG9mZnNldCwgb3JpZW50YXRpb24sIHBsYXllcikge1xuICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94SWRbMF07XG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcblxuICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBvZmZzZXQ7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIHJldHVybiBhZGp1c3RlZE51bVBhcnQgPiAwICYmIGFkanVzdGVkTnVtUGFydCArIGxlbmd0aCAtIDEgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ID49IDAgJiYgY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ICsgbGVuZ3RoIDw9IHBsYXllci5nYW1lQm9hcmQuaGVpZ2h0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpIHtcbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbZGF0YS1zaGlwLW9yaWVudGF0aW9uXVwiKTtcbiAgICByZXR1cm4gc2hpcE9yaWVudGF0aW9uRWxlbWVudCA/IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQuZGF0YXNldC5zaGlwT3JpZW50YXRpb24gOiBcIkhvcml6b250YWxcIjtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmQoZ2FtZSwgcGxheWVyKSB7XG4gICAgXG5cbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcbiAgICBsZXQgZ2FtZUJvYXJkQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgZ2FtZUJvYXJkVG9wQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgYWxwaGFDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIFxuICAgXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXG4gICAgIGdhbWVCb2FyZENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lclwiO1xuICAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgdG9wXCI7XG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcbiAgICAgZ2FtZUJvYXJkLmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkXCI7XG4gICAgIGdhbWVCb2FyZC5pZCA9IHBsYXllci5uYW1lOyAvLyBBc3N1bWluZyB0aGUgcGxheWVyIGlzIGEgc3RyaW5nIGxpa2UgXCJwbGF5ZXIxXCJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcbiAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwibnVtZXJpY0Nvb3JkaW5hdGVzXCI7XG5cbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcbiAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjb2x1bW5UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcbiAgICAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmFwcGVuZENoaWxkKGNvbHVtblRpdGxlKTtcbiAgICAgfVxuXG4gICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmFwcGVuZENoaWxkKG51bWVyaWNDb29yZGluYXRlcyk7XG5cbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7IGkrKykge1xuXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XG5cbiAgICAgICAgbGV0IHJvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XG4gICAgICAgIGFscGhhQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQocm93VGl0bGUpO1xuXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcbiAgICAgICAgcm93LmlkID0gYWxwaGFDaGFyO1xuXG4gICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gW107XG4gICAgICAgIGxldCBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbXTtcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBqKyspIHtcbiAgICAgICAgXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XG4gICAgICAgICAgICBib3guaWQgPSBhbHBoYUNoYXIgKyBqXG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBkcmFnRGF0YS5kcmFnZ2VkU2hpcDtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoaXBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU2hpcCBkYXRhIGlzIG51bGwhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkUGxhY2VtZW50ID0gaXNWYWxpZFBsYWNlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcERhdGEub2Zmc2V0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcyA9IGdldEFmZmVjdGVkQm94ZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuZHJhZ0FmZmVjdGVkID0gXCJ0cnVlXCI7IC8vIEFkZCB0aGlzIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMCk7IC8vIGRlbGF5IG9mIDAgbXMsIGp1c3QgZW5vdWdoIHRvIGxldCBkcmFnbGVhdmUgaGFwcGVuIGZpcnN0IGlmIGl0J3MgZ29pbmcgdG9cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3hbZGF0YS1kcmFnLWFmZmVjdGVkPVwidHJ1ZVwiXScpO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzbHlBZmZlY3RlZEJveGVzLmZvckVhY2gocHJldkJveCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKTsgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXJMZXR0ZXJCb3VuZCA9IDY1O1xuICAgICAgICAgICAgICAgIGxldCB1cHBlckxldHRlckJvdW5kID0gNzQ7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBib3guaWRbMF07ICAvLyBBc3N1bWluZyB0aGUgZm9ybWF0IGlzIGFsd2F5cyBsaWtlIFwiQTVcIlxuICAgICAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3guaWQuc2xpY2UoMSkpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIHNoaXBEYXRhLm9mZnNldDtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uID0gY2hhclBhcnQgKyBhZGp1c3RlZE51bVBhcnQ7ICAvLyBUaGUgbmV3IHBvc2l0aW9uIGZvciB0aGUgaGVhZCBvZiB0aGUgc2hpcFxuICAgICAgICAgICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhhZGp1c3RlZFRhcmdldFBvc2l0aW9uLCBzaGlwRGF0YS5sZW5ndGgsIHNoaXBPcmllbnRhdGlvbilcblxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0ZWQgcG9zaXRpb24gYmFzZWQgb24gd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCBvbiB0aGUgc2hpcFxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRDb29yZGluYXRlID0gKGNoYXJQYXJ0ICsgbnVtUGFydCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDaGFyID0gY2hhclBhcnQuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGFjZW1lbnQgaXMgb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIgJiYgKGFkanVzdGVkTnVtUGFydCA8PSAwIHx8IGFkanVzdGVkTnVtUGFydCArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiVmVydGljYWxcIiAmJiAoc2VsZWN0ZWRDaGFyICsgc2hpcERhdGEubGVuZ3RoIDwgbG93ZXJMZXR0ZXJCb3VuZCB8fCBzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggLSAxID4gdXBwZXJMZXR0ZXJCb3VuZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLm5hbWUsIGhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdmVybGFwcGluZyBTaGlwLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuaGl0TWFya2VyID0gXCJmYWxzZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuc2hpcCA9IHNoaXBEYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBpc1ZlcnRpY2FsID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XG4gICAgICAgICAgICAgICAgbGV0IHNoaXBFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gcGxhY2UgJHtzaGlwRGF0YS5uYW1lfSB3aXRoIGxlbmd0aCAke3NoaXBEYXRhLmxlbmd0aH0gYXQgcG9zaXRpb24gJHthZGp1c3RlZFRhcmdldFBvc2l0aW9ufS5gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2IyR7c2hpcERhdGEubmFtZX0uZHJhZ2dhYmxlLnNoaXBgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2I3ZlcnRpY2FsJHtzaGlwRGF0YS5uYW1lfS52ZXJ0aWNhbERyYWdnYWJsZS5zaGlwYClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RWxlbWVudCA9IHNoaXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmNsYXNzTmFtZSA9IFwicGxhY2VkVGV4dFwiO1xuICAgICAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgZGl2IHRvIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGxhY2VkRGl2KTtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7XG4gICAgICAgICAgICAgICAgLy8gbGV0IHNoaXBPYmplY3ROYW1lID0gc2hpcERhdGEubmFtZTtcblxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGFmZmVjdGVkQm94ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNCb3hlcyA9IGFmZmVjdGVkQm94ZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBpZiAoIWFmZmVjdGVkQm94ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyR3Vlc3MgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgICAgICAgICBnYW1lRHJpdmVyU2NyaXB0KGdhbWUsIHBsYXllckd1ZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgICAgfVxuXG4gICAgICAgXG5cbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgfVxuXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xuICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xuXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCk7XG5cblxuICAgIHJldHVybiBnYW1lQm9hcmRDb21wb25lbnRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVHYW1lQm9hcmQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAxMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xuICAgICAgICB0aGlzLm1pc3NDb3VudCA9IDA7XG4gICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5zaGlwID0ge1xuICAgICAgICAgICAgQ2Fycmllcjoge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0JhdHRsZXNoaXAnKSxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDcnVpc2VyOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdDcnVpc2VyJyksXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3VibWFyaW5lOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0Rlc3Ryb3llcicpLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9hcmQgPSB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgbGV0IGJvYXJkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goXCJcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9hcmQucHVzaChyb3cpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIFRoaXMgY29kZSByZXR1cm5zIHRoZSBjaGFyIHZhbHVlIGFzIGFuIGludCBzbyBpZiBpdCBpcyAnQicgKG9yICdiJyksIHdlIHdvdWxkIGdldCB0aGUgdmFsdWUgNjYgLSA2NSA9IDEsIGZvciB0aGUgcHVycG9zZSBvZiBvdXIgYXJyYXkgQiBpcyByZXAuIGJ5IGJvYXJkWzFdLlxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XG4gICAgICAgICAgICBjaGFyID0gY2hhci50b1VwcGVyQ2FzZSgpOyAvLyBDb252ZXJ0IHRoZSBjaGFyYWN0ZXIgdG8gdXBwZXJjYXNlXG4gICAgICAgICAgICByZXR1cm4gY2hhci5jaGFyQ29kZUF0KDApIC0gJ0EnLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gUmV0dXJucyBhbiBpbnQgYXMgYSBzdHIgd2hlcmUgbnVtYmVycyBmcm9tIDEgdG8gMTAsIHdpbGwgYmUgdW5kZXJzdG9vZCBmb3IgYXJyYXkgYWNjZXNzOiBmcm9tIDAgdG8gOS5cbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChzdHIpIC0gMTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBzZXRBdChhbGlhcywgc3RyaW5nKSB7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiA5IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+IDkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPSBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0F0KGFsaWFzKSB7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcbiAgICAgICAgXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gRW5zdXJlIGluZGljZXMgYXJlIHZhbGlkXG4gICAgICAgICAgICBpZiAocm93SW5kZXggPCAwIHx8IHJvd0luZGV4ID49IHRoaXMuaGVpZ2h0IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+PSB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkhpdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGdpdmVuIGNvb3JkaW5hdGUgaXMgb2NjdXBpZWRcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRCZWxvd0FsaWFzKGFsaWFzKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxuICAgICAgICBcbiAgICAgICAgICAgIC8vIENvbnZlcnQgY2hhclBhcnQgdG8gdGhlIG5leHQgbGV0dGVyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xuICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG5ld0FsaWFzID0gbmV4dENoYXIgKyBudW1QYXJ0O1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFyVG9Sb3dJbmRleChuZXh0Q2hhcikgPiA5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXG4gICAgICAgICAgICBsZXQgbnVtUGFydCA9IHBhcnNlSW50KGFsaWFzLnN1YnN0cmluZygxKSwgMTApOyAvLyBDb252ZXJ0IHRoZSBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgIFxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIG51bWJlciBieSAxXG4gICAgICAgICAgICBudW1QYXJ0Kys7XG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBjaGFyUGFydCArIG51bVBhcnQ7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChudW1QYXJ0ID4gMTApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyBjb2x1bW4gdG8gdGhlIHJpZ2h0IG9mIHRoaXMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgICAgIHBsYWNlU2hpcChzaGlwTmFtZSwgc2hpcEhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBNYXJrZXIgPSBcIlNoaXBcIjtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHNoaXBIZWFkQ29vcmRpbmF0ZTtcbiAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXG4gICAgICAgICAgICAgICAgPyBjb29yZGluYXRlID0+IHRoaXMuZ2V0QmVsb3dBbGlhcyhjb29yZGluYXRlKVxuICAgICAgICAgICAgICAgIDogY29vcmRpbmF0ZSA9PiB0aGlzLmdldFJpZ2h0QWxpYXMoY29vcmRpbmF0ZSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID0gW107IC8vIENsZWFyIGFueSBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzLnB1c2goY3VycmVudENvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBnZXROZXh0Q29vcmRpbmF0ZShjdXJyZW50Q29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIFBsYWNlIHRoZSBzaGlwXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIHNoaXBNYXJrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoaXBDb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIkhpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWlzc0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIk1pc3NcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnYW1lT3ZlcigpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxuICAgICAgICAgICAgICAgIH0gICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BsYXkoKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciB3aXRoIGNvbHVtbiBudW1iZXJzXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gXCIgICAgXCI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBoZWFkZXIgKz0gaSArIFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaGVhZGVyKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCByb3cgYW5kIHByaW50IHRoZW1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3dTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIiB8IFwiOyAvLyBDb252ZXJ0IHJvdyBpbmRleCB0byBBLUogYW5kIGFkZCB0aGUgc2VwYXJhdG9yXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsVmFsdWUgPSB0aGlzLmJvYXJkW2ldW2pdO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTaGlwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhpdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1pc3NcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyb3dTdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IHBsYWNlQm9hcmRNYXJrZXIgPSByZXF1aXJlKCcuL3BsYWNlQm9hcmRNYXJrZXInKTtcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XG5cbmZ1bmN0aW9uIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpIHtcblxuICAgIGNvbnNvbGUubG9nKGdhbWUuY3VycmVudFN0YXRlKTtcbiAgICBjb25zb2xlLmxvZyhwbGF5ZXJHdWVzcyk7XG5cblxuICAgIGlmIChnYW1lLmN1cnJlbnRTdGF0ZSA9PT0gXCJHYW1lIFNldC1VcFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RlcHBlZCBpbnRvIDFcIik7XG4gICAgICAgIGFsZXJ0KFwiQ2Fubm90IGNsaWNrIGJveGVzIHRpbGwgZ2FtZSBoYXMgc3RhcnRlZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChnYW1lLmNoZWNrV2lubmVyKCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gMlwiKTtcblxuICAgICAgICBhbGVydChcIldvT1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhnYW1lLnBsYXlUdXJuKHBsYXllckd1ZXNzKSk7XG5cbiAgICBpZiAoIWdhbWUucGxheVR1cm4ocGxheWVyR3Vlc3MpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RlcHBlZCBpbnRvIDNcIik7XG5cbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIE1vdmUhIFRyeSBhZ2Fpbi5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgICAgIFxuICAgIGlmIChnYW1lLmN1cnJlbnRTdGF0ZSA9PSBcIkdhbWUgUGxheSBQaGFzZVwiICYmIGdhbWUuY3VycmVudFR1cm4gPT09IFwiUGxheWVyIE1vdmVcIikgeyAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gNFwiKTsgICAgICAgIFxuICAgIFxuICAgICAgICBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIHBsYXllckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKTtcbiAgICAgICAgZ2FtZS51cGRhdGVTdGF0ZSgpO1xuICAgICAgICBwaGFzZVVwZGF0ZXIoZ2FtZSk7XG4gICAgIFxuICAgICAgICBsZXQgY29tcHV0ZXJHdWVzcyA9IGdhbWUucGxheVR1cm4oKTtcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxuICAgICAgICBnYW1lLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcbiAgICAgICAgZ2FtZS5jaGVja1dpbm5lcigpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIGdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFBsYXkgUGhhc2VcIiAmJlxuICAgIGlmICggZ2FtZS5jdXJyZW50VHVybiA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHsgICAgICAgICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gNVwiKTtcblxuICAgXG4gICAgICAgIH0gICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVEcml2ZXJTY3JpcHQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lSWQsIHBsYXllck5hbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lSWQgPSBnYW1lSWQ7XG4gICAgICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XG4gICAgICAgIHRoaXMucGhhc2VDb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJcIjtcbiAgICB9XG5cbiAgICAvLyBUTy1ETyBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpLCBwcm9tcHRVc2VyT3JpZW50YXRpb24oKSwgY2hlY2tXaW5uZXIoKTtcblxuICAgIGNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9IFwiR2FtZSBTZXQtVXBcIikge1xuICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApO1xuICAgICAgICBmb3IgKGxldCBzaGlwVHlwZXMgaW4gdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZXNdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgIH0gXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwbGFjZUNvbXB1dGVyU2hpcChzaGlwTmFtZSkge1xuICAgICAgICB3aGlsZSAoY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID09IFwiXCIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcbiAgICAgICAgICAgIGxldCBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xuXG4gICAgICAgICAgICB3aGlsZSAoIWNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIGNvbXB1dGVyQ29vcmRpbmF0ZSwgY29tcHV0ZXJPcmllbnRhdGlvbikpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XG4gICAgICAgICAgICAgICAgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludGlhbGl6ZUdhbWUoKSB7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCJcbiAgICAgICAgY29uc3Qgc2hpcFR5cGVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xuICAgICAgICAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcblxuICAgICAgICBmb3IgKGNvbnN0IHNoaXAgb2Ygc2hpcFR5cGVzKSB7XG4gICAgICAgICAgICB0aGlzLnBsYWNlUGxheWVyU2hpcHMoc2hpcCk7XG4gICAgICAgICAgICB0aGlzLnBsYWNlQ29tcHV0ZXJTaGlwKHNoaXApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBwbGF5VHVybihtb3ZlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vdmUpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJNb3ZlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGlsZSAoIWlzVmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyTW92ZSA9IHRoaXMucGxheWVyMS5tYWtlQXR0YWNrKG1vdmUpO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkTW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXJNb3ZlO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOyAvLyBPdXRwdXQgdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gdGhpcy5jb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XG4gICAgICAgICAgICAodGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVyQ2hvaWNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJHYW1lIFNldC1VcFwiKSB7XG4gICAgICAgICAgICBsZXQgdHVyblZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IHR1cm5WYWx1ZSA9PT0gMSA/IFwiUGxheWVyIE1vdmVcIiA6IFwiQ29tcHV0ZXIgTW92ZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFR1cm4gPT09IFwiUGxheWVyIE1vdmVcIikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IFwiQ29tcHV0ZXIgTW92ZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFR1cm4gPT09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJQbGF5ZXIgTW92ZVwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tXaW5uZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcHV0ZXIgV2luc1wiKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgV2luc1wiKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB3aGlsZSghdGhpcy5jaGVja1dpbm5lcigpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlTmF2VWkgKCkge1xuXG4gICAgbGV0IGdhbWVJbml0aWFsaXplckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyXCI7XG5cbiAgICBsZXQgcGxheWVyTmFtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5jbGFzc05hbWUgPSBcInBsYXllck5hbWVDb250YWluZXJcIjtcbiAgICBsZXQgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuY2xhc3NOYW1lID0gXCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXJcIjtcbiAgICBsZXQgaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcImluaXRpYWxpemVCdXR0b25Db250YWluZXJcIjtcblxuICAgIGxldCBwbGF5ZXJOYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgcGxheWVyTmFtZUxhYmVsLmNsYXNzTmFtZSA9IFwicGxheWVySW5wdXROYW1lTGFiZWxcIlxuICAgIHBsYXllck5hbWVMYWJlbC50ZXh0Q29udGVudCA9IFwiRW50ZXIgeW91ciBuYW1lOlwiO1xuICAgIHBsYXllck5hbWVMYWJlbC5odG1sRm9yID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllck5hbWVMYWJlbCk7XG5cbiAgICBsZXQgaXNWYWxpZElucHV0ID0gZmFsc2U7ICAvLyBUaGlzIHdpbGwgYmUgdXNlZCB0byBzdG9yZSB0aGUgaW5wdXQgdmFsaWRpdHlcbiAgICBsZXQgcmF3SW5wdXQ7XG5cbiAgICBsZXQgcGxheWVySW5wdXROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHBsYXllcklucHV0TmFtZS5jbGFzc05hbWUgPSBcInBsYXllcklucHV0TmFtZVwiO1xuICAgIHBsYXllcklucHV0TmFtZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJhd0lucHV0ID0gcGxheWVySW5wdXROYW1lLnZhbHVlO1xuICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHBsYXllcklucHV0TmFtZS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiY29tcHV0ZXJcIiB8fCBpbnB1dFZhbHVlID09PSBcImFpXCIpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdUaGUgbmFtZSBjYW5ub3QgYmUgXCJjb21wdXRlclwiIG9yIFwiYWlcIi4nKTtcbiAgICAgICAgICAgIHBsYXllcklucHV0TmFtZS52YWx1ZSA9ICcnOyAvLyBDbGVhciB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICAgIGlzVmFsaWRJbnB1dCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaXNWYWxpZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzVmFsaWRJbnB1dCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllcklucHV0TmFtZSk7XG5cbiAgICBsZXQgZWFzeVJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGVhc3lSYWRpby50eXBlID0gXCJyYWRpb1wiO1xuICAgIGVhc3lSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XG4gICAgZWFzeVJhZGlvLnZhbHVlID0gXCJlYXN5XCI7XG4gICAgZWFzeVJhZGlvLmlkID0gXCJlYXN5XCI7XG4gICAgbGV0IGVhc3lMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBlYXN5TGFiZWwuaHRtbEZvciA9IFwiZWFzeVwiO1xuICAgIGVhc3lMYWJlbC50ZXh0Q29udGVudCA9IFwiRWFzeSBCYXR0bGVzaGlwIEFJXCI7XG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lSYWRpbyk7XG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lMYWJlbCk7XG5cbiAgICAvLyBSYWRpbyBidXR0b24gZm9yIGhhcmQgZGlmZmljdWx0eVxuICAgIGxldCBoYXJkUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaGFyZFJhZGlvLnR5cGUgPSBcInJhZGlvXCI7XG4gICAgaGFyZFJhZGlvLm5hbWUgPSBcImRpZmZpY3VsdHlcIjtcbiAgICBoYXJkUmFkaW8udmFsdWUgPSBcImhhcmRcIjtcbiAgICBoYXJkUmFkaW8uaWQgPSBcImhhcmRcIjtcbiAgICBsZXQgaGFyZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGhhcmRMYWJlbC5odG1sRm9yID0gXCJoYXJkXCI7XG4gICAgaGFyZExhYmVsLnRleHRDb250ZW50ID0gXCJIYXJkIEJhdHRsZXNoaXAgQUlcIjtcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZFJhZGlvKTtcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuYXBwZW5kQ2hpbGQoaGFyZExhYmVsKTtcblxuICAgIC8vIGluaXRpYWxpemUgYnV0dG9uXG4gICAgbGV0IGluaXRpYWxpemVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGluaXRpYWxpemVCdXR0b24udGV4dENvbnRlbnQgPSBcIlBsYWNlIFBpZWNlc1wiO1xuICAgIGluaXRpYWxpemVCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoaW5pdGlhbGl6ZUJ1dHRvbik7XG4gICAgaW5pdGlhbGl6ZUJ1dHRvbi5pZCA9IFwiaW5pdFBsYWNlQnV0dG9uXCI7XG4gICAgaW5pdGlhbGl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpc1ZhbGlkSW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdWYWxpZCBpbnB1dCEgSW5pdGlhbGl6aW5nIGdhbWUuLi4nKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwbGF5ZXJOYW1lJywgcmF3SW5wdXQpO1xuICAgICAgICAgICAgLy8gWW91IGNhbiBhbHNvIGRvIG1vcmUsIGxpa2UgY2hlY2tpbmcgaWYgYSBkaWZmaWN1bHR5IGlzIHNlbGVjdGVkIGV0Yy5cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJiYXR0bGVzaGlwLmh0bWxcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnZhbGlkIGlucHV0LicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSlcblxuXG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXJzIHRvIHRoZSBtYWluIGNvbnRhaW5lclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJOYW1lQ29udGFpbmVyKTtcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyKTtcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5pdGlhbGl6ZUJ1dHRvbkNvbnRhaW5lcik7XG5cblxuICAgIHJldHVybiBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTmF2VWk7IiwiZnVuY3Rpb24gcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBtb3ZlLCB0dXJuKSB7XG5cbiAgICBpZiAodHVybiA9PSBcIkNvbXB1dGVyIE1vdmVcIikge1xuICAgICAgICBsZXQgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtnYW1lLnBsYXllcjEubmFtZX0uZ2FtZUJvYXJkYCk7XG5cbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGUgaW4gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIGdhbWUucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZV0uY29vcmRpbmF0ZXMpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2Nvb3JkaW5hdGV9LmJveGApO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBjb29yZGluYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmRhdGFzZXQuc2hpcCA9IHNoaXBUeXBlO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LnRleHRDb250ZW50ID0gXCJYXCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2hpcEJveE1pc3NlZCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xuICAgIFxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcblxuICAgIH1cblxuICAgIGlmICh0dXJuID09IFwiUGxheWVyIE1vdmVcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhtb3ZlKVxuICAgICAgICBsZXQgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29tcHV0ZXIuZ2FtZUJvYXJkXCIpO1xuXG4gICAgICAgIGZvciAobGV0IHNoaXBUeXBlIGluIGdhbWUuY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZV0uY29vcmRpbmF0ZXMpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvcihgZGl2IyR7Y29vcmRpbmF0ZX0uYm94YCk7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKG1vdmUgPT09IGNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwicGxhY2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guZGF0YXNldC5zaGlwID0gc2hpcFR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3gudGV4dENvbnRlbnQgPSBcIlhcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNoaXBCb3hNaXNzZWQgPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcbiAgICB9XG5cbiAgICByZXR1cm47XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYWNlQm9hcmRNYXJrZXI7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xuXG5cblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XG4gICAgfVxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgbWFrZUF0dGFjayhjb29yZGluYXRlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vdmUgaXMgYWxyZWFkeSBtYWRlXCIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cblxuICAgIGlzQWkobmFtZSkge1xuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrID09IFwiQ29tcHV0ZXJcIiB8fCBjaGVjayA9PSBcIkFpXCI7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cblxuXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcbiAgICAgICAgbGV0IGFsbE1vdmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQWxpYXMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbk51bWJlciArIDY1KTtcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XG4gICAgfVxuXG4gICAgZWFzeUFpTW92ZXMoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcbiAgICAgICAgICAgIGxldCB1bnBsYXllZE1vdmVzID0gYWxsUG9zc2libGVNb3Zlcy5maWx0ZXIobW92ZSA9PiAhdGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhtb3ZlKSk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIGlmICh1bnBsYXllZE1vdmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBsZXQgbW92ZSA9IHVucGxheWVkTW92ZXNbcmFuZG9tSW5kZXhdO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xuICAgIH1cblxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiVmVydGljYWxcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYWNlQWxsU2hpcHNGb3JBSSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gcGxhY2VBbGxTaGlwc0ZvckFJIGlzIHJlc3RyaWN0ZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgICAgICBsZXQgcGxhY2VkID0gZmFsc2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoaWxlICghcGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0IGEgcmFuZG9tIHN0YXJ0aW5nIGNvb3JkaW5hdGVcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21Nb3ZlID0gdGhpcy5lYXN5QWlNb3ZlcygpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENob29zZSBhIHJhbmRvbSBvcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gdGhpcy5haVNoaXBPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm91bmRzIGJhc2VkIG9uIGl0cyBzdGFydGluZyBjb29yZGluYXRlLCBvcmllbnRhdGlvbiwgYW5kIGxlbmd0aFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2hpcFBsYWNlbWVudFZhbGlkKHNoaXBOYW1lLCByYW5kb21Nb3ZlLCBvcmllbnRhdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQncyBhIHZhbGlkIHBsYWNlbWVudCwgYXR0ZW1wdCB0byBwbGFjZSB0aGUgc2hpcFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0aGlzLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBsYWNlZCBtb3ZlIGZyb20gY29tcGxldGVkIG1vdmVzIHNvIGl0IGNhbiBiZSB1c2VkIGJ5IHRoZSBBSSBkdXJpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgaWYgYSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm9hcmRcbiAgICBpc1NoaXBQbGFjZW1lbnRWYWxpZChzaGlwTmFtZSwgc3RhcnRpbmdDb29yZGluYXRlLCBvcmllbnRhdGlvbikge1xuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UubGVuZ3RoO1xuICAgICAgICBsZXQgY3VycmVudENvb3JkaW5hdGUgPSBzdGFydGluZ0Nvb3JkaW5hdGU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIgJiYgcGFyc2VJbnQoY3VycmVudENvb3JkaW5hdGUuc3Vic3RyaW5nKDEpLCAxMCkgKyBzaGlwTGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCIgJiYgdGhpcy5nYW1lQm9hcmQuY2hhclRvUm93SW5kZXgoY3VycmVudENvb3JkaW5hdGUuY2hhckF0KDApKSArIHNoaXBMZW5ndGggPiA5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiIFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZ2FtZUJvYXJkLmdldEJlbG93QWxpYXMoY3VycmVudENvb3JkaW5hdGUpIFxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZ2FtZUJvYXJkLmdldFJpZ2h0QWxpYXMoY3VycmVudENvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsIlxuY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuXG4gICAgICAgIHRoaXMuc2hpcFR5cGVzID0ge1xuICAgICAgICAgICAgQ2FycmllcjogNSxcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXG4gICAgICAgICAgICBDcnVpc2VyOiAzLFxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcblxuICAgIH1cblxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiAnJztcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHNldExlbmd0aChuYW1lKSB7XG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcblxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGl0Q291bnQgPT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0aGlzLmlzRGVhZDtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0Q291bnQ7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCJmdW5jdGlvbiBwaGFzZVVwZGF0ZXIoZ2FtZSkge1xuXG4gICAgbGV0IGdhbWVQaGFzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVBoYXNlXCIpO1xuICAgIGxldCBwbGF5ZXJUdXJuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJUdXJuXCIpO1xuXG4gICAgY29uc29sZS5sb2coZ2FtZS5jdXJyZW50U3RhdGUpO1xuXG4gICAgaWYgKGdhbWUgPT0gbnVsbCkge1xuICAgICAgICBnYW1lUGhhc2UudGV4dENvbnRlbnQgPSBcIkdhbWUgSW5pdGlhbGl6dGlvblwiXG4gICAgICAgIHBsYXllclR1cm4udGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdhbWVQaGFzZS50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFN0YXRlO1xuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50VHVybjtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwaGFzZVVwZGF0ZXI7IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uZ2FtZUNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGJhY2tncm91bmQ6IHJlZDtcbn1cblxuLmdhbWVIZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgIGhlaWdodDogMTUlO1xuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcbn1cblxuI2JhdHRsZXNoaXBUaXRsZSB7XG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcbiAgICBjb2xvcjogd2hpdGU7XG59XG5cbi5nYW1lU3RhdGVDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgd2lkdGg6IDIwJTtcbiAgICBoZWlnaHQ6IDcwJTtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbn1cblxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDg1JTtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XG59XG5cbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDUlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XG4gICAgbWFyZ2luLXRvcDogM2VtO1xufVxuXG4uZ2FtZUJvYXJkSGVhZGVyIHtcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XG59XG5cbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDg1JTtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XG59XG5cbi5nYW1lU2NyZWVuLUxlZnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICB3aWR0aDogMjAlO1xuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xufVxuXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICAgIGhlaWdodDogMTAlO1xuICAgIHdpZHRoOiA4MCU7XG59XG5cblxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDEwJTtcbiAgICB3aWR0aDogODAlO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xufVxuXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgaGVpZ2h0OiAxMDAlO1xufVxuXG5cbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgaGVpZ2h0OiA1JTtcbn1cblxuXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgZm9udC1zaXplOiAzNnB4O1xuICAgIG1hcmdpbi10b3A6IDFlbTtcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xufVxuXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XG59XG5cbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgaGVpZ2h0OiA5MCU7XG59XG5cbi5hbHBoYUNvb3JkaW5hdGVzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBmb250LXNpemU6IDM2cHg7XG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcbn1cblxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcbn1cblxuLmdhbWVCb2FyZCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogNTAwcHg7XG4gICAgd2lkdGg6IDUwMHB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cbn1cblxuLnJvdywgLnNoaXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgaGVpZ2h0OiAxMCU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG59XG5cbi5zaGlwIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLmJveCB7XG4gICAgd2lkdGg6IDUwcHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmJveDpob3ZlciB7XG4gICAgd2lkdGg6IDEwJTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xufVxuXG4uaGlnaGxpZ2h0IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXG59XG5cbi5wbGFjZWQge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXG59XG5cbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDUlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xufVxuXG4ucGllY2VzQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgaGVpZ2h0OiAzNTBweDtcbiAgICB3aWR0aDogNDI1cHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG4gICAgbWFyZ2luLXRvcDogMy41ZW07XG59XG5cbi5zaGlwQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGhlaWdodDogNTBweDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBtYXJnaW4tdG9wOiAxZW07XG59XG5cbi5zaGlwTmFtZSB7XG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xuICAgIG1hcmdpbi1sZWZ0OiAxZW07XG59XG5cblxuLnNoaXBib3gge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcbiAgICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5wbGFjZWRUZXh0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGNvbG9yOiBncmVlbnllbGxvdztcbn1cblxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcbn1cblxuLnBsYWNlZFRleHQjdmVydGljYWwge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgZm9udC1zaXplOiBsYXJnZTtcbn1cblxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgaGVpZ2h0OiA2MHZoO1xuICAgIHdpZHRoOiA2MHZ3O1xuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xufVxuXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBoZWlnaHQ6IDIwMHB4O1xuICAgIHdpZHRoOiAyMDBweDtcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcbn1cblxuLnBsYXllck5hbWVDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIFxufVxuXG4ucGxheWVySW5wdXROYW1lTGFiZWwge1xuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XG59XG5cbi5wbGF5ZXJJbnB1dE5hbWUge1xuICAgIGhlaWdodDogNTBweDsgICAgXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XG4gICAgd2lkdGg6IDYwJTtcbiAgICBmb250LXNpemU6IDQwcHg7XG59XG5cbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xufVxuXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xuICAgIG1hcmdpbi1yaWdodDogOGVtO1xufVxuXG4jaW5pdFBsYWNlQnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XG59XG5cbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xufVxuXG4jaW5pdFN0YXJ0QnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk0LCAyNywgMjcpO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xufVxuXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBoZWlnaHQ6IDM1MHB4O1xuICAgIHdpZHRoOiA0MjVweDtcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcbn1cblxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXG59XG5cbi52ZXJ0aWNhbFNoaXBOYW1lIHtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xufVxuXG5cbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xuICAgIHdpZHRoOiA1MHB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cbn1cblxuLmJveC5wbGFjZWQuaGl0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiA1MHB4O1xuICAgIGZvbnQtd2VpZ2h0OiAxMDA7IFxufSBcblxuLmJveC5taXNzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMjgsIDEyOCwgMTI4LCAwLjgpO1xuICAgIGNvbG9yOiB3aGl0ZTtcbn0gYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNu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QWtCO0FBQ3RCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RTs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLDBDQUEwQztJQUMxQyxZQUFZO0FBQ2hCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbi5nYW1lQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XFxufVxcblxcbi5nYW1lSGVhZGVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGhlaWdodDogMTUlO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XFxufVxcblxcbiNiYXR0bGVzaGlwVGl0bGUge1xcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcbiAgICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5nYW1lU3RhdGVDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICB3aWR0aDogMjAlO1xcbiAgICBoZWlnaHQ6IDcwJTtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogODUlO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcbn1cXG5cXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogNSU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcbiAgICBtYXJnaW4tdG9wOiAzZW07XFxufVxcblxcbi5nYW1lQm9hcmRIZWFkZXIge1xcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxufVxcblxcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogODUlO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcbn1cXG5cXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgd2lkdGg6IDIwJTtcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxufVxcblxcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgICBoZWlnaHQ6IDEwJTtcXG4gICAgd2lkdGg6IDgwJTtcXG59XFxuXFxuXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogMTAlO1xcbiAgICB3aWR0aDogODAlO1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcbn1cXG5cXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGhlaWdodDogNSU7XFxufVxcblxcblxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcbn1cXG5cXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcbn1cXG5cXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgaGVpZ2h0OiA5MCU7XFxufVxcblxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxufVxcblxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcbn1cXG5cXG4uZ2FtZUJvYXJkIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgaGVpZ2h0OiA1MDBweDtcXG4gICAgd2lkdGg6IDUwMHB4O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcbn1cXG5cXG4ucm93LCAuc2hpcCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGhlaWdodDogMTAlO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnNoaXAge1xcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uYm94IHtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4uYm94OmhvdmVyIHtcXG4gICAgd2lkdGg6IDEwJTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxufVxcblxcbi5oaWdobGlnaHQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxufVxcblxcbi5wbGFjZWQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcbn1cXG5cXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGhlaWdodDogNSU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxufVxcblxcbi5waWVjZXNDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBoZWlnaHQ6IDM1MHB4O1xcbiAgICB3aWR0aDogNDI1cHg7XFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXG59XFxuXFxuLnNoaXBDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXG59XFxuXFxuLnNoaXBOYW1lIHtcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcbn1cXG5cXG5cXG4uc2hpcGJveCB7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxuICAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnBsYWNlZFRleHQge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XFxufVxcblxcbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcXG59XFxuXFxuLnBsYWNlZFRleHQjdmVydGljYWwge1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XFxufVxcblxcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgaGVpZ2h0OiA2MHZoO1xcbiAgICB3aWR0aDogNjB2dztcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5nYW1lU3RhcnRDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgaGVpZ2h0OiAyMDBweDtcXG4gICAgd2lkdGg6IDIwMHB4O1xcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnBsYXllck5hbWVDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xcbiAgICBmb250LXdlaWdodDogNjAwO1xcbiAgICBcXG59XFxuXFxuLnBsYXllcklucHV0TmFtZUxhYmVsIHtcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXG59XFxuXFxuLnBsYXllcklucHV0TmFtZSB7XFxuICAgIGhlaWdodDogNTBweDsgICAgXFxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xcbiAgICB3aWR0aDogNjAlO1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxufVxcblxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcbiAgICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XFxuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xcbn1cXG5cXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xcbiAgICBtYXJnaW4tcmlnaHQ6IDhlbTtcXG59XFxuXFxuI2luaXRQbGFjZUJ1dHRvbiB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXG59XFxuXFxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XFxuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xcbn1cXG5cXG4jaW5pdFN0YXJ0QnV0dG9uIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NCwgMjcsIDI3KTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBmb250LXdlaWdodDogNzAwO1xcbiAgICBmb250LXNpemU6IGxhcmdlcjtcXG59XFxuXFxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGhlaWdodDogMzUwcHg7XFxuICAgIHdpZHRoOiA0MjVweDtcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcbn1cXG5cXG4udmVydGljYWxEcmFnZ2FibGUge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xcbn1cXG5cXG4udmVydGljYWxTaGlwTmFtZSB7XFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xcbn1cXG5cXG5cXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xcbn1cXG5cXG4uYm94LnBsYWNlZC5oaXQge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiA1MHB4O1xcbiAgICBmb250LXdlaWdodDogMTAwOyBcXG59IFxcblxcbi5ib3gubWlzcyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTI4LCAxMjgsIDEyOCwgMC44KTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbn0gXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xuY29uc3QgY3JlYXRlTmF2VWkgPSByZXF1aXJlKCcuL25hdmlnYXRpb25Db21wb25lbnRzJyk7XG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XG5yZXF1aXJlKCcuL2JhdHRsZXNoaXAuY3NzJyk7XG5cbmxvY2FsU3RvcmFnZS5jbGVhcigpXG5cbnBoYXNlVXBkYXRlcihudWxsKTtcbmxldCBnYW1lU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lU2NyZWVuQ29udGFpbmVyXCIpO1xubGV0IGdhbWVJbml0Q29tcG9uZW50ID0gY3JlYXRlTmF2VWkoXCJnYW1lSW5pdGlhbGl6ZXJcIik7XG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0Q29tcG9uZW50KTtcblxuIl0sIm5hbWVzIjpbImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwib3JpZW50YXRpb24iLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib3hXaWR0aCIsImJveEhlaWdodCIsImlzVmVydGljYWwiLCJjbGFzc05hbWUiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJhcHBlbmRDaGlsZCIsInNoaXBQaWVjZSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwicGxhY2VkRGl2IiwiaWQiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwid2lkdGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94Iiwic2V0QXR0cmlidXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZXF1aXJlIiwicmVxdWlyZSIsImdhbWVEcml2ZXJTY3JpcHQiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uIiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhc2V0Iiwic2hpcE9yaWVudGF0aW9uIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZSIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZFBsYWNlbWVudCIsImZvckVhY2giLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwibG93ZXJMZXR0ZXJCb3VuZCIsInVwcGVyTGV0dGVyQm91bmQiLCJwYXJzZSIsImdldERhdGEiLCJhZGp1c3RlZFRhcmdldFBvc2l0aW9uIiwiaGVhZENvb3JkaW5hdGUiLCJzZWxlY3RlZENoYXIiLCJwbGFjZVNoaXAiLCJoaXRNYXJrZXIiLCJzaGlwRWxlbWVudCIsImNvbmNhdCIsInBhcmVudEVsZW1lbnQiLCJwcmV2aW91c0JveGVzIiwiZSIsInBsYXllckd1ZXNzIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJDcnVpc2VyIiwiU3VibWFyaW5lIiwiRGVzdHJveWVyIiwiYm9hcmQiLCJzdGFydEdhbWUiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwic3RyaW5nVG9Db2xJbmRleCIsInN0ciIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwic2hpcEhlYWRDb29yZGluYXRlIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsInBsYWNlQm9hcmRNYXJrZXIiLCJwaGFzZVVwZGF0ZXIiLCJsb2ciLCJjdXJyZW50U3RhdGUiLCJhbGVydCIsImNoZWNrV2lubmVyIiwicGxheVR1cm4iLCJjdXJyZW50VHVybiIsInVwZGF0ZVN0YXRlIiwiY29tcHV0ZXJHdWVzcyIsIlBsYXllciIsIkdhbWUiLCJnYW1lSWQiLCJwbGF5ZXJOYW1lIiwicGxheWVyMSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSIsInNoaXBUeXBlcyIsInBsYWNlQ29tcHV0ZXJTaGlwIiwiY29tcHV0ZXJDb29yZGluYXRlIiwiZWFzeUFpTW92ZXMiLCJjb21wdXRlck9yaWVudGF0aW9uIiwiYWlTaGlwT3JpZW50YXRpb24iLCJpbnRpYWxpemVHYW1lIiwiX2kiLCJfc2hpcFR5cGVzIiwicGxhY2VQbGF5ZXJTaGlwcyIsInN0YXJ0IiwibW92ZSIsImlzVmFsaWRNb3ZlIiwicGxheWVyTW92ZSIsIm1ha2VBdHRhY2siLCJtZXNzYWdlIiwiY29tcHV0ZXJDaG9pY2UiLCJjb21wdXRlck1vdmUiLCJ0dXJuVmFsdWUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjcmVhdGVOYXZVaSIsImdhbWVJbml0aWFsaXplckNvbnRhaW5lciIsInBsYXllck5hbWVDb250YWluZXIiLCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIiLCJpbml0aWFsaXplQnV0dG9uQ29udGFpbmVyIiwicGxheWVyTmFtZUxhYmVsIiwiaHRtbEZvciIsImlzVmFsaWRJbnB1dCIsInJhd0lucHV0IiwicGxheWVySW5wdXROYW1lIiwiaW5wdXRWYWx1ZSIsInRvTG93ZXJDYXNlIiwiZWFzeVJhZGlvIiwidHlwZSIsImVhc3lMYWJlbCIsImhhcmRSYWRpbyIsImhhcmRMYWJlbCIsImluaXRpYWxpemVCdXR0b24iLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwidHVybiIsInBsYXllckJvYXJkIiwic2hpcFR5cGUiLCJzaGlwQm94TWlzc2VkIiwiY29tcHV0ZXJCb2FyZCIsIl9pdGVyYXRvcjIiLCJfc3RlcDIiLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsImNoZWNrIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiZ2V0QWxsUG9zc2libGVNb3ZlcyIsImFsbE1vdmVzIiwiY29sdW1uTnVtYmVyIiwicm93TnVtYmVyIiwiY29sdW1uQWxpYXMiLCJhbGxQb3NzaWJsZU1vdmVzIiwidW5wbGF5ZWRNb3ZlcyIsImZpbHRlciIsInJhbmRvbUluZGV4IiwicGxhY2VBbGxTaGlwc0ZvckFJIiwicGxhY2VkIiwicmFuZG9tTW92ZSIsImlzU2hpcFBsYWNlbWVudFZhbGlkIiwicG9wIiwic3RhcnRpbmdDb29yZGluYXRlIiwiaXNWYWxpZCIsInNldExlbmd0aCIsImhpdENvdW50IiwiY2FwaXRhbGl6ZWRTaGlwTmFtZSIsImlzU3VuayIsImdhbWVQaGFzZSIsInBsYXllclR1cm4iLCJjbGVhciIsImdhbWVTY3JlZW4iLCJnYW1lSW5pdENvbXBvbmVudCJdLCJzb3VyY2VSb290IjoiIn0=