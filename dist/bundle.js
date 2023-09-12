/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./battleshipPieces.js":
/*!*****************************!*\
  !*** ./battleshipPieces.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Player = __webpack_require__(/*! ./player */ "./player.js");
function battleshipPieces(player) {
  var piecesContainer = document.createElement("div");
  piecesContainer.className = "piecesContainer";
  var boxWidth = 50;
  var boxHeight = 50;
  for (var shipName in player.gameBoard.ship) {
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
      event.dataTransfer.setData("text", event.target.id);
    });
    for (var i = 0; i < shipAttribute.length; i++) {
      var shipBox = document.createElement("div");
      shipBox.className = "shipbox";
      shipBox.style.width = 100 / shipAttribute.length + "%";
      shipPiece.appendChild(shipBox);
    }
    shipContainer.appendChild(shipTitle);
    shipContainer.appendChild(shipPiece);
    piecesContainer.appendChild(shipContainer);
  }
  return piecesContainer;
}
module.exports = battleshipPieces;

/***/ }),

/***/ "./createGameBoard.js":
/*!****************************!*\
  !*** ./createGameBoard.js ***!
  \****************************/
/***/ ((module) => {

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
  for (var _i = 0; _i < player.gameBoard.height; _i++) {
    var alphaChar = String.fromCharCode(_i + 65);
    var rowTitle = document.createElement("div");
    rowTitle.textContent = alphaChar;
    alphaCoordinates.appendChild(rowTitle);
    var row = document.createElement("div");
    row.className = "row";
    row.id = alphaChar;

    // Generate coordinate columns for each row
    var _loop = function _loop() {
      var box = document.createElement("div");
      box.className = "box";
      box.id = alphaChar + j;
      box.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      box.addEventListener('drop', function (event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var droppedShip = document.getElementById(data);
        if (canPlaceShip(droppedShip, box)) {
          // Assuming you have a function to check if the ship can be placed.
          box.appendChild(droppedShip);
          // Any additional logic for updating your game state goes here
        } else {
          alert("Cannot place the ship here!");
        }
      });
      row.appendChild(box);
    };
    for (var j = 1; j <= player.gameBoard.width; j++) {
      _loop();
    }
    gameBoard.appendChild(row);
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
}

.box {
    width: 50px;
    border: 1px solid black;
}

.box:hover {
    width: 10%;
    border: 1px solid black;
    background-color: lightgreen;
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
}`, "",{"version":3,"sources":["webpack://./battleship.css"],"names":[],"mappings":"AAAA;IACI,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,YAAY;IACZ,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,mBAAmB;IACnB,6BAA6B;IAC7B,WAAW;IACX,2BAA2B;AAC/B;;AAEA;IACI,mBAAmB;IACnB,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,UAAU;IACV,WAAW;IACX,sBAAsB;IACtB,mBAAmB;IACnB,6BAA6B;IAC7B,kBAAkB;IAClB,YAAY;IACZ,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,6BAA6B;IAC7B,WAAW;IACX,YAAY;IACZ,6BAA6B;AACjC;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;IACV,WAAW;IACX,4BAA4B;IAC5B,eAAe;AACnB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,mBAAmB;IACnB,6BAA6B;IAC7B,WAAW;IACX,YAAY;IACZ,6BAA6B;AACjC;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,YAAY;AAChB;;;AAGA;IACI,aAAa;IACb,mBAAmB;IACnB,UAAU;AACd;;;AAGA;IACI,aAAa;IACb,mBAAmB;IACnB,mBAAmB;IACnB,8BAA8B;IAC9B,eAAe;IACf,eAAe;IACf,mBAAmB;AACvB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,mBAAmB;IACnB,8BAA8B;IAC9B,WAAW;AACf;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,6BAA6B;IAC7B,eAAe;IACf,mBAAmB;IACnB,oBAAoB;AACxB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,YAAY;IACZ,uBAAuB;IACvB,wBAAwB;AAC5B;;AAEA;IACI,aAAa;IACb,WAAW;IACX,uBAAuB;AAC3B;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,WAAW;IACX,uBAAuB;AAC3B;;AAEA;IACI,UAAU;IACV,uBAAuB;IACvB,4BAA4B;AAChC;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;IACV,WAAW;IACX,4BAA4B;IAC5B,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,YAAY;IACZ,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,YAAY;IACZ,WAAW;IACX,mBAAmB;IACnB,8BAA8B;IAC9B,eAAe;AACnB;;AAEA;IACI,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,uBAAuB;IACvB,sCAAsC;IACtC,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,6BAA6B;IAC7B,aAAa;IACb,YAAY;IACZ,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;;AAEvB;;AAEA;IACI,WAAW;IACX,iBAAiB;AACrB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,WAAW;AACf;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,sBAAsB;IACtB,YAAY;IACZ,gBAAgB;IAChB,iBAAiB;AACrB","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.gameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100vh;\r\n    width: 100vw;\r\n    background: red;\r\n}\r\n\r\n.gameHeader {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 15%;\r\n    background: rgb(47, 0, 255);\r\n}\r\n\r\n#battleshipTitle {\r\n    font-size: xx-large;\r\n    color: white;\r\n}\r\n\r\n.gameStateContainer {\r\n    display: flex;\r\n    width: 20%;\r\n    height: 70%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: x-large;\r\n    color: white;\r\n    border: 1px solid black;\r\n}\r\n\r\n.gameContentContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardHeaderContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-top: 3em;\r\n}\r\n\r\n.gameBoardHeader {\r\n    font-size: x-large;\r\n}\r\n\r\n.gameScreenContainer {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 85%;\r\n    width: 100vw;\r\n    background: rgb(31, 147, 155);\r\n}\r\n\r\n.gameBoardContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.gameBoardContainer.top {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 5%;\r\n}\r\n\r\n\r\n.numericCoordinates {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 36px;\r\n    margin-top: 1em;\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.numericCoordinates > div{\r\n    margin-left: 0.85em;\r\n}\r\n\r\n.gameBoardContainer.bottom {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    height: 90%;\r\n}\r\n\r\n.alphaCoordinates {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    font-size: 36px;\r\n    margin-right: 0.5em;\r\n    margin-bottom: 0.2em;\r\n}\r\n\r\n.alphaCoordinates > div {\r\n    margin-top: 0.25em;\r\n}\r\n\r\n.gameBoard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 500px;\r\n    width: 500px;\r\n    border: 1px solid black;\r\n    /* margin-bottom: 7em; */\r\n}\r\n\r\n.row, .ship {\r\n    display: flex;\r\n    height: 10%;\r\n    border: 1px solid black;\r\n}\r\n\r\n.ship {\r\n    margin-right: 1em;\r\n}\r\n\r\n.box {\r\n    width: 50px;\r\n    border: 1px solid black;\r\n}\r\n\r\n.box:hover {\r\n    width: 10%;\r\n    border: 1px solid black;\r\n    background-color: lightgreen;\r\n}\r\n\r\n.gameBoardResultContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 5%;\r\n    width: 100%;\r\n    background: rgb(83, 180, 59);\r\n    margin-bottom: 4em;\r\n}\r\n\r\n.piecesContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 350px;\r\n    width: 425px;\r\n    border: 2px solid black;\r\n}\r\n\r\n.shipContainer {\r\n    display: flex;\r\n    height: 50px;\r\n    width: 100%;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-top: 1em;\r\n}\r\n\r\n.shipName {\r\n    font-size: x-large;\r\n    margin-left: 1em;\r\n}\r\n\r\n.shipbox {\r\n    border: 1px solid green;\r\n    background-color: rgba(0, 128, 0, 0.2); \r\n    height: 100%;\r\n}\r\n\r\n.gameInitializerContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: space-evenly;\r\n    height: 200px;\r\n    width: 200px;\r\n    border: 3px solid black;\r\n}\r\n\r\n.playerNameContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n}\r\n\r\n.playerNameContainer > input {\r\n    height: 50%;    \r\n    margin-top: 0.5em;\r\n}\r\n\r\n.computerDifficultyContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    width: 100%;\r\n}\r\n\r\n.computerDifficultyContainer > #easy, #hard {\r\n    margin-left: 1em;\r\n}\r\n\r\n.computerDifficultyContainer > label {\r\n    margin-right: 1em;\r\n}\r\n\r\n#initStartButton {\r\n    background-color: grey;\r\n    color: white;\r\n    font-weight: 700;\r\n    font-size: larger;\r\n}"],"sourceRoot":""}]);
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
var createGameBoard = __webpack_require__(/*! ./createGameBoard */ "./createGameBoard.js");
var piecesContainer = __webpack_require__(/*! ./battleshipPieces */ "./battleshipPieces.js");
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
var gameInit = createNavUi();
var player1 = new Player();
var newGame = new Game(generateRandomString(), player1);
var gameScreen = document.querySelector(".gameScreenContainer");
var board1 = createGameBoard(newGame.player1);
var pieces = piecesContainer(player1);
var board2 = createGameBoard(newGame.computer);
gameScreen.appendChild(pieces);
gameScreen.appendChild(board1);
gameScreen.appendChild(gameInit);
// gameScreen.appendChild(board2);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxpRkFBaUYsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFB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QUFHLElBQUlsRixJQUFJLENBQUM4RSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUzRSxPQUFPLENBQUM7QUFFdkQsSUFBSWdGLFVBQVUsR0FBR2pOLFFBQVEsQ0FBQ2tOLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztBQUUvRCxJQUFJQyxNQUFNLEdBQUdsTCxlQUFlLENBQUMrSyxPQUFPLENBQUMvRSxPQUFPLENBQUM7QUFDN0MsSUFBSW1GLE1BQU0sR0FBR3JOLGVBQWUsQ0FBQ2tJLE9BQU8sQ0FBQztBQUNyQyxJQUFJb0YsTUFBTSxHQUFHcEwsZUFBZSxDQUFDK0ssT0FBTyxDQUFDOUUsUUFBUSxDQUFDO0FBRzlDK0UsVUFBVSxDQUFDbkwsV0FBVyxDQUFDc0wsTUFBTSxDQUFDO0FBQzlCSCxVQUFVLENBQUNuTCxXQUFXLENBQUNxTCxNQUFNLENBQUM7QUFDOUJGLFVBQVUsQ0FBQ25MLFdBQVcsQ0FBQ2lMLFFBQVEsQ0FBQztBQUNoQyxrQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcFBpZWNlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2NyZWF0ZUdhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL2dhbWVMb29wLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbmF2aWdhdGlvbkNvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zaGlwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vYmF0dGxlc2hpcC5jc3MiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmNzcz9lMGZlIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9iYXR0bGVzaGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XHJcblxyXG5cclxuZnVuY3Rpb24gYmF0dGxlc2hpcFBpZWNlcyAocGxheWVyKSB7XHJcbiAgICBcclxuICAgIGxldCBwaWVjZXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcGllY2VzQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwicGllY2VzQ29udGFpbmVyXCI7XHJcbiAgICBsZXQgYm94V2lkdGggPSA1MDtcclxuICAgIGxldCBib3hIZWlnaHQgPSA1MDtcclxuXHJcbiAgICBmb3IgKGxldCBzaGlwTmFtZSBpbiBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXApIHtcclxuXHJcbiAgICAgICAgbGV0IHNoaXBBdHRyaWJ1dGUgPSBwbGF5ZXIuZ2FtZUJvYXJkLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwic2hpcENvbnRhaW5lclwiO1xyXG4gICAgICAgIGxldCBzaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBUaXRsZS5jbGFzc05hbWUgPSBcInNoaXBOYW1lXCI7XHJcbiAgICAgICAgc2hpcFRpdGxlLnRleHRDb250ZW50ID0gc2hpcEF0dHJpYnV0ZS5uYW1lICsgXCI6XCI7XHJcblxyXG4gICAgICAgIGxldCBzaGlwUGllY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dhYmxlXCIpO1xyXG4gICAgICAgIHNoaXBQaWVjZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICBzaGlwUGllY2UuaWQgPSBzaGlwQXR0cmlidXRlLm5hbWU7XHJcbiAgICAgICAgc2hpcFBpZWNlLnN0eWxlLndpZHRoID0gKGJveFdpZHRoICogc2hpcEF0dHJpYnV0ZS5sZW5ndGgpICsgXCJweFwiO1xyXG4gICAgICAgIHNoaXBQaWVjZS5zdHlsZS5oZWlnaHQgPSAoYm94SGVpZ2h0KSArIFwicHhcIjtcclxuICAgICAgICBzaGlwUGllY2UuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICBzaGlwUGllY2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0XCIsIGV2ZW50LnRhcmdldC5pZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBdHRyaWJ1dGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHNoaXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzaGlwQm94LmNsYXNzTmFtZSA9IFwic2hpcGJveFwiO1xyXG4gICAgICAgICAgICBzaGlwQm94LnN0eWxlLndpZHRoID0gKDEwMCAvIHNoaXBBdHRyaWJ1dGUubGVuZ3RoKSArIFwiJVwiO1xyXG4gICAgICAgICAgICBzaGlwUGllY2UuYXBwZW5kQ2hpbGQoc2hpcEJveCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNoaXBDb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcFRpdGxlKTtcclxuICAgICAgICBzaGlwQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBQaWVjZSk7XHJcbiAgICAgICAgcGllY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBDb250YWluZXIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGllY2VzQ29udGFpbmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJhdHRsZXNoaXBQaWVjZXM7IiwiZnVuY3Rpb24gY3JlYXRlR2FtZUJvYXJkKHBsYXllcikge1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIGRpdiBlbGVtZW50cyBmb3IgR2FtZSBCb2FyZFxyXG4gICAgbGV0IGdhbWVCb2FyZENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZ2FtZUJvYXJkVG9wQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBnYW1lQm9hcmRCb3R0b21Db21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgYWxwaGFDb29yZGluYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgbnVtZXJpY0Nvb3JkaW5hdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBcclxuICAgXHJcbiAgICAgLy8gQXNzaWduaW5nIGNsYXNzZXMgdG8gdGhlIGNyZWF0ZWQgZWxlbWVudHNcclxuICAgICBnYW1lQm9hcmRDb21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXJcIjtcclxuICAgICBnYW1lQm9hcmRUb3BDb21wb25lbnQuY2xhc3NOYW1lID0gXCJnYW1lQm9hcmRDb250YWluZXIgdG9wXCI7XHJcbiAgICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmNsYXNzTmFtZSA9IFwiZ2FtZUJvYXJkQ29udGFpbmVyIGJvdHRvbVwiO1xyXG4gICAgIGdhbWVCb2FyZC5jbGFzc05hbWUgPSBcImdhbWVCb2FyZFwiO1xyXG4gICAgIGdhbWVCb2FyZC5pZCA9IHBsYXllci5uYW1lOyAvLyBBc3N1bWluZyB0aGUgcGxheWVyIGlzIGEgc3RyaW5nIGxpa2UgXCJwbGF5ZXIxXCJcclxuICAgICBhbHBoYUNvb3JkaW5hdGVzLmNsYXNzTmFtZSA9IFwiYWxwaGFDb29yZGluYXRlc1wiO1xyXG4gICAgIG51bWVyaWNDb29yZGluYXRlcy5jbGFzc05hbWUgPSBcIm51bWVyaWNDb29yZGluYXRlc1wiO1xyXG5cclxuICAgICAvLyBDcmVhdGUgY29sdW1uIHRpdGxlcyBlcXVhbCB0byB3aWR0aCBvZiBib2FyZFxyXG4gICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjb2x1bW5UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29sdW1uVGl0bGUudGV4dENvbnRlbnQgPSBpO1xyXG4gICAgICAgIG51bWVyaWNDb29yZGluYXRlcy5hcHBlbmRDaGlsZChjb2x1bW5UaXRsZSk7XHJcbiAgICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZFRvcENvbXBvbmVudC5hcHBlbmRDaGlsZChudW1lcmljQ29vcmRpbmF0ZXMpO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIHJvd3MgYW5kIHJvdyB0aXRsZXMgZXF1YWwgdG8gaGVpZ2h0XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllci5nYW1lQm9hcmQuaGVpZ2h0OyBpKyspIHtcclxuXHJcbiAgICAgICAgbGV0IGFscGhhQ2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDY1KTtcclxuXHJcbiAgICAgICAgbGV0IHJvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3dUaXRsZS50ZXh0Q29udGVudCA9IGFscGhhQ2hhcjtcclxuICAgICAgICBhbHBoYUNvb3JkaW5hdGVzLmFwcGVuZENoaWxkKHJvd1RpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcbiAgICAgICAgcm93LmlkID0gYWxwaGFDaGFyO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgY29vcmRpbmF0ZSBjb2x1bW5zIGZvciBlYWNoIHJvd1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHBsYXllci5nYW1lQm9hcmQud2lkdGg7IGorKykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gXCJib3hcIjtcclxuICAgICAgICAgICAgYm94LmlkID0gYWxwaGFDaGFyICsgalxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRyb3BwZWRTaGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKGNhblBsYWNlU2hpcChkcm9wcGVkU2hpcCwgYm94KSkgeyAvLyBBc3N1bWluZyB5b3UgaGF2ZSBhIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKGRyb3BwZWRTaGlwKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBbnkgYWRkaXRpb25hbCBsb2dpYyBmb3IgdXBkYXRpbmcgeW91ciBnYW1lIHN0YXRlIGdvZXMgaGVyZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNhbm5vdCBwbGFjZSB0aGUgc2hpcCBoZXJlIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGFscGhhQ29vcmRpbmF0ZXMpO1xyXG4gICAgZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29tcG9uZW50LmFwcGVuZENoaWxkKGdhbWVCb2FyZFRvcENvbXBvbmVudCk7XHJcbiAgICBnYW1lQm9hcmRDb21wb25lbnQuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGdhbWVCb2FyZENvbXBvbmVudFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUdhbWVCb2FyZDsiLCJjb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDEwO1xyXG4gICAgICAgIHRoaXMubWlzc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm1pc3NlZE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmhpdE1vdmVzQXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaXAgPSB7XHJcbiAgICAgICAgICAgIENhcnJpZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ2FycmllcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEJhdHRsZXNoaXA6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQmF0dGxlc2hpcCcpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENydWlzZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnQ3J1aXNlcicpLFxyXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFN1Ym1hcmluZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG5ldyBTaGlwKCdTdWJtYXJpbmUnKSxcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBuZXcgU2hpcCgnRGVzdHJveWVyJyksXHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkID0gdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBib2FyZDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBUaGlzIGNvZGUgcmV0dXJucyB0aGUgY2hhciB2YWx1ZSBhcyBhbiBpbnQgc28gaWYgaXQgaXMgJ0InIChvciAnYicpLCB3ZSB3b3VsZCBnZXQgdGhlIHZhbHVlIDY2IC0gNjUgPSAxLCBmb3IgdGhlIHB1cnBvc2Ugb2Ygb3VyIGFycmF5IEIgaXMgcmVwLiBieSBib2FyZFsxXS5cclxuICAgICAgICBjaGFyVG9Sb3dJbmRleChjaGFyKSB7XHJcbiAgICAgICAgICAgIGNoYXIgPSBjaGFyLnRvVXBwZXJDYXNlKCk7IC8vIENvbnZlcnQgdGhlIGNoYXJhY3RlciB0byB1cHBlcmNhc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXIuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIFJldHVybnMgYW4gaW50IGFzIGEgc3RyIHdoZXJlIG51bWJlcnMgZnJvbSAxIHRvIDEwLCB3aWxsIGJlIHVuZGVyc3Rvb2QgZm9yIGFycmF5IGFjY2VzczogZnJvbSAwIHRvIDkuXHJcbiAgICAgICAgc3RyaW5nVG9Db2xJbmRleChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cikgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHNldEF0KGFsaWFzLCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGV0dGVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSBDIFxyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIGZyb20gY2hhciBleDogQzEwIC0gY2hhclBhcnQgPSAxMCBcclxuICAgICAgICAgICAgY29uc3QgbnVtUGFydCA9IGFsaWFzLnN1YnN0cmluZygxKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuY2hhclRvUm93SW5kZXgoY2hhclBhcnQpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xJbmRleCA9IHRoaXMuc3RyaW5nVG9Db2xJbmRleChudW1QYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiBnaXZlbiBjb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHMgbGlrZSBLOSBvciBDMThcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IDkgfHwgY29sSW5kZXggPCAwIHx8IGNvbEluZGV4ID4gOSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3dJbmRleF1bY29sSW5kZXhdID0gc3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tBdChhbGlhcykge1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBsZXR0ZXIgZnJvbSBjaGFyIGV4OiBDMTAgLSBjaGFyUGFydCA9IEMgXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJQYXJ0ID0gYWxpYXMuY2hhckF0KDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBmcm9tIGNoYXIgZXg6IEMxMCAtIGNoYXJQYXJ0ID0gMTAgXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBhbGlhcy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5jaGFyVG9Sb3dJbmRleChjaGFyUGFydCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGhpcy5zdHJpbmdUb0NvbEluZGV4KG51bVBhcnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgaW5kaWNlcyBhcmUgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+PSB0aGlzLmhlaWdodCB8fCBjb2xJbmRleCA8IDAgfHwgY29sSW5kZXggPj0gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlIGFsaWFzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93SW5kZXhdW2NvbEluZGV4XSA9PT0gXCJIaXRcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGl0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBjb29yZGluYXRlIGlzIG9jY3VwaWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd0luZGV4XVtjb2xJbmRleF0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEJlbG93QWxpYXMoYWxpYXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hhclBhcnQgPSBhbGlhcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTsgLy8gRW5zdXJlIGl0J3MgaW4gdXBwZXJjYXNlXHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJQYXJ0IHRvIHRoZSBuZXh0IGxldHRlclxyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhclBhcnQuY2hhckNvZGVBdCgwKSArIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IG5leHRDaGFyICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhclRvUm93SW5kZXgobmV4dENoYXIpID4gOSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm93IGJlbG93IHRoaXMuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBbGlhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0UmlnaHRBbGlhcyhhbGlhcykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFyUGFydCA9IGFsaWFzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpOyAvLyBFbnN1cmUgaXQncyBpbiB1cHBlcmNhc2VcclxuICAgICAgICAgICAgbGV0IG51bVBhcnQgPSBwYXJzZUludChhbGlhcy5zdWJzdHJpbmcoMSksIDEwKTsgLy8gQ29udmVydCB0aGUgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgbnVtYmVyIGJ5IDFcclxuICAgICAgICAgICAgbnVtUGFydCsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXdBbGlhcyA9IGNoYXJQYXJ0ICsgbnVtUGFydDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG91dC1vZi1ib3VuZHNcclxuICAgICAgICAgICAgaWYgKG51bVBhcnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gY29sdW1uIHRvIHRoZSByaWdodCBvZiB0aGlzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QWxpYXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcGxhY2VTaGlwKHNoaXBOYW1lLCBzaGlwSGVhZENvb3JkaW5hdGUsIHNoaXBPcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwTWFya2VyID0gXCJTaGlwXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmluc3RhbmNlLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRDb29yZGluYXRlID0gc2hpcEhlYWRDb29yZGluYXRlO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnZXROZXh0Q29vcmRpbmF0ZSA9IHNoaXBPcmllbnRhdGlvbiA9PT0gXCJWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICA/IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRCZWxvd0FsaWFzKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICA6IGNvb3JkaW5hdGUgPT4gdGhpcy5nZXRSaWdodEFsaWFzKGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGVja0F0KGN1cnJlbnRDb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMgPSBbXTsgLy8gQ2xlYXIgYW55IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcy5wdXNoKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc2hpcExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29vcmRpbmF0ZSA9IGdldE5leHRDb29yZGluYXRlKGN1cnJlbnRDb29yZGluYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb29yZGluYXRlIG9mIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgc2hpcE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFtzaGlwTmFtZV0uY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0F0KGNvb3JkaW5hdGUpID09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSB0aGlzLnNoaXBbc2hpcE5hbWVdLmNvb3JkaW5hdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5oaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXQoY29vcmRpbmF0ZSwgXCJIaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pc3NDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taXNzZWRNb3Zlc0FycmF5LnB1c2goY29vcmRpbmF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0KGNvb3JkaW5hdGUsIFwiTWlzc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0QWxsU2hpcHNUb0RlYWQoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNoaXBOYW1lIGluIHRoaXMuc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwW3NoaXBOYW1lXS5pbnN0YW5jZS5pc0RlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2hpcE5hbWUgaW4gdGhpcy5zaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hpcFtzaGlwTmFtZV0uaW5zdGFuY2UuaXNEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gUmV0dXJuIGZhbHNlIGlmIGFueSBzaGlwIGlzIG5vdCBkZWFkLlxyXG4gICAgICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BsYXkoKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIHdpdGggY29sdW1uIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFwiICAgIFwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlciArPSBpICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaGVhZGVyKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcm93IGFuZCBwcmludCB0aGVtXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSArIFwiIHwgXCI7IC8vIENvbnZlcnQgcm93IGluZGV4IHRvIEEtSiBhbmQgYWRkIHRoZSBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZWFjaCBjZWxsJ3MgdmFsdWUgYW5kIGRlY2lkZSB3aGF0IHRvIHByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxWYWx1ZSA9IHRoaXMuYm9hcmRbaV1bal07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlIHRoZSBjZWxsJ3MgZGlzcGxheSBiYXNlZCBvbiBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93U3RyaW5nICs9IFwiUyBcIjsgLy8gUyBmb3IgU2hpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIaXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIlggXCI7IC8vIFggZm9yIEhpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNaXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dTdHJpbmcgKz0gXCJNIFwiOyAvLyBNIGZvciBNaXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1N0cmluZyArPSBcIi0gXCI7IC8vIC0gZm9yIEVtcHR5IENlbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvd1N0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpXHJcblxyXG5jbGFzcyBHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVJZCwgcGxheWVyTmFtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUlkID0gZ2FtZUlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjb21wdXRlclwiKTtcclxuICAgICAgICB0aGlzLnBoYXNlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPLURPIHByb21wdFVzZXJDb29yZGluYXRlKCksIHByb21wdFVzZXJPcmllbnRhdGlvbigpLCBjaGVja1dpbm5lcigpO1xyXG5cclxuICAgIHBsYWNlUGxheWVyU2hpcHMoc2hpcE5hbWUpIHtcclxuICAgICAgICB3aGlsZSAocGxheWVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vIFByb21wdCBVc2VyIGZvciBzaGlwSGVhZENvb3JkaW5hdGVcclxuICAgICAgICAgICAgbGV0IHVzZXJDb29yZGluYXRlID0gcHJvbXB0VXNlckNvb3JkaW5hdGUoKTtcclxuICAgICAgICAgICAgbGV0IHVzZXJTaGlwT3JpZW50YXRpb24gPSBwcm9tcHRVc2VyT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoc2hpcE5hbWUsIHVzZXJDb29yZGluYXRlLCB1c2VyU2hpcE9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgdXNlckNvb3JkaW5hdGUgPSBwcm9tcHRVc2VyQ29vcmRpbmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdXNlclNoaXBPcmllbnRhdGlvbiA9IHByb21wdFVzZXJPcmllbnRhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlQ29tcHV0ZXJTaGlwKHNoaXBOYW1lKSB7XHJcbiAgICAgICAgd2hpbGUgKGNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwW3NoaXBOYW1lXS5jb29yZGluYXRlcyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICBsZXQgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChzaGlwTmFtZSwgY29tcHV0ZXJDb29yZGluYXRlLCBjb21wdXRlck9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJDb29yZGluYXRlID0gdGhpcy5jb21wdXRlci5lYXN5QWlNb3ZlcygpO1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJPcmllbnRhdGlvbiA9IHRoaXMuY29tcHV0ZXIuYWlTaGlwT3JpZW50YXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbnRpYWxpemVHYW1lKCkge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiR2FtZSBTZXQtVXBcIlxyXG4gICAgICAgIGNvbnN0IHNoaXBUeXBlcyA9IFtcIkNhcnJpZXJcIiwgXCJCYXR0bGVzaGlwXCIsIFwiQ3J1aXNlclwiLCBcIlN1Ym1hcmluZVwiLCBcIkRlc3Ryb3llclwiXTtcclxuICAgICAgICAvLyBQbGFjZSBzaGlwIHBoYXNlIC0gdGVzdCBvbiByYW5kb20gY29vcmRpbmF0ZXNcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzaGlwIG9mIHNoaXBUeXBlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlUGxheWVyU2hpcHMoc2hpcCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxhY2VDb21wdXRlclNoaXAoc2hpcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlUdXJuKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gXCJQbGF5ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyTW92ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKCFpc1ZhbGlkTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvL3Byb21wdCB1c2VyIGZvciBjb29yZGluYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21wdCA9IFwiQTFcIjsgLy8gSGVyZSB5b3UgbWlnaHQgd2FudCB0byBnZXQgYWN0dWFsIGlucHV0IGZyb20gdGhlIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyTW92ZSA9IHBsYXllci5tYWtlQXR0YWNrKHByb21wdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOyAvLyBPdXRwdXQgdGhlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgeW91IGNhbiBwcm9tcHQgdGhlIHVzZXIgd2l0aCBhIG1lc3NhZ2UgdG8gZW50ZXIgYSBuZXcgY29vcmRpbmF0ZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJNb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wdXRlckNob2ljZSA9IGNvbXB1dGVyLmVhc3lBaU1vdmVzKClcclxuICAgICAgICAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IGNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXHJcbiAgICAgICAgICAgIHBsYXllci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhjb21wdXRlck1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiR2FtZSBTZXQtVXBcIikge1xyXG4gICAgICAgICAgICBsZXQgdHVyblZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkpICsgMTtcclxuICAgICAgICAgICAgaWYgKHR1cm5WYWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJQbGF5ZXIgTW92ZVwiXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBcIkNvbXB1dGVyIE1vdmVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiUGxheWVyIE1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gXCJDb21wdXRlciBNb3ZlXCJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgPT09IFwiQ29tcHV0ZXIgTW92ZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiUGxheWVyIE1vdmVcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja1dpbm5lcigpIHtcclxuICAgICAgICBpZiAocGxheWVyLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkNvbXB1dGVyIFdpbnNcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbXB1dGVyLmdhbWVCb2FyZC5nYW1lT3ZlcigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlBsYXllciBXaW5zXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB3aGlsZSghY2hlY2tXaW5uZXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheVR1cm4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuXHJcbi8vIC8vIEdldCBwbGF5ZXIgbmFtZVxyXG4vLyBsZXQgbmFtZSA9IFwicGxheWVyMVwiXHJcblxyXG4vLyAvLyBDcmVhdGUgcGxheWVyc1xyXG4vLyBsZXQgcGxheWVyID0gbmV3IFBsYXllcihuYW1lKTtcclxuLy8gbGV0IGNvbXB1dGVyID0gbmV3IFBsYXllcihcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gLy8gUGxhY2Ugc2hpcCBwaGFzZSAtIHRlc3Qgb24gcmFuZG9tIGNvb3JkaW5hdGVzXHJcblxyXG4vLyAgICAgLy8gXCJDYXJyaWVyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ2FycmllclwiLCBcIkU1XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNhcnJpZXJcIiwgXCJBMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIkJhdHRsZXNoaXBcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJCYXR0bGVzaGlwXCIsIFwiSjdcIiwgXCJIb3Jpem9udGFsXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQmF0dGxlc2hpcFwiLCBcIkIxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJDcnVpc2VyXCJcclxuLy8gICAgIHBsYXllci5nYW1lQm9hcmQucGxhY2VTaGlwKFwiQ3J1aXNlclwiLCBcIkE4XCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIkNydWlzZXJcIiwgXCJGMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBcIlN1Ym1hcmluZVwiXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkQxXCIsIFwiSG9yaXpvbnRhbFwiKVxyXG4vLyAgICAgY29tcHV0ZXIuZ2FtZUJvYXJkLnBsYWNlU2hpcChcIlN1Ym1hcmluZVwiLCBcIkgxMFwiLCBcIlZlcnRpY2FsXCIpXHJcblxyXG4vLyAgICAgLy8gXCJEZXN0cm95ZXJcIlxyXG4vLyAgICAgcGxheWVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJCMlwiLCBcIkhvcml6b250YWxcIilcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5wbGFjZVNoaXAoXCJEZXN0cm95ZXJcIiwgXCJKMVwiLCBcIkhvcml6b250YWxcIilcclxuXHJcbi8vICAgICAvLyBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuLy8gICAgIGNvbXB1dGVyLmdhbWVCb2FyZC5kaXNwbGF5KCk7XHJcblxyXG4vLyAvLyBBdHRhY2sgcGhhc2UgXHJcblxyXG4vLyAgICAgLy8gUGxheWVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IHBsYXllck1vdmUgPSBwbGF5ZXIubWFrZUF0dGFjayhcIkExXCIpXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhwbGF5ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBjb21wdXRlci5nYW1lQm9hcmQuZGlzcGxheSgpO1xyXG5cclxuLy8gICAgIC8vIENvbXB1dGVyIGF0dGFjayBwaGFzZVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyQ2hvaWNlID0gY29tcHV0ZXIuZWFzeUFpTW92ZXMoKVxyXG4vLyAgICAgbGV0IGNvbXB1dGVyTW92ZSA9IGNvbXB1dGVyLm1ha2VBdHRhY2soY29tcHV0ZXJDaG9pY2UpXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soY29tcHV0ZXJNb3ZlKTtcclxuXHJcbi8vICAgICBwbGF5ZXIuZ2FtZUJvYXJkLmRpc3BsYXkoKTtcclxuIiwiZnVuY3Rpb24gY3JlYXRlTmF2VWkgKCkge1xyXG4gICAgbGV0IGdhbWVJbml0aWFsaXplckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lSW5pdGlhbGl6ZXJDb250YWluZXJcIjtcclxuXHJcbiAgICBsZXQgcGxheWVyTmFtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwbGF5ZXJOYW1lQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwicGxheWVyTmFtZUNvbnRhaW5lclwiO1xyXG4gICAgbGV0IGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIuY2xhc3NOYW1lID0gXCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXJcIjtcclxuICAgIGxldCBzdGFydEJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBzdGFydEJ1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInN0YXJ0QnV0dG9uQ29udGFpbmVyXCI7XHJcblxyXG4gICAgbGV0IHBsYXllck5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIHBsYXllck5hbWVMYWJlbC50ZXh0Q29udGVudCA9IFwiRW50ZXIgeW91ciBuYW1lOlwiO1xyXG4gICAgcGxheWVyTmFtZUxhYmVsLmh0bWxGb3IgPSBcInBsYXllcklucHV0TmFtZVwiO1xyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJOYW1lTGFiZWwpO1xyXG5cclxuICAgIGxldCBwbGF5ZXJJbnB1dE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBwbGF5ZXJJbnB1dE5hbWUuY2xhc3NOYW1lID0gXCJwbGF5ZXJJbnB1dE5hbWVcIjtcclxuICAgIHBsYXllcklucHV0TmFtZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBpbnB1dFZhbHVlID0gcGxheWVySW5wdXROYW1lLnZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiY29tcHV0ZXJcIiB8fCBpbnB1dFZhbHVlID09PSBcImFpXCIpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ1RoZSBuYW1lIGNhbm5vdCBiZSBcImNvbXB1dGVyXCIgb3IgXCJhaVwiLicpO1xyXG4gICAgICAgICAgICBwbGF5ZXJJbnB1dE5hbWUudmFsdWUgPSAnJzsgLy8gQ2xlYXIgdGhlIGlucHV0IGZpZWxkXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGxheWVyTmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJJbnB1dE5hbWUpO1xyXG5cclxuICAgIGxldCBlYXN5UmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBlYXN5UmFkaW8udHlwZSA9IFwicmFkaW9cIjtcclxuICAgIGVhc3lSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XHJcbiAgICBlYXN5UmFkaW8udmFsdWUgPSBcImVhc3lcIjtcclxuICAgIGVhc3lSYWRpby5pZCA9IFwiZWFzeVwiO1xyXG4gICAgbGV0IGVhc3lMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGVhc3lMYWJlbC5odG1sRm9yID0gXCJlYXN5XCI7XHJcbiAgICBlYXN5TGFiZWwudGV4dENvbnRlbnQgPSBcIkVhc3lcIjtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChlYXN5UmFkaW8pO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVhc3lMYWJlbCk7XHJcblxyXG4gICAgLy8gUmFkaW8gYnV0dG9uIGZvciBoYXJkIGRpZmZpY3VsdHlcclxuICAgIGxldCBoYXJkUmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBoYXJkUmFkaW8udHlwZSA9IFwicmFkaW9cIjtcclxuICAgIGhhcmRSYWRpby5uYW1lID0gXCJkaWZmaWN1bHR5XCI7XHJcbiAgICBoYXJkUmFkaW8udmFsdWUgPSBcImhhcmRcIjtcclxuICAgIGhhcmRSYWRpby5pZCA9IFwiaGFyZFwiO1xyXG4gICAgbGV0IGhhcmRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGhhcmRMYWJlbC5odG1sRm9yID0gXCJoYXJkXCI7XHJcbiAgICBoYXJkTGFiZWwudGV4dENvbnRlbnQgPSBcIkhhcmRcIjtcclxuICAgIGNvbXB1dGVyRGlmZmljdWx0eUNvbnRhaW5lci5hcHBlbmRDaGlsZChoYXJkUmFkaW8pO1xyXG4gICAgY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyLmFwcGVuZENoaWxkKGhhcmRMYWJlbCk7XHJcblxyXG4gICAgLy8gU3RhcnQgYnV0dG9uXHJcbiAgICBsZXQgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSBcIlN0YXJ0IEdhbWVcIjtcclxuICAgIHN0YXJ0QnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uKTtcclxuICAgIHN0YXJ0QnV0dG9uLmlkID0gXCJpbml0U3RhcnRCdXR0b25cIjtcclxuXHJcbiAgICAvLyBBcHBlbmQgdGhlIGNvbnRhaW5lcnMgdG8gdGhlIG1haW4gY29udGFpbmVyXHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyTmFtZUNvbnRhaW5lcik7XHJcbiAgICBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyKTtcclxuICAgIGdhbWVJbml0aWFsaXplckNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG5cclxuICAgIHJldHVybiBnYW1lSW5pdGlhbGl6ZXJDb250YWluZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTmF2VWk7IiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZUJvYXJkXCIpO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuQWkgPSB0aGlzLmlzQWkodGhpcy5uYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IG5ldyBHYW1lYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemVGaXJzdChzdHIpIHtcclxuICAgICAgICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xyXG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQXR0YWNrKGNvb3JkaW5hdGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkTW92ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZSkgJiYgIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW92ZSBpcyBhbHJlYWR5IG1hZGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGxldGVkTW92ZXMucHVzaChjb29yZGluYXRlKTtcclxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FpKG5hbWUpIHtcclxuICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmNhcGl0YWxpemVGaXJzdChuYW1lKTtcclxuICAgICAgICByZXR1cm4gY2hlY2sgPT0gXCJDb21wdXRlclwiIHx8IGNoZWNrID09IFwiQWlcIjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QWxsUG9zc2libGVNb3ZlcygpIHtcclxuICAgICAgICBsZXQgYWxsTW92ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBjb2x1bW5OdW1iZXIgPSAwOyBjb2x1bW5OdW1iZXIgPCB0aGlzLmdhbWVCb2FyZC53aWR0aDsgY29sdW1uTnVtYmVyKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93TnVtYmVyID0gMTsgcm93TnVtYmVyIDw9IHRoaXMuZ2FtZUJvYXJkLmhlaWdodDsgcm93TnVtYmVyKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5BbGlhcyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sdW1uTnVtYmVyICsgNjUpO1xyXG4gICAgICAgICAgICAgICAgYWxsTW92ZXMucHVzaChjb2x1bW5BbGlhcyArIHJvd051bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFsbE1vdmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVhc3lBaU1vdmVzKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuQWkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjZXNzIHRvIGVhc3lBaU1vdmVzIGlzIHJlc3RyaWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNldCBvZiBhbGwgdW5wbGF5ZWQgbW92ZXNcclxuICAgICAgICAgICAgbGV0IGFsbFBvc3NpYmxlTW92ZXMgPSB0aGlzLmdldEFsbFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICAgICAgbGV0IHVucGxheWVkTW92ZXMgPSBhbGxQb3NzaWJsZU1vdmVzLmZpbHRlcihtb3ZlID0+ICF0aGlzLmNvbXBsZXRlZE1vdmVzLmluY2x1ZGVzKG1vdmUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1bnBsYXllZCBtb3ZlcyBsZWZ0LCByYWlzZSBhbiBlcnJvciBvciBoYW5kbGUgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgaWYgKHVucGxheWVkTW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbGwgbW92ZXMgaGF2ZSBiZWVuIHBsYXllZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIG1vdmUgZnJvbSB0aGUgc2V0IG9mIHVucGxheWVkIG1vdmVzXHJcbiAgICAgICAgICAgIGxldCByYW5kb21JbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KDAsIHVucGxheWVkTW92ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdW5wbGF5ZWRNb3Zlc1tyYW5kb21JbmRleF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlZE1vdmVzLnB1c2gobW92ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBhaVNoaXBPcmllbnRhdGlvbigpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkhvcml6b250YWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7IiwiXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IHtcclxuICAgICAgICAgICAgQ2FycmllcjogNSxcclxuICAgICAgICAgICAgQmF0dGxlc2hpcDogNCxcclxuICAgICAgICAgICAgQ3J1aXNlcjogMyxcclxuICAgICAgICAgICAgU3VibWFyaW5lOiAzLFxyXG4gICAgICAgICAgICBEZXN0cm95ZXI6IDIsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzVmFsaWQgPSB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnNoaXBUeXBlc1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2V0TGVuZ3RoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FwaXRhbGl6ZUZpcnN0KHN0cikge1xyXG4gICAgICAgIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExlbmd0aChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY2FwaXRhbGl6ZWRTaGlwTmFtZSA9IHRoaXMuY2FwaXRhbGl6ZUZpcnN0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zaGlwVHlwZXNbY2FwaXRhbGl6ZWRTaGlwTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hpcFR5cGVzW2NhcGl0YWxpemVkU2hpcE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpdENvdW50ID09IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcclxuICAgICAgICB0aGlzLmlzU3VuaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpdENvdW50O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG4uZ2FtZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbiAgICB3aWR0aDogMTAwdnc7XHJcbiAgICBiYWNrZ3JvdW5kOiByZWQ7XHJcbn1cclxuXHJcbi5nYW1lSGVhZGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgaGVpZ2h0OiAxNSU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNDcsIDAsIDI1NSk7XHJcbn1cclxuXHJcbiNiYXR0bGVzaGlwVGl0bGUge1xyXG4gICAgZm9udC1zaXplOiB4eC1sYXJnZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLmdhbWVTdGF0ZUNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgd2lkdGg6IDIwJTtcclxuICAgIGhlaWdodDogNzAlO1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uZ2FtZUNvbnRlbnRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDg1JTtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkSGVhZGVyQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoODMsIDE4MCwgNTkpO1xyXG4gICAgbWFyZ2luLXRvcDogM2VtO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkSGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcclxufVxyXG5cclxuLmdhbWVTY3JlZW5Db250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICBoZWlnaHQ6IDg1JTtcclxuICAgIHdpZHRoOiAxMDB2dztcclxuICAgIGJhY2tncm91bmQ6IHJnYigzMSwgMTQ3LCAxNTUpO1xyXG59XHJcblxyXG4uZ2FtZUJvYXJkQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci50b3Age1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBoZWlnaHQ6IDUlO1xyXG59XHJcblxyXG5cclxuLm51bWVyaWNDb29yZGluYXRlcyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBmb250LXNpemU6IDM2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbiAgICBtYXJnaW4tbGVmdDogMC44NWVtO1xyXG59XHJcblxyXG4ubnVtZXJpY0Nvb3JkaW5hdGVzID4gZGl2e1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAuODVlbTtcclxufVxyXG5cclxuLmdhbWVCb2FyZENvbnRhaW5lci5ib3R0b20ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgaGVpZ2h0OiA5MCU7XHJcbn1cclxuXHJcbi5hbHBoYUNvb3JkaW5hdGVzIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gICAgZm9udC1zaXplOiAzNnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuMmVtO1xyXG59XHJcblxyXG4uYWxwaGFDb29yZGluYXRlcyA+IGRpdiB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XHJcbn1cclxuXHJcbi5nYW1lQm9hcmQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDUwMHB4O1xyXG4gICAgd2lkdGg6IDUwMHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXHJcbn1cclxuXHJcbi5yb3csIC5zaGlwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uc2hpcCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxufVxyXG5cclxuLmJveCB7XHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uYm94OmhvdmVyIHtcclxuICAgIHdpZHRoOiAxMCU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XHJcbn1cclxuXHJcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIGhlaWdodDogNSU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0ZW07XHJcbn1cclxuXHJcbi5waWVjZXNDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBoZWlnaHQ6IDM1MHB4O1xyXG4gICAgd2lkdGg6IDQyNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5zaGlwQ29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBoZWlnaHQ6IDUwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbn1cclxuXHJcbi5zaGlwTmFtZSB7XHJcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XHJcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xyXG59XHJcblxyXG4uc2hpcGJveCB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjIpOyBcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLmdhbWVJbml0aWFsaXplckNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcclxufVxyXG5cclxuLnBsYXllck5hbWVDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgXHJcbn1cclxuXHJcbi5wbGF5ZXJOYW1lQ29udGFpbmVyID4gaW5wdXQge1xyXG4gICAgaGVpZ2h0OiA1MCU7ICAgIFxyXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gI2Vhc3ksICNoYXJkIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbn1cclxuXHJcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiBsYWJlbCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcclxufVxyXG5cclxuI2luaXRTdGFydEJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9iYXR0bGVzaGlwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixZQUFZO0lBQ1osZUFBZTtBQUNuQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsVUFBVTtJQUNWLFdBQVc7SUFDWCxzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0lBQ1gsWUFBWTtJQUNaLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFVBQVU7SUFDVixXQUFXO0lBQ1gsNEJBQTRCO0lBQzVCLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLFlBQVk7QUFDaEI7OztBQUdBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixVQUFVO0FBQ2Q7OztBQUdBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsOEJBQThCO0lBQzlCLGVBQWU7SUFDZixlQUFlO0lBQ2YsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsOEJBQThCO0lBQzlCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixlQUFlO0lBQ2YsbUJBQW1CO0lBQ25CLG9CQUFvQjtBQUN4Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIsd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFdBQVc7SUFDWCx1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksVUFBVTtJQUNWLHVCQUF1QjtJQUN2Qiw0QkFBNEI7QUFDaEM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixVQUFVO0lBQ1YsV0FBVztJQUNYLDRCQUE0QjtJQUM1QixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFlBQVk7SUFDWixXQUFXO0lBQ1gsbUJBQW1CO0lBQ25CLDhCQUE4QjtJQUM5QixlQUFlO0FBQ25COztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLHVCQUF1QjtJQUN2QixzQ0FBc0M7SUFDdEMsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1COztBQUV2Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDZCQUE2QjtJQUM3QixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxzQkFBc0I7SUFDdEIsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgICB3aWR0aDogMTAwdnc7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVIZWFkZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAxNSU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig0NywgMCwgMjU1KTtcXHJcXG59XFxyXFxuXFxyXFxuI2JhdHRsZXNoaXBUaXRsZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeHgtbGFyZ2U7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTdGF0ZUNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIGhlaWdodDogNzAlO1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgZm9udC1zaXplOiB4LWxhcmdlO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZUNvbnRlbnRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRIZWFkZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi10b3A6IDNlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVCb2FyZEhlYWRlciB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVTY3JlZW5Db250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA4NSU7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDMxLCAxNDcsIDE1NSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIudG9wIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLm51bWVyaWNDb29yZGluYXRlcyB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgZm9udC1zaXplOiAzNnB4O1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XFxyXFxufVxcclxcblxcclxcbi5udW1lcmljQ29vcmRpbmF0ZXMgPiBkaXZ7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAwLjg1ZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRDb250YWluZXIuYm90dG9tIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBoZWlnaHQ6IDkwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmFscGhhQ29vcmRpbmF0ZXMge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgZm9udC1zaXplOiAzNnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNWVtO1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmFscGhhQ29vcmRpbmF0ZXMgPiBkaXYge1xcclxcbiAgICBtYXJnaW4tdG9wOiAwLjI1ZW07XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBoZWlnaHQ6IDUwMHB4O1xcclxcbiAgICB3aWR0aDogNTAwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgICAvKiBtYXJnaW4tYm90dG9tOiA3ZW07ICovXFxyXFxufVxcclxcblxcclxcbi5yb3csIC5zaGlwIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcCB7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94IHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4uYm94OmhvdmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwJTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47XFxyXFxufVxcclxcblxcclxcbi5nYW1lQm9hcmRSZXN1bHRDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgaGVpZ2h0OiA1JTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig4MywgMTgwLCA1OSk7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDRlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBpZWNlc0NvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMzUwcHg7XFxyXFxuICAgIHdpZHRoOiA0MjVweDtcXHJcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5zaGlwQ29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxufVxcclxcblxcclxcbi5zaGlwTmFtZSB7XFxyXFxuICAgIGZvbnQtc2l6ZTogeC1sYXJnZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXBib3gge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxMjgsIDAsIDAuMik7IFxcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5nYW1lSW5pdGlhbGl6ZXJDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gICAgaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgICBib3JkZXI6IDNweCBzb2xpZCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllck5hbWVDb250YWluZXIgPiBpbnB1dCB7XFxyXFxuICAgIGhlaWdodDogNTAlOyAgICBcXHJcXG4gICAgbWFyZ2luLXRvcDogMC41ZW07XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5jb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIgPiAjZWFzeSwgI2hhcmQge1xcclxcbiAgICBtYXJnaW4tbGVmdDogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY29tcHV0ZXJEaWZmaWN1bHR5Q29udGFpbmVyID4gbGFiZWwge1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuI2luaXRTdGFydEJ1dHRvbiB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gICAgZm9udC1zaXplOiBsYXJnZXI7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYmF0dGxlc2hpcC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTsgIC8vIEFkanVzdCBwYXRoIGFjY29yZGluZ2x5XHJcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7ICAvLyBBZGp1c3QgcGF0aCBhY2NvcmRpbmdseVxyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpO1xyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xyXG5jb25zdCBjcmVhdGVHYW1lQm9hcmQgPSAgcmVxdWlyZSgnLi9jcmVhdGVHYW1lQm9hcmQnKTtcclxuY29uc3QgcGllY2VzQ29udGFpbmVyID0gcmVxdWlyZSgnLi9iYXR0bGVzaGlwUGllY2VzJyk7XHJcbmNvbnN0IGNyZWF0ZU5hdlVpID0gcmVxdWlyZSgnLi9uYXZpZ2F0aW9uQ29tcG9uZW50cycpO1xyXG5pbXBvcnQgJy4vYmF0dGxlc2hpcC5jc3MnO1xyXG5cclxuLy8gU3RyaW5nIHRvIGdlbmVyYXRlIGdhbWUgSURcclxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XHJcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcclxuICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubGV0IGdhbWVJbml0ID0gY3JlYXRlTmF2VWkoKTtcclxuXHJcbmxldCBwbGF5ZXIxID0gbmV3IFBsYXllcjtcclxuXHJcbmxldCBuZXdHYW1lID0gbmV3IEdhbWUoZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSwgcGxheWVyMSlcclxuXHJcbmxldCBnYW1lU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lU2NyZWVuQ29udGFpbmVyXCIpO1xyXG5cclxubGV0IGJvYXJkMSA9IGNyZWF0ZUdhbWVCb2FyZChuZXdHYW1lLnBsYXllcjEpO1xyXG5sZXQgcGllY2VzID0gcGllY2VzQ29udGFpbmVyKHBsYXllcjEpO1xyXG5sZXQgYm9hcmQyID0gY3JlYXRlR2FtZUJvYXJkKG5ld0dhbWUuY29tcHV0ZXIpO1xyXG5cclxuXHJcbmdhbWVTY3JlZW4uYXBwZW5kQ2hpbGQocGllY2VzKTtcclxuZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDEpO1xyXG5nYW1lU2NyZWVuLmFwcGVuZENoaWxkKGdhbWVJbml0KTtcclxuLy8gZ2FtZVNjcmVlbi5hcHBlbmRDaGlsZChib2FyZDIpO1xyXG5cclxuIl0sIm5hbWVzIjpbIlBsYXllciIsInJlcXVpcmUiLCJiYXR0bGVzaGlwUGllY2VzIiwicGxheWVyIiwicGllY2VzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiYm94V2lkdGgiLCJib3hIZWlnaHQiLCJzaGlwTmFtZSIsImdhbWVCb2FyZCIsInNoaXAiLCJzaGlwQXR0cmlidXRlIiwiaW5zdGFuY2UiLCJzaGlwQ29udGFpbmVyIiwic2hpcFRpdGxlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwic2hpcFBpZWNlIiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJzdHlsZSIsIndpZHRoIiwibGVuZ3RoIiwiaGVpZ2h0IiwiZHJhZ2dhYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsInRhcmdldCIsImkiLCJzaGlwQm94IiwiYXBwZW5kQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwiY3JlYXRlR2FtZUJvYXJkIiwiZ2FtZUJvYXJkQ29tcG9uZW50IiwiZ2FtZUJvYXJkVG9wQ29tcG9uZW50IiwiZ2FtZUJvYXJkQm90dG9tQ29tcG9uZW50IiwiYWxwaGFDb29yZGluYXRlcyIsIm51bWVyaWNDb29yZGluYXRlcyIsImNvbHVtblRpdGxlIiwiYWxwaGFDaGFyIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwicm93VGl0bGUiLCJyb3ciLCJfbG9vcCIsImJveCIsImoiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJnZXREYXRhIiwiZHJvcHBlZFNoaXAiLCJnZXRFbGVtZW50QnlJZCIsImNhblBsYWNlU2hpcCIsImFsZXJ0IiwiU2hpcCIsIkdhbWVib2FyZCIsIl9jbGFzc0NhbGxDaGVjayIsIm1pc3NDb3VudCIsIm1pc3NlZE1vdmVzQXJyYXkiLCJoaXRNb3Zlc0FycmF5IiwiQ2FycmllciIsImNvb3JkaW5hdGVzIiwiQmF0dGxlc2hpcCIsIkNydWlzZXIiLCJTdWJtYXJpbmUiLCJEZXN0cm95ZXIiLCJib2FyZCIsInN0YXJ0R2FtZSIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwicHVzaCIsImNoYXJUb1Jvd0luZGV4IiwiY2hhciIsInRvVXBwZXJDYXNlIiwiY2hhckNvZGVBdCIsInN0cmluZ1RvQ29sSW5kZXgiLCJzdHIiLCJwYXJzZUludCIsInNldEF0IiwiYWxpYXMiLCJzdHJpbmciLCJjaGFyUGFydCIsImNoYXJBdCIsIm51bVBhcnQiLCJzdWJzdHJpbmciLCJyb3dJbmRleCIsImNvbEluZGV4IiwiY2hlY2tBdCIsIkVycm9yIiwiZ2V0QmVsb3dBbGlhcyIsIm5leHRDaGFyIiwibmV3QWxpYXMiLCJnZXRSaWdodEFsaWFzIiwicGxhY2VTaGlwIiwic2hpcEhlYWRDb29yZGluYXRlIiwic2hpcE9yaWVudGF0aW9uIiwiX3RoaXMiLCJzaGlwTWFya2VyIiwic2hpcExlbmd0aCIsImN1cnJlbnRDb29yZGluYXRlIiwiZ2V0TmV4dENvb3JkaW5hdGUiLCJjb29yZGluYXRlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsImVyciIsImUiLCJmIiwicmVjZWl2ZUF0dGFjayIsInNoaXBDb29yZGluYXRlcyIsImluY2x1ZGVzIiwiaGl0Iiwic2V0QWxsU2hpcHNUb0RlYWQiLCJpc0RlYWQiLCJnYW1lT3ZlciIsImRpc3BsYXkiLCJoZWFkZXIiLCJjb25zb2xlIiwibG9nIiwicm93U3RyaW5nIiwiY2VsbFZhbHVlIiwiR2FtZSIsImdhbWVJZCIsInBsYXllck5hbWUiLCJwbGF5ZXIxIiwiY29tcHV0ZXIiLCJwaGFzZUNvdW50ZXIiLCJjdXJyZW50U3RhdGUiLCJjdXJyZW50VHVybiIsInBsYWNlUGxheWVyU2hpcHMiLCJ1c2VyQ29vcmRpbmF0ZSIsInByb21wdFVzZXJDb29yZGluYXRlIiwidXNlclNoaXBPcmllbnRhdGlvbiIsInByb21wdFVzZXJPcmllbnRhdGlvbiIsInBsYWNlQ29tcHV0ZXJTaGlwIiwiY29tcHV0ZXJDb29yZGluYXRlIiwiZWFzeUFpTW92ZXMiLCJjb21wdXRlck9yaWVudGF0aW9uIiwiYWlTaGlwT3JpZW50YXRpb24iLCJpbnRpYWxpemVHYW1lIiwic2hpcFR5cGVzIiwiX2kiLCJfc2hpcFR5cGVzIiwic3RhcnQiLCJwbGF5VHVybiIsImlzVmFsaWRNb3ZlIiwicGxheWVyTW92ZSIsInByb21wdCIsIm1ha2VBdHRhY2siLCJlcnJvciIsIm1lc3NhZ2UiLCJjb21wdXRlckNob2ljZSIsImNvbXB1dGVyTW92ZSIsInVwZGF0ZVN0YXRlIiwidHVyblZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2hlY2tXaW5uZXIiLCJjcmVhdGVOYXZVaSIsImdhbWVJbml0aWFsaXplckNvbnRhaW5lciIsInBsYXllck5hbWVDb250YWluZXIiLCJjb21wdXRlckRpZmZpY3VsdHlDb250YWluZXIiLCJzdGFydEJ1dHRvbkNvbnRhaW5lciIsInBsYXllck5hbWVMYWJlbCIsImh0bWxGb3IiLCJwbGF5ZXJJbnB1dE5hbWUiLCJpbnB1dFZhbHVlIiwidG9Mb3dlckNhc2UiLCJlYXN5UmFkaW8iLCJ0eXBlIiwiZWFzeUxhYmVsIiwiaGFyZFJhZGlvIiwiaGFyZExhYmVsIiwic3RhcnRCdXR0b24iLCJBaSIsImlzQWkiLCJjb21wbGV0ZWRNb3ZlcyIsImNhcGl0YWxpemVGaXJzdCIsInNsaWNlIiwiY2hlY2siLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJnZXRBbGxQb3NzaWJsZU1vdmVzIiwiYWxsTW92ZXMiLCJjb2x1bW5OdW1iZXIiLCJyb3dOdW1iZXIiLCJjb2x1bW5BbGlhcyIsImFsbFBvc3NpYmxlTW92ZXMiLCJ1bnBsYXllZE1vdmVzIiwiZmlsdGVyIiwibW92ZSIsInJhbmRvbUluZGV4IiwiaXNWYWxpZCIsInNldExlbmd0aCIsImhpdENvdW50IiwiY2FwaXRhbGl6ZWRTaGlwTmFtZSIsImlzU3VuayIsImdlbmVyYXRlUmFuZG9tU3RyaW5nIiwiY2hhcmFjdGVycyIsInJlc3VsdCIsImdhbWVJbml0IiwibmV3R2FtZSIsImdhbWVTY3JlZW4iLCJxdWVyeVNlbGVjdG9yIiwiYm9hcmQxIiwicGllY2VzIiwiYm9hcmQyIl0sInNvdXJjZVJvb3QiOiIifQ==