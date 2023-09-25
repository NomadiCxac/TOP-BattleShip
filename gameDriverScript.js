const placeBoardMarker = require('./placeBoardMarker');
const phaseUpdater = require('./updateCurrentPhase');

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
        
    if (game.currentState = "Game Play Phase" && game.currentTurn == "Player Move") {               
        placeBoardMarker(game, playerGuess, game.currentTurn);
        game.updateState();
        phaseUpdater(game);
    }
    // game.currentState = "Game Play Phase" &&
    if ( game.currentTurn == "Computer Move") {               
        let computerGuess = game.playTurn();
        placeBoardMarker(game, computerGuess, game.currentTurn)
        game.updateState();
        phaseUpdater(game);
        }   
        return;
    }


module.exports = gameDriverScript;