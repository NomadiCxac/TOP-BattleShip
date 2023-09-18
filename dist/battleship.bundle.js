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

/***/ "./placePiecesOnComputerBoardFrontEnd.js":
/*!***********************************************!*\
  !*** ./placePiecesOnComputerBoardFrontEnd.js ***!
  \***********************************************/
/***/ ((module) => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function placePiecesOnComputerBoardFrontEnd(computer) {
  var computerBoard = document.querySelector("div#computer.gameBoard");
  console.log(computerBoard);
  for (var shipType in computer.gameBoard.ship) {
    var _iterator = _createForOfIteratorHelper(computer.gameBoard.ship[shipType].coordinates),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var coordinate = _step.value;
        // Use the template string and interpolation correctly here
        var shipBox = computerBoard.querySelector("div#".concat(coordinate, ".box"));
        shipBox.classList.add("placed");
        shipBox.dataset.ship = shipType;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}
module.exports = placePiecesOnComputerBoardFrontEnd;

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
var placePiecesOnComputerBoardFrontEnd = __webpack_require__(/*! ./placePiecesOnComputerBoardFrontEnd */ "./placePiecesOnComputerBoardFrontEnd.js");

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
var computer = currentGame.computer;
computer.placeAllShipsForAI();
console.log(computer.gameBoard.ship);
console.log(computer.gameBoard.ship["Carrier"].coordinates);
var board2 = createGameBoard(currentGame.computer);
leftGameScreen.appendChild(pieces);
leftGameScreen.appendChild(currentShipOrientation);
leftGameScreen.appendChild(shipPositionSwitcher);
gameScreen.appendChild(board1);
// gameScreen.appendChild(gameStart);
gameScreen.appendChild(board2);
placePiecesOnComputerBoardFrontEnd(computer);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNu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SSxDQUFDLFNBQVMsQ0FBQyxDQUFDUyxXQUFXLENBQUM7QUFFM0QsSUFBSWtRLE1BQU0sR0FBR3ZNLGVBQWUsQ0FBQ2dNLFdBQVcsQ0FBQy9FLFFBQVEsQ0FBQztBQUtsRDRELGNBQWMsQ0FBQzFPLFdBQVcsQ0FBQ2tRLE1BQU0sQ0FBQztBQUNsQ3hCLGNBQWMsQ0FBQzFPLFdBQVcsQ0FBQ2lRLHNCQUFzQixDQUFDO0FBQ2xEdkIsY0FBYyxDQUFDMU8sV0FBVyxDQUFDd08sb0JBQW9CLENBQUM7QUFDaER3QixVQUFVLENBQUNoUSxXQUFXLENBQUNtUSxNQUFNLENBQUM7QUFDOUI7QUFDQUgsVUFBVSxDQUFDaFEsV0FBVyxDQUFDb1EsTUFBTSxDQUFDO0FBQzlCekQsa0NBQWtDLENBQUM3QixRQUFRLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcFBpZWNlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZUdhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZVN0YXJ0QnV0dG9uLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGFjZVBpZWNlc09uQ29tcHV0ZXJCb2FyZEZyb250RW5kLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vcG9zaXRpb25Td2l0Y2hlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi91cGRhdGVDdXJyZW50UGhhc2UuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuY3NzP2UwZmUiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2JhdHRsZXNoaXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRyYWdEYXRhID0ge1xyXG4gICAgZHJhZ2dlZFNoaXA6IG51bGxcclxufTtcclxuXHJcbmZ1bmN0aW9uIGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBvcmllbnRhdGlvbikge1xyXG4gICAgbGV0IHBpZWNlc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgYm94V2lkdGggPSA1MDtcclxuICAgIGxldCBib3hIZWlnaHQgPSA0ODtcclxuICAgIGxldCBpc1ZlcnRpY2FsID0gb3JpZW50YXRpb24gPT09IFwiVmVydGljYWxcIjtcclxuXHJcbiAgICBwaWVjZXNDb250YWluZXIuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxQaWVjZXNDb250YWluZXJcIiA6IFwicGllY2VzQ29udGFpbmVyXCI7XHJcblxyXG4gICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gcGxheWVyLmdhbWVCb2FyZC5zaGlwKSB7XHJcbiAgICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xyXG4gICAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsU2hpcENvbnRhaW5lclwiIDogXCJzaGlwQ29udGFpbmVyXCI7XHJcbiAgICBcclxuICAgICAgICBsZXQgc2hpcFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwVGl0bGUuY2xhc3NOYW1lID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxTaGlwTmFtZVwiIDogXCJzaGlwTmFtZVwiO1xyXG4gICAgICAgIHNoaXBUaXRsZS50ZXh0Q29udGVudCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiOlwiO1xyXG4gICAgXHJcbiAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpOyAvLyBBZGQgdGhlIHNoaXBUaXRsZSBmaXJzdCBcclxuICAgIFxyXG4gICAgICAgIGxldCBzaGlwUGllY2U7XHJcbiAgICBcclxuICAgICAgICBpZiAocGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGFjZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBwbGFjZWREaXYuY2xhc3NOYW1lID0gXCJwbGFjZWRUZXh0XCI7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XHJcbiAgICAgICAgICAgIHBsYWNlZERpdi5pZCA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJmbGV4LXN0YXJ0XCI7ICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKGlzVmVydGljYWwgPyBcInZlcnRpY2FsRHJhZ2dhYmxlXCIgOiBcImRyYWdnYWJsZVwiKTtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lIDogc2hpcEF0dHJpYnV0ZS5uYW1lO1xyXG4gICAgICAgICAgICBzaGlwUGllY2Uuc3R5bGUud2lkdGggPSBpc1ZlcnRpY2FsID8gYm94V2lkdGggKyBcInB4XCIgOiAoYm94V2lkdGggKiBzaGlwQXR0cmlidXRlLmxlbmd0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSBpc1ZlcnRpY2FsID8gKGJveEhlaWdodCAqIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwicHhcIiA6IGJveEhlaWdodCArIFwicHhcIjtcclxuICAgICAgICAgICAgc2hpcFBpZWNlLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRCb3hPZmZzZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vZmZzZXRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGlwRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzaGlwQXR0cmlidXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwQXR0cmlidXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGNsaWNrZWRCb3hPZmZzZXRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBkcmFnRGF0YS5kcmFnZ2VkU2hpcCA9IHNoaXBEYXRhO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nLCBKU09OLnN0cmluZ2lmeShzaGlwRGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcEhlYWRSZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwSGVhZFwiICsgc2hpcEF0dHJpYnV0ZS5uYW1lKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBQaWVjZVJlY3QgPSBzaGlwUGllY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gc2hpcEhlYWRSZWN0LmxlZnQgLSBzaGlwUGllY2VSZWN0LmxlZnQgKyAoc2hpcEhlYWRSZWN0LndpZHRoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXRZID0gc2hpcEhlYWRSZWN0LnRvcCAtIHNoaXBQaWVjZVJlY3QudG9wICsgKHNoaXBIZWFkUmVjdC5oZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcFBpZWNlLCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBzaGlwQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHNoaXBCb3guY2xhc3NOYW1lID0gXCJzaGlwYm94XCI7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LnN0eWxlLndpZHRoID0gYm94V2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IGNsaWNrZWQ6XCIsIGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcFBpZWNlLnNldEF0dHJpYnV0ZShcImRhdGEtb2Zmc2V0XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IFwic2hpcEhlYWRcIiArIHNoaXBBdHRyaWJ1dGUubmFtZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJveC5pZCA9IHNoaXBBdHRyaWJ1dGUubmFtZSArIFwiLVwiICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNoaXBQaWVjZS5hcHBlbmRDaGlsZChzaGlwQm94KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hpcENvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwVGl0bGUpO1xyXG4gICAgICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBwaWVjZXNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcENvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBpZWNlc0NvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7YmF0dGxlc2hpcFBpZWNlcywgZHJhZ0RhdGEgfTsiLCJjb25zdCB7IGRyYWdEYXRhIH0gPSByZXF1aXJlKCcuL2JhdHRsZXNoaXBQaWVjZXMnKTtcclxuXHJcbi8vIGxldCBkcmFnZ2VkU2hpcERhdGEgPSBudWxsOyAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxyXG5cclxuZnVuY3Rpb24gZ2V0QWZmZWN0ZWRCb3hlcyhoZWFkUG9zaXRpb24sIGxlbmd0aCwgb3JpZW50YXRpb24pIHtcclxuICAgIGNvbnN0IGJveGVzID0gW107XHJcbiAgICBjb25zdCBjaGFyUGFydCA9IGhlYWRQb3NpdGlvblswXTtcclxuICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChoZWFkUG9zaXRpb24uc2xpY2UoMSkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgIGJveGVzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhclBhcnQgKyAobnVtUGFydCArIGkpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYm94ZXMucHVzaChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgKyBpKSArIG51bVBhcnQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJveGVzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNWYWxpZFBsYWNlbWVudChib3hJZCwgbGVuZ3RoLCBvZmZzZXQsIG9yaWVudGF0aW9uLCBwbGF5ZXIpIHtcclxuICAgIGNvbnN0IGNoYXJQYXJ0ID0gYm94SWRbMF07XHJcbiAgICBjb25zdCBudW1QYXJ0ID0gcGFyc2VJbnQoYm94SWQuc2xpY2UoMSkpO1xyXG5cclxuICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBvZmZzZXQ7XHJcblxyXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgIHJldHVybiBhZGp1c3RlZE51bVBhcnQgPiAwICYmIGFkanVzdGVkTnVtUGFydCArIGxlbmd0aCAtIDEgPD0gcGxheWVyLmdhbWVCb2FyZC53aWR0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCA+PSAwICYmIGNoYXJQYXJ0LmNoYXJDb2RlQXQoMCkgLSA2NSAtIG9mZnNldCArIGxlbmd0aCA8PSBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgIGxldCBzaGlwT3JpZW50YXRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXNoaXAtb3JpZW50YXRpb25dXCIpO1xyXG4gICAgcmV0dXJuIHNoaXBPcmllbnRhdGlvbkVsZW1lbnQgPyBzaGlwT3JpZW50YXRpb25FbGVtZW50LmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uIDogXCJIb3Jpem9udGFsXCI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmQocGxheWVyKSB7XHJcbiAgICBcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBkaXYgZWxlbWVudHMgZm9yIEdhbWUgQm9hcmRcclxuICAgIGxldCBnYW1lQm9hcmRDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZFRvcENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGFscGhhQ29vcmRpbmF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IG51bWVyaWNDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgXHJcbiAgIFxyXG4gICAgIC8vIEFzc2lnbmluZyBjbGFzc2VzIHRvIHRoZSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgZ2FtZUJvYXJkQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyXCI7XHJcbiAgICAgZ2FtZUJvYXJkVG9wQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIHRvcFwiO1xyXG4gICAgIGdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZENvbnRhaW5lciBib3R0b21cIjtcclxuICAgICBnYW1lQm9hcmQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRcIjtcclxuICAgICBnYW1lQm9hcmQuaWQgPSBwbGF5ZXIubmFtZTsgLy8gQXNzdW1pbmcgdGhlIHBsYXllciBpcyBhIHN0cmluZyBsaWtlIFwicGxheWVyMVwiXHJcbiAgICAgYWxwaGFDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcImFscGhhQ29vcmRpbmF0ZXNcIjtcclxuICAgICBudW1lcmljQ29vcmRpbmF0ZXMuY2xhc3NOYW1lID0gXCJudW1lcmljQ29vcmRpbmF0ZXNcIjtcclxuXHJcbiAgICAgLy8gQ3JlYXRlIGNvbHVtbiB0aXRsZXMgZXF1YWwgdG8gd2lkdGggb2YgYm9hcmRcclxuICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29sdW1uVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbHVtblRpdGxlLnRleHRDb250ZW50ID0gaTtcclxuICAgICAgICBudW1lcmljQ29vcmRpbmF0ZXMuYXBwZW5kQ2hpbGQoY29sdW1uVGl0bGUpO1xyXG4gICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSByb3dzIGFuZCByb3cgdGl0bGVzIGVxdWFsIHRvIGhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuZ2FtZUJvYXJkLmhlaWdodDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA2NSk7XHJcblxyXG4gICAgICAgIGxldCByb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93VGl0bGUudGV4dENvbnRlbnQgPSBhbHBoYUNoYXI7XHJcbiAgICAgICAgYWxwaGFDb29yZGluYXRlcy5hcHBlbmRDaGlsZChyb3dUaXRsZSk7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG4gICAgICAgIHJvdy5pZCA9IGFscGhhQ2hhcjtcclxuXHJcbiAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBbXTtcclxuICAgICAgICBsZXQgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gW107XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBEYXRhID0gZHJhZ0RhdGEuZHJhZ2dlZFNoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBZmZlY3RlZEJveGVzID0gWy4uLmFmZmVjdGVkQm94ZXNdOyAvLyBtYWtlIGEgc2hhbGxvdyBjb3B5ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hpcERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNoaXAgZGF0YSBpcyBudWxsIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCBvdXQgaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBpc1ZhbGlkUGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guaWQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5vZmZzZXQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFBsYWNlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzID0gZ2V0QWZmZWN0ZWRCb3hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5pZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwRGF0YS5sZW5ndGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5kcmFnQWZmZWN0ZWQgPSBcInRydWVcIjsgLy8gQWRkIHRoaXMgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTsgLy8gZGVsYXkgb2YgMCBtcywganVzdCBlbm91Z2ggdG8gbGV0IGRyYWdsZWF2ZSBoYXBwZW4gZmlyc3QgaWYgaXQncyBnb2luZyB0b1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5QWZmZWN0ZWRCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3hbZGF0YS1kcmFnLWFmZmVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNseUFmZmVjdGVkQm94ZXMuZm9yRWFjaChwcmV2Qm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2Qm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCb3gucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWRyYWctYWZmZWN0ZWQnKTsgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGdldEN1cnJlbnRTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlckxldHRlckJvdW5kID0gNjU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXBwZXJMZXR0ZXJCb3VuZCA9IDc0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBib3guaWRbMF07ICAvLyBBc3N1bWluZyB0aGUgZm9ybWF0IGlzIGFsd2F5cyBsaWtlIFwiQTVcIlxyXG4gICAgICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGJveC5pZC5zbGljZSgxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkTnVtUGFydCA9IG51bVBhcnQgLSBzaGlwRGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFRhcmdldFBvc2l0aW9uID0gY2hhclBhcnQgKyBhZGp1c3RlZE51bVBhcnQ7ICAvLyBUaGUgbmV3IHBvc2l0aW9uIGZvciB0aGUgaGVhZCBvZiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgbGV0IGFmZmVjdGVkQm94ZXMgPSBnZXRBZmZlY3RlZEJveGVzKGFkanVzdGVkVGFyZ2V0UG9zaXRpb24sIHNoaXBEYXRhLmxlbmd0aCwgc2hpcE9yaWVudGF0aW9uKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0ZWQgcG9zaXRpb24gYmFzZWQgb24gd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCBvbiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZENvb3JkaW5hdGUgPSAoY2hhclBhcnQgKyBudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDaGFyID0gY2hhclBhcnQuY2hhckNvZGVBdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxhY2VtZW50IGlzIG91dCBvZiBib3VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJIb3Jpem9udGFsXCIgJiYgKGFkanVzdGVkTnVtUGFydCA8PSAwIHx8IGFkanVzdGVkTnVtUGFydCArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiBwbGF5ZXIuZ2FtZUJvYXJkLndpZHRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiICYmIChzZWxlY3RlZENoYXIgKyBzaGlwRGF0YS5sZW5ndGggPCBsb3dlckxldHRlckJvdW5kIHx8IHNlbGVjdGVkQ2hhciArIHNoaXBEYXRhLmxlbmd0aCAtIDEgPiB1cHBlckxldHRlckJvdW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdXQgb2YgYm91bmRzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5uYW1lLCBoZWFkQ29vcmRpbmF0ZSwgc2hpcE9yaWVudGF0aW9uKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHNoaXAgcGxhY2VtZW50OiBPdmVybGFwcGluZyBTaGlwLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZEJveGVzLmZvckVhY2goYm94ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0ZWRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kcmFnLWFmZmVjdGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guZGF0YXNldC5oaXRNYXJrZXIgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5kYXRhc2V0LnNoaXAgPSBzaGlwRGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpc1ZlcnRpY2FsID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hpcEVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gcGxhY2UgJHtzaGlwRGF0YS5uYW1lfSB3aXRoIGxlbmd0aCAke3NoaXBEYXRhLmxlbmd0aH0gYXQgcG9zaXRpb24gJHthZGp1c3RlZFRhcmdldFBvc2l0aW9ufS5gKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PSBcIkhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2IyR7c2hpcERhdGEubmFtZX0uZHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT0gXCJWZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYjdmVydGljYWwke3NoaXBEYXRhLm5hbWV9LnZlcnRpY2FsRHJhZ2dhYmxlLnNoaXBgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFbGVtZW50ID0gc2hpcEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNoaXBFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcGxhY2VkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi5jbGFzc05hbWUgPSBcInBsYWNlZFRleHRcIjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZERpdi50ZXh0Q29udGVudCA9IFwiUGxhY2VkXCI7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWREaXYuaWQgPSBpc1ZlcnRpY2FsID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgZGl2IHRvIHRoZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWREaXYpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiZmxleC1zdGFydFwiO1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IHNoaXBPYmplY3ROYW1lID0gc2hpcERhdGEubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgaGlnaGxpZ2h0XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJldmlvdXNCb3hlcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNCb3hlcyA9IGFmZmVjdGVkQm94ZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghYWZmZWN0ZWRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFmZmVjdGVkQm94ZXMuZm9yRWFjaChib3ggPT4gYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCAoZ2FtZSkge1xyXG4gICAgbGV0IGdhbWVTdGFydENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lU3RhcnRDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lU3RhcnRDb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgc3RhcnRCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3RhcnRCdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJzdGFydEJ1dHRvbkNvbnRhaW5lclwiO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJ1dHRvblxyXG4gICAgbGV0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XHJcbiAgICBzdGFydEJ1dHRvbi5pZCA9IFwiaW5pdFN0YXJ0QnV0dG9uXCI7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbik7XHJcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZ2FtZS5wbGF5ZXIxLmdhbWVCb2FyZC5zaGlwKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhnYW1lLmNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUoKSk7XHJcbiAgICAgICAgaWYgKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFBsYWNlIEFsbCBZb3VyIFNoaXBzIGluIExlZ2FsIFBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpID09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnVlXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSkgXHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBzdGFydEJ1dHRvbkNvbnRhaW5lciB0byB0aGUgbWFpbiBjb250YWluZXJcclxuICAgIGdhbWVTdGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgcmV0dXJuIGdhbWVTdGFydENvbnRhaW5lcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVHYW1lU3RhcnRFbGVtZW50OyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcblxyXG5jbGFzcyBHYW1lYm9hcmQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAxMDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMTA7XHJcbiAgICAgICAgdGhpcy5taXNzQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMubWlzc2VkTW92ZXNBcnJheSA9IFtdO1xyXG4gICAgICAgIHRoaXMuaGl0TW92ZXNBcnJheSA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2hpcCA9IHtcclxuICAgICAgICAgICAgQ2Fycmllcjoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdDYXJyaWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdCYXR0bGVzaGlwJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ3J1aXNlcjoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdDcnVpc2VyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbmV3IFNoaXAoJ1N1Ym1hcmluZScpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIERlc3Ryb3llcjoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdEZXN0cm95ZXInKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9hcmQgPSB0aGlzLnN0YXJ0R2FtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0R2FtZSgpIHtcclxuICAgICAgICBsZXQgYm9hcmQgPSBbXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3cgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goXCJcIilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvYXJkLnB1c2gocm93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGJvYXJkO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFRoaXMgY29kZSByZXR1cm5zIHRoZSBjaGFyIHZhbHVlIGFzIGFuIGludCBzbyBpZiBpdCBpcyAnQicgKG9yICdiJyksIHdlIHdvdWxkIGdldCB0aGUgdmFsdWUgNjYgLSA2NSA9IDEsIGZvciB0aGUgcHVycG9zZSBvZiBvdXIgYXJyYXkgQiBpcyByZXAuIGJ5IGJvYXJkWzFdLlxyXG4gICAgICAgIGNoYXJUb1Jvd0luZGV4KGNoYXIpIHtcclxuICAgICAgICAgICAgY2hhciA9IGNoYXIudG9VcHBlckNhc2UoKTsgLy8gQ29udmVydCB0aGUgY2hhcmFjdGVyIHRvIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICByZXR1cm4gY2hhci5jaGFyQ29kZUF0KDApIC0gJ0EnLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gUmV0dXJucyBhbiBpbnQgYXMgYSBzdHIgd2hlcmUgbnVtYmVycyBmcm9tIDEgdG8gMTAsIHdpbGwgYmUgdW5kZXJzdG9vZCBmb3IgYXJyYXkgYWNjZXNzOiBmcm9tIDAgdG8gOS5cclxuICAgICAgICBzdHJpbmdUb0NvbEluZGV4KHN0cikge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoc3RyKSAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgc2V0QXQoYWxpYXMsIHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IDEwIFxyXG4gICAgICAgICAgICBjb25zdCBudW1QYXJ0ID0gYWxpYXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGdpdmVuIGNvb3JkaW5hdGUgaXMgb3V0IG9mIGJvdW5kcyBsaWtlIEs5IG9yIEMxOFxyXG4gICAgICAgICAgICBpZiAocm93SW5kZXggPCAwIHx8IHJvd0luZGV4ID4gOSB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPiA5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gPSBzdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGVja0F0KGFsaWFzKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxldHRlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gQyBcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmNoYXJUb1Jvd0luZGV4KGNoYXJQYXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLnN0cmluZ1RvQ29sSW5kZXgobnVtUGFydCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSBpbmRpY2VzIGFyZSB2YWxpZFxyXG4gICAgICAgICAgICBpZiAocm93SW5kZXggPCAwIHx8IHJvd0luZGV4ID49IHRoaXMuaGVpZ2h0IHx8IGNvbEluZGV4IDwgMCB8fCBjb2xJbmRleCA+PSB0aGlzLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGUgYWxpYXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID09PSBcIkhpdFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJIaXRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGdpdmVuIGNvb3JkaW5hdGUgaXMgb2NjdXBpZWRcclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0QmVsb3dBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IHBhcnNlSW50KGFsaWFzLnN1YnN0cmluZygxKSwgMTApOyAvLyBDb252ZXJ0IHRoZSBzdHJpbmcgdG8gbnVtYmVyXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgY2hhclBhcnQgdG8gdGhlIG5leHQgbGV0dGVyXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyUGFydC5jaGFyQ29kZUF0KDApICsgMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0FsaWFzID0gbmV4dENoYXIgKyBudW1QYXJ0O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBmb3Igb3V0LW9mLWJvdW5kc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFyVG9Sb3dJbmRleChuZXh0Q2hhcikgPiA5KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyByb3cgYmVsb3cgdGhpcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0FsaWFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXRSaWdodEFsaWFzKGFsaWFzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7IC8vIEVuc3VyZSBpdCdzIGluIHVwcGVyY2FzZVxyXG4gICAgICAgICAgICBsZXQgbnVtUGFydCA9IHBhcnNlSW50KGFsaWFzLnN1YnN0cmluZygxKSwgMTApOyAvLyBDb252ZXJ0IHRoZSBzdHJpbmcgdG8gbnVtYmVyXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEluY3JlYXNlIHRoZSBudW1iZXIgYnkgMVxyXG4gICAgICAgICAgICBudW1QYXJ0Kys7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0FsaWFzID0gY2hhclBhcnQgKyBudW1QYXJ0O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBmb3Igb3V0LW9mLWJvdW5kc1xyXG4gICAgICAgICAgICBpZiAobnVtUGFydCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyBjb2x1bW4gdG8gdGhlIHJpZ2h0IG9mIHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwbGFjZVNoaXAoc2hpcE5hbWUsIHNoaXBIZWFkQ29vcmRpbmF0ZSwgc2hpcE9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBNYXJrZXIgPSBcIlNoaXBcIjtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudENvb3JkaW5hdGUgPSBzaGlwSGVhZENvb3JkaW5hdGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGdldE5leHRDb29yZGluYXRlID0gc2hpcE9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCJcclxuICAgICAgICAgICAgICAgID8gY29vcmRpbmF0ZSA9PiB0aGlzLmdldEJlbG93QWxpYXMoY29vcmRpbmF0ZSlcclxuICAgICAgICAgICAgICAgIDogY29vcmRpbmF0ZSA9PiB0aGlzLmdldFJpZ2h0QWxpYXMoY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHNoaXAgY2FuIGJlIHBsYWNlZFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNoZWNrQXQoY3VycmVudENvb3JkaW5hdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9IFtdOyAvLyBDbGVhciBhbnkgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzLnB1c2goY3VycmVudENvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBzaGlwTGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb29yZGluYXRlID0gZ2V0TmV4dENvb3JkaW5hdGUoY3VycmVudENvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFBsYWNlIHRoZSBzaGlwXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBzaGlwTWFya2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQXQoY29vcmRpbmF0ZSkgPT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBDb29yZGluYXRlcyA9IHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoaXBDb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmhpdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdChjb29yZGluYXRlLCBcIkhpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWlzc0NvdW50ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJNaXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRBbGxTaGlwc1RvRGVhZCgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdhbWVPdmVyKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiB0aGlzLnNoaXApIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAvLyBSZXR1cm4gZmFsc2UgaWYgYW55IHNoaXAgaXMgbm90IGRlYWQuXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGlzcGxheSgpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBoZWFkZXIgd2l0aCBjb2x1bW4gbnVtYmVyc1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gXCIgICAgXCI7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyICs9IGkgKyBcIiBcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhoZWFkZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCByb3cgYW5kIHByaW50IHRoZW1cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGkpICsgXCIgfCBcIjsgLy8gQ29udmVydCByb3cgaW5kZXggdG8gQS1KIGFuZCBhZGQgdGhlIHNlcGFyYXRvclxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBlYWNoIGNlbGwncyB2YWx1ZSBhbmQgZGVjaWRlIHdoYXQgdG8gcHJpbnRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbFZhbHVlID0gdGhpcy5ib2FyZFtpXVtqXTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBEZWNpZGUgdGhlIGNlbGwncyBkaXNwbGF5IGJhc2VkIG9uIGl0cyB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTaGlwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJTIFwiOyAvLyBTIGZvciBTaGlwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhpdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiWCBcIjsgLy8gWCBmb3IgSGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1pc3NcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIk0gXCI7IC8vIE0gZm9yIE1pc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiLSBcIjsgLy8gLSBmb3IgRW1wdHkgQ2VsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocm93U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lYm9hcmQ7IiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpOyAgLy8gQWRqdXN0IHBhdGggYWNjb3JkaW5nbHlcclxuY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJylcclxuXHJcbmNsYXNzIEdhbWUge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZUlkLCBwbGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lSWQgPSBnYW1lSWQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihwbGF5ZXJOYW1lKTtcclxuICAgICAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG4gICAgICAgIHRoaXMucGhhc2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE8tRE8gcHJvbXB0VXNlckNvb3JkaW5hdGUoKSwgcHJvbXB0VXNlck9yaWVudGF0aW9uKCksIGNoZWNrV2lubmVyKCk7XHJcblxyXG4gICAgY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2hpcFR5cGVzIGluIHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyMS5nYW1lQm9hcmQuc2hpcFtzaGlwVHlwZXNdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VDb21wdXRlclNoaXAoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAoY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzID09IFwiXCIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKHNoaXBOYW1lLCBjb21wdXRlckNvb3JkaW5hdGUsIGNvbXB1dGVyT3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckNvb3JkaW5hdGUgPSB0aGlzLmNvbXB1dGVyLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlck9yaWVudGF0aW9uID0gdGhpcy5jb21wdXRlci5haVNoaXBPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGlhbGl6ZUdhbWUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJHYW1lIFNldC1VcFwiXHJcbiAgICAgICAgY29uc3Qgc2hpcFR5cGVzID0gW1wiQ2FycmllclwiLCBcIkJhdHRsZXNoaXBcIiwgXCJDcnVpc2VyXCIsIFwiU3VibWFyaW5lXCIsIFwiRGVzdHJveWVyXCJdO1xyXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgcGhhc2UgLSB0ZXN0IG9uIHJhbmRvbSBjb29yZGluYXRlc1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNoaXAgb2Ygc2hpcFR5cGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VQbGF5ZXJTaGlwcyhzaGlwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUNvbXB1dGVyU2hpcChzaGlwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVR1cm4oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSBcIlBsYXllciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWRNb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJNb3ZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZSAoIWlzVmFsaWRNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcHJvbXB0IHVzZXIgZm9yIGNvb3JkaW5hdGVcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvbXB0ID0gXCJBMVwiOyAvLyBIZXJlIHlvdSBtaWdodCB3YW50IHRvIGdldCBhY3R1YWwgaW5wdXQgZnJvbSB0aGUgdXNlci5cclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJNb3ZlID0gcGxheWVyLm1ha2VBdHRhY2socHJvbXB0KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkTW92ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7IC8vIE91dHB1dCB0aGUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBPcHRpb25hbGx5LCB5b3UgY2FuIHByb21wdCB0aGUgdXNlciB3aXRoIGEgbWVzc2FnZSB0byBlbnRlciBhIG5ldyBjb29yZGluYXRlLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHBsYXllck1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJNb3ZlID0gY29tcHV0ZXIubWFrZUF0dGFjayhjb21wdXRlckNob2ljZSlcclxuICAgICAgICAgICAgcGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGNvbXB1dGVyTW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVN0YXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJHYW1lIFNldC1VcFwiKSB7XHJcbiAgICAgICAgICAgIGxldCB0dXJuVmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSkgKyAxO1xyXG4gICAgICAgICAgICBpZiAodHVyblZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIlBsYXllciBNb3ZlXCJcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJDb21wdXRlciBNb3ZlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJQbGF5ZXIgTW92ZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrV2lubmVyKCkge1xyXG4gICAgICAgIGlmIChwbGF5ZXIuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQ29tcHV0ZXIgV2luc1wiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29tcHV0ZXIuZ2FtZUJvYXJkLmdhbWVPdmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUGxheWVyIFdpbnNcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHdoaWxlKCFjaGVja1dpbm5lcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5VHVybigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG5cclxuLy8gLy8gR2V0IHBsYXllciBuYW1lXHJcbi8vIGxldCBuYW1lID0gXCJwbGF5ZXIxXCJcclxuXHJcbi8vIC8vIENyZWF0ZSBwbGF5ZXJzXHJcbmxldCBnYW1lID0gbmV3IEdhbWUobnVsbCwgXCJwbGF5ZXJcIilcclxuXHJcbmNvbnNvbGUubG9nKGdhbWUuY2hlY2tQbGF5ZXJSZWFkeUdhbWVTdGF0ZSgpKVxyXG5cclxuLy8gbGV0IGNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4vLyAgICAgLy8gXCJDYXJyaWVyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkU1XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNhcnJpZXJcIiwgXCJBMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIkJhdHRsZXNoaXBcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiSjdcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQmF0dGxlc2hpcFwiLCBcIkIxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJDcnVpc2VyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkE4XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNydWlzZXJcIiwgXCJGMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIlN1Ym1hcmluZVwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkQxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkgxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJEZXN0cm95ZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJCMlwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJKMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAvLyBBdHRhY2sgcGhhc2UgXHJcblxyXG4vLyAgICAgLy8gUGxheWVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhcIkExXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG5cclxuLy8gICAgIC8vIENvbXB1dGVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IGNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuIiwiZnVuY3Rpb24gcGxhY2VQaWVjZXNPbkNvbXB1dGVyQm9hcmRGcm9udEVuZChjb21wdXRlcikge1xyXG4gICAgbGV0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbXB1dGVyLmdhbWVCb2FyZFwiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjb21wdXRlckJvYXJkKTtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwVHlwZSBpbiBjb21wdXRlci5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvb3JkaW5hdGUgb2YgY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcFR5cGVdLmNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgICAgIC8vIFVzZSB0aGUgdGVtcGxhdGUgc3RyaW5nIGFuZCBpbnRlcnBvbGF0aW9uIGNvcnJlY3RseSBoZXJlXHJcbiAgICAgICAgICAgIGxldCBzaGlwQm94ID0gY29tcHV0ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBkaXYjJHtjb29yZGluYXRlfS5ib3hgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcclxuICAgICAgICAgICAgc2hpcEJveC5kYXRhc2V0LnNoaXAgPSBzaGlwVHlwZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBsYWNlUGllY2VzT25Db21wdXRlckJvYXJkRnJvbnRFbmQ7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xyXG5cclxuXHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5BaSA9IHRoaXMuaXNBaSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VBdHRhY2soY29vcmRpbmF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRNb3Zlcy5pbmNsdWRlcyhjb29yZGluYXRlKSAmJiAhdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3ZlIGlzIGFscmVhZHkgbWFkZVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3Zlcy5wdXNoKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQWkobmFtZSkge1xyXG4gICAgICAgIGxldCBjaGVjayA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjaGVjayA9PSBcIkNvbXB1dGVyXCIgfHwgY2hlY2sgPT0gXCJBaVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBbGxQb3NzaWJsZU1vdmVzKCkge1xyXG4gICAgICAgIGxldCBhbGxNb3ZlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGNvbHVtbk51bWJlciA9IDA7IGNvbHVtbk51bWJlciA8IHRoaXMuZ2FtZUJvYXJkLndpZHRoOyBjb2x1bW5OdW1iZXIrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3dOdW1iZXIgPSAxOyByb3dOdW1iZXIgPD0gdGhpcy5nYW1lQm9hcmQuaGVpZ2h0OyByb3dOdW1iZXIrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbkFsaWFzID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW5OdW1iZXIgKyA2NSk7XHJcbiAgICAgICAgICAgICAgICBhbGxNb3Zlcy5wdXNoKGNvbHVtbkFsaWFzICsgcm93TnVtYmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsTW92ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZWFzeUFpTW92ZXMoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5BaSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2Nlc3MgdG8gZWFzeUFpTW92ZXMgaXMgcmVzdHJpY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2V0IG9mIGFsbCB1bnBsYXllZCBtb3Zlc1xyXG4gICAgICAgICAgICBsZXQgYWxsUG9zc2libGVNb3ZlcyA9IHRoaXMuZ2V0QWxsUG9zc2libGVNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgdW5wbGF5ZWRNb3ZlcyA9IGFsbFBvc3NpYmxlTW92ZXMuZmlsdGVyKG1vdmUgPT4gIXRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMobW92ZSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHVucGxheWVkIG1vdmVzIGxlZnQsIHJhaXNlIGFuIGVycm9yIG9yIGhhbmRsZSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBpZiAodW5wbGF5ZWRNb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFsbCBtb3ZlcyBoYXZlIGJlZW4gcGxheWVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgbW92ZSBmcm9tIHRoZSBzZXQgb2YgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gdGhpcy5nZXRSYW5kb21JbnQoMCwgdW5wbGF5ZWRNb3Zlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB1bnBsYXllZE1vdmVzW3JhbmRvbUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIGFpU2hpcE9yaWVudGF0aW9uKCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpICsgMTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiSG9yaXpvbnRhbFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlQWxsU2hpcHNGb3JBSSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIHBsYWNlQWxsU2hpcHNGb3JBSSBpcyByZXN0cmljdGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5nYW1lQm9hcmQuc2hpcCkge1xyXG4gICAgICAgICAgICBsZXQgcGxhY2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZSAoIXBsYWNlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0IGEgcmFuZG9tIHN0YXJ0aW5nIGNvb3JkaW5hdGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU1vdmUgPSB0aGlzLmVhc3lBaU1vdmVzKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENob29zZSBhIHJhbmRvbSBvcmllbnRhdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSB0aGlzLmFpU2hpcE9yaWVudGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzaGlwIHdpbGwgZml0IHdpdGhpbiB0aGUgYm91bmRzIGJhc2VkIG9uIGl0cyBzdGFydGluZyBjb29yZGluYXRlLCBvcmllbnRhdGlvbiwgYW5kIGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTaGlwUGxhY2VtZW50VmFsaWQoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYSB2YWxpZCBwbGFjZW1lbnQsIGF0dGVtcHQgdG8gcGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0aGlzLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHJhbmRvbU1vdmUsIG9yaWVudGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcGxhY2VkIG1vdmUgZnJvbSBjb21wbGV0ZWQgbW92ZXMgc28gaXQgY2FuIGJlIHVzZWQgYnkgdGhlIEFJIGR1cmluZyB0aGUgZ2FtZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgc2hpcCB3aWxsIGZpdCB3aXRoaW4gdGhlIGJvYXJkXHJcbiAgICBpc1NoaXBQbGFjZW1lbnRWYWxpZChzaGlwTmFtZSwgc3RhcnRpbmdDb29yZGluYXRlLCBvcmllbnRhdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc3RhcnRpbmdDb29yZGluYXRlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGZvciBvdXQtb2YtYm91bmRzXHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJIb3Jpem9udGFsXCIgJiYgcGFyc2VJbnQoY3VycmVudENvb3JkaW5hdGUuc3Vic3RyaW5nKDEpLCAxMCkgKyBzaGlwTGVuZ3RoID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiICYmIHRoaXMuZ2FtZUJvYXJkLmNoYXJUb1Jvd0luZGV4KGN1cnJlbnRDb29yZGluYXRlLmNoYXJBdCgwKSkgKyBzaGlwTGVuZ3RoID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaSA8IHNoaXBMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IG9yaWVudGF0aW9uID09PSBcIlZlcnRpY2FsXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmdhbWVCb2FyZC5nZXRCZWxvd0FsaWFzKGN1cnJlbnRDb29yZGluYXRlKSBcclxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZ2FtZUJvYXJkLmdldFJpZ2h0QWxpYXMoY3VycmVudENvb3JkaW5hdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIocGxheWVyKSB7XHJcbiAgICBsZXQgc2hpcFBvc2l0aW9uU3dpdGNoZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuY2xhc3NOYW1lID1cInNoaXBQb3NpdGlvblN3aXRjaGVyXCI7XHJcbiAgICBzaGlwUG9zaXRpb25Td2l0Y2hlci5pbm5lclRleHQgPSBcIlN3aXRjaCBPcmllbnRhdGlvblwiXHJcblxyXG4gICAgc2hpcFBvc2l0aW9uU3dpdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudFNoaXBPcmllbnRhdGlvblwiKTtcclxuICAgIGxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbi1MZWZ0XCIpO1xyXG5cclxuXHJcbiAgICBpZiAoc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID09IFwiSG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIGxldCB1cGRhdGVkVmVydEJvYXJkID0gYmF0dGxlc2hpcFBpZWNlcyhwbGF5ZXIsIFwiVmVydGljYWxcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxheWVyLmdhbWVCb2FyZC5zaGlwKVxyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLnJlbW92ZUNoaWxkKGxlZnRHYW1lU2NyZWVuLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIGxlZnRHYW1lU2NyZWVuLmluc2VydEJlZm9yZSh1cGRhdGVkVmVydEJvYXJkLCBsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uID0gXCJIb3Jpem9udGFsXCI7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRIb3JCb2FyZCA9IGJhdHRsZXNoaXBQaWVjZXMocGxheWVyLCBcIkhvcml6b250YWxcIik7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5nYW1lQm9hcmQuc2hpcClcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5yZW1vdmVDaGlsZChsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgICAgICBsZWZ0R2FtZVNjcmVlbi5pbnNlcnRCZWZvcmUodXBkYXRlZEhvckJvYXJkLCBsZWZ0R2FtZVNjcmVlbi5maXJzdENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzaGlwT3JpZW50YXRpb24uaW5uZXJUZXh0ID0gYEN1cnJlbnQgU2hpcCBQb3NpdGlvbiBpczogJHtzaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb259YFxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gc2hpcFBvc2l0aW9uU3dpdGNoZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXI7IiwiXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcclxuICAgICAgICAgICAgQ2FycmllcjogNSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDogNCxcclxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IDIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnNoaXBUeXBlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2V0TGVuZ3RoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExlbmd0aChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY2FwaXRhbGl6ZWRTaGlwTmFtZSA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcclxuICAgICAgICB0aGlzLmlzU3VuaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsImZ1bmN0aW9uIHBoYXNlVXBkYXRlcihnYW1lKSB7XHJcblxyXG4gICAgbGV0IGdhbWVQaGFzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVBoYXNlXCIpO1xyXG4gICAgbGV0IHBsYXllclR1cm4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllclR1cm5cIik7XHJcblxyXG4gICAgaWYgKGdhbWUgPT0gbnVsbCkge1xyXG4gICAgICAgIGdhbWVQaGFzZS50ZXh0Q29udGVudCA9IFwiR2FtZSBJbml0aWFsaXp0aW9uXCJcclxuICAgICAgICBwbGF5ZXJUdXJuLnRleHRDb250ZW50ID0gXCJcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2FtZVBoYXNlLnRleHRDb250ZW50ID0gZ2FtZS5jdXJyZW50U3RhdGU7XHJcbiAgICAgICAgcGxheWVyVHVybi50ZXh0Q29udGVudCA9IGdhbWUuY3VycmVudFR1cm47XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBoYXNlVXBkYXRlcjsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJlZDtcclxufVxyXG5cclxuLmdhbWVIZWFkZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDE1JTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcclxufVxyXG5cclxuI2JhdHRsZXNoaXBUaXRsZSB7XHJcbiAgICBmb250LXNpemU6IHh4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgaGVpZ2h0OiA3MCU7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tdG9wOiAzZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRIZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xyXG59XHJcblxyXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogODUlO1xyXG4gICAgd2lkdGg6IDEwMHZ3O1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5nYW1lU2NyZWVuLUxlZnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMjAlO1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XHJcbn1cclxuXHJcbi5jdXJyZW50U2hpcE9yaWVudGF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxufVxyXG5cclxuXHJcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDgwJTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyMiwgMzksIDE4OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgaGVpZ2h0OiA1JTtcclxufVxyXG5cclxuXHJcbi5udW1lcmljQ29vcmRpbmF0ZXMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMWVtO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcclxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGhlaWdodDogOTAlO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcclxufVxyXG5cclxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xyXG4gICAgbWFyZ2luLXRvcDogMC4yNWVtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiA1MDBweDtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgLyogbWFyZ2luLWJvdHRvbTogN2VtOyAqL1xyXG59XHJcblxyXG4ucm93LCAuc2hpcCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnNoaXAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uYm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5oaWdobGlnaHQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xyXG59XHJcblxyXG4ucGxhY2VkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjAsIDYxLCAxNzMsIDAuNCk7IC8qIFNlbWktdHJhbnNwYXJlbnQgYmxhY2suIEFkanVzdCBhcyBuZWVkZWQuICovXHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcclxufVxyXG5cclxuLnNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIG1hcmdpbi10b3A6IDFlbTtcclxufVxyXG5cclxuLnNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnBsYWNlZFRleHQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGNvbG9yOiBncmVlbnllbGxvdztcclxufVxyXG5cclxuLnBsYWNlZFRleHQjaG9yaXpvbnRhbCB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XHJcbn1cclxuXHJcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zaXplOiBsYXJnZTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogNjB2aDtcclxuICAgIHdpZHRoOiA2MHZ3O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5nYW1lU3RhcnRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgICBoZWlnaHQ6IDIwMHB4O1xyXG4gICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIFxyXG59XHJcblxyXG4ucGxheWVySW5wdXROYW1lTGFiZWwge1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuLnBsYXllcklucHV0TmFtZSB7XHJcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbiAgICB3aWR0aDogNjAlO1xyXG4gICAgZm9udC1zaXplOiA0MHB4O1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+ICNlYXN5LCAjaGFyZCB7XHJcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcclxufVxyXG5cclxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcclxuICAgIG1hcmdpbi1yaWdodDogOGVtO1xyXG59XHJcblxyXG4jaW5pdFBsYWNlQnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1NiwgMTcsIDE5NCk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxufVxyXG5cclxuI2luaXRQbGFjZUJ1dHRvbjpob3ZlciB7XHJcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk0LCAyNywgMjcpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59XHJcblxyXG4udmVydGljYWxQaWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMzUwcHg7XHJcbiAgICB3aWR0aDogNDI1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDMuNWVtO1xyXG59XHJcblxyXG4udmVydGljYWxEcmFnZ2FibGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbn1cclxuXHJcbi52ZXJ0aWNhbFNoaXBOYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxufVxyXG5cclxuXHJcbi52ZXJ0aWNhbFNoaXBDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uc2hpcGJveCwgLnZlcnRpY2FsU2hpcGJveCB7IFxyXG4gICAgaGVpZ2h0OiA0OHB4OyAgLyogYWRqdXN0IHRoaXMgYXMgcGVyIHlvdXIgZGVzaWduICovXHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7IC8qIGZvciB2aXN1YWxpemF0aW9uICovXHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiB0byBlbnN1cmUgYm9yZGVyIGRvZXNuJ3QgYWRkIHRvIHdpZHRoL2hlaWdodCAqL1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLG1CQUFtQjtJQUNuQixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFVBQVU7SUFDVixXQUFXO0lBQ1gsc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixVQUFVO0lBQ1YsV0FBVztJQUNYLDRCQUE0QjtJQUM1QixlQUFlO0FBQ25COztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIs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QUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGtDQUFrQztJQUNsQyxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGtDQUFrQztJQUNsQyxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7QUFDdkU7O0FBRUE7SUFDSSxlQUFlO0lBQ2Ysa0JBQWtCO0FBQ3RCOzs7QUFHQTtJQUNJLGFBQWE7SUFDYixzQkFBc0IsR0FBRywwQ0FBMEM7SUFDbkUsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksWUFBWSxHQUFHLG1DQUFtQztJQUNsRCxXQUFXO0lBQ1gsc0JBQXNCLEVBQUUsc0JBQXNCO0lBQzlDLHNCQUFzQixFQUFFLGlEQUFpRDtBQUM3RVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUhlYWRlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDE1JTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDQ3LCAwLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4jYmF0dGxlc2hpcFRpdGxlIHtcXHJcXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXRlQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgd2lkdGg6IDIwJTtcXHJcXG4gICAgaGVpZ2h0OiA3MCU7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQ29udGVudENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlckNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLXRvcDogM2VtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUJvYXJkSGVhZGVyIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVNjcmVlbkNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDg1JTtcXHJcXG4gICAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMzEsIDE0NywgMTU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW4tTGVmdCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudFNoaXBPcmllbnRhdGlvbiB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiA4MCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5zaGlwUG9zaXRpb25Td2l0Y2hlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDgwJTtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjIsIDM5LCAxODkpO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubnVtZXJpY0Nvb3JkaW5hdGVzIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi10b3A6IDFlbTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyA+IGRpdntcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIGhlaWdodDogOTAlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBmb250LXNpemU6IDM2cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMC41ZW07XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XFxyXFxuICAgIG1hcmdpbi10b3A6IDAuMjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogNTAwcHg7XFxyXFxuICAgIHdpZHRoOiA1MDBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIC8qIG1hcmdpbi1ib3R0b206IDdlbTsgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnJvdywgLnNoaXAge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5zaGlwIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxZW07XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmJveCB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLmJveDpob3ZlciB7XFxyXFxuICAgIHdpZHRoOiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uaGlnaGxpZ2h0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiBTZW1pLXRyYW5zcGFyZW50IGJsYWNrLiBBZGp1c3QgYXMgbmVlZGVkLiAqL1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyMCwgNjEsIDE3MywgMC40KTsgLyogU2VtaS10cmFuc3BhcmVudCBibGFjay4gQWRqdXN0IGFzIG5lZWRlZC4gKi9cXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZFJlc3VsdENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbiAgICBoZWlnaHQ6IDUlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDgzLCAxODAsIDU5KTtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogNGVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGllY2VzQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgaGVpZ2h0OiAzNTBweDtcXHJcXG4gICAgd2lkdGg6IDQyNXB4O1xcclxcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXHJcXG4gICAgbWFyZ2luLXRvcDogMy41ZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnNoaXBib3gge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgY29sb3I6IGdyZWVueWVsbG93O1xcclxcbn1cXHJcXG5cXHJcXG4ucGxhY2VkVGV4dCNob3Jpem9udGFsIHtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBtYXJnaW4tbGVmdDogMS41ZW07XFxyXFxufVxcclxcblxcclxcbi5wbGFjZWRUZXh0I3ZlcnRpY2FsIHtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBmb250LXNpemU6IGxhcmdlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUluaXRpYWxpemVyQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogNjB2aDtcXHJcXG4gICAgd2lkdGg6IDYwdnc7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZVN0YXJ0Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICAgIGhlaWdodDogMjAwcHg7XFxyXFxuICAgIHdpZHRoOiAyMDBweDtcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJOYW1lQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gICAgXFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWVMYWJlbCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXJJbnB1dE5hbWUge1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7ICAgIFxcclxcbiAgICBtYXJnaW4tdG9wOiAwLjVlbTtcXHJcXG4gICAgd2lkdGg6IDYwJTtcXHJcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcclxcbiAgICBtYXJnaW4tbGVmdDogMTJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA+IGxhYmVsIHtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiA4ZW07XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b24ge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTYsIDE3LCAxOTQpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxufVxcclxcblxcclxcbiNpbml0UGxhY2VCdXR0b246aG92ZXIge1xcclxcbiAgICBjb2xvcjogcmdiKDIzOCwgMjU1LCAwKTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTQsIDI3LCAyNyk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxyXFxufVxcclxcblxcclxcbi52ZXJ0aWNhbFBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgICBoZWlnaHQ6IDM1MHB4O1xcclxcbiAgICB3aWR0aDogNDI1cHg7XFxyXFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsRHJhZ2dhYmxlIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgIC8qIHRoaXMgc3RhY2tzIHRoZSBzaGlwIGJveGVzIHZlcnRpY2FsbHkgKi9cXHJcXG59XFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcE5hbWUge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnZlcnRpY2FsU2hpcENvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAvKiB0aGlzIHN0YWNrcyB0aGUgc2hpcCBib3hlcyB2ZXJ0aWNhbGx5ICovXFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5zaGlwYm94LCAudmVydGljYWxTaGlwYm94IHsgXFxyXFxuICAgIGhlaWdodDogNDhweDsgIC8qIGFkanVzdCB0aGlzIGFzIHBlciB5b3VyIGRlc2lnbiAqL1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwMDsgLyogZm9yIHZpc3VhbGl6YXRpb24gKi9cXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogdG8gZW5zdXJlIGJvcmRlciBkb2Vzbid0IGFkZCB0byB3aWR0aC9oZWlnaHQgKi9cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVzaGlwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XHJcbmNvbnN0IHtiYXR0bGVzaGlwUGllY2VzfSA9IHJlcXVpcmUoJy4vYmF0dGxlc2hpcFBpZWNlcycpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlU3RhcnRCdXR0b24nKTtcclxuY29uc3QgY3JlYXRlU2hpcFBvc2l0aW9uU3dpdGNoZXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvblN3aXRjaGVyXCIpXHJcbmNvbnN0IHBoYXNlVXBkYXRlciA9IHJlcXVpcmUoJy4vdXBkYXRlQ3VycmVudFBoYXNlJyk7XHJcbmNvbnN0IHBsYWNlUGllY2VzT25Db21wdXRlckJvYXJkRnJvbnRFbmQgPSByZXF1aXJlKCcuL3BsYWNlUGllY2VzT25Db21wdXRlckJvYXJkRnJvbnRFbmQnKVxyXG5pbXBvcnQgJy4vYmF0dGxlc2hpcC5jc3MnO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xyXG4gICAgY29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcblxyXG5sZXQgcGxheWVyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwbGF5ZXJOYW1lJyk7XHJcbmxldCBjdXJyZW50R2FtZSA9IG5ldyBHYW1lIChnZW5lcmF0ZVJhbmRvbVN0cmluZygpLCBwbGF5ZXJOYW1lKVxyXG5jdXJyZW50R2FtZS5jdXJyZW50U3RhdGUgPSBcIkdhbWUgU2V0LVVwXCI7XHJcbmxldCBjdXJyZW50UGxheWVyID0gY3VycmVudEdhbWUucGxheWVyMTtcclxuXHJcbnBoYXNlVXBkYXRlcihjdXJyZW50R2FtZSk7XHJcblxyXG5sZXQgZ2FtZVN0YXJ0ID0gY3JlYXRlR2FtZVN0YXJ0RWxlbWVudChjdXJyZW50R2FtZSk7XHJcblxyXG5sZXQgZ2FtZVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVNjcmVlbkNvbnRhaW5lclwiKTtcclxuXHJcbmxldCBsZWZ0R2FtZVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmxlZnRHYW1lU2NyZWVuLmNsYXNzTmFtZT1cImdhbWVTY3JlZW4tTGVmdFwiXHJcblxyXG5sZXQgY3VycmVudFNoaXBPcmllbnRhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uY2xhc3NOYW1lID0gXCJjdXJyZW50U2hpcE9yaWVudGF0aW9uXCI7XHJcbmN1cnJlbnRTaGlwT3JpZW50YXRpb24uZGF0YXNldC5zaGlwT3JpZW50YXRpb24gPSBcIkhvcml6b250YWxcIlxyXG5jdXJyZW50U2hpcE9yaWVudGF0aW9uLmlubmVyVGV4dCA9IGBDdXJyZW50IFNoaXAgUG9zaXRpb24gaXM6ICR7Y3VycmVudFNoaXBPcmllbnRhdGlvbi5kYXRhc2V0LnNoaXBPcmllbnRhdGlvbn1gXHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQobGVmdEdhbWVTY3JlZW4pO1xyXG5cclxubGV0IHBpZWNlcyA9IGJhdHRsZXNoaXBQaWVjZXMoY3VycmVudFBsYXllciwgXCJIb3Jpem9udGFsXCIpO1xyXG5sZWZ0R2FtZVNjcmVlbi5hcHBlbmRDaGlsZChwaWVjZXMpO1xyXG5cclxuXHJcbmxldCBzaGlwUG9zaXRpb25Td2l0Y2hlciA9IGNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyKGN1cnJlbnRQbGF5ZXIpO1xyXG5cclxubGV0IGJvYXJkMSA9IGNyZWF0ZUdhbWVCb2FyZChjdXJyZW50UGxheWVyLCBjdXJyZW50U2hpcE9yaWVudGF0aW9uLmRhdGFzZXQuc2hpcE9yaWVudGF0aW9uKTtcclxuXHJcbmxldCBjb21wdXRlciA9IGN1cnJlbnRHYW1lLmNvbXB1dGVyO1xyXG5jb21wdXRlci5wbGFjZUFsbFNoaXBzRm9yQUkoKVxyXG5cclxuY29uc29sZS5sb2coY29tcHV0ZXIuZ2FtZUJvYXJkLnNoaXApXHJcbmNvbnNvbGUubG9nKGNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwW1wiQ2FycmllclwiXS5jb29yZGluYXRlcylcclxuXHJcbmxldCBib2FyZDIgPSBjcmVhdGVHYW1lQm9hcmQoY3VycmVudEdhbWUuY29tcHV0ZXIpO1xyXG5cclxuXHJcblxyXG5cclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQocGllY2VzKTtcclxubGVmdEdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoY3VycmVudFNoaXBPcmllbnRhdGlvbik7XHJcbmxlZnRHYW1lU2NyZWVuLmFwcGVuZENoaWxkKHNoaXBQb3NpdGlvblN3aXRjaGVyKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG4vLyBnYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVTdGFydCk7XHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQoYm9hcmQyKTtcclxucGxhY2VQaWVjZXNPbkNvbXB1dGVyQm9hcmRGcm9udEVuZChjb21wdXRlcilcclxuXHJcbiJdLCJuYW1lcyI6WyJkcmFnRGF0YSIsImRyYWdnZWRTaGlwIiwiYmF0dGxlc2hpcFBpZWNlcyIsInBsYXllciIsIm9yaWVudGF0aW9uIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJpc1ZlcnRpY2FsIiwiY2xhc3NOYW1lIiwiX2xvb3AiLCJzaGlwQXR0cmlidXRlIiwiZ2FtZUJvYXJkIiwic2hpcCIsInNoaXBOYW1lIiwiaW5zdGFuY2UiLCJzaGlwQ29udGFpbmVyIiwic2hpcFRpdGxlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwiYXBwZW5kQ2hpbGQiLCJzaGlwUGllY2UiLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInBsYWNlZERpdiIsImlkIiwic3R5bGUiLCJqdXN0aWZ5Q29udGVudCIsImNsYXNzTGlzdCIsImFkZCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhZ2dhYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiY2xpY2tlZEJveE9mZnNldCIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInNoaXBEYXRhIiwib2Zmc2V0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzaGlwSGVhZFJlY3QiLCJnZXRFbGVtZW50QnlJZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNoaXBQaWVjZVJlY3QiLCJvZmZzZXRYIiwibGVmdCIsIm9mZnNldFkiLCJ0b3AiLCJzZXREcmFnSW1hZ2UiLCJpIiwic2hpcEJveCIsImNvbnNvbGUiLCJsb2ciLCJzZXRBdHRyaWJ1dGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiX3JlcXVpcmUiLCJyZXF1aXJlIiwiZ2V0QWZmZWN0ZWRCb3hlcyIsImhlYWRQb3NpdGlvbiIsImJveGVzIiwiY2hhclBhcnQiLCJudW1QYXJ0IiwicGFyc2VJbnQiLCJzbGljZSIsInB1c2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiaXNWYWxpZFBsYWNlbWVudCIsImJveElkIiwiYWRqdXN0ZWROdW1QYXJ0IiwiZ2V0Q3VycmVudFNoaXBPcmllbnRhdGlvbiIsInNoaXBPcmllbnRhdGlvbkVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZGF0YXNldCIsInNoaXBPcmllbnRhdGlvbiIsImNyZWF0ZUdhbWVCb2FyZCIsImdhbWVCb2FyZENvbXBvbmVudCIsImdhbWVCb2FyZFRvcENvbXBvbmVudCIsImdhbWVCb2FyZEJvdHRvbUNvbXBvbmVudCIsImFscGhhQ29vcmRpbmF0ZXMiLCJudW1lcmljQ29vcmRpbmF0ZXMiLCJjb2x1bW5UaXRsZSIsImFscGhhQ2hhciIsInJvd1RpdGxlIiwicm93IiwiYWZmZWN0ZWRCb3hlcyIsInByZXZpb3VzQWZmZWN0ZWRCb3hlcyIsIl9sb29wMiIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJlcnJvciIsInZhbGlkUGxhY2VtZW50IiwiZm9yRWFjaCIsImRyYWdBZmZlY3RlZCIsInByZXZpb3VzbHlBZmZlY3RlZEJveGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZCb3giLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJsb3dlckxldHRlckJvdW5kIiwidXBwZXJMZXR0ZXJCb3VuZCIsInBhcnNlIiwiZ2V0RGF0YSIsImFkanVzdGVkVGFyZ2V0UG9zaXRpb24iLCJoZWFkQ29vcmRpbmF0ZSIsInNlbGVjdGVkQ2hhciIsInBsYWNlU2hpcCIsImhpdE1hcmtlciIsInNoaXBFbGVtZW50IiwiY29uY2F0IiwicGFyZW50RWxlbWVudCIsInByZXZpb3VzQm94ZXMiLCJHYW1lIiwiY3JlYXRlR2FtZVN0YXJ0RWxlbWVudCIsImdhbWUiLCJnYW1lU3RhcnRDb250YWluZXIiLCJzdGFydEJ1dHRvbkNvbnRhaW5lciIsInN0YXJ0QnV0dG9uIiwicGxheWVyMSIsImNoZWNrUGxheWVyUmVhZHlHYW1lU3RhdGUiLCJhbGVydCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJfY2xhc3NDYWxsQ2hlY2siLCJtaXNzQ291bnQiLCJtaXNzZWRNb3Zlc0FycmF5IiwiaGl0TW92ZXNBcnJheSIsIkNhcnJpZXIiLCJCYXR0bGVzaGlwIiwiQ3J1aXNlciIsIlN1Ym1hcmluZSIsIkRlc3Ryb3llciIsImJvYXJkIiwic3RhcnRHYW1lIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJjaGFyVG9Sb3dJbmRleCIsImNoYXIiLCJ0b1VwcGVyQ2FzZSIsInN0cmluZ1RvQ29sSW5kZXgiLCJzdHIiLCJzZXRBdCIsImFsaWFzIiwic3RyaW5nIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwicm93SW5kZXgiLCJjb2xJbmRleCIsImNoZWNrQXQiLCJFcnJvciIsImdldEJlbG93QWxpYXMiLCJuZXh0Q2hhciIsIm5ld0FsaWFzIiwiZ2V0UmlnaHRBbGlhcyIsInNoaXBIZWFkQ29vcmRpbmF0ZSIsIl90aGlzIiwic2hpcE1hcmtlciIsInNoaXBMZW5ndGgiLCJjdXJyZW50Q29vcmRpbmF0ZSIsImdldE5leHRDb29yZGluYXRlIiwiY29vcmRpbmF0ZSIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJlcnIiLCJlIiwiZiIsInJlY2VpdmVBdHRhY2siLCJzaGlwQ29vcmRpbmF0ZXMiLCJpbmNsdWRlcyIsImhpdCIsInNldEFsbFNoaXBzVG9EZWFkIiwiaXNEZWFkIiwiZ2FtZU92ZXIiLCJkaXNwbGF5IiwiaGVhZGVyIiwicm93U3RyaW5nIiwiY2VsbFZhbHVlIiwiUGxheWVyIiwiZ2FtZUlkIiwicGxheWVyTmFtZSIsImNvbXB1dGVyIiwicGhhc2VDb3VudGVyIiwiY3VycmVudFN0YXRlIiwiY3VycmVudFR1cm4iLCJzaGlwVHlwZXMiLCJwbGFjZUNvbXB1dGVyU2hpcCIsImNvbXB1dGVyQ29vcmRpbmF0ZSIsImVhc3lBaU1vdmVzIiwiY29tcHV0ZXJPcmllbnRhdGlvbiIsImFpU2hpcE9yaWVudGF0aW9uIiwiaW50aWFsaXplR2FtZSIsIl9pIiwiX3NoaXBUeXBlcyIsInBsYWNlUGxheWVyU2hpcHMiLCJzdGFydCIsInBsYXlUdXJuIiwiaXNWYWxpZE1vdmUiLCJwbGF5ZXJNb3ZlIiwicHJvbXB0IiwibWFrZUF0dGFjayIsIm1lc3NhZ2UiLCJjb21wdXRlckNob2ljZSIsImNvbXB1dGVyTW92ZSIsInVwZGF0ZVN0YXRlIiwidHVyblZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2hlY2tXaW5uZXIiLCJwbGFjZVBpZWNlc09uQ29tcHV0ZXJCb2FyZEZyb250RW5kIiwiY29tcHV0ZXJCb2FyZCIsInNoaXBUeXBlIiwiQWkiLCJpc0FpIiwiY29tcGxldGVkTW92ZXMiLCJjYXBpdGFsaXplRmlyc3QiLCJ0b0xvd2VyQ2FzZSIsImNoZWNrIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiZ2V0QWxsUG9zc2libGVNb3ZlcyIsImFsbE1vdmVzIiwiY29sdW1uTnVtYmVyIiwicm93TnVtYmVyIiwiY29sdW1uQWxpYXMiLCJhbGxQb3NzaWJsZU1vdmVzIiwidW5wbGF5ZWRNb3ZlcyIsImZpbHRlciIsIm1vdmUiLCJyYW5kb21JbmRleCIsInBsYWNlQWxsU2hpcHNGb3JBSSIsInBsYWNlZCIsInJhbmRvbU1vdmUiLCJpc1NoaXBQbGFjZW1lbnRWYWxpZCIsInBvcCIsInN0YXJ0aW5nQ29vcmRpbmF0ZSIsImNyZWF0ZVNoaXBQb3NpdGlvblN3aXRjaGVyIiwic2hpcFBvc2l0aW9uU3dpdGNoZXIiLCJpbm5lclRleHQiLCJsZWZ0R2FtZVNjcmVlbiIsInVwZGF0ZWRWZXJ0Qm9hcmQiLCJyZW1vdmVDaGlsZCIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJ1cGRhdGVkSG9yQm9hcmQiLCJpc1ZhbGlkIiwic2V0TGVuZ3RoIiwiaGl0Q291bnQiLCJjYXBpdGFsaXplZFNoaXBOYW1lIiwiaXNTdW5rIiwicGhhc2VVcGRhdGVyIiwiZ2FtZVBoYXNlIiwicGxheWVyVHVybiIsImdlbmVyYXRlUmFuZG9tU3RyaW5nIiwiY2hhcmFjdGVycyIsInJlc3VsdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJjdXJyZW50R2FtZSIsImN1cnJlbnRQbGF5ZXIiLCJnYW1lU3RhcnQiLCJnYW1lU2NyZWVuIiwiY3VycmVudFNoaXBPcmllbnRhdGlvbiIsInBpZWNlcyIsImJvYXJkMSIsImJvYXJkMiJdLCJzb3VyY2VSb290IjoiIn0=