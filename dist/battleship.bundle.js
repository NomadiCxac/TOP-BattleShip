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

/***/ "./createStartButton.js":
/*!******************************!*\
  !*** ./createStartButton.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Game = __webpack_require__(/*! ./gameLoop */ "./gameLoop.js");
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
    console.log(game.player1.gameBoard.ship);
    console.log(game.checkPlayerReadyGameState());
    if (game.checkPlayerReadyGameState() == false) {
      alert("Please Place All Your Ships in Legal Positions");
      return;
    }
    if (game.checkPlayerReadyGameState() == true) {
      console.log("True");
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

function generateRandomString() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
var playerName = localStorage.getItem('playerName');
var currentGame = new Game(generateRandomString(), playerName);
currentGame.currentState = "Game Set-Up";
var currentPlayer = currentGame.player1;
phaseUpdater(currentGame);
var gameStart = createGameStartElement(currentGame);
var gameScreen = document.querySelector(".gameScreenContainer");
var leftGameScreen = document.createElement("div");
leftGameScreen.className = "gameScreen-Left";
var currentShipOrientation = document.createElement("div");
currentShipOrientation.className = "currentShipOrientation";
currentShipOrientation.dataset.shipOrientation = "Horizontal";
currentShipOrientation.innerText = "Current Ship Position is: ".concat(currentShipOrientation.dataset.shipOrientation);
gameScreen.appendChild(leftGameScreen);
var pieces = battleshipPieces(currentPlayer, "Horizontal");
leftGameScreen.appendChild(pieces);
var shipPositionSwitcher = createShipPositionSwitcher(currentPlayer);
var board1 = createGameBoard(currentPlayer, currentShipOrientation.dataset.shipOrientation);
var board2 = createGameBoard(currentGame.computer);
leftGameScreen.appendChild(pieces);
// leftGameScreen.appendChild(verticalPieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameStart);
// gameScreen.appendChild(board2);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBQzVCLENBQUMsT0FBTyxpRkFBaUYsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsUUFBUSxLQUFLLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FBSyx3QkFBd0IsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxPQUFPLEtBQUssWUFBWSxhQUFhLFFBQVEsS0FBSyxZQUFZLGFBQWEsV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxjQUFjLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLE9BQU8s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Q2lPLGNBQWMsQ0FBQztBQUV0QyxJQUFJd0IsTUFBTSxHQUFHN1EsZ0JBQWdCLENBQUN5USxhQUFhLEVBQUUsWUFBWSxDQUFDO0FBQzFEcEIsY0FBYyxDQUFDak8sV0FBVyxDQUFDeVAsTUFBTSxDQUFDO0FBR2xDLElBQUkxQixvQkFBb0IsR0FBR0QsMEJBQTBCLENBQUN1QixhQUFhLENBQUM7QUFFcEUsSUFBSUssTUFBTSxHQUFHN0wsZUFBZSxDQUFDd0wsYUFBYSxFQUFFRyxzQkFBc0IsQ0FBQzdMLE9BQU8sQ0FBQ0MsZUFBZSxDQUFDO0FBRTNGLElBQUkrTCxNQUFNLEdBQUc5TCxlQUFlLENBQUN1TCxXQUFXLENBQUN0RSxRQUFRLENBQUM7QUFHbERtRCxjQUFjLENBQUNqTyxXQUFXLENBQUN5UCxNQUFNLENBQUM7QUFDbEM7QUFDQXhCLGNBQWMsQ0FBQ2pPLFdBQVcsQ0FBQ3dQLHNCQUFzQixDQUFDO0FBQ2xEdkIsY0FBYyxDQUFDak8sV0FBVyxDQUFDK04sb0JBQW9CLENBQUM7QUFDaER3QixVQUFVLENBQUN2UCxXQUFXLENBQUMwUCxNQUFNLENBQUM7QUFDOUJILFVBQVUsQ0FBQ3ZQLFdBQVcsQ0FBQ3NQLFNBQVMsQ0FBQztBQUNqQyxrQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcFBpZWNlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZUdhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZVN0YXJ0QnV0dG9uLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wb3NpdGlvblN3aXRjaGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3VwZGF0ZUN1cnJlbnRQaGFzZS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3M/ZTBmZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZHJhZ0RhdGEgPSB7XHJcbiAgICBkcmFnZ2VkU2hpcDogbnVsbFxyXG59O1xyXG5cclxuZnVuY3Rpb24gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIG9yaWVudGF0aW9uKSB7XHJcbiAgICBsZXQgcGllY2VzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBib3hXaWR0aCA9IDUwO1xyXG4gICAgbGV0IGJveEhlaWdodCA9IDQ4O1xyXG4gICAgbGV0IGlzVmVydGljYWwgPSBvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiO1xyXG5cclxuICAgIHBpZWNlc0NvbnRhaW5lci5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lclwiIDogXCJwaWVjZXNDb250YWluZXJcIjtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuICAgICAgICBsZXQgc2hpcEF0dHJpYnV0ZSA9IHBsYXllci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2U7XHJcbiAgICAgICAgbGV0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwQ29udGFpbmVyXCIgOiBcInNoaXBDb250YWluZXJcIjtcclxuICAgIFxyXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFNoaXBOYW1lXCIgOiBcInNoaXBOYW1lXCI7XHJcbiAgICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcbiAgICBcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7IC8vIEFkZCB0aGUgc2hpcFRpdGxlIGZpcnN0IFxyXG4gICAgXHJcbiAgICAgICAgbGV0IHNoaXBQaWVjZTtcclxuICAgIFxyXG4gICAgICAgIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcclxuICAgICAgICAgICAgcGxhY2VkRGl2LmlkID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlZERpdik7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hpcFBpZWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoaXNWZXJ0aWNhbCA/IFwidmVydGljYWxEcmFnZ2FibGVcIiA6IFwiZHJhZ2dhYmxlXCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUgOiBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5zdHlsZS53aWR0aCA9IGlzVmVydGljYWwgPyBib3hXaWR0aCArIFwicHhcIiA6IChib3hXaWR0aCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIjtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLnN0eWxlLmhlaWdodCA9IGlzVmVydGljYWwgPyAoYm94SGVpZ2h0ICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiIDogYm94SGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZEJveE9mZnNldCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9mZnNldFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNoaXBBdHRyaWJ1dGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXBBdHRyaWJ1dGUubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogY2xpY2tlZEJveE9mZnNldFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRyYWdEYXRhLmRyYWdnZWRTaGlwID0gc2hpcERhdGE7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicsIEpTT04uc3RyaW5naWZ5KHNoaXBEYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwSGVhZFJlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBIZWFkXCIgKyBzaGlwQXR0cmlidXRlLm5hbWUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcFBpZWNlUmVjdCA9IHNoaXBQaWVjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFggPSBzaGlwSGVhZFJlY3QubGVmdCAtIHNoaXBQaWVjZVJlY3QubGVmdCArIChzaGlwSGVhZFJlY3Qud2lkdGggLyAyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSBzaGlwSGVhZFJlY3QudG9wIC0gc2hpcFBpZWNlUmVjdC50b3AgKyAoc2hpcEhlYWRSZWN0LmhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShzaGlwUGllY2UsIG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEF0dHJpYnV0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgc2hpcEJveC5jbGFzc05hbWUgPSBcInNoaXBib3hcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guc3R5bGUud2lkdGggPSBib3hXaWR0aCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgY2xpY2tlZDpcIiwgZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwUGllY2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwQm94LmlkID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCItXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2hpcFBpZWNlLmFwcGVuZENoaWxkKHNoaXBCb3gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBUaXRsZSk7XHJcbiAgICAgICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFBpZWNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHBpZWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtiYXR0bGVzaGlwUGllY2VzLCBkcmFnRGF0YSB9OyIsImNvbnN0IHsgZHJhZ0RhdGEgfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5cclxuLy8gbGV0IGRyYWdnZWRTaGlwRGF0YSA9IG51bGw7ICAvLyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXHJcblxyXG5mdW5jdGlvbiBnZXRBZmZlY3RlZEJveGVzKGhlYWRQb3NpdGlvbiwgbGVuZ3RoLCBvcmllbnRhdGlvbikge1xyXG4gICAgY29uc3QgYm94ZXMgPSBbXTtcclxuICAgIGNvbnN0IGNoYXJQYXJ0ID0gaGVhZFBvc2l0aW9uWzBdO1xyXG4gICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGhlYWRQb3NpdGlvbi5zbGljZSgxKSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjaGFyUGFydCArIChudW1QYXJ0ICsgaSkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBib3hlcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIGkpICsgbnVtUGFydCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm94ZXM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkUGxhY2VtZW50KGJveElkLCBsZW5ndGgsIG9mZnNldCwgb3JpZW50YXRpb24sIHBsYXllcikge1xyXG4gICAgY29uc3QgY2hhclBhcnQgPSBib3hJZFswXTtcclxuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChib3hJZC5zbGljZSgxKSk7XHJcblxyXG4gICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIG9mZnNldDtcclxuXHJcbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGFkanVzdGVkTnVtUGFydCA+IDAgJiYgYWRqdXN0ZWROdW1QYXJ0ICsgbGVuZ3RoIC0gMSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ID49IDAgJiYgY2hhclBhcnQuY2hhckNvZGVBdCgwKSAtIDY1IC0gb2Zmc2V0ICsgbGVuZ3RoIDw9IHBsYXllci5nYW1lQm9hcmQuaGVpZ2h0O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDdXJyZW50U2hpcE9yaWVudGF0aW9uKCkge1xyXG4gICAgbGV0IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2W2RhdGEtc2hpcC1vcmllbnRhdGlvbl1cIik7XHJcbiAgICByZXR1cm4gc2hpcE9yaWVudGF0aW9uRWxlbWVudCA/IHNoaXBPcmllbnRhdGlvbkVsZW1lbnQuZGF0YXNldC5zaGlwT3JpZW50YXRpb24gOiBcIkhvcml6b250YWxcIjtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZChwbGF5ZXIpIHtcclxuICAgIFxyXG5cclxuICAgIC8vIEdlbmVyYXRlIGRpdiBlbGVtZW50cyBmb3IgR2FtZSBCb2FyZFxyXG4gICAgbGV0IGdhbWVCb2FyZENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkVG9wQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgYWxwaGFDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgbnVtZXJpY0Nvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBcclxuICAgXHJcbiAgICAgLy8gQXNzaWduaW5nIGNsYXNzZXMgdG8gdGhlIGNyZWF0ZWQgZWxlbWVudHNcclxuICAgICBnYW1lQm9hcmRDb21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXJcIjtcclxuICAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgdG9wXCI7XHJcbiAgICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIGJvdHRvbVwiO1xyXG4gICAgIGdhbWVCb2FyZC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZFwiO1xyXG4gICAgIGdhbWVCb2FyZC5pZCA9IHBsYXllci5uYW1lOyAvLyBBc3N1bWluZyB0aGUgcGxheWVyIGlzIGEgc3RyaW5nIGxpa2UgXCJwbGF5ZXIxXCJcclxuICAgICBhbHBoYUNvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwiYWxwaGFDb29yZGluYXRlc1wiO1xyXG4gICAgIG51bWVyaWNDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcIm51bWVyaWNDb29yZGluYXRlc1wiO1xyXG5cclxuICAgICAvLyBDcmVhdGUgY29sdW1uIHRpdGxlcyBlcXVhbCB0byB3aWR0aCBvZiBib2FyZFxyXG4gICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjb2x1bW5UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29sdW1uVGl0bGUudGV4dENvbnRlbnQgPSBpO1xyXG4gICAgICAgIG51bWVyaWNDb29yZGluYXRlcy5hcHBlbmRDaGlsZChjb2x1bW5UaXRsZSk7XHJcbiAgICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5hcHBlbmRDaGlsZChudW1lcmljQ29vcmRpbmF0ZXMpO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIHJvd3MgYW5kIHJvdyB0aXRsZXMgZXF1YWwgdG8gaGVpZ2h0XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllci5nYW1lQm9hcmQuaGVpZ2h0OyBpKyspIHtcclxuXHJcbiAgICAgICAgbGV0IGFscGhhQ2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDY1KTtcclxuXHJcbiAgICAgICAgbGV0IHJvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3dUaXRsZS50ZXh0Q29udGVudCA9IGFscGhhQ2hhcjtcclxuICAgICAgICBhbHBoYUNvb3JkaW5hdGVzLmFwcGVuZENoaWxkKHJvd1RpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcbiAgICAgICAgcm93LmlkID0gYWxwaGFDaGFyO1xyXG5cclxuICAgICAgICBsZXQgYWZmZWN0ZWRCb3hlcyA9IFtdO1xyXG4gICAgICAgIGxldCBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICAvLyBHZW5lcmF0ZSBjb29yZGluYXRlIGNvbHVtbnMgZm9yIGVhY2ggcm93XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGJveC5jbGFzc05hbWUgPSBcImJveFwiO1xyXG4gICAgICAgICAgICBib3guaWQgPSBhbHBoYUNoYXIgKyBqXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBkcmFnRGF0YS5kcmFnZ2VkU2hpcDtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0FmZmVjdGVkQm94ZXMgPSBbLi4uYWZmZWN0ZWRCb3hlc107IC8vIG1ha2UgYSBzaGFsbG93IGNvcHkgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGlwRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU2hpcCBkYXRhIGlzIG51bGwhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIG91dCBpZiB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZFBsYWNlbWVudCA9IGlzVmFsaWRQbGFjZW1lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLm9mZnNldCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUGxhY2VtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmlkLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBEYXRhLmxlbmd0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LmRyYWdBZmZlY3RlZCA9IFwidHJ1ZVwiOyAvLyBBZGQgdGhpcyBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApOyAvLyBkZWxheSBvZiAwIG1zLCBqdXN0IGVub3VnaCB0byBsZXQgZHJhZ2xlYXZlIGhhcHBlbiBmaXJzdCBpZiBpdCdzIGdvaW5nIHRvXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlBZmZlY3RlZEJveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJveFtkYXRhLWRyYWctYWZmZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcy5mb3JFYWNoKHByZXZCb3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZHJhZy1hZmZlY3RlZCcpOyAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyTGV0dGVyQm91bmQgPSA2NTtcclxuICAgICAgICAgICAgICAgIGxldCB1cHBlckxldHRlckJvdW5kID0gNzQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGJveC5pZFswXTsgIC8vIEFzc3VtaW5nIHRoZSBmb3JtYXQgaXMgYWx3YXlzIGxpa2UgXCJBNVwiXHJcbiAgICAgICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94LmlkLnNsaWNlKDEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWROdW1QYXJ0ID0gbnVtUGFydCAtIHNoaXBEYXRhLm9mZnNldDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkVGFyZ2V0UG9zaXRpb24gPSBjaGFyUGFydCArIGFkanVzdGVkTnVtUGFydDsgIC8vIFRoZSBuZXcgcG9zaXRpb24gZm9yIHRoZSBoZWFkIG9mIHRoZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBsZXQgYWZmZWN0ZWRCb3hlcyA9IGdldEFmZmVjdGVkQm94ZXMoYWRqdXN0ZWRUYXJnZXRQb3NpdGlvbiwgc2hpcERhdGEubGVuZ3RoLCBzaGlwT3JpZW50YXRpb24pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhZGp1c3RlZCBwb3NpdGlvbiBiYXNlZCBvbiB3aGVyZSB0aGUgdXNlciBjbGlja2VkIG9uIHRoZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkQ29vcmRpbmF0ZSA9IChjaGFyUGFydCArIG51bVBhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENoYXIgPSBjaGFyUGFydC5jaGFyQ29kZUF0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGFjZW1lbnQgaXMgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIiAmJiAoYWRqdXN0ZWROdW1QYXJ0IDw9IDAgfHwgYWRqdXN0ZWROdW1QYXJ0ICsgc2hpcERhdGEubGVuZ3RoIC0gMSA+IHBsYXllci5nYW1lQm9hcmQud2lkdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIlZlcnRpY2FsXCIgJiYgKHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCA8IGxvd2VyTGV0dGVyQm91bmQgfHwgc2VsZWN0ZWRDaGFyICsgc2hpcERhdGEubGVuZ3RoIC0gMSA+IHVwcGVyTGV0dGVyQm91bmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE91dCBvZiBib3VuZHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLm5hbWUsIGhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc2hpcCBwbGFjZW1lbnQ6IE92ZXJsYXBwaW5nIFNoaXAuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LmhpdE1hcmtlciA9IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmRhdGFzZXQuc2hpcCA9IHNoaXBEYXRhLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmVydGljYWwgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwRWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBwbGFjZSAke3NoaXBEYXRhLm5hbWV9IHdpdGggbGVuZ3RoICR7c2hpcERhdGEubGVuZ3RofSBhdCBwb3NpdGlvbiAke2FkanVzdGVkVGFyZ2V0UG9zaXRpb259LmApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtzaGlwRGF0YS5uYW1lfS5kcmFnZ2FibGUuc2hpcGApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIlZlcnRpY2FsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdiN2ZXJ0aWNhbCR7c2hpcERhdGEubmFtZX0udmVydGljYWxEcmFnZ2FibGUuc2hpcGApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEVsZW1lbnQgPSBzaGlwRWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBwbGFjZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LmNsYXNzTmFtZSA9IFwicGxhY2VkVGV4dFwiO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkRGl2LnRleHRDb250ZW50ID0gXCJQbGFjZWRcIjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIG5ldyBkaXYgdG8gdGhlIHBhcmVudCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHBsYWNlZERpdik7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7XHJcbiAgICAgICAgICAgICAgICAvLyBsZXQgc2hpcE9iamVjdE5hbWUgPSBzaGlwRGF0YS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBoaWdobGlnaHRcclxuICAgICAgICAgICAgICAgIGxldCBwcmV2aW91c0JveGVzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGFmZmVjdGVkQm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0JveGVzID0gYWZmZWN0ZWRCb3hlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoYWxwaGFDb29yZGluYXRlcyk7XHJcbiAgICBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxuXHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkVG9wQ29tcG9uZW50KTtcclxuICAgIGdhbWVCb2FyZENvbXBvbmVudC5hcHBlbmRDaGlsZChnYW1lQm9hcmRCb3R0b21Db21wb25lbnQpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZ2FtZUJvYXJkQ29tcG9uZW50XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlR2FtZUJvYXJkOyIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYW1lU3RhcnRFbGVtZW50IChnYW1lKSB7XHJcbiAgICBsZXQgZ2FtZVN0YXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGdhbWVTdGFydENvbnRhaW5lci5jbGFzc05hbWUgPSBcImdhbWVTdGFydENvbnRhaW5lclwiO1xyXG5cclxuICAgIGxldCBzdGFydEJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInN0YXJ0QnV0dG9uQ29udGFpbmVyXCI7XHJcblxyXG4gICAgLy8gU3RhcnQgYnV0dG9uXHJcbiAgICBsZXQgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IEdhbWVcIjtcclxuICAgIHN0YXJ0QnV0dG9uLmlkID0gXCJpbml0U3RhcnRCdXR0b25cIjtcclxuICAgIHN0YXJ0QnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uKTtcclxuICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhnYW1lLnBsYXllcjEuZ2FtZUJvYXJkLnNoaXApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpKTtcclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgUGxhY2UgQWxsIFlvdXIgU2hpcHMgaW4gTGVnYWwgUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRydWVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9KSBcclxuXHJcbiAgICAvLyBBcHBlbmQgdGhlIHN0YXJ0QnV0dG9uQ29udGFpbmVyIHRvIHRoZSBtYWluIGNvbnRhaW5lclxyXG4gICAgZ2FtZVN0YXJ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uQ29udGFpbmVyKTtcclxuXHJcbiAgICByZXR1cm4gZ2FtZVN0YXJ0Q29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVTdGFydEVsZW1lbnQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDEwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAxMDtcclxuICAgICAgICB0aGlzLm1pc3NDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlwID0ge1xyXG4gICAgICAgICAgICBDYXJyaWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NhcnJpZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBCYXR0bGVzaGlwOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0JhdHRsZXNoaXAnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDcnVpc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0NydWlzZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTdWJtYXJpbmU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnU3VibWFyaW5lJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ0Rlc3Ryb3llcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIGxldCBib2FyZCA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChcIlwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmQucHVzaChyb3cpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gVGhpcyBjb2RlIHJldHVybnMgdGhlIGNoYXIgdmFsdWUgYXMgYW4gaW50IHNvIGlmIGl0IGlzICdCJyAob3IgJ2InKSwgd2Ugd291bGQgZ2V0IHRoZSB2YWx1ZSA2NiAtIDY1ID0gMSwgZm9yIHRoZSBwdXJwb3NlIG9mIG91ciBhcnJheSBCIGlzIHJlcC4gYnkgYm9hcmRbMV0uXHJcbiAgICAgICAgY2hhclRvUm93SW5kZXgoY2hhcikge1xyXG4gICAgICAgICAgICBjaGFyID0gY2hhci50b1VwcGVyQ2FzZSgpOyAvLyBDb252ZXJ0IHRoZSBjaGFyYWN0ZXIgdG8gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBSZXR1cm5zIGFuIGludCBhcyBhIHN0ciB3aGVyZSBudW1iZXJzIGZyb20gMSB0byAxMCwgd2lsbCBiZSB1bmRlcnN0b29kIGZvciBhcnJheSBhY2Nlc3M6IGZyb20gMCB0byA5LlxyXG4gICAgICAgIHN0cmluZ1RvQ29sSW5kZXgoc3RyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChzdHIpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXRBdChhbGlhcywgc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxldHRlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gQyBcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmNoYXJUb1Jvd0luZGV4KGNoYXJQYXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvdXQgb2YgYm91bmRzIGxpa2UgSzkgb3IgQzE4XHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiA5IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9IHN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoZWNrQXQoYWxpYXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gRW5zdXJlIGluZGljZXMgYXJlIHZhbGlkXHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPj0gdGhpcy5oZWlnaHQgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID49IHRoaXMud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZSBhbGlhcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPT09IFwiSGl0XCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkhpdFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSBpcyBvY2N1cGllZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRCZWxvd0FsaWFzKGFsaWFzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFyUGFydCB0byB0aGUgbmV4dCBsZXR0ZXJcclxuICAgICAgICAgICAgY29uc3QgbmV4dENoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyAxKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBuZXh0Q2hhciArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYXJUb1Jvd0luZGV4KG5leHRDaGFyKSA+IDkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdyBiZWxvdyB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldFJpZ2h0QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGxldCBudW1QYXJ0ID0gcGFyc2VJbnQoYWxpYXMuc3Vic3RyaW5nKDEpLCAxMCk7IC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIG51bWJlciBieSAxXHJcbiAgICAgICAgICAgIG51bVBhcnQrKztcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV3QWxpYXMgPSBjaGFyUGFydCArIG51bVBhcnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChudW1QYXJ0ID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGNvbHVtbiB0byB0aGUgcmlnaHQgb2YgdGhpcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHBsYWNlU2hpcChzaGlwTmFtZSwgc2hpcEhlYWRDb29yZGluYXRlLCBzaGlwT3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcE1hcmtlciA9IFwiU2hpcFwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q29vcmRpbmF0ZSA9IHNoaXBIZWFkQ29vcmRpbmF0ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZ2V0TmV4dENvb3JkaW5hdGUgPSBzaGlwT3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIlxyXG4gICAgICAgICAgICAgICAgPyBjb29yZGluYXRlID0+IHRoaXMuZ2V0QmVsb3dBbGlhcyhjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgOiBjb29yZGluYXRlID0+IHRoaXMuZ2V0UmlnaHRBbGlhcyhjb29yZGluYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tBdChjdXJyZW50Q29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID0gW107IC8vIENsZWFyIGFueSBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMucHVzaChjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBnZXROZXh0Q29vcmRpbmF0ZShjdXJyZW50Q29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgZm9yIChsZXQgY29vcmRpbmF0ZSBvZiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIHNoaXBNYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBdChjb29yZGluYXRlKSA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcENvb3JkaW5hdGVzID0gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaGl0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiSGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzQ291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheS5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIk1pc3NcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEFsbFNoaXBzVG9EZWFkKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZU92ZXIoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgIC8vIFJldHVybiBmYWxzZSBpZiBhbnkgc2hpcCBpcyBub3QgZGVhZC5cclxuICAgICAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwbGF5KCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciB3aXRoIGNvbHVtbiBudW1iZXJzXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBcIiAgICBcIjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgKz0gaSArIFwiIFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlYWRlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHJvdyBhbmQgcHJpbnQgdGhlbVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIiB8IFwiOyAvLyBDb252ZXJ0IHJvdyBpbmRleCB0byBBLUogYW5kIGFkZCB0aGUgc2VwYXJhdG9yXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGVhY2ggY2VsbCdzIHZhbHVlIGFuZCBkZWNpZGUgd2hhdCB0byBwcmludFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsVmFsdWUgPSB0aGlzLmJvYXJkW2ldW2pdO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlY2lkZSB0aGUgY2VsbCdzIGRpc3BsYXkgYmFzZWQgb24gaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNoaXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlMgXCI7IC8vIFMgZm9yIFNoaXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSGl0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJYIFwiOyAvLyBYIGZvciBIaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTWlzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiTSBcIjsgLy8gTSBmb3IgTWlzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCItIFwiOyAvLyAtIGZvciBFbXB0eSBDZWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3dTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lSWQsIHBsYXllck5hbWUpIHtcclxuICAgICAgICB0aGlzLmdhbWVJZCA9IGdhbWVJZDtcclxuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKHBsYXllck5hbWUpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcbiAgICAgICAgdGhpcy5waGFzZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUTy1ETyBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpLCBwcm9tcHRVc2VyT3JpZW50YXRpb24oKSwgY2hlY2tXaW5uZXIoKTtcclxuXHJcbiAgICBjaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgIT0gXCJHYW1lIFNldC1VcFwiKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKTtcclxuICAgICAgICBmb3IgKGxldCBzaGlwVHlwZXMgaW4gdGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwW3NoaXBUeXBlc10uY29vcmRpbmF0ZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGFjZUNvbXB1dGVyU2hpcChzaGlwTmFtZSkge1xyXG4gICAgICAgIHdoaWxlIChjb21wdXRlci5nYW1lQm9hcmQuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIGNvbXB1dGVyQ29vcmRpbmF0ZSwgY29tcHV0ZXJPcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyQ29vcmRpbmF0ZSA9IHRoaXMuY29tcHV0ZXIuZWFzeUFpTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVyT3JpZW50YXRpb24gPSB0aGlzLmNvbXB1dGVyLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50aWFsaXplR2FtZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCJcclxuICAgICAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJDYXJyaWVyXCIsIFwiQmF0dGxlc2hpcFwiLCBcIkNydWlzZXJcIiwgXCJTdWJtYXJpbmVcIiwgXCJEZXN0cm95ZXJcIl07XHJcbiAgICAgICAgLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2hpcCBvZiBzaGlwVHlwZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZVBsYXllclNoaXBzKHNoaXApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlQ29tcHV0ZXJTaGlwKHNoaXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5VHVybigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZE1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHBsYXllck1vdmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlICghaXNWYWxpZE1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9tcHQgdXNlciBmb3IgY29vcmRpbmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9tcHQgPSBcIkExXCI7IC8vIEhlcmUgeW91IG1pZ2h0IHdhbnQgdG8gZ2V0IGFjdHVhbCBpbnB1dCBmcm9tIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhwcm9tcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTsgLy8gT3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHlvdSBjYW4gcHJvbXB0IHRoZSB1c2VyIHdpdGggYSBtZXNzYWdlIHRvIGVudGVyIGEgbmV3IGNvb3JkaW5hdGUuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2socGxheWVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck1vdmUgPSBjb21wdXRlci5tYWtlQXR0YWNrKGNvbXB1dGVyQ2hvaWNlKVxyXG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkdhbWUgU2V0LVVwXCIpIHtcclxuICAgICAgICAgICAgbGV0IHR1cm5WYWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyIC0gMSArIDEpKSArIDE7XHJcbiAgICAgICAgICAgIGlmICh0dXJuVmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIkNvbXB1dGVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHBsYXllci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDb21wdXRlciBXaW5zXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21wdXRlci5nYW1lQm9hcmQuZ2FtZU92ZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGF5ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgd2hpbGUoIWNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlUdXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcblxyXG4vLyAvLyBHZXQgcGxheWVyIG5hbWVcclxuLy8gbGV0IG5hbWUgPSBcInBsYXllcjFcIlxyXG5cclxuLy8gLy8gQ3JlYXRlIHBsYXllcnNcclxubGV0IGdhbWUgPSBuZXcgR2FtZShudWxsLCBcInBsYXllclwiKVxyXG5cclxuY29uc29sZS5sb2coZ2FtZS5jaGVja1BsYXllclJlYWR5R2FtZVN0YXRlKCkpXHJcblxyXG4vLyBsZXQgY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbi8vICAgICAvLyBcIkNhcnJpZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDYXJyaWVyXCIsIFwiRTVcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkExXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiQmF0dGxlc2hpcFwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkJhdHRsZXNoaXBcIiwgXCJKN1wiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiQjEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkNydWlzZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJDcnVpc2VyXCIsIFwiQThcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkYxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIFwiU3VibWFyaW5lXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiRDFcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiU3VibWFyaW5lXCIsIFwiSDEwXCIsIFwiVmVydGljYWxcIilcclxuXHJcbi8vICAgICAvLyBcIkRlc3Ryb3llclwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkIyXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkRlc3Ryb3llclwiLCBcIkoxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG5cclxuLy8gICAgIC8vIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuXHJcbi8vIC8vIEF0dGFjayBwaGFzZSBcclxuXHJcbi8vICAgICAvLyBQbGF5ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgcGxheWVyTW92ZSA9IHBsYXllci5tYWtlQXR0YWNrKFwiQTFcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllck1vdmUpO1xyXG5cclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAgICAgLy8gQ29tcHV0ZXIgYXR0YWNrIHBoYXNlXHJcbi8vICAgICBsZXQgY29tcHV0ZXJDaG9pY2UgPSBjb21wdXRlci5lYXN5QWlNb3ZlcygpXHJcbi8vICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhjb21wdXRlck1vdmUpO1xyXG5cclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG4iLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9nYW1lQm9hcmRcIik7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5BaSA9IHRoaXMuaXNBaSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VBdHRhY2soY29vcmRpbmF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhjb29yZGluYXRlKSAmJiAhdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3ZlIGlzIGFscmVhZHkgbWFkZVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQWkobmFtZSkge1xyXG4gICAgICAgIGxldCBjaGVjayA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjaGVjayA9PSBcIkNvbXB1dGVyXCIgfHwgY2hlY2sgPT0gXCJBaVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBbGxQb3NzaWJsZU1vdmVzKCkge1xyXG4gICAgICAgIGxldCBhbGxNb3ZlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3dOdW1iZXIgPSAxOyByb3dOdW1iZXIgPD0gdGhpcy5nYW1lQm9hcmQuaGVpZ2h0OyByb3dOdW1iZXIrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbkFsaWFzID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW5OdW1iZXIgKyA2NSk7XHJcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZWFzeUFpTW92ZXMoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgYWxsUG9zc2libGVNb3ZlcyA9IHRoaXMuZ2V0QWxsUG9zc2libGVNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgdW5wbGF5ZWRNb3ZlcyA9IGFsbFBvc3NpYmxlTW92ZXMuZmlsdGVyKG1vdmUgPT4gIXRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMobW92ZSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHVucGxheWVkIG1vdmVzIGxlZnQsIHJhaXNlIGFuIGVycm9yIG9yIGhhbmRsZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBpZiAodW5wbGF5ZWRNb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gdGhpcy5nZXRSYW5kb21JbnQoMCwgdW5wbGF5ZWRNb3Zlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB1bnBsYXllZE1vdmVzW3JhbmRvbUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpICsgMTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJjb25zdCB7YmF0dGxlc2hpcFBpZWNlc30gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKHBsYXllcikge1xyXG4gICAgbGV0IHNoaXBQb3NpdGlvblN3aXRjaGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmNsYXNzTmFtZSA9XCJzaGlwUG9zaXRpb25Td2l0Y2hlclwiO1xyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuaW5uZXJUZXh0ID0gXCJTd2l0Y2ggT3JpZW50YXRpb25cIlxyXG5cclxuICAgIHNoaXBQb3NpdGlvblN3aXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xyXG5cclxuICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRTaGlwT3JpZW50YXRpb25cIik7XHJcbiAgICBsZXQgbGVmdEdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVTY3JlZW4tTGVmdFwiKTtcclxuXHJcblxyXG4gICAgaWYgKHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICBsZXQgdXBkYXRlZFZlcnRCb2FyZCA9IGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBcIlZlcnRpY2FsXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZFZlcnRCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbiA9IFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIGxldCB1cGRhdGVkSG9yQm9hcmQgPSBiYXR0bGVzaGlwUGllY2VzKHBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApXHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4ucmVtb3ZlQ2hpbGQobGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgbGVmdEdhbWVTY3JlZW4uaW5zZXJ0QmVmb3JlKHVwZGF0ZWRIb3JCb2FyZCwgbGVmdEdhbWVTY3JlZW4uZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7c2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9ufWBcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHNoaXBQb3NpdGlvblN3aXRjaGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyOyIsIlxyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwVHlwZXMgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IDUsXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IDQsXHJcbiAgICAgICAgICAgIENydWlzZXI6IDMsXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZTogMyxcclxuICAgICAgICAgICAgRGVzdHJveWVyOiAyLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkID0gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmICEhdGhpcy5zaGlwVHlwZXNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnNldExlbmd0aCh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZW5ndGgobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNhcGl0YWxpemVkU2hpcE5hbWUgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoaXBUeXBlc1tjYXBpdGFsaXplZFNoaXBOYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3VuaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRDb3VudCA9PSB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XHJcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaXRDb3VudDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCJmdW5jdGlvbiBwaGFzZVVwZGF0ZXIoZ2FtZSkge1xyXG5cclxuICAgIGxldCBnYW1lUGhhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVQaGFzZVwiKTtcclxuICAgIGxldCBwbGF5ZXJUdXJuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJUdXJuXCIpO1xyXG5cclxuICAgIGlmIChnYW1lID09IG51bGwpIHtcclxuICAgICAgICBnYW1lUGhhc2UudGV4dENvbnRlbnQgPSBcIkdhbWUgSW5pdGlhbGl6dGlvblwiXHJcbiAgICAgICAgcGxheWVyVHVybi50ZXh0Q29udGVudCA9IFwiXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdhbWVQaGFzZS50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFN0YXRlO1xyXG4gICAgICAgIHBsYXllclR1cm4udGV4dENvbnRlbnQgPSBnYW1lLmN1cnJlbnRUdXJuO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwaGFzZVVwZGF0ZXI7IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uZ2FtZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XHJcbn1cclxuXHJcbi5nYW1lSGVhZGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAxNSU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XHJcbn1cclxuXHJcbiNiYXR0bGVzaGlwVGl0bGUge1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLmdhbWVTdGF0ZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgd2lkdGg6IDIwJTtcclxuICAgIGhlaWdodDogNzAlO1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uZ2FtZUNvbnRlbnRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDg1JTtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xyXG4gICAgbWFyZ2luLXRvcDogM2VtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkSGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxufVxyXG5cclxuLmdhbWVTY3JlZW5Db250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDg1JTtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbi1MZWZ0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDIwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xyXG59XHJcblxyXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiA4MCU7XHJcbn1cclxuXHJcblxyXG4uc2hpcFBvc2l0aW9uU3dpdGNoZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiA4MCU7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMS41ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcblxyXG4uZ2FtZUJvYXJkQ29udGFpbmVyLnRvcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGhlaWdodDogNSU7XHJcbn1cclxuXHJcblxyXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMgPiBkaXZ7XHJcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkQ29udGFpbmVyLmJvdHRvbSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBoZWlnaHQ6IDkwJTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBmb250LXNpemU6IDM2cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNWVtO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMC4yZW07XHJcbn1cclxuXHJcbi5hbHBoYUNvb3JkaW5hdGVzID4gZGl2IHtcclxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogNTAwcHg7XHJcbiAgICB3aWR0aDogNTAwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cclxufVxyXG5cclxuLnJvdywgLnNoaXAge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5zaGlwIHtcclxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuLmJveCB7XHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLmJveDpob3ZlciB7XHJcbiAgICB3aWR0aDogMTAlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xyXG59XHJcblxyXG4uaGlnaGxpZ2h0IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cclxufVxyXG5cclxuLnBsYWNlZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIwLCA2MSwgMTczLCAwLjQpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkUmVzdWx0Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xyXG59XHJcblxyXG4ucGllY2VzQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIHdpZHRoOiA0MjVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XHJcbn1cclxuXHJcbi5zaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDUwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbn1cclxuXHJcbi5zaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xyXG59XHJcblxyXG5cclxuLnNoaXBib3gge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC4yKTsgXHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBjb2xvcjogZ3JlZW55ZWxsb3c7XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0I2hvcml6b250YWwge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEuNWVtO1xyXG59XHJcblxyXG4ucGxhY2VkVGV4dCN2ZXJ0aWNhbCB7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XHJcbn1cclxuXHJcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDYwdmg7XHJcbiAgICB3aWR0aDogNjB2dztcclxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAyMDBweDtcclxuICAgIHdpZHRoOiAyMDBweDtcclxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4ucGxheWVyTmFtZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICBcclxufVxyXG5cclxuLnBsYXllcklucHV0TmFtZUxhYmVsIHtcclxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XHJcbn1cclxuXHJcbi5wbGF5ZXJJbnB1dE5hbWUge1xyXG4gICAgaGVpZ2h0OiA1MHB4OyAgICBcclxuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xyXG4gICAgd2lkdGg6IDYwJTtcclxuICAgIGZvbnQtc2l6ZTogNDBweDtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEyZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDhlbTtcclxufVxyXG5cclxuI2luaXRQbGFjZUJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XHJcbn1cclxuXHJcbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xyXG4gICAgY29sb3I6IHJnYigyMzgsIDI1NSwgMCk7XHJcbn1cclxuXHJcbiNpbml0U3RhcnRCdXR0b24ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NCwgMjcsIDI3KTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBmb250LXNpemU6IGxhcmdlcjtcclxufVxyXG5cclxuLnZlcnRpY2FsUGllY2VzQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG59XHJcblxyXG4udmVydGljYWxTaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XHJcbn1cclxuXHJcblxyXG4udmVydGljYWxTaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnNoaXBib3gsIC52ZXJ0aWNhbFNoaXBib3ggeyBcclxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMDAwOyAvKiBmb3IgdmlzdWFsaXphdGlvbiAqL1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vYmF0dGxl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QUFDdkI7O0FBRUE7SUFDSSx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtJQUN2QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0FBQ3ZFOztBQUVBO0lBQ0ksZUFBZTtJQUNmLGtCQUFrQjtBQUN0Qjs7O0FBR0E7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCLEdBQUcsMENBQTBDO0lBQ25FLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFlBQVksR0FBRyxtQ0FBbUM7SUFDbEQsV0FBVztJQUNYLHNCQUFzQixFQUFFLHNCQUFzQjtJQUM5QyxzQkFBc0IsRUFBRSxpREFBaUQ7QUFDN0VcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVIZWFkZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAxNSU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcXHJcXG59XFxyXFxuXFxyXFxuI2JhdHRsZXNoaXBUaXRsZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTdGF0ZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGhlaWdodDogNzAlO1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRlbnRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi10b3A6IDNlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlciB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW5Db250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lU2NyZWVuLUxlZnQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICB3aWR0aDogMjAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnRTaGlwT3JpZW50YXRpb24ge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogODAlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uc2hpcFBvc2l0aW9uU3dpdGNoZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiA4MCU7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDIyLCAzOSwgMTg5KTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMS41ZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgZm9udC1zaXplOiAzNnB4O1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XFxyXFxufVxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMgPiBkaXZ7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBoZWlnaHQ6IDkwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmFscGhhQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgZm9udC1zaXplOiAzNnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNWVtO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xcclxcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDUwMHB4O1xcclxcbiAgICB3aWR0aDogNTAwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXFxyXFxufVxcclxcblxcclxcbi5yb3csIC5zaGlwIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcCB7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxufVxcclxcblxcclxcbi5ib3gge1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5ib3g6aG92ZXIge1xcclxcbiAgICB3aWR0aDogMTAlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmhpZ2hsaWdodCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGhlaWdodDogNTBweDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgbWFyZ2luLXRvcDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XFxyXFxufVxcclxcblxcclxcblxcclxcbi5zaGlwYm94IHtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkVGV4dCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGNvbG9yOiBncmVlbnllbGxvdztcXHJcXG59XFxyXFxuXFxyXFxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDEuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkVGV4dCN2ZXJ0aWNhbCB7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDYwdmg7XFxyXFxuICAgIHdpZHRoOiA2MHZ3O1xcclxcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTdGFydENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDIwMHB4O1xcclxcbiAgICB3aWR0aDogMjAwcHg7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyTmFtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxyXFxuICAgIFxcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVySW5wdXROYW1lTGFiZWwge1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVySW5wdXROYW1lIHtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4OyAgICBcXHJcXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XFxyXFxuICAgIHdpZHRoOiA2MCU7XFxyXFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDEyZW07XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogOGVtO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFBsYWNlQnV0dG9uIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDU2LCAxNywgMTk0KTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5pdFBsYWNlQnV0dG9uOmhvdmVyIHtcXHJcXG4gICAgY29sb3I6IHJnYigyMzgsIDI1NSwgMCk7XFxyXFxufVxcclxcblxcclxcbiNpbml0U3RhcnRCdXR0b24ge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk0LCAyNywgMjcpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xcclxcbn1cXHJcXG5cXHJcXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAzNTBweDtcXHJcXG4gICAgd2lkdGg6IDQyNXB4O1xcclxcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXHJcXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbERyYWdnYWJsZSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcXHJcXG4gICAgZm9udC1zaXplOiAxNnB4O1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XFxyXFxufVxcclxcblxcclxcblxcclxcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAgLyogdGhpcyBzdGFja3MgdGhlIHNoaXAgYm94ZXMgdmVydGljYWxseSAqL1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxcclxcbiAgICBoZWlnaHQ6IDQ4cHg7ICAvKiBhZGp1c3QgdGhpcyBhcyBwZXIgeW91ciBkZXNpZ24gKi9cXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIHRvIGVuc3VyZSBib3JkZXIgZG9lc24ndCBhZGQgdG8gd2lkdGgvaGVpZ2h0ICovXFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIlxyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xyXG5jb25zdCB7YmF0dGxlc2hpcFBpZWNlc30gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuY29uc3QgY3JlYXRlR2FtZUJvYXJkID0gIHJlcXVpcmUoJy4vY3JlYXRlR2FtZUJvYXJkJyk7XHJcbmNvbnN0IGNyZWF0ZUdhbWVTdGFydEVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZVN0YXJ0QnV0dG9uJyk7XHJcbmNvbnN0IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyID0gcmVxdWlyZShcIi4vcG9zaXRpb25Td2l0Y2hlclwiKVxyXG5jb25zdCBwaGFzZVVwZGF0ZXIgPSByZXF1aXJlKCcuL3VwZGF0ZUN1cnJlbnRQaGFzZScpO1xyXG5pbXBvcnQgJy4vYmF0dGxlc2hpcC5jc3MnO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xyXG4gICAgY29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcblxyXG5sZXQgcGxheWVyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwbGF5ZXJOYW1lJyk7XHJcbmxldCBjdXJyZW50R2FtZSA9IG5ldyBHYW1lIChnZW5lcmF0ZVJhbmRvbVN0cmluZygpLCBwbGF5ZXJOYW1lKVxyXG5jdXJyZW50R2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCI7XHJcbmxldCBjdXJyZW50UGxheWVyID0gY3VycmVudEdhbWUucGxheWVyMTtcclxuXHJcbnBoYXNlVXBkYXRlcihjdXJyZW50R2FtZSk7XHJcblxyXG5sZXQgZ2FtZVN0YXJ0ID0gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudChjdXJyZW50R2FtZSk7XHJcblxyXG5sZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcclxuXHJcbmxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmxlZnRHYW1lU2NyZWVuLmNsYXNzTmFtZT1cImdhbWVTY3JlZW4tTGVmdFwiXHJcblxyXG5sZXQgY3VycmVudFNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uY2xhc3NOYW1lID0gXCJjdXJyZW50U2hpcE9yaWVudGF0aW9uXCI7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb24gPSBcIkhvcml6b250YWxcIlxyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7Y3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbn1gXHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQobGVmdEdhbWVTY3JlZW4pO1xyXG5cclxubGV0IHBpZWNlcyA9IGJhdHRsZXNoaXBQaWVjZXMoY3VycmVudFBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5cclxuXHJcbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKGN1cnJlbnRQbGF5ZXIpO1xyXG5cclxubGV0IGJvYXJkMSA9IGNyZWF0ZUdhbWVCb2FyZChjdXJyZW50UGxheWVyLCBjdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uKTtcclxuXHJcbmxldCBib2FyZDIgPSBjcmVhdGVHYW1lQm9hcmQoY3VycmVudEdhbWUuY29tcHV0ZXIpO1xyXG5cclxuXHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHBpZWNlcyk7XHJcbi8vIGxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHZlcnRpY2FsUGllY2VzKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY3VycmVudFNoaXBPcmllbnRhdGlvbik7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHNoaXBQb3NpdGlvblN3aXRjaGVyKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVTdGFydCk7XHJcbi8vIGdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoYm9hcmQyKTtcclxuXHJcbiJdLCJuYW1lcyI6WyJkcmFnRGF0YSIsImRyYWdnZWRTaGlwIiwiYmF0dGxlc2hpcFBpZWNlcyIsInBsYXllciIsIm9yaWVudGF0aW9uIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJpc1ZlcnRpY2FsIiwiY2xhc3NOYW1lIiwiX2xvb3AiLCJzaGlwQXR0cmlidXRlIiwiZ2FtZUJvYXJkIiwic2hpcCIsInNoaXBOYW1lIiwiaW5zdGFuY2UiLCJzaGlwQ29udGFpbmVyIiwic2hpcFRpdGxlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwiYXBwZW5kQ2hpbGQiLCJzaGlwUGllY2UiLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInBsYWNlZERpdiIsImlkIiwic3R5bGUiLCJqdXN0aWZ5Q29udGVudCIsImNsYXNzTGlzdCIsImFkZCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhZ2dhYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiY2xpY2tlZEJveE9mZnNldCIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInNoaXBEYXRhIiwib2Zmc2V0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzaGlwSGVhZFJlY3QiLCJnZXRFbGVtZW50QnlJZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNoaXBQaWVjZVJlY3QiLCJvZmZzZXRYIiwibGVmdCIsIm9mZnNldFkiLCJ0b3AiLCJzZXREcmFnSW1hZ2UiLCJpIiwic2hpcEJveCIsImNvbnNvbGUiLCJsb2ciLCJzZXRBdHRyaWJ1dGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiX3JlcXVpcmUiLCJyZXF1aXJlIiwiZ2V0QWZmZWN0ZWRCb3hlcyIsImhlYWRQb3NpdGlvbiIsImJveGVzIiwiY2hhclBhcnQiLCJudW1QYXJ0IiwicGFyc2VJbnQiLCJzbGljZSIsInB1c2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiaXNWYWxpZFBsYWNlbWVudCIsImJveElkIiwiYWRqdXN0ZWROdW1QYXJ0IiwiZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbiIsInNoaXBPcmllbnRhdGlvbkVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZGF0YXNldCIsInNoaXBPcmllbnRhdGlvbiIsImNyZWF0ZUdhbWVCb2FyZCIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJlcnJvciIsInZhbGlkUGxhY2VtZW50IiwiZm9yRWFjaCIsImRyYWdBZmZlY3RlZCIsInByZXZpb3VzbHlBZmZlY3RlZEJveGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZCb3giLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJsb3dlckxldHRlckJvdW5kIiwidXBwZXJMZXR0ZXJCb3VuZCIsInBhcnNlIiwiZ2V0RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJoZWFkQ29vcmRpbmF0ZSIsInNlbGVjdGVkQ2hhciIsInBsYWNlU2hpcCIsImhpdE1hcmtlciIsInNoaXBFbGVtZW50IiwiY29uY2F0IiwicGFyZW50RWxlbWVudCIsInByZXZpb3VzQm94ZXMiLCJHYW1lIiwiY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCIsImdhbWUiLCJnYW1lU3RhcnRDb250YWluZXIiLCJzdGFydEJ1dHRvbkNvbnRhaW5lciIsInN0YXJ0QnV0dG9uIiwicGxheWVyMSIsImNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUiLCJhbGVydCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJfY2xhc3NDYWxsQ2hlY2siLCJtaXNzQ291bnQiLCJtaXNzZWRNb3Zlc0FycmF5IiwiaGl0TW92ZXNBcnJheSIsIkNhcnJpZXIiLCJCYXR0bGVzaGlwIiwiQ3J1aXNlciIsIlN1Ym1hcmluZSIsIkRlc3Ryb3llciIsImJvYXJkIiwic3RhcnRHYW1lIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJjaGFyVG9Sb3dJbmRleCIsImNoYXIiLCJ0b1VwcGVyQ2FzZSIsInN0cmluZ1RvQ29sSW5kZXgiLCJzdHIiLCJzZXRBdCIsImFsaWFzIiwic3RyaW5nIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwicm93SW5kZXgiLCJjb2xJbmRleCIsImNoZWNrQXQiLCJFcnJvciIsImdldEJlbG93QWxpYXMiLCJuZXh0Q2hhciIsIm5ld0FsaWFzIiwiZ2V0UmlnaHRBbGlhcyIsInNoaXBIZWFkQ29vcmRpbmF0ZSIsIl90aGlzIiwic2hpcE1hcmtlciIsInNoaXBMZW5ndGgiLCJjdXJyZW50Q29vcmRpbmF0ZSIsImdldE5leHRDb29yZGluYXRlIiwiY29vcmRpbmF0ZSIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJlcnIiLCJlIiwiZiIsInJlY2VpdmVBdHRhY2siLCJzaGlwQ29vcmRpbmF0ZXMiLCJpbmNsdWRlcyIsImhpdCIsInNldEFsbFNoaXBzVG9EZWFkIiwiaXNEZWFkIiwiZ2FtZU92ZXIiLCJkaXNwbGF5IiwiaGVhZGVyIiwicm93U3RyaW5nIiwiY2VsbFZhbHVlIiwiUGxheWVyIiwiZ2FtZUlkIiwicGxheWVyTmFtZSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY3VycmVudFN0YXRlIiwiY3VycmVudFR1cm4iLCJzaGlwVHlwZXMiLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsIl9pIiwiX3NoaXBUeXBlcyIsInBsYWNlUGxheWVyU2hpcHMiLCJzdGFydCIsInBsYXlUdXJuIiwiaXNWYWxpZE1vdmUiLCJwbGF5ZXJNb3ZlIiwicHJvbXB0IiwibWFrZUF0dGFjayIsIm1lc3NhZ2UiLCJjb21wdXRlckNob2ljZSIsImNvbXB1dGVyTW92ZSIsInVwZGF0ZVN0YXRlIiwidHVyblZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2hlY2tXaW5uZXIiLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsInRvTG93ZXJDYXNlIiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwibW92ZSIsInJhbmRvbUluZGV4IiwiY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIiLCJzaGlwUG9zaXRpb25Td2l0Y2hlciIsImlubmVyVGV4dCIsImxlZnRHYW1lU2NyZWVuIiwidXBkYXRlZFZlcnRCb2FyZCIsInJlbW92ZUNoaWxkIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsInVwZGF0ZWRIb3JCb2FyZCIsImlzVmFsaWQiLCJzZXRMZW5ndGgiLCJoaXRDb3VudCIsImNhcGl0YWxpemVkU2hpcE5hbWUiLCJpc1N1bmsiLCJwaGFzZVVwZGF0ZXIiLCJnYW1lUGhhc2UiLCJwbGF5ZXJUdXJuIiwiZ2VuZXJhdGVSYW5kb21TdHJpbmciLCJjaGFyYWN0ZXJzIiwicmVzdWx0IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImN1cnJlbnRHYW1lIiwiY3VycmVudFBsYXllciIsImdhbWVTdGFydCIsImdhbWVTY3JlZW4iLCJjdXJyZW50U2hpcE9yaWVudGF0aW9uIiwicGllY2VzIiwiYm9hcmQxIiwiYm9hcmQyIl0sInNvdXJjZVJvb3QiOiIifQ==