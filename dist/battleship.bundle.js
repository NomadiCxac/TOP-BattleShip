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

/***/ "./createStartButton.js":
/*!******************************!*\
  !*** ./createStartButton.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var renderGameStartState = __webpack_require__(/*! ./renderGameStartState */ "./renderGameStartState.js");
var phaseUpdater = __webpack_require__(/*! ./updateCurrentPhase */ "./updateCurrentPhase.js");
function createGameStartElement(game) {
  var gameStartContainer = document.createElement("div");
  gameStartContainer.className = "gameStartContainer";
  var startButtonContainer = document.createElement("div");
  startButtonContainer.className = "startButtonContainer";

  // Start button
  var startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.id = "initStartButton";
  startButtonContainer.appendChild(startButton);
  startButton.addEventListener("click", function () {
    console.log(game.checkPlayerReadyGameState());
    if (game.checkPlayerReadyGameState() == false) {
      alert("Please Place All Your Ships in Legal Positions");
      return;
    }
    if (game.checkPlayerReadyGameState() == true) {
      // game.updateState();
      game.currentTurn = "Computer Move";
      game.currentState = "Game Play Phase";
      phaseUpdater(game);
      renderGameStartState(game);
      // game.player1.gameBoard.display()
      return;
    }
  });

  // Append the startButtonContainer to the main container
  gameStartContainer.appendChild(startButtonContainer);
  return gameStartContainer;
}
module.exports = createGameStartElement;

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

/***/ "./renderGameStartState.js":
/*!*********************************!*\
  !*** ./renderGameStartState.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var placeBoardMarker = __webpack_require__(/*! ./placeBoardMarker */ "./placeBoardMarker.js");
var createGameBoard = __webpack_require__(/*! ./createGameBoard */ "./createGameBoard.js");
var phaseUpdater = __webpack_require__(/*! ./updateCurrentPhase */ "./updateCurrentPhase.js");
function renderGameStartState(game) {
  console.log(_typeof(game.computer));
  var gameScreen = document.querySelector(".gameScreenContainer");
  var gameStartContainer = document.querySelector("div.gameStartContainer");
  gameStartContainer.remove();
  var leftGameScreen = document.querySelector("div.gameScreen-Left");
  leftGameScreen.remove();
  var computerGameBoard = createGameBoard(game, game.computer);
  game.computer.placeAllShipsForAI();
  gameScreen.appendChild(computerGameBoard);
  if (game.currentTurn == "Computer Move") {
    var computerGuess = game.playTurn();
    placeBoardMarker(game, computerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
  }
}
module.exports = renderGameStartState;

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
var createGameStartElement = __webpack_require__(/*! ./createStartButton */ "./createStartButton.js");
var createShipPositionSwitcher = __webpack_require__(/*! ./positionSwitcher */ "./positionSwitcher.js");
var phaseUpdater = __webpack_require__(/*! ./updateCurrentPhase */ "./updateCurrentPhase.js");
var renderGameStartState = __webpack_require__(/*! ./renderGameStartState */ "./renderGameStartState.js");
var placeBoardMarker = __webpack_require__(/*! ./placeBoardMarker */ "./placeBoardMarker.js");

function generateRandomString() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Initialize Player Name 
var playerName = localStorage.getItem('playerName');

// Create a new game from player name and set current state to game set up
var currentGame = new Game(generateRandomString(), playerName);
currentGame.currentState = "Game Set-Up";

// Update the Game Phase HTML accordingly
phaseUpdater(currentGame);

// Define the current player based on the current game class
var currentPlayer = currentGame.player1;

// Define the current computer based on the current game class
var computer = currentGame.computer;

// Generate the battleship pieces default state
var pieces = battleshipPieces(currentPlayer, "Horizontal");
var gameStartButton = createGameStartElement(currentGame);
var gameScreen = document.querySelector(".gameScreenContainer");
var leftGameScreen = document.createElement("div");
leftGameScreen.className = "gameScreen-Left";
var currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal";
currentShipOrientation.innerText = "Current Ship Position is: ".concat(currentShipOrientation.dataset.shipOrientation);
gameScreen.appendChild(leftGameScreen);
var shipPositionSwitcher = createShipPositionSwitcher(currentPlayer);
var board1 = createGameBoard(currentGame, currentPlayer);
// let board2 = createGameBoard(currentGame.computer);

leftGameScreen.appendChild(pieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameStartButton);
// gameScreen.appendChild(board2);
// placeBoardMarker(computer)
// renderGameStartState();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7OztBQ2Y3QjtBQUN5RztBQUNqQjtBQUN4Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlGQUFpRixVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxRQUFRLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyx3QkFBd0IsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGNBQWMsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSx3QkFBd0IsT0FBTyxLQUFLLFVBQVUsWUFBWSxRQUFRLEtBQUssVUFBVSx3QkFBd0IsYUFBYSxPQUFPLEtBQUssc0JBQXNCLFdBQVcsd0JBQXdCLHlCQUF5QixPQUFPLEtBQUss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QyxlQUFlLEdBQUcsWUFBWTtBQUM3RGlOLHNCQUFzQixDQUFDMUIsU0FBUyxnQ0FBQS9JLE1BQUEsQ0FBZ0N5SyxzQkFBc0IsQ0FBQ2xOLE9BQU8sQ0FBQ0MsZUFBZSxDQUFFO0FBQ2hIK0wsVUFBVSxDQUFDMVAsV0FBVyxDQUFDbVAsY0FBYyxDQUFDO0FBSXRDLElBQUlGLG9CQUFvQixHQUFHRCwwQkFBMEIsQ0FBQ3lCLGFBQWEsQ0FBQztBQUVwRSxJQUFJSSxNQUFNLEdBQUdqTixlQUFlLENBQUM0TSxXQUFXLEVBQUVDLGFBQWEsQ0FBQztBQUN4RDs7QUFLQXRCLGNBQWMsQ0FBQ25QLFdBQVcsQ0FBQzBRLE1BQU0sQ0FBQztBQUNsQ3ZCLGNBQWMsQ0FBQ25QLFdBQVcsQ0FBQzRRLHNCQUFzQixDQUFDO0FBQ2xEekIsY0FBYyxDQUFDblAsV0FBVyxDQUFDaVAsb0JBQW9CLENBQUM7QUFDaERTLFVBQVUsQ0FBQzFQLFdBQVcsQ0FBQzZRLE1BQU0sQ0FBQztBQUM5Qm5CLFVBQVUsQ0FBQzFQLFdBQVcsQ0FBQzJRLGVBQWUsQ0FBQztBQUN2QztBQUNBO0FBQ0EsMEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXBQaWVjZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9jcmVhdGVHYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9jcmVhdGVTdGFydEJ1dHRvbi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVEcml2ZXJTY3JpcHQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lTG9vcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3BsYWNlQm9hcmRNYXJrZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wb3NpdGlvblN3aXRjaGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcmVuZGVyR2FtZVN0YXJ0U3RhdGUuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zaGlwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vdXBkYXRlQ3VycmVudFBoYXNlLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3MiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcz9lMGZlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBkcmFnRGF0YSA9IHtcclxuICAgIGRyYWdnZWRTaGlwOiBudWxsXHJcbn07XHJcblxyXG5mdW5jdGlvbiBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgb3JpZW50YXRpb24pIHtcclxuICAgIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGJveFdpZHRoID0gNTA7XHJcbiAgICBsZXQgYm94SGVpZ2h0ID0gNDg7XHJcbiAgICBsZXQgaXNWZXJ0aWNhbCA9IG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XHJcblxyXG4gICAgcGllY2VzQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsUGllY2VzQ29udGFpbmVyXCIgOiBcInBpZWNlc0NvbnRhaW5lclwiO1xyXG5cclxuICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHBsYXllci5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgIGxldCBzaGlwQXR0cmlidXRlID0gcGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZTtcclxuICAgICAgICBsZXQgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBDb250YWluZXJcIiA6IFwic2hpcENvbnRhaW5lclwiO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc2hpcFRpdGxlLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsU2hpcE5hbWVcIiA6IFwic2hpcE5hbWVcIjtcclxuICAgICAgICBzaGlwVGl0bGUudGV4dENvbnRlbnQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIjpcIjtcclxuICAgIFxyXG4gICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTsgLy8gQWRkIHRoZSBzaGlwVGl0bGUgZmlyc3QgXHJcbiAgICBcclxuICAgICAgICBsZXQgc2hpcFBpZWNlO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LmNsYXNzTmFtZSA9IFwicGxhY2VkVGV4dFwiO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYudGV4dENvbnRlbnQgPSBcIlBsYWNlZFwiO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQocGxhY2VkRGl2KTtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiOyAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzaGlwUGllY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbERyYWdnYWJsZVwiIDogXCJkcmFnZ2FibGVcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSA6IHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gaXNWZXJ0aWNhbCA/IGJveFdpZHRoICsgXCJweFwiIDogKGJveFdpZHRoICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUuaGVpZ2h0ID0gaXNWZXJ0aWNhbCA/IChib3hIZWlnaHQgKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCIgOiBib3hIZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGlja2VkQm94T2Zmc2V0ID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2hpcEF0dHJpYnV0ZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogc2hpcEF0dHJpYnV0ZS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBjbGlja2VkQm94T2Zmc2V0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZHJhZ0RhdGEuZHJhZ2dlZFNoaXAgPSBzaGlwRGF0YTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJywgSlNPTi5zdHJpbmdpZnkoc2hpcERhdGEpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBIZWFkUmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwUGllY2VSZWN0ID0gc2hpcFBpZWNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHNoaXBIZWFkUmVjdC5sZWZ0IC0gc2hpcFBpZWNlUmVjdC5sZWZ0ICsgKHNoaXBIZWFkUmVjdC53aWR0aCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHNoaXBIZWFkUmVjdC50b3AgLSBzaGlwUGllY2VSZWN0LnRvcCArIChzaGlwSGVhZFJlY3QuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHNoaXBQaWVjZSwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQXR0cmlidXRlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5zdHlsZS53aWR0aCA9IGJveFdpZHRoICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBzaGlwQXR0cmlidXRlLm5hbWUgKyBcIi1cIiArIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwUGllY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgcGllY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwaWVjZXNDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2JhdHRsZXNoaXBQaWVjZXMsIGRyYWdEYXRhIH07IiwiY29uc3QgeyBkcmFnRGF0YSB9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcbmNvbnN0IGdhbWVEcml2ZXJTY3JpcHQgPSByZXF1aXJlKCcuL2dhbWVEcml2ZXJTY3JpcHQnKTtcclxuXHJcbi8vIGxldCBkcmFnZ2VkU2hpcERhdGEgPSBudWxsOyAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxyXG5cclxuZnVuY3Rpb24gZ2V0QWZmZWN0ZWRCb3hlcyhoZWFkUG9zaXRpb24sIGxlbmd0aCwgb3JpZW50YXRpb24pIHtcclxuICAgIGNvbnN0IGJveGVzID0gW107XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGhlYWRQb3NpdGlvblswXTtcclxuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChoZWFkUG9zaXRpb24uc2xpY2UoMSkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhclBhcnQgKyAobnVtUGFydCArIGkpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyBpKSArIG51bVBhcnQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJveGVzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNWYWxpZFBsYWNlbWVudChib3hJZCwgbGVuZ3RoLCBvZmZzZXQsIG9yaWVudGF0aW9uLCBwbGF5ZXIpIHtcclxuICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94SWRbMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94SWQuc2xpY2UoMSkpO1xyXG5cclxuICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBvZmZzZXQ7XHJcblxyXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHJldHVybiBhZGp1c3RlZE51bVBhcnQgPiAwICYmIGFkanVzdGVkTnVtUGFydCArIGxlbmd0aCAtIDEgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCA+PSAwICYmIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCArIGxlbmd0aCA8PSBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgIGxldCBzaGlwT3JpZW50YXRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXNoaXAtb3JpZW50YXRpb25dXCIpO1xyXG4gICAgcmV0dXJuIHNoaXBPcmllbnRhdGlvbkVsZW1lbnQgPyBzaGlwT3JpZW50YXRpb25FbGVtZW50LmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uIDogXCJIb3Jpem9udGFsXCI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmQoZ2FtZSwgcGxheWVyKSB7XHJcbiAgICBcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcclxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZFRvcENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGFscGhhQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgXHJcbiAgIFxyXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XHJcbiAgICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIHRvcFwiO1xyXG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcclxuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcclxuICAgICBnYW1lQm9hcmQuaWQgPSBwbGF5ZXIubmFtZTsgLy8gQXNzdW1pbmcgdGhlIHBsYXllciBpcyBhIHN0cmluZyBsaWtlIFwicGxheWVyMVwiXHJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcclxuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcclxuXHJcbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcclxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29sdW1uVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcclxuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xyXG4gICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XHJcblxyXG4gICAgICAgIGxldCByb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XHJcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG4gICAgICAgIHJvdy5pZCA9IGFscGhhQ2hhcjtcclxuXHJcbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICBsZXQgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gZHJhZ0RhdGEuZHJhZ2dlZFNoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNoaXAgZGF0YSBpcyBudWxsIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5kcmFnQWZmZWN0ZWQgPSBcInRydWVcIjsgLy8gQWRkIHRoaXMgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTsgLy8gZGVsYXkgb2YgMCBtcywganVzdCBlbm91Z2ggdG8gbGV0IGRyYWdsZWF2ZSBoYXBwZW4gZmlyc3QgaWYgaXQncyBnb2luZyB0b1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3hbZGF0YS1kcmFnLWFmZmVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMuZm9yRWFjaChwcmV2Qm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKTsgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlckxldHRlckJvdW5kID0gNjU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXBwZXJMZXR0ZXJCb3VuZCA9IDc0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBib3guaWRbMF07ICAvLyBBc3N1bWluZyB0aGUgZm9ybWF0IGlzIGFsd2F5cyBsaWtlIFwiQTVcIlxyXG4gICAgICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveC5pZC5zbGljZSgxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBzaGlwRGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uID0gY2hhclBhcnQgKyBhZGp1c3RlZE51bVBhcnQ7ICAvLyBUaGUgbmV3IHBvc2l0aW9uIGZvciB0aGUgaGVhZCBvZiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKGFkanVzdGVkVGFyZ2V0UG9zaXRpb24sIHNoaXBEYXRhLmxlbmd0aCwgc2hpcE9yaWVudGF0aW9uKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0ZWQgcG9zaXRpb24gYmFzZWQgb24gd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCBvbiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZENvb3JkaW5hdGUgPSAoY2hhclBhcnQgKyBudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDaGFyID0gY2hhclBhcnQuY2hhckNvZGVBdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxhY2VtZW50IGlzIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIgJiYgKGFkanVzdGVkTnVtUGFydCA8PSAwIHx8IGFkanVzdGVkTnVtUGFydCArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiICYmIChzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggPCBsb3dlckxldHRlckJvdW5kIHx8IHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiB1cHBlckxldHRlckJvdW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5uYW1lLCBoZWFkQ29vcmRpbmF0ZSwgc2hpcE9yaWVudGF0aW9uKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdmVybGFwcGluZyBTaGlwLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5oaXRNYXJrZXIgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LnNoaXAgPSBzaGlwRGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpc1ZlcnRpY2FsID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gcGxhY2UgJHtzaGlwRGF0YS5uYW1lfSB3aXRoIGxlbmd0aCAke3NoaXBEYXRhLmxlbmd0aH0gYXQgcG9zaXRpb24gJHthZGp1c3RlZFRhcmdldFBvc2l0aW9ufS5gKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2IyR7c2hpcERhdGEubmFtZX0uZHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjdmVydGljYWwke3NoaXBEYXRhLm5hbWV9LnZlcnRpY2FsRHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFbGVtZW50ID0gc2hpcEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgZGl2IHRvIHRoZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiO1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IHNoaXBPYmplY3ROYW1lID0gc2hpcERhdGEubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzQm94ZXMgPSBhZmZlY3RlZEJveGVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJHdWVzcyA9IGUudGFyZ2V0LmlkO1xyXG4gICAgICAgICAgICAgICAgZ2FtZURyaXZlclNjcmlwdChnYW1lLCBwbGF5ZXJHdWVzcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgIFxyXG5cclxuICAgICAgICBnYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoYWxwaGFDb29yZGluYXRlcyk7XHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxuXHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkVG9wQ29tcG9uZW50KTtcclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRCb3R0b21Db21wb25lbnQpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZ2FtZUJvYXJkQ29tcG9uZW50XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZUJvYXJkOyIsImNvbnN0IHJlbmRlckdhbWVTdGFydFN0YXRlID0gcmVxdWlyZSgnLi9yZW5kZXJHYW1lU3RhcnRTdGF0ZScpO1xyXG5jb25zdCBwaGFzZVVwZGF0ZXIgPSByZXF1aXJlKCcuL3VwZGF0ZUN1cnJlbnRQaGFzZScpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCAoZ2FtZSkge1xyXG4gICAgbGV0IGdhbWVTdGFydENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lU3RhcnRDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lU3RhcnRDb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgc3RhcnRCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJ1dHRvblxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XHJcbiAgICBzdGFydEJ1dHRvbi5pZCA9IFwiaW5pdFN0YXJ0QnV0dG9uXCI7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XHJcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpKVxyXG5cclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgUGxhY2UgQWxsIFlvdXIgU2hpcHMgaW4gTGVnYWwgUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAvLyBnYW1lLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgIGdhbWUuY3VycmVudFR1cm4gPSBcIkNvbXB1dGVyIE1vdmVcIjtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiXHJcbiAgICAgICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcclxuICAgICAgICAgICAgcmVuZGVyR2FtZVN0YXJ0U3RhdGUoZ2FtZSkgICAgICBcclxuICAgICAgICAgICAgLy8gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5kaXNwbGF5KClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0pIFxyXG5cclxuICAgIC8vIEFwcGVuZCB0aGUgc3RhcnRCdXR0b25Db250YWluZXIgdG8gdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICBnYW1lU3RhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRCdXR0b25Db250YWluZXIpO1xyXG5cclxuICAgIHJldHVybiBnYW1lU3RhcnRDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IHBsYWNlQm9hcmRNYXJrZXIgPSByZXF1aXJlKCcuL3BsYWNlQm9hcmRNYXJrZXInKTtcclxuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpIHtcclxuXHJcbiAgICBpZiAoZ2FtZS5jaGVja1dpbm5lcigpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJXb09cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coZ2FtZS5wbGF5VHVybihwbGF5ZXJHdWVzcykpO1xyXG5cclxuICAgIGlmICghZ2FtZS5wbGF5VHVybihwbGF5ZXJHdWVzcykpIHtcclxuICAgICAgICBhbGVydChcIkludmFsaWQgTW92ZSEgVHJ5IGFnYWluLlwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBpZiAoZ2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiICYmIGdhbWUuY3VycmVudFR1cm4gPT0gXCJQbGF5ZXIgTW92ZVwiKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBwbGF5ZXJHdWVzcywgZ2FtZS5jdXJyZW50VHVybik7XHJcbiAgICAgICAgZ2FtZS51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcclxuICAgIH1cclxuICAgIC8vIGdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFBsYXkgUGhhc2VcIiAmJlxyXG4gICAgaWYgKCBnYW1lLmN1cnJlbnRUdXJuID09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvbXB1dGVyR3Vlc3MgPSBnYW1lLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxyXG4gICAgICAgIGdhbWUudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICBwaGFzZVVwZGF0ZXIoZ2FtZSk7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVEcml2ZXJTY3JpcHQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJylcclxuXHJcbmNsYXNzIEdhbWUge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZUlkLCBwbGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lSWQgPSBnYW1lSWQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihwbGF5ZXJOYW1lKTtcclxuICAgICAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG4gICAgICAgIHRoaXMucGhhc2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE8tRE8gcHJvbXB0VXNlckNvb3JkaW5hdGUoKSwgcHJvbXB0VXNlck9yaWVudGF0aW9uKCksIGNoZWNrV2lubmVyKCk7XHJcblxyXG4gICAgY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGVzIGluIHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZXNdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VDb21wdXRlclNoaXAoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAoY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCBjb21wdXRlckNvb3JkaW5hdGUsIGNvbXB1dGVyT3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGlhbGl6ZUdhbWUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiXHJcbiAgICAgICAgY29uc3Qgc2hpcFR5cGVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xyXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNoaXAgb2Ygc2hpcFR5cGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VQbGF5ZXJTaGlwcyhzaGlwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUNvbXB1dGVyU2hpcChzaGlwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVR1cm4obW92ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWRNb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJNb3ZlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKCFpc1ZhbGlkTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJNb3ZlID0gdGhpcy5wbGF5ZXIxLm1ha2VBdHRhY2sobW92ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllck1vdmU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7IC8vIE91dHB1dCB0aGUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICBcclxuXHJcbiAgICAgICAgICAgICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFR1cm4gPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IHRoaXMuY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcbiAgICAgICAgICAgICh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLmRpc3BsYXkoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlckNob2ljZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0dXJuVmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSkgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBQbGF5IFBoYXNlXCJcclxuICAgICAgICAgICAgaWYgKHR1cm5WYWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFR1cm4gPSBcIlBsYXllciBNb3ZlXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VHVybiA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUdXJuID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFR1cm4gPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXB1dGVyIFdpbnNcIilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBXaW5zXCIpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHdoaWxlKCF0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsImZ1bmN0aW9uIHBsYWNlQm9hcmRNYXJrZXIoZ2FtZSwgbW92ZSwgdHVybikge1xyXG5cclxuICAgIGlmICh0dXJuID09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgbGV0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2IyR7Z2FtZS5wbGF5ZXIxLm5hbWV9LmdhbWVCb2FyZGApO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBzaGlwVHlwZSBpbiBnYW1lLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiBnYW1lLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXBbc2hpcFR5cGVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwQm94ID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihgZGl2IyR7Y29vcmRpbmF0ZX0uYm94YCk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBjb29yZGluYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwicGxhY2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmRhdGFzZXQuc2hpcCA9IHNoaXBUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInBsYXllclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC50ZXh0Q29udGVudCA9IFwiWFwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBCb3hNaXNzZWQgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBkaXYjJHttb3ZlfS5ib3hgKTtcclxuICAgIFxyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLmlkID0gXCJwbGF5ZXJcIlxyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLnRleHRDb250ZW50ID0gXCLCt1wiXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0dXJuID09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1vdmUpXHJcbiAgICAgICAgbGV0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbXB1dGVyLmdhbWVCb2FyZFwiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGUgaW4gZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIGdhbWUuY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcFR5cGVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwQm94ID0gY29tcHV0ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtjb29yZGluYXRlfS5ib3hgKTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKG1vdmUgPT09IGNvb3JkaW5hdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guZGF0YXNldC5zaGlwID0gc2hpcFR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IFwiY29tcHV0ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3gudGV4dENvbnRlbnQgPSBcIlhcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNoaXBCb3hNaXNzZWQgPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgICAgICBzaGlwQm94TWlzc2VkLmlkID0gXCJjb21wdXRlclwiXHJcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwbGFjZUJvYXJkTWFya2VyOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL2dhbWVCb2FyZFwiKTtcclxuXHJcblxyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IG5ldyBHYW1lYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW92ZSBpcyBhbHJlYWR5IG1hZGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FpKG5hbWUpIHtcclxuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuICAgICAgICByZXR1cm4gY2hlY2sgPT0gXCJDb21wdXRlclwiIHx8IGNoZWNrID09IFwiQWlcIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcclxuICAgICAgICBsZXQgYWxsTW92ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBjb2x1bW5OdW1iZXIgPSAwOyBjb2x1bW5OdW1iZXIgPCB0aGlzLmdhbWVCb2FyZC53aWR0aDsgY29sdW1uTnVtYmVyKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5BbGlhcyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sdW1uTnVtYmVyICsgNjUpO1xyXG4gICAgICAgICAgICAgICAgYWxsTW92ZXMucHVzaChjb2x1bW5BbGlhcyArIHJvd051bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFsbE1vdmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVhc3lBaU1vdmVzKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIGVhc3lBaU1vdmVzIGlzIHJlc3RyaWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNldCBvZiBhbGwgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IHVucGxheWVkTW92ZXMgPSBhbGxQb3NzaWJsZU1vdmVzLmZpbHRlcihtb3ZlID0+ICF0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKG1vdmUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgaWYgKHVucGxheWVkTW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbGwgbW92ZXMgaGF2ZSBiZWVuIHBsYXllZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIG1vdmUgZnJvbSB0aGUgc2V0IG9mIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdW5wbGF5ZWRNb3Zlc1tyYW5kb21JbmRleF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBhaVNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkhvcml6b250YWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwbGFjZUFsbFNoaXBzRm9yQUkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY2VzcyB0byBwbGFjZUFsbFNoaXBzRm9yQUkgaXMgcmVzdHJpY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKCFwbGFjZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNlbGVjdCBhIHJhbmRvbSBzdGFydGluZyBjb29yZGluYXRlXHJcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21Nb3ZlID0gdGhpcy5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaG9vc2UgYSByYW5kb20gb3JpZW50YXRpb25cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gdGhpcy5haVNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2hpcCB3aWxsIGZpdCB3aXRoaW4gdGhlIGJvdW5kcyBiYXNlZCBvbiBpdHMgc3RhcnRpbmcgY29vcmRpbmF0ZSwgb3JpZW50YXRpb24sIGFuZCBsZW5ndGhcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2hpcFBsYWNlbWVudFZhbGlkKHNoaXBOYW1lLCByYW5kb21Nb3ZlLCBvcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpdCdzIGEgdmFsaWQgcGxhY2VtZW50LCBhdHRlbXB0IHRvIHBsYWNlIHRoZSBzaGlwXHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VkID0gdGhpcy5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCByYW5kb21Nb3ZlLCBvcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChwbGFjZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBsYWNlZCBtb3ZlIGZyb20gY29tcGxldGVkIG1vdmVzIHNvIGl0IGNhbiBiZSB1c2VkIGJ5IHRoZSBBSSBkdXJpbmcgdGhlIGdhbWVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjaGVjayBpZiBhIHNoaXAgd2lsbCBmaXQgd2l0aGluIHRoZSBib2FyZFxyXG4gICAgaXNTaGlwUGxhY2VtZW50VmFsaWQoc2hpcE5hbWUsIHN0YXJ0aW5nQ29vcmRpbmF0ZSwgb3JpZW50YXRpb24pIHtcclxuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHN0YXJ0aW5nQ29vcmRpbmF0ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBmb3Igb3V0LW9mLWJvdW5kc1xyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiICYmIHBhcnNlSW50KGN1cnJlbnRDb29yZGluYXRlLnN1YnN0cmluZygxKSwgMTApICsgc2hpcExlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIiAmJiB0aGlzLmdhbWVCb2FyZC5jaGFyVG9Sb3dJbmRleChjdXJyZW50Q29vcmRpbmF0ZS5jaGFyQXQoMCkpICsgc2hpcExlbmd0aCA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGkgPCBzaGlwTGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiIFxyXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5nYW1lQm9hcmQuZ2V0QmVsb3dBbGlhcyhjdXJyZW50Q29vcmRpbmF0ZSkgXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmdhbWVCb2FyZC5nZXRSaWdodEFsaWFzKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJjb25zdCB7YmF0dGxlc2hpcFBpZWNlc30gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKHBsYXllcikge1xyXG4gICAgbGV0IHNoaXBQb3NpdGlvblN3aXRjaGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuaW5uZXJUZXh0ID0gXCJTd2l0Y2ggT3JpZW50YXRpb25cIlxyXG5cclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xyXG5cclxuICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRTaGlwT3JpZW50YXRpb25cIik7XHJcbiAgICBsZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW4tTGVmdFwiKTtcclxuXHJcblxyXG4gICAgaWYgKHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICBsZXQgdXBkYXRlZFZlcnRCb2FyZCA9IGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBcIlZlcnRpY2FsXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZFZlcnRCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIGxldCB1cGRhdGVkSG9yQm9hcmQgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApXHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlQ2hpbGQobGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4uaW5zZXJ0QmVmb3JlKHVwZGF0ZWRIb3JCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7c2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9ufWBcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHNoaXBQb3NpdGlvblN3aXRjaGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyOyIsImNvbnN0IHBsYWNlQm9hcmRNYXJrZXIgPSByZXF1aXJlKCcuL3BsYWNlQm9hcmRNYXJrZXInKVxyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSByZXF1aXJlKFwiLi9jcmVhdGVHYW1lQm9hcmRcIik7XHJcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lU3RhcnRTdGF0ZShnYW1lKSB7XHJcblxyXG4gICAgY29uc29sZS5sb2codHlwZW9mKGdhbWUuY29tcHV0ZXIpKTtcclxuXHJcbiAgICBsZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBsZXQgZ2FtZVN0YXJ0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5nYW1lU3RhcnRDb250YWluZXJcIilcclxuICAgIGdhbWVTdGFydENvbnRhaW5lci5yZW1vdmUoKTtcclxuXHJcbiAgICBsZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmdhbWVTY3JlZW4tTGVmdFwiKVxyXG4gICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlKCk7XHJcblxyXG4gICAgbGV0IGNvbXB1dGVyR2FtZUJvYXJkID0gY3JlYXRlR2FtZUJvYXJkKGdhbWUsIGdhbWUuY29tcHV0ZXIpO1xyXG4gICAgZ2FtZS5jb21wdXRlci5wbGFjZUFsbFNoaXBzRm9yQUkoKTtcclxuICAgIGdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY29tcHV0ZXJHYW1lQm9hcmQpO1xyXG4gICAgXHJcblxyXG4gICAgaWYgKGdhbWUuY3VycmVudFR1cm4gPT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICBsZXQgY29tcHV0ZXJHdWVzcyA9IGdhbWUucGxheVR1cm4oKTtcclxuICAgICAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxyXG4gICAgICAgICAgICBnYW1lLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJHYW1lU3RhcnRTdGF0ZTsiLCJcclxuY2xhc3MgU2hpcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcFR5cGVzID0ge1xyXG4gICAgICAgICAgICBDYXJyaWVyOiA1LFxyXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiA0LFxyXG4gICAgICAgICAgICBDcnVpc2VyOiAzLFxyXG4gICAgICAgICAgICBTdWJtYXJpbmU6IDMsXHJcbiAgICAgICAgICAgIERlc3Ryb3llcjogMixcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiAhIXRoaXMuc2hpcFR5cGVzW25hbWVdO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5zZXRMZW5ndGgodGhpcy5uYW1lKTtcclxuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjYXBpdGFsaXplRmlyc3Qoc3RyKSB7XHJcbiAgICAgICAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGVuZ3RoKG5hbWUpIHtcclxuICAgICAgICBjb25zdCBjYXBpdGFsaXplZFNoaXBOYW1lID0gdGhpcy5jYXBpdGFsaXplRmlyc3QobmFtZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1N1bmsoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGl0Q291bnQgPT0gdGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmlzRGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBoaXQoKSB7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCArPSAxO1xyXG4gICAgICAgIHRoaXMuaXNTdW5rKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0Q291bnQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiZnVuY3Rpb24gcGhhc2VVcGRhdGVyKGdhbWUpIHtcclxuXHJcbiAgICBsZXQgZ2FtZVBoYXNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lUGhhc2VcIik7XHJcbiAgICBsZXQgcGxheWVyVHVybiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyVHVyblwiKTtcclxuXHJcbiAgICBpZiAoZ2FtZSA9PSBudWxsKSB7XHJcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gXCJHYW1lIEluaXRpYWxpenRpb25cIlxyXG4gICAgICAgIHBsYXllclR1cm4udGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnYW1lUGhhc2UudGV4dENvbnRlbnQgPSBnYW1lLmN1cnJlbnRTdGF0ZTtcclxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50VHVybjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcGhhc2VVcGRhdGVyOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLmdhbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDEwMHZoO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmVkO1xyXG59XHJcblxyXG4uZ2FtZUhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMTUlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xyXG59XHJcblxyXG4jYmF0dGxlc2hpcFRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5nYW1lU3RhdGVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBoZWlnaHQ6IDcwJTtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA1JTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcclxuICAgIG1hcmdpbi10b3A6IDNlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVTY3JlZW4tTGVmdCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmN1cnJlbnRTaGlwT3JpZW50YXRpb24ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogODAlO1xyXG59XHJcblxyXG5cclxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogODAlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDIyLCAzOSwgMTg5KTtcclxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG59XHJcblxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBmb250LXNpemU6IDM2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xyXG59XHJcblxyXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgaGVpZ2h0OiA5MCU7XHJcbn1cclxuXHJcbi5hbHBoYUNvb3JkaW5hdGVzIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDUwMHB4O1xyXG4gICAgd2lkdGg6IDUwMHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXHJcbn1cclxuXHJcbi5yb3csIC5zaGlwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uc2hpcCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5ib3gge1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5ib3g6aG92ZXIge1xyXG4gICAgd2lkdGg6IDEwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcclxufVxyXG5cclxuLmhpZ2hsaWdodCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5wbGFjZWQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cclxufVxyXG5cclxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA1JTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcclxuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcclxufVxyXG5cclxuLnBpZWNlc0NvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4uc2hpcENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG59XHJcblxyXG4uc2hpcE5hbWUge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcclxufVxyXG5cclxuXHJcbi5zaGlwYm94IHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ucGxhY2VkVGV4dCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xyXG59XHJcblxyXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQjdmVydGljYWwge1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBmb250LXNpemU6IGxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiA2MHZoO1xyXG4gICAgd2lkdGg6IDYwdnc7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLmdhbWVTdGFydENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG59XHJcblxyXG4ucGxheWVySW5wdXROYW1lIHtcclxuICAgIGhlaWdodDogNTBweDsgICAgXHJcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcclxuICAgIHdpZHRoOiA2MCU7XHJcbiAgICBmb250LXNpemU6IDQwcHg7XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XHJcbn1cclxuXHJcbiNpbml0UGxhY2VCdXR0b24ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDU2LCAxNywgMTk0KTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG59XHJcblxyXG4jaW5pdFBsYWNlQnV0dG9uOmhvdmVyIHtcclxuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xyXG59XHJcblxyXG4jaW5pdFN0YXJ0QnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XHJcbn1cclxuXHJcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XHJcbn1cclxuXHJcbi52ZXJ0aWNhbERyYWdnYWJsZSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cclxufVxyXG5cclxuLnZlcnRpY2FsU2hpcE5hbWUge1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xyXG59XHJcblxyXG5cclxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXHJcbiAgICBoZWlnaHQ6IDQ4cHg7ICAvKiBhZGp1c3QgdGhpcyBhcyBwZXIgeW91ciBkZXNpZ24gKi9cclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIHRvIGVuc3VyZSBib3JkZXIgZG9lc24ndCBhZGQgdG8gd2lkdGgvaGVpZ2h0ICovXHJcbn1cclxuXHJcbi5ib3gucGxhY2VkLmhpdCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZm9udC1zaXplOiA1MHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDEwMDtcclxufSBcclxuXHJcbi5ib3gubWlzcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZm9udC1zaXplOiAxMDBweDtcclxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuOCk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn0gYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1C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O0lBQ2Ysa0JBQWtCO0FBQ3RCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RTs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLDBDQUEwQztJQUMxQyxZQUFZO0FBQ2hCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSGVhZGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMTUlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbiNiYXR0bGVzaGlwVGl0bGUge1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhdGVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBoZWlnaHQ6IDcwJTtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXIge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgaGVpZ2h0OiA5MCU7XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gICAgd2lkdGg6IDUwMHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucm93LCAuc2hpcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5oaWdobGlnaHQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5wbGFjZWQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxyXFxufVxcclxcblxcclxcbi5waWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uc2hpcGJveCB7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQjdmVydGljYWwge1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiA2MHZoO1xcclxcbiAgICB3aWR0aDogNjB2dztcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhcnRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xcclxcbiAgICBmb250LXdlaWdodDogNjAwO1xcclxcbiAgICBcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllcklucHV0TmFtZUxhYmVsIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllcklucHV0TmFtZSB7XFxyXFxuICAgIGhlaWdodDogNTBweDsgICAgXFxyXFxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xcclxcbiAgICB3aWR0aDogNjAlO1xcclxcbiAgICBmb250LXNpemU6IDQwcHg7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDhlbTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRQbGFjZUJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XFxyXFxuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFN0YXJ0QnV0dG9uIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NCwgMjcsIDI3KTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxEcmFnZ2FibGUge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcXHJcXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uYm94LnBsYWNlZC5oaXQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZm9udC1zaXplOiA1MHB4O1xcclxcbiAgICBmb250LXdlaWdodDogMTAwO1xcclxcbn0gXFxyXFxuXFxyXFxuLmJveC5taXNzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTAwcHg7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTI4LCAxMjgsIDEyOCwgMC44KTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn0gXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlU3RhcnRCdXR0b24nKTtcclxuY29uc3QgY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvblN3aXRjaGVyXCIpXHJcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XHJcbmNvbnN0IHJlbmRlckdhbWVTdGFydFN0YXRlID0gcmVxdWlyZSgnLi9yZW5kZXJHYW1lU3RhcnRTdGF0ZScpO1xyXG5jb25zdCBwbGFjZUJvYXJkTWFya2VyID0gcmVxdWlyZSgnLi9wbGFjZUJvYXJkTWFya2VyJylcclxuaW1wb3J0ICcuL2JhdHRsZXNoaXAuY3NzJztcclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpIHtcclxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vLyBJbml0aWFsaXplIFBsYXllciBOYW1lIFxyXG5sZXQgcGxheWVyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwbGF5ZXJOYW1lJyk7XHJcblxyXG4vLyBDcmVhdGUgYSBuZXcgZ2FtZSBmcm9tIHBsYXllciBuYW1lIGFuZCBzZXQgY3VycmVudCBzdGF0ZSB0byBnYW1lIHNldCB1cFxyXG5sZXQgY3VycmVudEdhbWUgPSBuZXcgR2FtZSAoZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSwgcGxheWVyTmFtZSlcclxuY3VycmVudEdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiO1xyXG5cclxuLy8gVXBkYXRlIHRoZSBHYW1lIFBoYXNlIEhUTUwgYWNjb3JkaW5nbHlcclxucGhhc2VVcGRhdGVyKGN1cnJlbnRHYW1lKTtcclxuXHJcbi8vIERlZmluZSB0aGUgY3VycmVudCBwbGF5ZXIgYmFzZWQgb24gdGhlIGN1cnJlbnQgZ2FtZSBjbGFzc1xyXG5sZXQgY3VycmVudFBsYXllciA9IGN1cnJlbnRHYW1lLnBsYXllcjE7XHJcblxyXG4vLyBEZWZpbmUgdGhlIGN1cnJlbnQgY29tcHV0ZXIgYmFzZWQgb24gdGhlIGN1cnJlbnQgZ2FtZSBjbGFzc1xyXG5sZXQgY29tcHV0ZXIgPSBjdXJyZW50R2FtZS5jb21wdXRlcjtcclxuXHJcbi8vIEdlbmVyYXRlIHRoZSBiYXR0bGVzaGlwIHBpZWNlcyBkZWZhdWx0IHN0YXRlXHJcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKGN1cnJlbnRQbGF5ZXIsIFwiSG9yaXpvbnRhbFwiKTtcclxuXHJcblxyXG5cclxubGV0IGdhbWVTdGFydEJ1dHRvbiA9IGNyZWF0ZUdhbWVTdGFydEVsZW1lbnQoY3VycmVudEdhbWUpO1xyXG5cclxubGV0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW5Db250YWluZXJcIik7XHJcblxyXG5sZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5jbGFzc05hbWU9XCJnYW1lU2NyZWVuLUxlZnRcIlxyXG5cclxubGV0IGN1cnJlbnRTaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmNsYXNzTmFtZSA9IFwiY3VycmVudFNoaXBPcmllbnRhdGlvblwiO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCJcclxuY3VycmVudFNoaXBPcmllbnRhdGlvbi5pbm5lclRleHQgPSBgQ3VycmVudCBTaGlwIFBvc2l0aW9uIGlzOiAke2N1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb259YFxyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGxlZnRHYW1lU2NyZWVuKTtcclxuXHJcblxyXG5cclxubGV0IHNoaXBQb3NpdGlvblN3aXRjaGVyID0gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIoY3VycmVudFBsYXllcik7XHJcblxyXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKGN1cnJlbnRHYW1lLCBjdXJyZW50UGxheWVyKTtcclxuLy8gbGV0IGJvYXJkMiA9IGNyZWF0ZUdhbWVCb2FyZChjdXJyZW50R2FtZS5jb21wdXRlcik7XHJcblxyXG5cclxuXHJcblxyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChjdXJyZW50U2hpcE9yaWVudGF0aW9uKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoc2hpcFBvc2l0aW9uU3dpdGNoZXIpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGJvYXJkMSk7XHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoZ2FtZVN0YXJ0QnV0dG9uKTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG4vLyBwbGFjZUJvYXJkTWFya2VyKGNvbXB1dGVyKVxyXG4vLyByZW5kZXJHYW1lU3RhcnRTdGF0ZSgpO1xyXG5cclxuIl0sIm5hbWVzIjpbImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwib3JpZW50YXRpb24iLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib3hXaWR0aCIsImJveEhlaWdodCIsImlzVmVydGljYWwiLCJjbGFzc05hbWUiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJhcHBlbmRDaGlsZCIsInNoaXBQaWVjZSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwicGxhY2VkRGl2IiwiaWQiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwid2lkdGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94Iiwic2V0QXR0cmlidXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZXF1aXJlIiwicmVxdWlyZSIsImdhbWVEcml2ZXJTY3JpcHQiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uIiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhc2V0Iiwic2hpcE9yaWVudGF0aW9uIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZSIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZFBsYWNlbWVudCIsImZvckVhY2giLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwibG93ZXJMZXR0ZXJCb3VuZCIsInVwcGVyTGV0dGVyQm91bmQiLCJwYXJzZSIsImdldERhdGEiLCJhZGp1c3RlZFRhcmdldFBvc2l0aW9uIiwiaGVhZENvb3JkaW5hdGUiLCJzZWxlY3RlZENoYXIiLCJwbGFjZVNoaXAiLCJoaXRNYXJrZXIiLCJzaGlwRWxlbWVudCIsImNvbmNhdCIsInBhcmVudEVsZW1lbnQiLCJwcmV2aW91c0JveGVzIiwiZSIsInBsYXllckd1ZXNzIiwicmVuZGVyR2FtZVN0YXJ0U3RhdGUiLCJwaGFzZVVwZGF0ZXIiLCJjcmVhdGVHYW1lU3RhcnRFbGVtZW50IiwiZ2FtZVN0YXJ0Q29udGFpbmVyIiwic3RhcnRCdXR0b25Db250YWluZXIiLCJzdGFydEJ1dHRvbiIsImxvZyIsImNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUiLCJhbGVydCIsImN1cnJlbnRUdXJuIiwiY3VycmVudFN0YXRlIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJDcnVpc2VyIiwiU3VibWFyaW5lIiwiRGVzdHJveWVyIiwiYm9hcmQiLCJzdGFydEdhbWUiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwic3RyaW5nVG9Db2xJbmRleCIsInN0ciIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwic2hpcEhlYWRDb29yZGluYXRlIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsInBsYWNlQm9hcmRNYXJrZXIiLCJjaGVja1dpbm5lciIsInBsYXlUdXJuIiwidXBkYXRlU3RhdGUiLCJjb21wdXRlckd1ZXNzIiwiUGxheWVyIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJwbGF5ZXIxIiwiY29tcHV0ZXIiLCJwaGFzZUNvdW50ZXIiLCJzaGlwVHlwZXMiLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsIl9pIiwiX3NoaXBUeXBlcyIsInBsYWNlUGxheWVyU2hpcHMiLCJzdGFydCIsIm1vdmUiLCJpc1ZhbGlkTW92ZSIsInBsYXllck1vdmUiLCJtYWtlQXR0YWNrIiwibWVzc2FnZSIsImNvbXB1dGVyQ2hvaWNlIiwiY29tcHV0ZXJNb3ZlIiwidHVyblZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidHVybiIsInBsYXllckJvYXJkIiwic2hpcFR5cGUiLCJzaGlwQm94TWlzc2VkIiwiY29tcHV0ZXJCb2FyZCIsIl9pdGVyYXRvcjIiLCJfc3RlcDIiLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsInRvTG93ZXJDYXNlIiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwicmFuZG9tSW5kZXgiLCJwbGFjZUFsbFNoaXBzRm9yQUkiLCJwbGFjZWQiLCJyYW5kb21Nb3ZlIiwiaXNTaGlwUGxhY2VtZW50VmFsaWQiLCJwb3AiLCJzdGFydGluZ0Nvb3JkaW5hdGUiLCJjcmVhdGVTaGlwUG9zaXRpb25Td2l0Y2hlciIsInNoaXBQb3NpdGlvblN3aXRjaGVyIiwiaW5uZXJUZXh0IiwibGVmdEdhbWVTY3JlZW4iLCJ1cGRhdGVkVmVydEJvYXJkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwidXBkYXRlZEhvckJvYXJkIiwiX3R5cGVvZiIsImdhbWVTY3JlZW4iLCJjb21wdXRlckdhbWVCb2FyZCIsImlzVmFsaWQiLCJzZXRMZW5ndGgiLCJoaXRDb3VudCIsImNhcGl0YWxpemVkU2hpcE5hbWUiLCJpc1N1bmsiLCJnYW1lUGhhc2UiLCJwbGF5ZXJUdXJuIiwiZ2VuZXJhdGVSYW5kb21TdHJpbmciLCJjaGFyYWN0ZXJzIiwicmVzdWx0IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImN1cnJlbnRHYW1lIiwiY3VycmVudFBsYXllciIsInBpZWNlcyIsImdhbWVTdGFydEJ1dHRvbiIsImN1cnJlbnRTaGlwT3JpZW50YXRpb24iLCJib2FyZDEiXSwic291cmNlUm9vdCI6IiJ9