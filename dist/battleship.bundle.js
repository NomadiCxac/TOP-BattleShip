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
      box.classList.add("".concat(player.name));
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
        if (game.currentTurn == "Player Move" && e.target.classList.contains(game.player1.name)) {
          alert("Cannot click your own board");
          return;
        } else {
          gameDriverScript(game, playerGuess);
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
  console.log(game.currentState);
  console.log(playerGuess);
  if (game.currentState === "Game Set-Up") {
    console.log("Stepped into 1");
    alert("Cannot click boxes till game has started");
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
    if (game.checkWinner()) {
      phaseUpdater(game);
      return;
    }
    var computerGuess = game.playTurn();
    placeBoardMarker(game, computerGuess, game.currentTurn);
    game.updateState();
    phaseUpdater(game);
    game.checkWinner();
  }
  // game.currentState = "Game Play Phase" &&
  if (game.checkWinner()) {
    phaseUpdater(game);
    return;
  }
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
      this.computer.gameBoard.display();
      if (this.currentTurn === "Player Move") {
        var isValidMove = false;
        var playerMove;
        while (!isValidMove) {
          try {
            playerMove = this.player1.makeAttack(move);
            isValidMove = true;
            this.computer.gameBoard.receiveAttack(move);
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
        alert("Computer Wins");
        this.currentState = "Game-Over";
        this.currentTurn = "Computer Wins!";
        return true;
      }
      if (this.computer.gameBoard.gameOver()) {
        alert("Player Wins");
        this.currentState = "Game-Over";
        this.currentTurn = "Player Wins!";
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
    font-size: 20px;
    font-weight: 100;
    background-color: rgba(128, 128, 128, 0.8);
    color: white;
} `, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"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","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameScreen-Left {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 100%;\r\n    width: 20%;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.currentShipOrientation {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border: 1px solid black;\r\n    height: 10%;\r\n    width: 80%;\r\n}\r\n\r\n\r\n.shipPositionSwitcher {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 10%;\r\n    width: 80%;\r\n    color: white;\r\n    background: rgb(22, 39, 189);\r\n    margin-bottom: 1.5em;\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n    box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.highlight {\r\n    background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.placed {\r\n    background-color: rgba(20, 61, 173, 0.4); /* Semi-transparent black. Adjust as needed. */\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.placedText {\r\n    display: flex;\r\n    color: greenyellow;\r\n}\r\n\r\n.placedText#horizontal {\r\n    font-size: x-large;\r\n    margin-left: 1.5em;\r\n}\r\n\r\n.placedText#vertical {\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 100%;\r\n    font-size: large;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 60vh;\r\n    width: 60vw;\r\n    border: 3px solid black;\r\n}\r\n\r\n.gameStartContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 100%;\r\n    font-style: italic;\r\n    font-weight: 600;\r\n    \r\n}\r\n\r\n.playerInputNameLabel {\r\n    font-size: xx-large;\r\n}\r\n\r\n.playerInputName {\r\n    height: 50px;    \r\n    margin-top: 0.5em;\r\n    width: 60%;\r\n    font-size: 40px;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    font-size: x-large;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 12em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 8em;\r\n}\r\n\r\n#initPlaceButton {\r\n    background-color: rgb(56, 17, 194);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: xx-large;\r\n}\r\n\r\n#initPlaceButton:hover {\r\n    color: rgb(238, 255, 0);\r\n}\r\n\r\n#initStartButton {\r\n    background-color: rgb(194, 27, 27);\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}\r\n\r\n.verticalPiecesContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.verticalDraggable {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n}\r\n\r\n.verticalShipName {\r\n    font-size: 16px;\r\n    margin-bottom: 1em;\r\n}\r\n\r\n\r\n.verticalShipContainer {\r\n    display: flex;\r\n    flex-direction: column;  /* this stacks the ship boxes vertically */\r\n    align-items: center;\r\n}\r\n\r\n.shipbox, .verticalShipbox { \r\n    height: 48px;  /* adjust this as per your design */\r\n    width: 50px;\r\n    border: 1px solid #000; /* for visualization */\r\n    box-sizing: border-box; /* to ensure border doesn't add to width/height */\r\n}\r\n\r\n.box.placed.hit {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 50px;\r\n    font-weight: 100; \r\n} \r\n\r\n.box.miss {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 20px;\r\n    font-weight: 100;\r\n    background-color: rgba(128, 128, 128, 0.8);\r\n    color: white;\r\n} "],"sourceRoot":""}]);
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
// // renderGameStartState();

// currentGame.player1.gameBoard.setAllShipsToDead();

// currentGame.checkWinner();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlGQUFpRixVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxRQUFRLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyx3QkFBd0IsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZ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OztBQUVBLDZCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwUGllY2VzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlR2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlU3RhcnRCdXR0b24uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lRHJpdmVyU2NyaXB0LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGFjZUJvYXJkTWFya2VyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcG9zaXRpb25Td2l0Y2hlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3JlbmRlckdhbWVTdGFydFN0YXRlLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3VwZGF0ZUN1cnJlbnRQaGFzZS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3M/ZTBmZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZHJhZ0RhdGEgPSB7XHJcbiAgICBkcmFnZ2VkU2hpcDogbnVsbFxyXG59O1xyXG5cclxuZnVuY3Rpb24gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gICAgbGV0IGJveEhlaWdodCA9IDQ4O1xyXG4gICAgbGV0IGlzVmVydGljYWwgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xyXG5cclxuICAgIHBpZWNlc0NvbnRhaW5lci5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lclwiIDogXCJwaWVjZXNDb250YWluZXJcIjtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICBsZXQgc2hpcEF0dHJpYnV0ZSA9IHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2U7XHJcbiAgICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwQ29udGFpbmVyXCIgOiBcInNoaXBDb250YWluZXJcIjtcclxuICAgIFxyXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBOYW1lXCIgOiBcInNoaXBOYW1lXCI7XHJcbiAgICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcbiAgICBcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7IC8vIEFkZCB0aGUgc2hpcFRpdGxlIGZpcnN0IFxyXG4gICAgXHJcbiAgICAgICAgbGV0IHNoaXBQaWVjZTtcclxuICAgIFxyXG4gICAgICAgIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlZERpdik7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoaXNWZXJ0aWNhbCA/IFwidmVydGljYWxEcmFnZ2FibGVcIiA6IFwiZHJhZ2dhYmxlXCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUgOiBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5zdHlsZS53aWR0aCA9IGlzVmVydGljYWwgPyBib3hXaWR0aCArIFwicHhcIiA6IChib3hXaWR0aCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIjtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IGlzVmVydGljYWwgPyAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiIDogYm94SGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogY2xpY2tlZEJveE9mZnNldFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRyYWdEYXRhLmRyYWdnZWRTaGlwID0gc2hpcERhdGE7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicsIEpTT04uc3RyaW5naWZ5KHNoaXBEYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFggPSBzaGlwSGVhZFJlY3QubGVmdCAtIHNoaXBQaWVjZVJlY3QubGVmdCArIChzaGlwSGVhZFJlY3Qud2lkdGggLyAyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShzaGlwUGllY2UsIG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEF0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSBib3hXaWR0aCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwUGllY2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2hpcFBpZWNlLmFwcGVuZENoaWxkKHNoaXBCb3gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFBpZWNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtiYXR0bGVzaGlwUGllY2VzLCBkcmFnRGF0YSB9OyIsImNvbnN0IHsgZHJhZ0RhdGEgfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBnYW1lRHJpdmVyU2NyaXB0ID0gcmVxdWlyZSgnLi9nYW1lRHJpdmVyU2NyaXB0Jyk7XHJcblxyXG4vLyBsZXQgZHJhZ2dlZFNoaXBEYXRhID0gbnVsbDsgIC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcclxuXHJcbmZ1bmN0aW9uIGdldEFmZmVjdGVkQm94ZXMoaGVhZFBvc2l0aW9uLCBsZW5ndGgsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBjb25zdCBib3hlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoaGVhZFBvc2l0aW9uLnNsaWNlKDEpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYXJQYXJ0ICsgKG51bVBhcnQgKyBpKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgaSkgKyBudW1QYXJ0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hlcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGJveElkWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveElkLnNsaWNlKDEpKTtcclxuXHJcbiAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gb2Zmc2V0O1xyXG5cclxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICByZXR1cm4gYWRqdXN0ZWROdW1QYXJ0ID4gMCAmJiBhZGp1c3RlZE51bVBhcnQgKyBsZW5ndGggLSAxIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKSB7XHJcbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbZGF0YS1zaGlwLW9yaWVudGF0aW9uXVwiKTtcclxuICAgIHJldHVybiBzaGlwT3JpZW50YXRpb25FbGVtZW50ID8gc2hpcE9yaWVudGF0aW9uRWxlbWVudC5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA6IFwiSG9yaXpvbnRhbFwiO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZUJvYXJkKGdhbWUsIHBsYXllcikge1xyXG4gICAgXHJcblxyXG4gICAgLy8gR2VuZXJhdGUgZGl2IGVsZW1lbnRzIGZvciBHYW1lIEJvYXJkXHJcbiAgICBsZXQgZ2FtZUJvYXJkQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRUb3BDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBhbHBoYUNvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBudW1lcmljQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIFxyXG4gICBcclxuICAgICAvLyBBc3NpZ25pbmcgY2xhc3NlcyB0byB0aGUgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgIGdhbWVCb2FyZENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lclwiO1xyXG4gICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciB0b3BcIjtcclxuICAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgYm90dG9tXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkXCI7XHJcbiAgICAgZ2FtZUJvYXJkLmlkID0gcGxheWVyLm5hbWU7IC8vIEFzc3VtaW5nIHRoZSBwbGF5ZXIgaXMgYSBzdHJpbmcgbGlrZSBcInBsYXllcjFcIlxyXG4gICAgIGFscGhhQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJhbHBoYUNvb3JkaW5hdGVzXCI7XHJcbiAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwibnVtZXJpY0Nvb3JkaW5hdGVzXCI7XHJcblxyXG4gICAgIC8vIENyZWF0ZSBjb2x1bW4gdGl0bGVzIGVxdWFsIHRvIHdpZHRoIG9mIGJvYXJkXHJcbiAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb2x1bW5UaXRsZS50ZXh0Q29udGVudCA9IGk7XHJcbiAgICAgICAgbnVtZXJpY0Nvb3JkaW5hdGVzLmFwcGVuZENoaWxkKGNvbHVtblRpdGxlKTtcclxuICAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmFwcGVuZENoaWxkKG51bWVyaWNDb29yZGluYXRlcyk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgcm93cyBhbmQgcm93IHRpdGxlcyBlcXVhbCB0byBoZWlnaHRcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7IGkrKykge1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpICsgNjUpO1xyXG5cclxuICAgICAgICBsZXQgcm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvd1RpdGxlLnRleHRDb250ZW50ID0gYWxwaGFDaGFyO1xyXG4gICAgICAgIGFscGhhQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQocm93VGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuICAgICAgICByb3cuaWQgPSBhbHBoYUNoYXI7XHJcblxyXG4gICAgICAgIGxldCBhZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgbGV0IHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFtdO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIGNvb3JkaW5hdGUgY29sdW1ucyBmb3IgZWFjaCByb3dcclxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBqKyspIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XHJcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKGAke3BsYXllci5uYW1lfWApO1xyXG4gICAgICAgICAgICBib3guaWQgPSBhbHBoYUNoYXIgKyBqXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBkcmFnRGF0YS5kcmFnZ2VkU2hpcDtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbLi4uYWZmZWN0ZWRCb3hlc107IC8vIG1ha2UgYSBzaGFsbG93IGNvcHkgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGlwRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU2hpcCBkYXRhIGlzIG51bGwhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIG91dCBpZiB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZFBsYWNlbWVudCA9IGlzVmFsaWRQbGFjZW1lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLm9mZnNldCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUGxhY2VtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LmRyYWdBZmZlY3RlZCA9IFwidHJ1ZVwiOyAvLyBBZGQgdGhpcyBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApOyAvLyBkZWxheSBvZiAwIG1zLCBqdXN0IGVub3VnaCB0byBsZXQgZHJhZ2xlYXZlIGhhcHBlbiBmaXJzdCBpZiBpdCdzIGdvaW5nIHRvXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlBZmZlY3RlZEJveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJveFtkYXRhLWRyYWctYWZmZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcy5mb3JFYWNoKHByZXZCb3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpOyAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyTGV0dGVyQm91bmQgPSA2NTtcclxuICAgICAgICAgICAgICAgIGxldCB1cHBlckxldHRlckJvdW5kID0gNzQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGJveC5pZFswXTsgIC8vIEFzc3VtaW5nIHRoZSBmb3JtYXQgaXMgYWx3YXlzIGxpa2UgXCJBNVwiXHJcbiAgICAgICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94LmlkLnNsaWNlKDEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIHNoaXBEYXRhLm9mZnNldDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkVGFyZ2V0UG9zaXRpb24gPSBjaGFyUGFydCArIGFkanVzdGVkTnVtUGFydDsgIC8vIFRoZSBuZXcgcG9zaXRpb24gZm9yIHRoZSBoZWFkIG9mIHRoZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBsZXQgYWZmZWN0ZWRCb3hlcyA9IGdldEFmZmVjdGVkQm94ZXMoYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiwgc2hpcERhdGEubGVuZ3RoLCBzaGlwT3JpZW50YXRpb24pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhZGp1c3RlZCBwb3NpdGlvbiBiYXNlZCBvbiB3aGVyZSB0aGUgdXNlciBjbGlja2VkIG9uIHRoZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkQ29vcmRpbmF0ZSA9IChjaGFyUGFydCArIG51bVBhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENoYXIgPSBjaGFyUGFydC5jaGFyQ29kZUF0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGFjZW1lbnQgaXMgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIiAmJiAoYWRqdXN0ZWROdW1QYXJ0IDw9IDAgfHwgYWRqdXN0ZWROdW1QYXJ0ICsgc2hpcERhdGEubGVuZ3RoIC0gMSA+IHBsYXllci5nYW1lQm9hcmQud2lkdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIlZlcnRpY2FsXCIgJiYgKHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCA8IGxvd2VyTGV0dGVyQm91bmQgfHwgc2VsZWN0ZWRDaGFyICsgc2hpcERhdGEubGVuZ3RoIC0gMSA+IHVwcGVyTGV0dGVyQm91bmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLm5hbWUsIGhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE92ZXJsYXBwaW5nIFNoaXAuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LmhpdE1hcmtlciA9IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuc2hpcCA9IHNoaXBEYXRhLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmVydGljYWwgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwRWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBwbGFjZSAke3NoaXBEYXRhLm5hbWV9IHdpdGggbGVuZ3RoICR7c2hpcERhdGEubGVuZ3RofSBhdCBwb3NpdGlvbiAke2FkanVzdGVkVGFyZ2V0UG9zaXRpb259LmApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtzaGlwRGF0YS5uYW1lfS5kcmFnZ2FibGUuc2hpcGApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIlZlcnRpY2FsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiN2ZXJ0aWNhbCR7c2hpcERhdGEubmFtZX0udmVydGljYWxEcmFnZ2FibGUuc2hpcGApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEVsZW1lbnQgPSBzaGlwRWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBwbGFjZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmNsYXNzTmFtZSA9IFwicGxhY2VkVGV4dFwiO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIG5ldyBkaXYgdG8gdGhlIHBhcmVudCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHBsYWNlZERpdik7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7XHJcbiAgICAgICAgICAgICAgICAvLyBsZXQgc2hpcE9iamVjdE5hbWUgPSBzaGlwRGF0YS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNCb3hlcyA9IGFmZmVjdGVkQm94ZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4gYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBsYXllckd1ZXNzID0gZS50YXJnZXQuaWQ7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGdhbWUuY3VycmVudFR1cm4gPT0gXCJQbGF5ZXIgTW92ZVwiICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhnYW1lLnBsYXllcjEubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ2Fubm90IGNsaWNrIHlvdXIgb3duIGJvYXJkXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ2FtZURyaXZlclNjcmlwdChnYW1lLCBwbGF5ZXJHdWVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgIFxyXG5cclxuICAgICAgICBnYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoYWxwaGFDb29yZGluYXRlcyk7XHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxuXHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkVG9wQ29tcG9uZW50KTtcclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRCb3R0b21Db21wb25lbnQpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZ2FtZUJvYXJkQ29tcG9uZW50XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZUJvYXJkOyIsImNvbnN0IHJlbmRlckdhbWVTdGFydFN0YXRlID0gcmVxdWlyZSgnLi9yZW5kZXJHYW1lU3RhcnRTdGF0ZScpO1xyXG5jb25zdCBwaGFzZVVwZGF0ZXIgPSByZXF1aXJlKCcuL3VwZGF0ZUN1cnJlbnRQaGFzZScpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCAoZ2FtZSkge1xyXG4gICAgbGV0IGdhbWVTdGFydENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lU3RhcnRDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lU3RhcnRDb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgc3RhcnRCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJ1dHRvblxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XHJcbiAgICBzdGFydEJ1dHRvbi5pZCA9IFwiaW5pdFN0YXJ0QnV0dG9uXCI7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XHJcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpKVxyXG5cclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgUGxhY2UgQWxsIFlvdXIgU2hpcHMgaW4gTGVnYWwgUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAvLyBnYW1lLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgIGdhbWUuY3VycmVudFR1cm4gPSBcIkNvbXB1dGVyIE1vdmVcIjtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiXHJcbiAgICAgICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcclxuICAgICAgICAgICAgcmVuZGVyR2FtZVN0YXJ0U3RhdGUoZ2FtZSkgICAgICBcclxuICAgICAgICAgICAgLy8gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5kaXNwbGF5KClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0pIFxyXG5cclxuICAgIC8vIEFwcGVuZCB0aGUgc3RhcnRCdXR0b25Db250YWluZXIgdG8gdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICBnYW1lU3RhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRCdXR0b25Db250YWluZXIpO1xyXG5cclxuICAgIHJldHVybiBnYW1lU3RhcnRDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IHBsYWNlQm9hcmRNYXJrZXIgPSByZXF1aXJlKCcuL3BsYWNlQm9hcmRNYXJrZXInKTtcclxuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhnYW1lLmN1cnJlbnRTdGF0ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhwbGF5ZXJHdWVzcyk7XHJcblxyXG5cclxuICAgIGlmIChnYW1lLmN1cnJlbnRTdGF0ZSA9PT0gXCJHYW1lIFNldC1VcFwiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gMVwiKTtcclxuICAgICAgICBhbGVydChcIkNhbm5vdCBjbGljayBib3hlcyB0aWxsIGdhbWUgaGFzIHN0YXJ0ZWRcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZyhnYW1lLnBsYXlUdXJuKHBsYXllckd1ZXNzKSk7XHJcblxyXG4gICAgaWYgKCFnYW1lLnBsYXlUdXJuKHBsYXllckd1ZXNzKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RlcHBlZCBpbnRvIDNcIik7XHJcblxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBNb3ZlISBUcnkgYWdhaW4uXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIGlmIChnYW1lLmN1cnJlbnRTdGF0ZSA9PSBcIkdhbWUgUGxheSBQaGFzZVwiICYmIGdhbWUuY3VycmVudFR1cm4gPT09IFwiUGxheWVyIE1vdmVcIikgeyAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0ZXBwZWQgaW50byA0XCIpOyAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIHBsYXllckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKTtcclxuICAgICAgICBnYW1lLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xyXG5cclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1dpbm5lcigpKSB7XHJcblxyXG4gICAgICAgICAgICBwaGFzZVVwZGF0ZXIoZ2FtZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgICAgbGV0IGNvbXB1dGVyR3Vlc3MgPSBnYW1lLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxyXG4gICAgICAgIGdhbWUudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICBwaGFzZVVwZGF0ZXIoZ2FtZSk7XHJcbiAgICAgICAgZ2FtZS5jaGVja1dpbm5lcigpXHJcbiAgICB9XHJcbiAgICAvLyBnYW1lLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBQbGF5IFBoYXNlXCIgJiZcclxuICAgIGlmIChnYW1lLmNoZWNrV2lubmVyKCkpIHtcclxuXHJcbiAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnYW1lRHJpdmVyU2NyaXB0OyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpXHJcblxyXG5jbGFzcyBHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVJZCwgcGxheWVyTmFtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUlkID0gZ2FtZUlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuICAgICAgICB0aGlzLnBoYXNlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPLURPIHByb21wdFVzZXJDb29yZGluYXRlKCksIHByb21wdFVzZXJPcmllbnRhdGlvbigpLCBjaGVja1dpbm5lcigpO1xyXG5cclxuICAgIGNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSAhPSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApO1xyXG4gICAgICAgIGZvciAobGV0IHNoaXBUeXBlcyBpbiB0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXBbc2hpcFR5cGVzXS5jb29yZGluYXRlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlQ29tcHV0ZXJTaGlwKHNoaXBOYW1lKSB7XHJcbiAgICAgICAgd2hpbGUgKGNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwTmFtZSwgY29tcHV0ZXJDb29yZGluYXRlLCBjb21wdXRlck9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbnRpYWxpemVHYW1lKCkge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBTZXQtVXBcIlxyXG4gICAgICAgIGNvbnN0IHNoaXBUeXBlcyA9IFtcIkNhcnJpZXJcIiwgXCJCYXR0bGVzaGlwXCIsIFwiQ3J1aXNlclwiLCBcIlN1Ym1hcmluZVwiLCBcIkRlc3Ryb3llclwiXTtcclxuICAgICAgICAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzaGlwIG9mIHNoaXBUeXBlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlUGxheWVyU2hpcHMoc2hpcCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VDb21wdXRlclNoaXAoc2hpcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlUdXJuKG1vdmUpIHtcclxuICAgICAgICAodGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpKTtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyTW92ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyTW92ZSA9IHRoaXMucGxheWVyMS5tYWtlQXR0YWNrKG1vdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKG1vdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGF5ZXJNb3ZlO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAodGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOyAvLyBPdXRwdXQgdGhlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFR1cm4gPT09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNob2ljZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gdGhpcy5jb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVyQ2hvaWNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgICBsZXQgdHVyblZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBQbGF5IFBoYXNlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSB0dXJuVmFsdWUgPT09IDEgPyBcIlBsYXllciBNb3ZlXCIgOiBcIkNvbXB1dGVyIE1vdmVcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFR1cm4gPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJDb21wdXRlciBNb3ZlXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJQbGF5ZXIgTW92ZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja1dpbm5lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ29tcHV0ZXIgV2luc1wiKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUtT3ZlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJDb21wdXRlciBXaW5zIVwiXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcHV0ZXIuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGF5ZXIgV2luc1wiKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUtT3ZlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJQbGF5ZXIgV2lucyFcIlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB3aGlsZSghdGhpcy5jaGVja1dpbm5lcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5VHVybigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG4iLCJmdW5jdGlvbiBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIG1vdmUsIHR1cm4pIHtcclxuXHJcbiAgICBpZiAodHVybiA9PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgIGxldCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2dhbWUucGxheWVyMS5uYW1lfS5nYW1lQm9hcmRgKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGUgaW4gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlXS5jb29yZGluYXRlcykge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2Nvb3JkaW5hdGV9LmJveGApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBpZiAobW92ZSA9PT0gY29vcmRpbmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5kYXRhc2V0LnNoaXAgPSBzaGlwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LnRleHRDb250ZW50ID0gXCJYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hpcEJveE1pc3NlZCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR1cm4gPT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cobW92ZSlcclxuICAgICAgICBsZXQgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29tcHV0ZXIuZ2FtZUJvYXJkXCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBzaGlwVHlwZSBpbiBnYW1lLmNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2Nvb3JkaW5hdGV9LmJveGApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBpZiAobW92ZSA9PT0gY29vcmRpbmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5kYXRhc2V0LnNoaXAgPSBzaGlwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LnRleHRDb250ZW50ID0gXCJYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzaGlwQm94TWlzc2VkID0gY29tcHV0ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBkaXYjJHttb3ZlfS5ib3hgKTtcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC50ZXh0Q29udGVudCA9IFwiwrdcIlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBsYWNlQm9hcmRNYXJrZXI7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xyXG5cclxuXHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5BaSA9IHRoaXMuaXNBaSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VBdHRhY2soY29vcmRpbmF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhjb29yZGluYXRlKSAmJiAhdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3ZlIGlzIGFscmVhZHkgbWFkZVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQWkobmFtZSkge1xyXG4gICAgICAgIGxldCBjaGVjayA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjaGVjayA9PSBcIkNvbXB1dGVyXCIgfHwgY2hlY2sgPT0gXCJBaVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBbGxQb3NzaWJsZU1vdmVzKCkge1xyXG4gICAgICAgIGxldCBhbGxNb3ZlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3dOdW1iZXIgPSAxOyByb3dOdW1iZXIgPD0gdGhpcy5nYW1lQm9hcmQuaGVpZ2h0OyByb3dOdW1iZXIrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbkFsaWFzID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW5OdW1iZXIgKyA2NSk7XHJcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZWFzeUFpTW92ZXMoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgYWxsUG9zc2libGVNb3ZlcyA9IHRoaXMuZ2V0QWxsUG9zc2libGVNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgdW5wbGF5ZWRNb3ZlcyA9IGFsbFBvc3NpYmxlTW92ZXMuZmlsdGVyKG1vdmUgPT4gIXRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMobW92ZSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHVucGxheWVkIG1vdmVzIGxlZnQsIHJhaXNlIGFuIGVycm9yIG9yIGhhbmRsZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBpZiAodW5wbGF5ZWRNb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gdGhpcy5nZXRSYW5kb21JbnQoMCwgdW5wbGF5ZWRNb3Zlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB1bnBsYXllZE1vdmVzW3JhbmRvbUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpICsgMTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlQWxsU2hpcHNGb3JBSSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIHBsYWNlQWxsU2hpcHNGb3JBSSBpcyByZXN0cmljdGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICBsZXQgcGxhY2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZSAoIXBsYWNlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0IGEgcmFuZG9tIHN0YXJ0aW5nIGNvb3JkaW5hdGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU1vdmUgPSB0aGlzLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENob29zZSBhIHJhbmRvbSBvcmllbnRhdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSB0aGlzLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm91bmRzIGJhc2VkIG9uIGl0cyBzdGFydGluZyBjb29yZGluYXRlLCBvcmllbnRhdGlvbiwgYW5kIGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTaGlwUGxhY2VtZW50VmFsaWQoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYSB2YWxpZCBwbGFjZW1lbnQsIGF0dGVtcHQgdG8gcGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0aGlzLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcGxhY2VkIG1vdmUgZnJvbSBjb21wbGV0ZWQgbW92ZXMgc28gaXQgY2FuIGJlIHVzZWQgYnkgdGhlIEFJIGR1cmluZyB0aGUgZ2FtZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgc2hpcCB3aWxsIGZpdCB3aXRoaW4gdGhlIGJvYXJkXHJcbiAgICBpc1NoaXBQbGFjZW1lbnRWYWxpZChzaGlwTmFtZSwgc3RhcnRpbmdDb29yZGluYXRlLCBvcmllbnRhdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc3RhcnRpbmdDb29yZGluYXRlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIgJiYgcGFyc2VJbnQoY3VycmVudENvb3JkaW5hdGUuc3Vic3RyaW5nKDEpLCAxMCkgKyBzaGlwTGVuZ3RoID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiICYmIHRoaXMuZ2FtZUJvYXJkLmNoYXJUb1Jvd0luZGV4KGN1cnJlbnRDb29yZGluYXRlLmNoYXJBdCgwKSkgKyBzaGlwTGVuZ3RoID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmdhbWVCb2FyZC5nZXRCZWxvd0FsaWFzKGN1cnJlbnRDb29yZGluYXRlKSBcclxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZ2FtZUJvYXJkLmdldFJpZ2h0QWxpYXMoY3VycmVudENvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIocGxheWVyKSB7XHJcbiAgICBsZXQgc2hpcFBvc2l0aW9uU3dpdGNoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuY2xhc3NOYW1lID1cInNoaXBQb3NpdGlvblN3aXRjaGVyXCI7XHJcbiAgICBzaGlwUG9zaXRpb25Td2l0Y2hlci5pbm5lclRleHQgPSBcIlN3aXRjaCBPcmllbnRhdGlvblwiXHJcblxyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudFNoaXBPcmllbnRhdGlvblwiKTtcclxuICAgIGxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbi1MZWZ0XCIpO1xyXG5cclxuXHJcbiAgICBpZiAoc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIGxldCB1cGRhdGVkVmVydEJvYXJkID0gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIFwiVmVydGljYWxcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxheWVyLmdhbWVCb2FyZC5zaGlwKVxyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLnJlbW92ZUNoaWxkKGxlZnRHYW1lU2NyZWVuLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLmluc2VydEJlZm9yZSh1cGRhdGVkVmVydEJvYXJkLCBsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCI7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRIb3JCb2FyZCA9IGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBcIkhvcml6b250YWxcIik7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZEhvckJvYXJkLCBsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzaGlwT3JpZW50YXRpb24uaW5uZXJUZXh0ID0gYEN1cnJlbnQgU2hpcCBQb3NpdGlvbiBpczogJHtzaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb259YFxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gc2hpcFBvc2l0aW9uU3dpdGNoZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXI7IiwiY29uc3QgcGxhY2VCb2FyZE1hcmtlciA9IHJlcXVpcmUoJy4vcGxhY2VCb2FyZE1hcmtlcicpXHJcbmNvbnN0IGNyZWF0ZUdhbWVCb2FyZCA9IHJlcXVpcmUoXCIuL2NyZWF0ZUdhbWVCb2FyZFwiKTtcclxuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckdhbWVTdGFydFN0YXRlKGdhbWUpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0eXBlb2YoZ2FtZS5jb21wdXRlcikpO1xyXG5cclxuICAgIGxldCBnYW1lU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lU2NyZWVuQ29udGFpbmVyXCIpO1xyXG5cclxuICAgIGxldCBnYW1lU3RhcnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmdhbWVTdGFydENvbnRhaW5lclwiKVxyXG4gICAgZ2FtZVN0YXJ0Q29udGFpbmVyLnJlbW92ZSgpO1xyXG5cclxuICAgIGxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuZ2FtZVNjcmVlbi1MZWZ0XCIpXHJcbiAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmUoKTtcclxuXHJcbiAgICBsZXQgY29tcHV0ZXJHYW1lQm9hcmQgPSBjcmVhdGVHYW1lQm9hcmQoZ2FtZSwgZ2FtZS5jb21wdXRlcik7XHJcbiAgICBnYW1lLmNvbXB1dGVyLnBsYWNlQWxsU2hpcHNGb3JBSSgpO1xyXG4gICAgZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChjb21wdXRlckdhbWVCb2FyZCk7XHJcbiAgICBcclxuXHJcbiAgICBpZiAoZ2FtZS5jdXJyZW50VHVybiA9PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgIGxldCBjb21wdXRlckd1ZXNzID0gZ2FtZS5wbGF5VHVybigpO1xyXG4gICAgICAgICAgICBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIGNvbXB1dGVyR3Vlc3MsIGdhbWUuY3VycmVudFR1cm4pXHJcbiAgICAgICAgICAgIGdhbWUudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckdhbWVTdGFydFN0YXRlOyIsIlxyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwVHlwZXMgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXHJcbiAgICAgICAgICAgIENydWlzZXI6IDMsXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZW5ndGgobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3VuaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRDb3VudCA9PSB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XHJcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaXRDb3VudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCJmdW5jdGlvbiBwaGFzZVVwZGF0ZXIoZ2FtZSkge1xyXG5cclxuICAgIGxldCBnYW1lUGhhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVQaGFzZVwiKTtcclxuICAgIGxldCBwbGF5ZXJUdXJuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJUdXJuXCIpO1xyXG5cclxuXHJcbiAgICBpZiAoZ2FtZSA9PSBudWxsKSB7XHJcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gXCJHYW1lIEluaXRpYWxpenRpb25cIlxyXG4gICAgICAgIHBsYXllclR1cm4udGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnYW1lUGhhc2UudGV4dENvbnRlbnQgPSBnYW1lLmN1cnJlbnRTdGF0ZTtcclxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50VHVybjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcGhhc2VVcGRhdGVyOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLmdhbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDEwMHZoO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmVkO1xyXG59XHJcblxyXG4uZ2FtZUhlYWRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMTUlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xyXG59XHJcblxyXG4jYmF0dGxlc2hpcFRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5nYW1lU3RhdGVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBoZWlnaHQ6IDcwJTtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA1JTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcclxuICAgIG1hcmdpbi10b3A6IDNlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZEhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA4NSU7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmdhbWVTY3JlZW4tTGVmdCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcclxufVxyXG5cclxuLmN1cnJlbnRTaGlwT3JpZW50YXRpb24ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogODAlO1xyXG59XHJcblxyXG5cclxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogODAlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDIyLCAzOSwgMTg5KTtcclxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG59XHJcblxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBmb250LXNpemU6IDM2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xyXG59XHJcblxyXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgaGVpZ2h0OiA5MCU7XHJcbn1cclxuXHJcbi5hbHBoYUNvb3JkaW5hdGVzIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDUwMHB4O1xyXG4gICAgd2lkdGg6IDUwMHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXHJcbn1cclxuXHJcbi5yb3csIC5zaGlwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uc2hpcCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5ib3gge1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5ib3g6aG92ZXIge1xyXG4gICAgd2lkdGg6IDEwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcclxufVxyXG5cclxuLmhpZ2hsaWdodCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5wbGFjZWQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cclxufVxyXG5cclxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiA1JTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcclxuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcclxufVxyXG5cclxuLnBpZWNlc0NvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4uc2hpcENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG59XHJcblxyXG4uc2hpcE5hbWUge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcclxufVxyXG5cclxuXHJcbi5zaGlwYm94IHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ucGxhY2VkVGV4dCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xyXG59XHJcblxyXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQjdmVydGljYWwge1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBmb250LXNpemU6IGxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiA2MHZoO1xyXG4gICAgd2lkdGg6IDYwdnc7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLmdhbWVTdGFydENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG59XHJcblxyXG4ucGxheWVySW5wdXROYW1lIHtcclxuICAgIGhlaWdodDogNTBweDsgICAgXHJcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcclxuICAgIHdpZHRoOiA2MCU7XHJcbiAgICBmb250LXNpemU6IDQwcHg7XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XHJcbn1cclxuXHJcbiNpbml0UGxhY2VCdXR0b24ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDU2LCAxNywgMTk0KTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG59XHJcblxyXG4jaW5pdFBsYWNlQnV0dG9uOmhvdmVyIHtcclxuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xyXG59XHJcblxyXG4jaW5pdFN0YXJ0QnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XHJcbn1cclxuXHJcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XHJcbn1cclxuXHJcbi52ZXJ0aWNhbERyYWdnYWJsZSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cclxufVxyXG5cclxuLnZlcnRpY2FsU2hpcE5hbWUge1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xyXG59XHJcblxyXG5cclxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXHJcbiAgICBoZWlnaHQ6IDQ4cHg7ICAvKiBhZGp1c3QgdGhpcyBhcyBwZXIgeW91ciBkZXNpZ24gKi9cclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIHRvIGVuc3VyZSBib3JkZXIgZG9lc24ndCBhZGQgdG8gd2lkdGgvaGVpZ2h0ICovXHJcbn1cclxuXHJcbi5ib3gucGxhY2VkLmhpdCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZm9udC1zaXplOiA1MHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDEwMDsgXHJcbn0gXHJcblxyXG4uYm94Lm1pc3Mge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuOCk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn0gYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNuQixZQUFZO0FB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Ozs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RTs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLDBDQUEwQztJQUMxQyxZQUFZO0FBQ2hCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSGVhZGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMTUlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbiNiYXR0bGVzaGlwVGl0bGUge1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhdGVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBoZWlnaHQ6IDcwJTtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250ZW50Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXIge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogODUlO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBQb3NpdGlvblN3aXRjaGVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xcclxcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgaGVpZ2h0OiA5MCU7XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGZvbnQtc2l6ZTogMzZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxyXFxufVxcclxcblxcclxcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gICAgd2lkdGg6IDUwMHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucm93LCAuc2hpcCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5oaWdobGlnaHQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5wbGFjZWQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGhlaWdodDogNSU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XFxyXFxufVxcclxcblxcclxcbi5waWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uc2hpcGJveCB7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQjdmVydGljYWwge1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiA2MHZoO1xcclxcbiAgICB3aWR0aDogNjB2dztcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU3RhcnRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xcclxcbiAgICBmb250LXdlaWdodDogNjAwO1xcclxcbiAgICBcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllcklucHV0TmFtZUxhYmVsIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllcklucHV0TmFtZSB7XFxyXFxuICAgIGhlaWdodDogNTBweDsgICAgXFxyXFxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xcclxcbiAgICB3aWR0aDogNjAlO1xcclxcbiAgICBmb250LXNpemU6IDQwcHg7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDhlbTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRQbGFjZUJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XFxyXFxuICAgIGNvbG9yOiByZ2IoMjM4LCAyNTUsIDApO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFN0YXJ0QnV0dG9uIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NCwgMjcsIDI3KTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxEcmFnZ2FibGUge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcXHJcXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uYm94LnBsYWNlZC5oaXQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZm9udC1zaXplOiA1MHB4O1xcclxcbiAgICBmb250LXdlaWdodDogMTAwOyBcXHJcXG59IFxcclxcblxcclxcbi5ib3gubWlzcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBmb250LXNpemU6IDIwcHg7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiAxMDA7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTI4LCAxMjgsIDEyOCwgMC44KTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn0gXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlU3RhcnRCdXR0b24nKTtcclxuY29uc3QgY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvblN3aXRjaGVyXCIpXHJcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XHJcbmNvbnN0IHJlbmRlckdhbWVTdGFydFN0YXRlID0gcmVxdWlyZSgnLi9yZW5kZXJHYW1lU3RhcnRTdGF0ZScpO1xyXG5jb25zdCBwbGFjZUJvYXJkTWFya2VyID0gcmVxdWlyZSgnLi9wbGFjZUJvYXJkTWFya2VyJylcclxuaW1wb3J0ICcuL2JhdHRsZXNoaXAuY3NzJztcclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpIHtcclxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vLyBJbml0aWFsaXplIFBsYXllciBOYW1lIFxyXG5sZXQgcGxheWVyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwbGF5ZXJOYW1lJyk7XHJcblxyXG4vLyBDcmVhdGUgYSBuZXcgZ2FtZSBmcm9tIHBsYXllciBuYW1lIGFuZCBzZXQgY3VycmVudCBzdGF0ZSB0byBnYW1lIHNldCB1cFxyXG5sZXQgY3VycmVudEdhbWUgPSBuZXcgR2FtZSAoZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSwgcGxheWVyTmFtZSlcclxuY3VycmVudEdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiO1xyXG5cclxuLy8gVXBkYXRlIHRoZSBHYW1lIFBoYXNlIEhUTUwgYWNjb3JkaW5nbHlcclxucGhhc2VVcGRhdGVyKGN1cnJlbnRHYW1lKTtcclxuXHJcbi8vIERlZmluZSB0aGUgY3VycmVudCBwbGF5ZXIgYmFzZWQgb24gdGhlIGN1cnJlbnQgZ2FtZSBjbGFzc1xyXG5sZXQgY3VycmVudFBsYXllciA9IGN1cnJlbnRHYW1lLnBsYXllcjE7XHJcblxyXG4vLyBEZWZpbmUgdGhlIGN1cnJlbnQgY29tcHV0ZXIgYmFzZWQgb24gdGhlIGN1cnJlbnQgZ2FtZSBjbGFzc1xyXG5sZXQgY29tcHV0ZXIgPSBjdXJyZW50R2FtZS5jb21wdXRlcjtcclxuXHJcbi8vIEdlbmVyYXRlIHRoZSBiYXR0bGVzaGlwIHBpZWNlcyBkZWZhdWx0IHN0YXRlXHJcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKGN1cnJlbnRQbGF5ZXIsIFwiSG9yaXpvbnRhbFwiKTtcclxuXHJcblxyXG5cclxubGV0IGdhbWVTdGFydEJ1dHRvbiA9IGNyZWF0ZUdhbWVTdGFydEVsZW1lbnQoY3VycmVudEdhbWUpO1xyXG5cclxubGV0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW5Db250YWluZXJcIik7XHJcblxyXG5sZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5jbGFzc05hbWU9XCJnYW1lU2NyZWVuLUxlZnRcIlxyXG5cclxubGV0IGN1cnJlbnRTaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmNsYXNzTmFtZSA9IFwiY3VycmVudFNoaXBPcmllbnRhdGlvblwiO1xyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCJcclxuY3VycmVudFNoaXBPcmllbnRhdGlvbi5pbm5lclRleHQgPSBgQ3VycmVudCBTaGlwIFBvc2l0aW9uIGlzOiAke2N1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb259YFxyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGxlZnRHYW1lU2NyZWVuKTtcclxuXHJcblxyXG5cclxubGV0IHNoaXBQb3NpdGlvblN3aXRjaGVyID0gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIoY3VycmVudFBsYXllcik7XHJcblxyXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKGN1cnJlbnRHYW1lLCBjdXJyZW50UGxheWVyKTtcclxuLy8gbGV0IGJvYXJkMiA9IGNyZWF0ZUdhbWVCb2FyZChjdXJyZW50R2FtZS5jb21wdXRlcik7XHJcblxyXG5cclxuXHJcblxyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChjdXJyZW50U2hpcE9yaWVudGF0aW9uKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoc2hpcFBvc2l0aW9uU3dpdGNoZXIpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGJvYXJkMSk7XHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoZ2FtZVN0YXJ0QnV0dG9uKTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG4vLyBwbGFjZUJvYXJkTWFya2VyKGNvbXB1dGVyKVxyXG4vLyAvLyByZW5kZXJHYW1lU3RhcnRTdGF0ZSgpO1xyXG5cclxuLy8gY3VycmVudEdhbWUucGxheWVyMS5nYW1lQm9hcmQuc2V0QWxsU2hpcHNUb0RlYWQoKTtcclxuXHJcbi8vIGN1cnJlbnRHYW1lLmNoZWNrV2lubmVyKCk7Il0sIm5hbWVzIjpbImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwib3JpZW50YXRpb24iLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib3hXaWR0aCIsImJveEhlaWdodCIsImlzVmVydGljYWwiLCJjbGFzc05hbWUiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJhcHBlbmRDaGlsZCIsInNoaXBQaWVjZSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwicGxhY2VkRGl2IiwiaWQiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwid2lkdGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94Iiwic2V0QXR0cmlidXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZXF1aXJlIiwicmVxdWlyZSIsImdhbWVEcml2ZXJTY3JpcHQiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uIiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhc2V0Iiwic2hpcE9yaWVudGF0aW9uIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZSIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImNvbmNhdCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZFBsYWNlbWVudCIsImZvckVhY2giLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwibG93ZXJMZXR0ZXJCb3VuZCIsInVwcGVyTGV0dGVyQm91bmQiLCJwYXJzZSIsImdldERhdGEiLCJhZGp1c3RlZFRhcmdldFBvc2l0aW9uIiwiaGVhZENvb3JkaW5hdGUiLCJzZWxlY3RlZENoYXIiLCJwbGFjZVNoaXAiLCJoaXRNYXJrZXIiLCJzaGlwRWxlbWVudCIsInBhcmVudEVsZW1lbnQiLCJwcmV2aW91c0JveGVzIiwiZSIsInBsYXllckd1ZXNzIiwiY3VycmVudFR1cm4iLCJjb250YWlucyIsInBsYXllcjEiLCJhbGVydCIsInJlbmRlckdhbWVTdGFydFN0YXRlIiwicGhhc2VVcGRhdGVyIiwiY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCIsImdhbWVTdGFydENvbnRhaW5lciIsInN0YXJ0QnV0dG9uQ29udGFpbmVyIiwic3RhcnRCdXR0b24iLCJsb2ciLCJjaGVja1BsYXllclJlYWR5R2FtZVN0YXRlIiwiY3VycmVudFN0YXRlIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJDcnVpc2VyIiwiU3VibWFyaW5lIiwiRGVzdHJveWVyIiwiYm9hcmQiLCJzdGFydEdhbWUiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwic3RyaW5nVG9Db2xJbmRleCIsInN0ciIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwic2hpcEhlYWRDb29yZGluYXRlIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsInBsYWNlQm9hcmRNYXJrZXIiLCJwbGF5VHVybiIsInVwZGF0ZVN0YXRlIiwiY2hlY2tXaW5uZXIiLCJjb21wdXRlckd1ZXNzIiwiUGxheWVyIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJjb21wdXRlciIsInBoYXNlQ291bnRlciIsInNoaXBUeXBlcyIsInBsYWNlQ29tcHV0ZXJTaGlwIiwiY29tcHV0ZXJDb29yZGluYXRlIiwiZWFzeUFpTW92ZXMiLCJjb21wdXRlck9yaWVudGF0aW9uIiwiYWlTaGlwT3JpZW50YXRpb24iLCJpbnRpYWxpemVHYW1lIiwiX2kiLCJfc2hpcFR5cGVzIiwicGxhY2VQbGF5ZXJTaGlwcyIsInN0YXJ0IiwibW92ZSIsImlzVmFsaWRNb3ZlIiwicGxheWVyTW92ZSIsIm1ha2VBdHRhY2siLCJtZXNzYWdlIiwiY29tcHV0ZXJDaG9pY2UiLCJjb21wdXRlck1vdmUiLCJ0dXJuVmFsdWUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJ0dXJuIiwicGxheWVyQm9hcmQiLCJzaGlwVHlwZSIsInNoaXBCb3hNaXNzZWQiLCJjb21wdXRlckJvYXJkIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsIkFpIiwiaXNBaSIsImNvbXBsZXRlZE1vdmVzIiwiY2FwaXRhbGl6ZUZpcnN0IiwidG9Mb3dlckNhc2UiLCJjaGVjayIsImdldFJhbmRvbUludCIsIm1pbiIsIm1heCIsImdldEFsbFBvc3NpYmxlTW92ZXMiLCJhbGxNb3ZlcyIsImNvbHVtbk51bWJlciIsInJvd051bWJlciIsImNvbHVtbkFsaWFzIiwiYWxsUG9zc2libGVNb3ZlcyIsInVucGxheWVkTW92ZXMiLCJmaWx0ZXIiLCJyYW5kb21JbmRleCIsInBsYWNlQWxsU2hpcHNGb3JBSSIsInBsYWNlZCIsInJhbmRvbU1vdmUiLCJpc1NoaXBQbGFjZW1lbnRWYWxpZCIsInBvcCIsInN0YXJ0aW5nQ29vcmRpbmF0ZSIsImNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyIiwic2hpcFBvc2l0aW9uU3dpdGNoZXIiLCJpbm5lclRleHQiLCJsZWZ0R2FtZVNjcmVlbiIsInVwZGF0ZWRWZXJ0Qm9hcmQiLCJyZW1vdmVDaGlsZCIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJ1cGRhdGVkSG9yQm9hcmQiLCJfdHlwZW9mIiwiZ2FtZVNjcmVlbiIsImNvbXB1dGVyR2FtZUJvYXJkIiwiaXNWYWxpZCIsInNldExlbmd0aCIsImhpdENvdW50IiwiY2FwaXRhbGl6ZWRTaGlwTmFtZSIsImlzU3VuayIsImdhbWVQaGFzZSIsInBsYXllclR1cm4iLCJnZW5lcmF0ZVJhbmRvbVN0cmluZyIsImNoYXJhY3RlcnMiLCJyZXN1bHQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiY3VycmVudEdhbWUiLCJjdXJyZW50UGxheWVyIiwicGllY2VzIiwiZ2FtZVN0YXJ0QnV0dG9uIiwiY3VycmVudFNoaXBPcmllbnRhdGlvbiIsImJvYXJkMSJdLCJzb3VyY2VSb290IjoiIn0=