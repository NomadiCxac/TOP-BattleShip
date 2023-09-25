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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQztBQUMxQzs7QUFFQTtBQUNBLDhDQUE4QztBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxpRkFBaUYsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsUUFBUSxLQUFLLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FB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QUFhLENBQUM7QUFFcEUsSUFBSUksTUFBTSxHQUFHak4sZUFBZSxDQUFDNE0sV0FBVyxFQUFFQyxhQUFhLENBQUM7QUFDeEQ7O0FBS0F0QixjQUFjLENBQUNuUCxXQUFXLENBQUMwUSxNQUFNLENBQUM7QUFDbEN2QixjQUFjLENBQUNuUCxXQUFXLENBQUM0USxzQkFBc0IsQ0FBQztBQUNsRHpCLGNBQWMsQ0FBQ25QLFdBQVcsQ0FBQ2lQLG9CQUFvQixDQUFDO0FBQ2hEUyxVQUFVLENBQUMxUCxXQUFXLENBQUM2USxNQUFNLENBQUM7QUFDOUJuQixVQUFVLENBQUMxUCxXQUFXLENBQUMyUSxlQUFlLENBQUM7QUFDdkM7QUFDQTtBQUNBLDBCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwUGllY2VzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlR2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vY3JlYXRlU3RhcnRCdXR0b24uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9nYW1lRHJpdmVyU2NyaXB0LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGFjZUJvYXJkTWFya2VyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcG9zaXRpb25Td2l0Y2hlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3JlbmRlckdhbWVTdGFydFN0YXRlLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3VwZGF0ZUN1cnJlbnRQaGFzZS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3M/ZTBmZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZHJhZ0RhdGEgPSB7XG4gICAgZHJhZ2dlZFNoaXA6IG51bGxcbn07XG5cbmZ1bmN0aW9uIGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBib3hXaWR0aCA9IDUwO1xuICAgIGxldCBib3hIZWlnaHQgPSA0ODtcbiAgICBsZXQgaXNWZXJ0aWNhbCA9IG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XG5cbiAgICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxQaWVjZXNDb250YWluZXJcIiA6IFwicGllY2VzQ29udGFpbmVyXCI7XG5cbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcbiAgICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xuICAgICAgICBsZXQgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHNoaXBDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwQ29udGFpbmVyXCIgOiBcInNoaXBDb250YWluZXJcIjtcbiAgICBcbiAgICAgICAgbGV0IHNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBOYW1lXCIgOiBcInNoaXBOYW1lXCI7XG4gICAgICAgIHNoaXBUaXRsZS50ZXh0Q29udGVudCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiOlwiO1xuICAgIFxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7IC8vIEFkZCB0aGUgc2hpcFRpdGxlIGZpcnN0IFxuICAgIFxuICAgICAgICBsZXQgc2hpcFBpZWNlO1xuICAgIFxuICAgICAgICBpZiAocGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcbiAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XG4gICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlZERpdik7XG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7ICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKGlzVmVydGljYWwgPyBcInZlcnRpY2FsRHJhZ2dhYmxlXCIgOiBcImRyYWdnYWJsZVwiKTtcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgIHNoaXBQaWVjZS5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUgOiBzaGlwQXR0cmlidXRlLm5hbWU7XG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUud2lkdGggPSBpc1ZlcnRpY2FsID8gYm94V2lkdGggKyBcInB4XCIgOiAoYm94V2lkdGggKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCI7XG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUuaGVpZ2h0ID0gaXNWZXJ0aWNhbCA/IChib3hIZWlnaHQgKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCIgOiBib3hIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2hpcFBpZWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2hpcEF0dHJpYnV0ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRyYWdEYXRhLmRyYWdnZWRTaGlwID0gc2hpcERhdGE7XG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShzaGlwRGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBIZWFkUmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gc2hpcEhlYWRSZWN0LmxlZnQgLSBzaGlwUGllY2VSZWN0LmxlZnQgKyAoc2hpcEhlYWRSZWN0LndpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHNoaXBIZWFkUmVjdC50b3AgLSBzaGlwUGllY2VSZWN0LnRvcCArIChzaGlwSGVhZFJlY3QuaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShzaGlwUGllY2UsIG9mZnNldFgsIG9mZnNldFkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEF0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzaGlwQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xuICAgICAgICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSBib3hXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiLCAwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guaWQgPSBcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiLVwiICsgaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hpcFBpZWNlLmFwcGVuZENoaWxkKHNoaXBCb3gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7XG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICAgICAgcGllY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBDb250YWluZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBwaWVjZXNDb250YWluZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge2JhdHRsZXNoaXBQaWVjZXMsIGRyYWdEYXRhIH07IiwiY29uc3QgeyBkcmFnRGF0YSB9ID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XG5jb25zdCBnYW1lRHJpdmVyU2NyaXB0ID0gcmVxdWlyZSgnLi9nYW1lRHJpdmVyU2NyaXB0Jyk7XG5cbi8vIGxldCBkcmFnZ2VkU2hpcERhdGEgPSBudWxsOyAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxuXG5mdW5jdGlvbiBnZXRBZmZlY3RlZEJveGVzKGhlYWRQb3NpdGlvbiwgbGVuZ3RoLCBvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IGJveGVzID0gW107XG4gICAgY29uc3QgY2hhclBhcnQgPSBoZWFkUG9zaXRpb25bMF07XG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGhlYWRQb3NpdGlvbi5zbGljZSgxKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhclBhcnQgKyAobnVtUGFydCArIGkpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIGkpICsgbnVtUGFydCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJveGVzO1xufVxuXG5cbmZ1bmN0aW9uIGlzVmFsaWRQbGFjZW1lbnQoYm94SWQsIGxlbmd0aCwgb2Zmc2V0LCBvcmllbnRhdGlvbiwgcGxheWVyKSB7XG4gICAgY29uc3QgY2hhclBhcnQgPSBib3hJZFswXTtcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94SWQuc2xpY2UoMSkpO1xuXG4gICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIG9mZnNldDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcbiAgICAgICAgcmV0dXJuIGFkanVzdGVkTnVtUGFydCA+IDAgJiYgYWRqdXN0ZWROdW1QYXJ0ICsgbGVuZ3RoIC0gMSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgPj0gMCAmJiBjaGFyUGFydC5jaGFyQ29kZUF0KDApIC0gNjUgLSBvZmZzZXQgKyBsZW5ndGggPD0gcGxheWVyLmdhbWVCb2FyZC5oZWlnaHQ7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCkge1xuICAgIGxldCBzaGlwT3JpZW50YXRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXNoaXAtb3JpZW50YXRpb25dXCIpO1xuICAgIHJldHVybiBzaGlwT3JpZW50YXRpb25FbGVtZW50ID8gc2hpcE9yaWVudGF0aW9uRWxlbWVudC5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA6IFwiSG9yaXpvbnRhbFwiO1xufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZChnYW1lLCBwbGF5ZXIpIHtcbiAgICBcblxuICAgIC8vIEdlbmVyYXRlIGRpdiBlbGVtZW50cyBmb3IgR2FtZSBCb2FyZFxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBnYW1lQm9hcmRUb3BDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBhbHBoYUNvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgbnVtZXJpY0Nvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgXG4gICBcbiAgICAgLy8gQXNzaWduaW5nIGNsYXNzZXMgdG8gdGhlIGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XG4gICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciB0b3BcIjtcbiAgICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIGJvdHRvbVwiO1xuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcbiAgICAgZ2FtZUJvYXJkLmlkID0gcGxheWVyLm5hbWU7IC8vIEFzc3VtaW5nIHRoZSBwbGF5ZXIgaXMgYSBzdHJpbmcgbGlrZSBcInBsYXllcjFcIlxuICAgICBhbHBoYUNvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwiYWxwaGFDb29yZGluYXRlc1wiO1xuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcblxuICAgICAvLyBDcmVhdGUgY29sdW1uIHRpdGxlcyBlcXVhbCB0byB3aWR0aCBvZiBib2FyZFxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcbiAgICAgICAgbGV0IGNvbHVtblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29sdW1uVGl0bGUudGV4dENvbnRlbnQgPSBpO1xuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xuICAgICB9XG5cbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcblxuICAgIC8vIEdlbmVyYXRlIHJvd3MgYW5kIHJvdyB0aXRsZXMgZXF1YWwgdG8gaGVpZ2h0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XG5cbiAgICAgICAgbGV0IGFscGhhQ2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDY1KTtcblxuICAgICAgICBsZXQgcm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByb3dUaXRsZS50ZXh0Q29udGVudCA9IGFscGhhQ2hhcjtcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XG5cbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xuICAgICAgICByb3cuaWQgPSBhbHBoYUNoYXI7XG5cbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcbiAgICAgICAgbGV0IHByZXZpb3VzQWZmZWN0ZWRCb3hlcyA9IFtdO1xuICAgICAgICAvLyBHZW5lcmF0ZSBjb29yZGluYXRlIGNvbHVtbnMgZm9yIGVhY2ggcm93XG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xuICAgICAgICBcbiAgICAgICAgbGV0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcbiAgICAgICAgICAgIGJveC5pZCA9IGFscGhhQ2hhciArIGpcblxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IGRyYWdEYXRhLmRyYWdnZWRTaGlwO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbLi4uYWZmZWN0ZWRCb3hlc107IC8vIG1ha2UgYSBzaGFsbG93IGNvcHkgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTaGlwIGRhdGEgaXMgbnVsbCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIG91dCBpZiB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUGxhY2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5kcmFnQWZmZWN0ZWQgPSBcInRydWVcIjsgLy8gQWRkIHRoaXMgbGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAwKTsgLy8gZGVsYXkgb2YgMCBtcywganVzdCBlbm91Z2ggdG8gbGV0IGRyYWdsZWF2ZSBoYXBwZW4gZmlyc3QgaWYgaXQncyBnb2luZyB0b1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlBZmZlY3RlZEJveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJveFtkYXRhLWRyYWctYWZmZWN0ZWQ9XCJ0cnVlXCJdJyk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMuZm9yRWFjaChwcmV2Qm94ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpOyAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGxldCBsb3dlckxldHRlckJvdW5kID0gNjU7XG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyTGV0dGVyQm91bmQgPSA3NDtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGJveC5pZFswXTsgIC8vIEFzc3VtaW5nIHRoZSBmb3JtYXQgaXMgYWx3YXlzIGxpa2UgXCJBNVwiXG4gICAgICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveC5pZC5zbGljZSgxKSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZE51bVBhcnQgPSBudW1QYXJ0IC0gc2hpcERhdGEub2Zmc2V0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkVGFyZ2V0UG9zaXRpb24gPSBjaGFyUGFydCArIGFkanVzdGVkTnVtUGFydDsgIC8vIFRoZSBuZXcgcG9zaXRpb24gZm9yIHRoZSBoZWFkIG9mIHRoZSBzaGlwXG4gICAgICAgICAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKGFkanVzdGVkVGFyZ2V0UG9zaXRpb24sIHNoaXBEYXRhLmxlbmd0aCwgc2hpcE9yaWVudGF0aW9uKVxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhZGp1c3RlZCBwb3NpdGlvbiBiYXNlZCBvbiB3aGVyZSB0aGUgdXNlciBjbGlja2VkIG9uIHRoZSBzaGlwXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZENvb3JkaW5hdGUgPSAoY2hhclBhcnQgKyBudW1QYXJ0KTtcblxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENoYXIgPSBjaGFyUGFydC5jaGFyQ29kZUF0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYWNlbWVudCBpcyBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIiAmJiAoYWRqdXN0ZWROdW1QYXJ0IDw9IDAgfHwgYWRqdXN0ZWROdW1QYXJ0ICsgc2hpcERhdGEubGVuZ3RoIC0gMSA+IHBsYXllci5nYW1lQm9hcmQud2lkdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiICYmIChzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggPCBsb3dlckxldHRlckJvdW5kIHx8IHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiB1cHBlckxldHRlckJvdW5kKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzaGlwIHBsYWNlbWVudDogT3V0IG9mIGJvdW5kcy5cIik7XG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcERhdGEubmFtZSwgaGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE92ZXJsYXBwaW5nIFNoaXAuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5oaXRNYXJrZXIgPSBcImZhbHNlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5zaGlwID0gc2hpcERhdGEubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGlzVmVydGljYWwgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIjtcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBwbGFjZSAke3NoaXBEYXRhLm5hbWV9IHdpdGggbGVuZ3RoICR7c2hpcERhdGEubGVuZ3RofSBhdCBwb3NpdGlvbiAke2FkanVzdGVkVGFyZ2V0UG9zaXRpb259LmApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtzaGlwRGF0YS5uYW1lfS5kcmFnZ2FibGUuc2hpcGApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIlZlcnRpY2FsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjdmVydGljYWwke3NoaXBEYXRhLm5hbWV9LnZlcnRpY2FsRHJhZ2dhYmxlLnNoaXBgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFbGVtZW50ID0gc2hpcEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICBzaGlwRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIG5ldyBkaXYgdG8gdGhlIHBhcmVudCBlbGVtZW50XG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xuICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjtcbiAgICAgICAgICAgICAgICAvLyBsZXQgc2hpcE9iamVjdE5hbWUgPSBzaGlwRGF0YS5uYW1lO1xuXG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRCb3hlcykge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0JveGVzID0gYWZmZWN0ZWRCb3hlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIGlmICghYWZmZWN0ZWRCb3hlcykge1xuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJHdWVzcyA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAgICAgICAgIGdhbWVEcml2ZXJTY3JpcHQoZ2FtZSwgcGxheWVyR3Vlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgICB9XG5cbiAgICAgICBcblxuICAgICAgICBnYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9XG5cbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoYWxwaGFDb29yZGluYXRlcyk7XG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XG5cbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkVG9wQ29tcG9uZW50KTtcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcblxuXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCByZW5kZXJHYW1lU3RhcnRTdGF0ZSA9IHJlcXVpcmUoJy4vcmVuZGVyR2FtZVN0YXJ0U3RhdGUnKTtcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVTdGFydEVsZW1lbnQgKGdhbWUpIHtcbiAgICBsZXQgZ2FtZVN0YXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBnYW1lU3RhcnRDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lU3RhcnRDb250YWluZXJcIjtcblxuICAgIGxldCBzdGFydEJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xuXG4gICAgLy8gU3RhcnQgYnV0dG9uXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3RhcnQgR2FtZVwiO1xuICAgIHN0YXJ0QnV0dG9uLmlkID0gXCJpbml0U3RhcnRCdXR0b25cIjtcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XG4gICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpKVxuXG4gICAgICAgIGlmIChnYW1lLmNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUoKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgUGxhY2UgQWxsIFlvdXIgU2hpcHMgaW4gTGVnYWwgUG9zaXRpb25zXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgaWYgKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIGdhbWUudXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIGdhbWUuY3VycmVudFR1cm4gPSBcIkNvbXB1dGVyIE1vdmVcIjtcbiAgICAgICAgICAgIGdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFBsYXkgUGhhc2VcIlxuICAgICAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xuICAgICAgICAgICAgcmVuZGVyR2FtZVN0YXJ0U3RhdGUoZ2FtZSkgICAgICBcbiAgICAgICAgICAgIC8vIGdhbWUucGxheWVyMS5nYW1lQm9hcmQuZGlzcGxheSgpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KSBcblxuICAgIC8vIEFwcGVuZCB0aGUgc3RhcnRCdXR0b25Db250YWluZXIgdG8gdGhlIG1haW4gY29udGFpbmVyXG4gICAgZ2FtZVN0YXJ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uQ29udGFpbmVyKTtcblxuICAgIHJldHVybiBnYW1lU3RhcnRDb250YWluZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxuXG5jbGFzcyBHYW1lYm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IDEwO1xuICAgICAgICB0aGlzLndpZHRoID0gMTA7XG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5ID0gW107XG4gICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLnNoaXAgPSB7XG4gICAgICAgICAgICBDYXJyaWVyOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdDYXJyaWVyJyksXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQmF0dGxlc2hpcDoge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENydWlzZXI6IHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NydWlzZXInKSxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdWJtYXJpbmU6IHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ1N1Ym1hcmluZScpLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERlc3Ryb3llcjoge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBsZXQgYm9hcmQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIlwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gVGhpcyBjb2RlIHJldHVybnMgdGhlIGNoYXIgdmFsdWUgYXMgYW4gaW50IHNvIGlmIGl0IGlzICdCJyAob3IgJ2InKSwgd2Ugd291bGQgZ2V0IHRoZSB2YWx1ZSA2NiAtIDY1ID0gMSwgZm9yIHRoZSBwdXJwb3NlIG9mIG91ciBhcnJheSBCIGlzIHJlcC4gYnkgYm9hcmRbMV0uXG4gICAgICAgIGNoYXJUb1Jvd0luZGV4KGNoYXIpIHtcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcbiAgICAgICAgICAgIHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBSZXR1cm5zIGFuIGludCBhcyBhIHN0ciB3aGVyZSBudW1iZXJzIGZyb20gMSB0byAxMCwgd2lsbCBiZSB1bmRlcnN0b29kIGZvciBhcnJheSBhY2Nlc3M6IGZyb20gMCB0byA5LlxuICAgICAgICBzdHJpbmdUb0NvbEluZGV4KHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGdpdmVuIGNvb3JkaW5hdGUgaXMgb3V0IG9mIGJvdW5kcyBsaWtlIEs5IG9yIEMxOFxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrQXQoYWxpYXMpIHtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xuICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPj0gdGhpcy5oZWlnaHQgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID49IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGUgYWxpYXMuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID09PSBcIkhpdFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvY2N1cGllZFxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGFsaWFzLnN1YnN0cmluZygxKSwgMTApOyAvLyBDb252ZXJ0IHRoZSBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgIFxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFyUGFydCB0byB0aGUgbmV4dCBsZXR0ZXJcbiAgICAgICAgICAgIGNvbnN0IG5leHRDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgMSk7XG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBuZXh0Q2hhciArIG51bVBhcnQ7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYXJUb1Jvd0luZGV4KG5leHRDaGFyKSA+IDkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyByb3cgYmVsb3cgdGhpcy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXRSaWdodEFsaWFzKGFsaWFzKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcbiAgICAgICAgICAgIGxldCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcbiAgICAgICAgICAgIG51bVBhcnQrKztcbiAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayBmb3Igb3V0LW9mLWJvdW5kc1xuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGNvbHVtbiB0byB0aGUgcmlnaHQgb2YgdGhpcy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xuICAgICAgICB9XG5cbiAgICAgICAgXG5cbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc2hpcE1hcmtlciA9IFwiU2hpcFwiO1xuICAgICAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xuICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGdldE5leHRDb29yZGluYXRlID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXG4gICAgICAgICAgICAgICAgOiBjb29yZGluYXRlID0+IHRoaXMuZ2V0UmlnaHRBbGlhcyhjb29yZGluYXRlKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNoZWNrQXQoY3VycmVudENvb3JkaW5hdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMucHVzaChjdXJyZW50Q29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBzaGlwTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIHNoaXBcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQXQoY29vcmRpbmF0ZSkgPT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmhpdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiSGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNzQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkucHVzaChjb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBbGxTaGlwc1RvRGVhZCgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdhbWVPdmVyKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAvLyBSZXR1cm4gZmFsc2UgaWYgYW55IHNoaXAgaXMgbm90IGRlYWQuXG4gICAgICAgICAgICAgICAgfSAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzcGxheSgpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBcIiAgICBcIjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMud2lkdGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhoZWFkZXIpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHJvdyBhbmQgcHJpbnQgdGhlbVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBlYWNoIGNlbGwncyB2YWx1ZSBhbmQgZGVjaWRlIHdoYXQgdG8gcHJpbnRcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBEZWNpZGUgdGhlIGNlbGwncyBkaXNwbGF5IGJhc2VkIG9uIGl0cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNoaXBcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJTIFwiOyAvLyBTIGZvciBTaGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSGl0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiWCBcIjsgLy8gWCBmb3IgSGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWlzc1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIk0gXCI7IC8vIE0gZm9yIE1pc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiLSBcIjsgLy8gLSBmb3IgRW1wdHkgQ2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lYm9hcmQ7IiwiY29uc3QgcGxhY2VCb2FyZE1hcmtlciA9IHJlcXVpcmUoJy4vcGxhY2VCb2FyZE1hcmtlcicpO1xuY29uc3QgcGhhc2VVcGRhdGVyID0gcmVxdWlyZSgnLi91cGRhdGVDdXJyZW50UGhhc2UnKTtcblxuZnVuY3Rpb24gZ2FtZURyaXZlclNjcmlwdChnYW1lLCBwbGF5ZXJHdWVzcykge1xuXG4gICAgY29uc29sZS5sb2coZ2FtZS5jdXJyZW50U3RhdGUpO1xuICAgIGNvbnNvbGUubG9nKHBsYXllckd1ZXNzKTtcblxuXG4gICAgaWYgKGdhbWUuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gMVwiKTtcbiAgICAgICAgYWxlcnQoXCJDYW5ub3QgY2xpY2sgYm94ZXMgdGlsbCBnYW1lIGhhcyBzdGFydGVkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGdhbWUuY2hlY2tXaW5uZXIoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlN0ZXBwZWQgaW50byAyXCIpO1xuXG4gICAgICAgIGFsZXJ0KFwiV29PXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGdhbWUucGxheVR1cm4ocGxheWVyR3Vlc3MpKTtcblxuICAgIGlmICghZ2FtZS5wbGF5VHVybihwbGF5ZXJHdWVzcykpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGVwcGVkIGludG8gM1wiKTtcblxuICAgICAgICBhbGVydChcIkludmFsaWQgTW92ZSEgVHJ5IGFnYWluLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAgICAgXG4gICAgaWYgKGdhbWUuY3VycmVudFN0YXRlID09IFwiR2FtZSBQbGF5IFBoYXNlXCIgJiYgZ2FtZS5jdXJyZW50VHVybiA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7ICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0ZXBwZWQgaW50byA0XCIpOyAgICAgICAgXG4gICAgXG4gICAgICAgIHBsYWNlQm9hcmRNYXJrZXIoZ2FtZSwgcGxheWVyR3Vlc3MsIGdhbWUuY3VycmVudFR1cm4pO1xuICAgICAgICBnYW1lLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgIHBoYXNlVXBkYXRlcihnYW1lKTtcbiAgICAgXG4gICAgICAgIGxldCBjb21wdXRlckd1ZXNzID0gZ2FtZS5wbGF5VHVybigpO1xuICAgICAgICBwbGFjZUJvYXJkTWFya2VyKGdhbWUsIGNvbXB1dGVyR3Vlc3MsIGdhbWUuY3VycmVudFR1cm4pXG4gICAgICAgIGdhbWUudXBkYXRlU3RhdGUoKTtcbiAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xuICAgICAgICBnYW1lLmNoZWNrV2lubmVyKClcblxuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gZ2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgUGxheSBQaGFzZVwiICYmXG4gICAgaWYgKCBnYW1lLmN1cnJlbnRUdXJuID09PSBcIkNvbXB1dGVyIE1vdmVcIikgeyAgICAgICAgICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0ZXBwZWQgaW50byA1XCIpO1xuXG4gICBcbiAgICAgICAgfSAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZURyaXZlclNjcmlwdDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpXG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWVJZCwgcGxheWVyTmFtZSkge1xuICAgICAgICB0aGlzLmdhbWVJZCA9IGdhbWVJZDtcbiAgICAgICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihwbGF5ZXJOYW1lKTtcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcbiAgICAgICAgdGhpcy5waGFzZUNvdW50ZXIgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlwiO1xuICAgIH1cblxuICAgIC8vIFRPLURPIHByb21wdFVzZXJDb29yZGluYXRlKCksIHByb21wdFVzZXJPcmllbnRhdGlvbigpLCBjaGVja1dpbm5lcigpO1xuXG4gICAgY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpIHtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgIT0gXCJHYW1lIFNldC1VcFwiKSB7XG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCk7XG4gICAgICAgIGZvciAobGV0IHNoaXBUeXBlcyBpbiB0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApIHtcbiAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlc10uY29vcmRpbmF0ZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHBsYWNlQ29tcHV0ZXJTaGlwKHNoaXBOYW1lKSB7XG4gICAgICAgIHdoaWxlIChjb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xuICAgICAgICAgICAgbGV0IGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XG5cbiAgICAgICAgICAgIHdoaWxlICghY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwTmFtZSwgY29tcHV0ZXJDb29yZGluYXRlLCBjb21wdXRlck9yaWVudGF0aW9uKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcbiAgICAgICAgICAgICAgICBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW50aWFsaXplR2FtZSgpIHtcblxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBTZXQtVXBcIlxuICAgICAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XG4gICAgICAgIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xuXG4gICAgICAgIGZvciAoY29uc3Qgc2hpcCBvZiBzaGlwVHlwZXMpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2VQbGF5ZXJTaGlwcyhzaGlwKTtcbiAgICAgICAgICAgIHRoaXMucGxhY2VDb21wdXRlclNoaXAoc2hpcCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHBsYXlUdXJuKG1vdmUpIHtcbiAgICAgICAgY29uc29sZS5sb2cobW92ZSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSBcIlBsYXllciBNb3ZlXCIpIHtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBsYXllck1vdmU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJNb3ZlID0gdGhpcy5wbGF5ZXIxLm1ha2VBdHRhY2sobW92ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllck1vdmU7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7IC8vIE91dHB1dCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFR1cm4gPT09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKClcbiAgICAgICAgICAgIGxldCBjb21wdXRlck1vdmUgPSB0aGlzLmNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXG4gICAgICAgICAgICB0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcbiAgICAgICAgICAgICh0aGlzLnBsYXllcjEuZ2FtZUJvYXJkLmRpc3BsYXkoKSk7XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZXJDaG9pY2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcbiAgICAgICAgICAgIGxldCB0dXJuVmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBQbGF5IFBoYXNlXCI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gdHVyblZhbHVlID09PSAxID8gXCJQbGF5ZXIgTW92ZVwiIDogXCJDb21wdXRlciBNb3ZlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJDb21wdXRlciBNb3ZlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlBsYXllciBNb3ZlXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja1dpbm5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb21wdXRlciBXaW5zXCIpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbXB1dGVyLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBXaW5zXCIpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHdoaWxlKCF0aGlzLmNoZWNrV2lubmVyKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMucGxheVR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuIiwiZnVuY3Rpb24gcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBtb3ZlLCB0dXJuKSB7XG5cbiAgICBpZiAodHVybiA9PSBcIkNvbXB1dGVyIE1vdmVcIikge1xuICAgICAgICBsZXQgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtnYW1lLnBsYXllcjEubmFtZX0uZ2FtZUJvYXJkYCk7XG5cbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGUgaW4gZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIGdhbWUucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZV0uY29vcmRpbmF0ZXMpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke2Nvb3JkaW5hdGV9LmJveGApO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBjb29yZGluYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmRhdGFzZXQuc2hpcCA9IHNoaXBUeXBlO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LnRleHRDb250ZW50ID0gXCJYXCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2hpcEJveE1pc3NlZCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xuICAgIFxuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcblxuICAgIH1cblxuICAgIGlmICh0dXJuID09IFwiUGxheWVyIE1vdmVcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhtb3ZlKVxuICAgICAgICBsZXQgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29tcHV0ZXIuZ2FtZUJvYXJkXCIpO1xuXG4gICAgICAgIGZvciAobGV0IHNoaXBUeXBlIGluIGdhbWUuY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZV0uY29vcmRpbmF0ZXMpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEJveCA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvcihgZGl2IyR7Y29vcmRpbmF0ZX0uYm94YCk7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKG1vdmUgPT09IGNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKFwicGxhY2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3guZGF0YXNldC5zaGlwID0gc2hpcFR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBCb3gudGV4dENvbnRlbnQgPSBcIlhcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNoaXBCb3hNaXNzZWQgPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3IoYGRpdiMke21vdmV9LmJveGApO1xuICAgICAgICAgICAgc2hpcEJveE1pc3NlZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgICAgIHNoaXBCb3hNaXNzZWQudGV4dENvbnRlbnQgPSBcIsK3XCJcbiAgICB9XG5cbiAgICByZXR1cm47XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYWNlQm9hcmRNYXJrZXI7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xuXG5cblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQgPSBuZXcgR2FtZWJvYXJkO1xuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XG4gICAgfVxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgbWFrZUF0dGFjayhjb29yZGluYXRlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vdmUgaXMgYWxyZWFkeSBtYWRlXCIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xuICAgIH1cblxuICAgIGlzQWkobmFtZSkge1xuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrID09IFwiQ29tcHV0ZXJcIiB8fCBjaGVjayA9PSBcIkFpXCI7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cblxuXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcbiAgICAgICAgbGV0IGFsbE1vdmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY29sdW1uQWxpYXMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbk51bWJlciArIDY1KTtcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XG4gICAgfVxuXG4gICAgZWFzeUFpTW92ZXMoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcbiAgICAgICAgICAgIGxldCB1bnBsYXllZE1vdmVzID0gYWxsUG9zc2libGVNb3Zlcy5maWx0ZXIobW92ZSA9PiAhdGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhtb3ZlKSk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIGlmICh1bnBsYXllZE1vdmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBsZXQgbW92ZSA9IHVucGxheWVkTW92ZXNbcmFuZG9tSW5kZXhdO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xuICAgIH1cblxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiVmVydGljYWxcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYWNlQWxsU2hpcHNGb3JBSSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLkFpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gcGxhY2VBbGxTaGlwc0ZvckFJIGlzIHJlc3RyaWN0ZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLmdhbWVCb2FyZC5zaGlwKSB7XG4gICAgICAgICAgICBsZXQgcGxhY2VkID0gZmFsc2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoaWxlICghcGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0IGEgcmFuZG9tIHN0YXJ0aW5nIGNvb3JkaW5hdGVcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21Nb3ZlID0gdGhpcy5lYXN5QWlNb3ZlcygpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENob29zZSBhIHJhbmRvbSBvcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gdGhpcy5haVNoaXBPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm91bmRzIGJhc2VkIG9uIGl0cyBzdGFydGluZyBjb29yZGluYXRlLCBvcmllbnRhdGlvbiwgYW5kIGxlbmd0aFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2hpcFBsYWNlbWVudFZhbGlkKHNoaXBOYW1lLCByYW5kb21Nb3ZlLCBvcmllbnRhdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQncyBhIHZhbGlkIHBsYWNlbWVudCwgYXR0ZW1wdCB0byBwbGFjZSB0aGUgc2hpcFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0aGlzLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHBsYWNlZCBtb3ZlIGZyb20gY29tcGxldGVkIG1vdmVzIHNvIGl0IGNhbiBiZSB1c2VkIGJ5IHRoZSBBSSBkdXJpbmcgdGhlIGdhbWVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgaWYgYSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm9hcmRcbiAgICBpc1NoaXBQbGFjZW1lbnRWYWxpZChzaGlwTmFtZSwgc3RhcnRpbmdDb29yZGluYXRlLCBvcmllbnRhdGlvbikge1xuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UubGVuZ3RoO1xuICAgICAgICBsZXQgY3VycmVudENvb3JkaW5hdGUgPSBzdGFydGluZ0Nvb3JkaW5hdGU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIgJiYgcGFyc2VJbnQoY3VycmVudENvb3JkaW5hdGUuc3Vic3RyaW5nKDEpLCAxMCkgKyBzaGlwTGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCIgJiYgdGhpcy5nYW1lQm9hcmQuY2hhclRvUm93SW5kZXgoY3VycmVudENvb3JkaW5hdGUuY2hhckF0KDApKSArIHNoaXBMZW5ndGggPiA5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiIFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZ2FtZUJvYXJkLmdldEJlbG93QWxpYXMoY3VycmVudENvb3JkaW5hdGUpIFxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZ2FtZUJvYXJkLmdldFJpZ2h0QWxpYXMoY3VycmVudENvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwUG9zaXRpb25Td2l0Y2hlcihwbGF5ZXIpIHtcbiAgICBsZXQgc2hpcFBvc2l0aW9uU3dpdGNoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmlubmVyVGV4dCA9IFwiU3dpdGNoIE9yaWVudGF0aW9uXCJcblxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudFNoaXBPcmllbnRhdGlvblwiKTtcbiAgICBsZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW4tTGVmdFwiKTtcblxuXG4gICAgaWYgKHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xuICAgICAgICBzaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb24gPSBcIlZlcnRpY2FsXCI7XG4gICAgICAgIGxldCB1cGRhdGVkVmVydEJvYXJkID0gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIFwiVmVydGljYWxcIik7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLnJlbW92ZUNoaWxkKGxlZnRHYW1lU2NyZWVuLmZpcnN0Q2hpbGQpO1xuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZFZlcnRCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCI7XG4gICAgICAgIGxldCB1cGRhdGVkSG9yQm9hcmQgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlQ2hpbGQobGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLmluc2VydEJlZm9yZSh1cGRhdGVkSG9yQm9hcmQsIGxlZnRHYW1lU2NyZWVuLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHNoaXBPcmllbnRhdGlvbi5pbm5lclRleHQgPSBgQ3VycmVudCBTaGlwIFBvc2l0aW9uIGlzOiAke3NoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbn1gXG4gICAgfSlcblxuICAgIHJldHVybiBzaGlwUG9zaXRpb25Td2l0Y2hlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVTaGlwUG9zaXRpb25Td2l0Y2hlcjsiLCJjb25zdCBwbGFjZUJvYXJkTWFya2VyID0gcmVxdWlyZSgnLi9wbGFjZUJvYXJkTWFya2VyJylcbmNvbnN0IGNyZWF0ZUdhbWVCb2FyZCA9IHJlcXVpcmUoXCIuL2NyZWF0ZUdhbWVCb2FyZFwiKTtcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVTdGFydFN0YXRlKGdhbWUpIHtcblxuICAgIGNvbnNvbGUubG9nKHR5cGVvZihnYW1lLmNvbXB1dGVyKSk7XG5cbiAgICBsZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcblxuICAgIGxldCBnYW1lU3RhcnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmdhbWVTdGFydENvbnRhaW5lclwiKVxuICAgIGdhbWVTdGFydENvbnRhaW5lci5yZW1vdmUoKTtcblxuICAgIGxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuZ2FtZVNjcmVlbi1MZWZ0XCIpXG4gICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlKCk7XG5cbiAgICBsZXQgY29tcHV0ZXJHYW1lQm9hcmQgPSBjcmVhdGVHYW1lQm9hcmQoZ2FtZSwgZ2FtZS5jb21wdXRlcik7XG4gICAgZ2FtZS5jb21wdXRlci5wbGFjZUFsbFNoaXBzRm9yQUkoKTtcbiAgICBnYW1lU2NyZWVuLmFwcGVuZENoaWxkKGNvbXB1dGVyR2FtZUJvYXJkKTtcbiAgICBcblxuICAgIGlmIChnYW1lLmN1cnJlbnRUdXJuID09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XG4gICAgICAgIGxldCBjb21wdXRlckd1ZXNzID0gZ2FtZS5wbGF5VHVybigpO1xuICAgICAgICAgICAgcGxhY2VCb2FyZE1hcmtlcihnYW1lLCBjb21wdXRlckd1ZXNzLCBnYW1lLmN1cnJlbnRUdXJuKVxuICAgICAgICAgICAgZ2FtZS51cGRhdGVTdGF0ZSgpO1xuICAgICAgICAgICAgcGhhc2VVcGRhdGVyKGdhbWUpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJHYW1lU3RhcnRTdGF0ZTsiLCJcbmNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcblxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiA0LFxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcbiAgICAgICAgICAgIERlc3Ryb3llcjogMixcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiAhIXRoaXMuc2hpcFR5cGVzW25hbWVdO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5zZXRMZW5ndGgodGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBjYXBpdGFsaXplRmlyc3Qoc3RyKSB7XG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBzZXRMZW5ndGgobmFtZSkge1xuICAgICAgICBjb25zdCBjYXBpdGFsaXplZFNoaXBOYW1lID0gdGhpcy5jYXBpdGFsaXplRmlyc3QobmFtZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XG4gICAgICAgIHRoaXMuaXNTdW5rKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiZnVuY3Rpb24gcGhhc2VVcGRhdGVyKGdhbWUpIHtcblxuICAgIGxldCBnYW1lUGhhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVQaGFzZVwiKTtcbiAgICBsZXQgcGxheWVyVHVybiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyVHVyblwiKTtcblxuICAgIGNvbnNvbGUubG9nKGdhbWUuY3VycmVudFN0YXRlKTtcblxuICAgIGlmIChnYW1lID09IG51bGwpIHtcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gXCJHYW1lIEluaXRpYWxpenRpb25cIlxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnYW1lUGhhc2UudGV4dENvbnRlbnQgPSBnYW1lLmN1cnJlbnRTdGF0ZTtcbiAgICAgICAgcGxheWVyVHVybi50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFR1cm47XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGhhc2VVcGRhdGVyOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmdhbWVDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XG59XG5cbi5nYW1lSGVhZGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBoZWlnaHQ6IDE1JTtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XG59XG5cbiNiYXR0bGVzaGlwVGl0bGUge1xuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XG4gICAgY29sb3I6IHdoaXRlO1xufVxuXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHdpZHRoOiAyMCU7XG4gICAgaGVpZ2h0OiA3MCU7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG59XG5cbi5nYW1lQ29udGVudENvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgaGVpZ2h0OiA4NSU7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xufVxuXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgaGVpZ2h0OiA1JTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xuICAgIG1hcmdpbi10b3A6IDNlbTtcbn1cblxuLmdhbWVCb2FyZEhlYWRlciB7XG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xufVxuXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgaGVpZ2h0OiA4NSU7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xufVxuXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgd2lkdGg6IDIwJTtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcbn1cblxuLmN1cnJlbnRTaGlwT3JpZW50YXRpb24ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgICBoZWlnaHQ6IDEwJTtcbiAgICB3aWR0aDogODAlO1xufVxuXG5cbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgaGVpZ2h0OiAxMCU7XG4gICAgd2lkdGg6IDgwJTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgYmFja2dyb3VuZDogcmdiKDIyLCAzOSwgMTg5KTtcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcbn1cblxuLmdhbWVCb2FyZENvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogMTAwJTtcbn1cblxuXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGhlaWdodDogNSU7XG59XG5cblxuLm51bWVyaWNDb29yZGluYXRlcyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGZvbnQtc2l6ZTogMzZweDtcbiAgICBtYXJnaW4tdG9wOiAxZW07XG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcbn1cblxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xufVxuXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGhlaWdodDogOTAlO1xufVxuXG4uYWxwaGFDb29yZGluYXRlcyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgZm9udC1zaXplOiAzNnB4O1xuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XG59XG5cbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XG59XG5cbi5nYW1lQm9hcmQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBoZWlnaHQ6IDUwMHB4O1xuICAgIHdpZHRoOiA1MDBweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXG59XG5cbi5yb3csIC5zaGlwIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGhlaWdodDogMTAlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xufVxuXG4uc2hpcCB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5ib3gge1xuICAgIHdpZHRoOiA1MHB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5ib3g6aG92ZXIge1xuICAgIHdpZHRoOiAxMCU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcbn1cblxuLmhpZ2hsaWdodCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xufVxuXG4ucGxhY2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xufVxuXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgaGVpZ2h0OiA1JTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcbn1cblxuLnBpZWNlc0NvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDogMzUwcHg7XG4gICAgd2lkdGg6IDQyNXB4O1xuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xufVxuXG4uc2hpcENvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBoZWlnaHQ6IDUwcHg7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgbWFyZ2luLXRvcDogMWVtO1xufVxuXG4uc2hpcE5hbWUge1xuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xufVxuXG5cbi5zaGlwYm94IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXG4gICAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ucGxhY2VkVGV4dCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XG59XG5cbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XG59XG5cbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XG59XG5cbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgIGhlaWdodDogNjB2aDtcbiAgICB3aWR0aDogNjB2dztcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcbn1cblxuLmdhbWVTdGFydENvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgaGVpZ2h0OiAyMDBweDtcbiAgICB3aWR0aDogMjAwcHg7XG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XG59XG5cbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBcbn1cblxuLnBsYXllcklucHV0TmFtZUxhYmVsIHtcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xufVxuXG4ucGxheWVySW5wdXROYW1lIHtcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xuICAgIHdpZHRoOiA2MCU7XG4gICAgZm9udC1zaXplOiA0MHB4O1xufVxuXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcbn1cblxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDhlbTtcbn1cblxuI2luaXRQbGFjZUJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDU2LCAxNywgMTk0KTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xufVxuXG4jaW5pdFBsYWNlQnV0dG9uOmhvdmVyIHtcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcbn1cblxuI2luaXRTdGFydEJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NCwgMjcsIDI3KTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBmb250LXNpemU6IGxhcmdlcjtcbn1cblxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgaGVpZ2h0OiAzNTBweDtcbiAgICB3aWR0aDogNDI1cHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG4gICAgbWFyZ2luLXRvcDogMy41ZW07XG59XG5cbi52ZXJ0aWNhbERyYWdnYWJsZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xufVxuXG4udmVydGljYWxTaGlwTmFtZSB7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbn1cblxuXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcbiAgICBoZWlnaHQ6IDQ4cHg7ICAvKiBhZGp1c3QgdGhpcyBhcyBwZXIgeW91ciBkZXNpZ24gKi9cbiAgICB3aWR0aDogNTBweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIHRvIGVuc3VyZSBib3JkZXIgZG9lc24ndCBhZGQgdG8gd2lkdGgvaGVpZ2h0ICovXG59XG5cbi5ib3gucGxhY2VkLmhpdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogNTBweDtcbiAgICBmb250LXdlaWdodDogMTAwOyBcbn0gXG5cbi5ib3gubWlzcyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICBmb250LXdlaWdodDogMTAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTI4LCAxMjgsIDEyOCwgMC44KTtcbiAgICBjb2xvcjogd2hpdGU7XG59IGAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vYmF0dGxlc2hpcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLFlBQVk7SUFDWixlQUFlO0FBQ25COztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixVQUFVO0lBQ1YsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsVUFBVTtJQUNWLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsWUFBWTtJQUNaLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJ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LGlCQUFpQjtJQUNqQixVQUFVO0lBQ1YsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0FBQ3ZFOztBQUVBO0lBQ0ksZUFBZTtJQUNmLGtCQUFrQjtBQUN0Qjs7O0FBR0E7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0lBQ25FLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFlBQVksR0FBRyxtQ0FBbUM7SUFDbEQsV0FBVztJQUNYLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxzQkFBc0IsRUFBRSxpREFBaUQ7QUFDN0U7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQiwwQ0FBMEM7SUFDMUMsWUFBWTtBQUNoQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4uZ2FtZUNvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgYmFja2dyb3VuZDogcmVkO1xcbn1cXG5cXG4uZ2FtZUhlYWRlciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBoZWlnaHQ6IDE1JTtcXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xcbn1cXG5cXG4jYmF0dGxlc2hpcFRpdGxlIHtcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgd2lkdGg6IDIwJTtcXG4gICAgaGVpZ2h0OiA3MCU7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDg1JTtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXG59XFxuXFxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDUlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXG4gICAgbWFyZ2luLXRvcDogM2VtO1xcbn1cXG5cXG4uZ2FtZUJvYXJkSGVhZGVyIHtcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcbn1cXG5cXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDg1JTtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXG59XFxuXFxuLmdhbWVTY3JlZW4tTGVmdCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIHdpZHRoOiAyMCU7XFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcbn1cXG5cXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gICAgaGVpZ2h0OiAxMCU7XFxuICAgIHdpZHRoOiA4MCU7XFxufVxcblxcblxcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDEwJTtcXG4gICAgd2lkdGg6IDgwJTtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXG59XFxuXFxuLmdhbWVCb2FyZENvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBoZWlnaHQ6IDUlO1xcbn1cXG5cXG5cXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgICBmb250LXNpemU6IDM2cHg7XFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXG59XFxuXFxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXG59XFxuXFxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIGhlaWdodDogOTAlO1xcbn1cXG5cXG4uYWxwaGFDb29yZGluYXRlcyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBmb250LXNpemU6IDM2cHg7XFxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XFxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcbn1cXG5cXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XFxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcXG59XFxuXFxuLmdhbWVCb2FyZCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGhlaWdodDogNTAwcHg7XFxuICAgIHdpZHRoOiA1MDBweDtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cXG59XFxuXFxuLnJvdywgLnNoaXAge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBoZWlnaHQ6IDEwJTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5zaGlwIHtcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmJveCB7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuLmJveDpob3ZlciB7XFxuICAgIHdpZHRoOiAxMCU7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xcbn1cXG5cXG4uaGlnaGxpZ2h0IHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcbn1cXG5cXG4ucGxhY2VkIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cXG59XFxuXFxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBoZWlnaHQ6IDUlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xcbn1cXG5cXG4ucGllY2VzQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgaGVpZ2h0OiAzNTBweDtcXG4gICAgd2lkdGg6IDQyNXB4O1xcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XFxufVxcblxcbi5zaGlwQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgaGVpZ2h0OiA1MHB4O1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxufVxcblxcbi5zaGlwTmFtZSB7XFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXG59XFxuXFxuXFxuLnNoaXBib3gge1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxcbiAgICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5wbGFjZWRUZXh0IHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xcbn1cXG5cXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XFxufVxcblxcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBmb250LXNpemU6IGxhcmdlO1xcbn1cXG5cXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGhlaWdodDogNjB2aDtcXG4gICAgd2lkdGg6IDYwdnc7XFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIGhlaWdodDogMjAwcHg7XFxuICAgIHdpZHRoOiAyMDBweDtcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgXFxufVxcblxcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxufVxcblxcbi5wbGF5ZXJJbnB1dE5hbWUge1xcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXG4gICAgd2lkdGg6IDYwJTtcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcbn1cXG5cXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcXG59XFxuXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XFxufVxcblxcbiNpbml0UGxhY2VCdXR0b24ge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxufVxcblxcbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcXG59XFxuXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxufVxcblxcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBoZWlnaHQ6IDM1MHB4O1xcbiAgICB3aWR0aDogNDI1cHg7XFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXG59XFxuXFxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXG59XFxuXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcbiAgICBmb250LXNpemU6IDE2cHg7XFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXG59XFxuXFxuXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcbiAgICB3aWR0aDogNTBweDtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXG59XFxuXFxuLmJveC5wbGFjZWQuaGl0IHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGZvbnQtc2l6ZTogNTBweDtcXG4gICAgZm9udC13ZWlnaHQ6IDEwMDsgXFxufSBcXG5cXG4uYm94Lm1pc3Mge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcbiAgICBmb250LXdlaWdodDogMTAwO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuOCk7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG59IFwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIlxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZUxvb3AnKTtcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xuY29uc3QgY3JlYXRlR2FtZUJvYXJkID0gIHJlcXVpcmUoJy4vY3JlYXRlR2FtZUJvYXJkJyk7XG5jb25zdCBjcmVhdGVHYW1lU3RhcnRFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVTdGFydEJ1dHRvbicpO1xuY29uc3QgY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvblN3aXRjaGVyXCIpXG5jb25zdCBwaGFzZVVwZGF0ZXIgPSByZXF1aXJlKCcuL3VwZGF0ZUN1cnJlbnRQaGFzZScpO1xuY29uc3QgcmVuZGVyR2FtZVN0YXJ0U3RhdGUgPSByZXF1aXJlKCcuL3JlbmRlckdhbWVTdGFydFN0YXRlJyk7XG5jb25zdCBwbGFjZUJvYXJkTWFya2VyID0gcmVxdWlyZSgnLi9wbGFjZUJvYXJkTWFya2VyJylcbmltcG9ydCAnLi9iYXR0bGVzaGlwLmNzcyc7XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gICAgY29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gSW5pdGlhbGl6ZSBQbGF5ZXIgTmFtZSBcbmxldCBwbGF5ZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3BsYXllck5hbWUnKTtcblxuLy8gQ3JlYXRlIGEgbmV3IGdhbWUgZnJvbSBwbGF5ZXIgbmFtZSBhbmQgc2V0IGN1cnJlbnQgc3RhdGUgdG8gZ2FtZSBzZXQgdXBcbmxldCBjdXJyZW50R2FtZSA9IG5ldyBHYW1lIChnZW5lcmF0ZVJhbmRvbVN0cmluZygpLCBwbGF5ZXJOYW1lKVxuY3VycmVudEdhbWUuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiO1xuXG4vLyBVcGRhdGUgdGhlIEdhbWUgUGhhc2UgSFRNTCBhY2NvcmRpbmdseVxucGhhc2VVcGRhdGVyKGN1cnJlbnRHYW1lKTtcblxuLy8gRGVmaW5lIHRoZSBjdXJyZW50IHBsYXllciBiYXNlZCBvbiB0aGUgY3VycmVudCBnYW1lIGNsYXNzXG5sZXQgY3VycmVudFBsYXllciA9IGN1cnJlbnRHYW1lLnBsYXllcjE7XG5cbi8vIERlZmluZSB0aGUgY3VycmVudCBjb21wdXRlciBiYXNlZCBvbiB0aGUgY3VycmVudCBnYW1lIGNsYXNzXG5sZXQgY29tcHV0ZXIgPSBjdXJyZW50R2FtZS5jb21wdXRlcjtcblxuLy8gR2VuZXJhdGUgdGhlIGJhdHRsZXNoaXAgcGllY2VzIGRlZmF1bHQgc3RhdGVcbmxldCBwaWVjZXMgPSBiYXR0bGVzaGlwUGllY2VzKGN1cnJlbnRQbGF5ZXIsIFwiSG9yaXpvbnRhbFwiKTtcblxuXG5cbmxldCBnYW1lU3RhcnRCdXR0b24gPSBjcmVhdGVHYW1lU3RhcnRFbGVtZW50KGN1cnJlbnRHYW1lKTtcblxubGV0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW5Db250YWluZXJcIik7XG5cbmxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5sZWZ0R2FtZVNjcmVlbi5jbGFzc05hbWU9XCJnYW1lU2NyZWVuLUxlZnRcIlxuXG5sZXQgY3VycmVudFNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmNsYXNzTmFtZSA9IFwiY3VycmVudFNoaXBPcmllbnRhdGlvblwiO1xuY3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiSG9yaXpvbnRhbFwiXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7Y3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbn1gXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGxlZnRHYW1lU2NyZWVuKTtcblxuXG5cbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKGN1cnJlbnRQbGF5ZXIpO1xuXG5sZXQgYm9hcmQxID0gY3JlYXRlR2FtZUJvYXJkKGN1cnJlbnRHYW1lLCBjdXJyZW50UGxheWVyKTtcbi8vIGxldCBib2FyZDIgPSBjcmVhdGVHYW1lQm9hcmQoY3VycmVudEdhbWUuY29tcHV0ZXIpO1xuXG5cblxuXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY3VycmVudFNoaXBPcmllbnRhdGlvbik7XG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChzaGlwUG9zaXRpb25Td2l0Y2hlcik7XG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGJvYXJkMSk7XG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVTdGFydEJ1dHRvbik7XG4vLyBnYW1lU2NyZWVuLmFwcGVuZENoaWxkKGJvYXJkMik7XG4vLyBwbGFjZUJvYXJkTWFya2VyKGNvbXB1dGVyKVxuLy8gcmVuZGVyR2FtZVN0YXJ0U3RhdGUoKTtcblxuIl0sIm5hbWVzIjpbImRyYWdEYXRhIiwiZHJhZ2dlZFNoaXAiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwib3JpZW50YXRpb24iLCJwaWVjZXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib3hXaWR0aCIsImJveEhlaWdodCIsImlzVmVydGljYWwiLCJjbGFzc05hbWUiLCJfbG9vcCIsInNoaXBBdHRyaWJ1dGUiLCJnYW1lQm9hcmQiLCJzaGlwIiwic2hpcE5hbWUiLCJpbnN0YW5jZSIsInNoaXBDb250YWluZXIiLCJzaGlwVGl0bGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJhcHBlbmRDaGlsZCIsInNoaXBQaWVjZSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwicGxhY2VkRGl2IiwiaWQiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwid2lkdGgiLCJoZWlnaHQiLCJkcmFnZ2FibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkQm94T2Zmc2V0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2hpcERhdGEiLCJvZmZzZXQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNoaXBIZWFkUmVjdCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2hpcFBpZWNlUmVjdCIsIm9mZnNldFgiLCJsZWZ0Iiwib2Zmc2V0WSIsInRvcCIsInNldERyYWdJbWFnZSIsImkiLCJzaGlwQm94Iiwic2V0QXR0cmlidXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9yZXF1aXJlIiwicmVxdWlyZSIsImdhbWVEcml2ZXJTY3JpcHQiLCJnZXRBZmZlY3RlZEJveGVzIiwiaGVhZFBvc2l0aW9uIiwiYm94ZXMiLCJjaGFyUGFydCIsIm51bVBhcnQiLCJwYXJzZUludCIsInNsaWNlIiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJpc1ZhbGlkUGxhY2VtZW50IiwiYm94SWQiLCJhZGp1c3RlZE51bVBhcnQiLCJnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uIiwic2hpcE9yaWVudGF0aW9uRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhc2V0Iiwic2hpcE9yaWVudGF0aW9uIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZSIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZFBsYWNlbWVudCIsImZvckVhY2giLCJkcmFnQWZmZWN0ZWQiLCJwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2Qm94IiwicmVtb3ZlIiwicmVtb3ZlQXR0cmlidXRlIiwibG93ZXJMZXR0ZXJCb3VuZCIsInVwcGVyTGV0dGVyQm91bmQiLCJwYXJzZSIsImdldERhdGEiLCJhZGp1c3RlZFRhcmdldFBvc2l0aW9uIiwiaGVhZENvb3JkaW5hdGUiLCJzZWxlY3RlZENoYXIiLCJwbGFjZVNoaXAiLCJoaXRNYXJrZXIiLCJzaGlwRWxlbWVudCIsImNvbmNhdCIsInBhcmVudEVsZW1lbnQiLCJwcmV2aW91c0JveGVzIiwiZSIsInBsYXllckd1ZXNzIiwicmVuZGVyR2FtZVN0YXJ0U3RhdGUiLCJwaGFzZVVwZGF0ZXIiLCJjcmVhdGVHYW1lU3RhcnRFbGVtZW50IiwiZ2FtZVN0YXJ0Q29udGFpbmVyIiwic3RhcnRCdXR0b25Db250YWluZXIiLCJzdGFydEJ1dHRvbiIsImxvZyIsImNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUiLCJhbGVydCIsImN1cnJlbnRUdXJuIiwiY3VycmVudFN0YXRlIiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsIkJhdHRsZXNoaXAiLCJDcnVpc2VyIiwiU3VibWFyaW5lIiwiRGVzdHJveWVyIiwiYm9hcmQiLCJzdGFydEdhbWUiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwic3RyaW5nVG9Db2xJbmRleCIsInN0ciIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwic2hpcEhlYWRDb29yZGluYXRlIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImYiLCJyZWNlaXZlQXR0YWNrIiwic2hpcENvb3JkaW5hdGVzIiwiaW5jbHVkZXMiLCJoaXQiLCJzZXRBbGxTaGlwc1RvRGVhZCIsImlzRGVhZCIsImdhbWVPdmVyIiwiZGlzcGxheSIsImhlYWRlciIsInJvd1N0cmluZyIsImNlbGxWYWx1ZSIsInBsYWNlQm9hcmRNYXJrZXIiLCJjaGVja1dpbm5lciIsInBsYXlUdXJuIiwidXBkYXRlU3RhdGUiLCJjb21wdXRlckd1ZXNzIiwiUGxheWVyIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJwbGF5ZXIxIiwiY29tcHV0ZXIiLCJwaGFzZUNvdW50ZXIiLCJzaGlwVHlwZXMiLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsIl9pIiwiX3NoaXBUeXBlcyIsInBsYWNlUGxheWVyU2hpcHMiLCJzdGFydCIsIm1vdmUiLCJpc1ZhbGlkTW92ZSIsInBsYXllck1vdmUiLCJtYWtlQXR0YWNrIiwibWVzc2FnZSIsImNvbXB1dGVyQ2hvaWNlIiwiY29tcHV0ZXJNb3ZlIiwidHVyblZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidHVybiIsInBsYXllckJvYXJkIiwic2hpcFR5cGUiLCJzaGlwQm94TWlzc2VkIiwiY29tcHV0ZXJCb2FyZCIsIl9pdGVyYXRvcjIiLCJfc3RlcDIiLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsInRvTG93ZXJDYXNlIiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwicmFuZG9tSW5kZXgiLCJwbGFjZUFsbFNoaXBzRm9yQUkiLCJwbGFjZWQiLCJyYW5kb21Nb3ZlIiwiaXNTaGlwUGxhY2VtZW50VmFsaWQiLCJwb3AiLCJzdGFydGluZ0Nvb3JkaW5hdGUiLCJjcmVhdGVTaGlwUG9zaXRpb25Td2l0Y2hlciIsInNoaXBQb3NpdGlvblN3aXRjaGVyIiwiaW5uZXJUZXh0IiwibGVmdEdhbWVTY3JlZW4iLCJ1cGRhdGVkVmVydEJvYXJkIiwicmVtb3ZlQ2hpbGQiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwidXBkYXRlZEhvckJvYXJkIiwiX3R5cGVvZiIsImdhbWVTY3JlZW4iLCJjb21wdXRlckdhbWVCb2FyZCIsImlzVmFsaWQiLCJzZXRMZW5ndGgiLCJoaXRDb3VudCIsImNhcGl0YWxpemVkU2hpcE5hbWUiLCJpc1N1bmsiLCJnYW1lUGhhc2UiLCJwbGF5ZXJUdXJuIiwiZ2VuZXJhdGVSYW5kb21TdHJpbmciLCJjaGFyYWN0ZXJzIiwicmVzdWx0IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImN1cnJlbnRHYW1lIiwiY3VycmVudFBsYXllciIsInBpZWNlcyIsImdhbWVTdGFydEJ1dHRvbiIsImN1cnJlbnRTaGlwT3JpZW50YXRpb24iLCJib2FyZDEiXSwic291cmNlUm9vdCI6IiJ9