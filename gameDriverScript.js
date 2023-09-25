const placeBoardMarker = require('./placeBoardMarker');
const phaseUpdater = require('./updateCurrentPhase');

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
     
        let computerGuess = game.playTurn();
        placeBoardMarker(game, computerGuess, game.currentTurn)
        game.updateState();
        phaseUpdater(game);
        game.checkWinner()
    }
    // game.currentState = "Game Play Phase" &&
    if (game.checkWinner()) {

        phaseUpdater(game);
        return;
        }
    }


module.exports = gameDriverScript;