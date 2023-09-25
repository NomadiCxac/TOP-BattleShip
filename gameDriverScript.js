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
     
        let computerGuess = game.playTurn();
        placeBoardMarker(game, computerGuess, game.currentTurn)
        game.updateState();
        phaseUpdater(game);
        game.checkWinner()

        return
    }
    // game.currentState = "Game Play Phase" &&
    if ( game.currentTurn === "Computer Move") {               
        console.log("Stepped into 5");

   
        }   
        return;
    }


module.exports = gameDriverScript;