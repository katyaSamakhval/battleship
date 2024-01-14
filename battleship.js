
/*view:

displayMessage - создание места для ввода
displayHit - функция выстрела
displayMiss - функчия промаха
______________________________________________________________________________________________________________________

model:

boardSize - size of board
numShips - number of ships
shipLength -amount of squers in which ships are located 
shipsSunk - amount of sunked ships
ships - location of ships and number of hits
fire - if you hit one part of the ship picture of ship, if you hit 3 parts you will sunk battleship
isSunk - if true - you sunk the battleship, if false - not

______________________________________________________________________________________________________________________

controller:

parseGuess - validity check entered by user
processGuess - check: did you sink all battleship?, transfer of entered locations

______________________________________________________________________________________________________________________

fireButton:

function init - press ENTER/button "fire"
function handleKeyPress - press ENTER
function handleFireButton - clear data of value, receiving data and transfer it to controller
*/
let view = {
    displayMassege: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};
/*
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
*/

let model = {
    boardSize: 7,
    numShips: 3,
    shipsLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    fire: function(guess) {
       for(let i = 0; i < this.numShips; i++) {
        let ship = this.ships[i];
        let index = ship.locations.indexOf(guess);
        if (index >= 0) {
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMassege("HIT!")
            if (this.isSunk(ship)) {
                view.displayMassege("You sunk my buttleship;(");
                this.shipsSunk++;
            }
            return true;
        }
    }
    view.displayMiss(guess);
    view.displayMassege("You missed");
    return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipsLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.genereteShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    genereteShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let col, row;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipsLength));
        }else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipsLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipsLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
            return newShipLocations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

}
/*
model.fire("53");
model.fire("10");
model.fire("20");
model.fire("30")
*/
function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oop, please enter a letter and a number on the board;)");
    } else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(column) || isNaN(row)) {
            alert("Oops, that's not on the board;(");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board;(");
        } else {
          return row + column;  
        }
    }
    return null;
}

var controller = {
    guesses: 0,
    proccesGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMassege("You sunk all my battleships, in " + this.guesses + " guesses.")
            }
        }
    }
}


/*controller.proccesGuess("A6");
controller.proccesGuess("B6");
controller.proccesGuess("C4");
controller.proccesGuess("D4");
controller.proccesGuess("E4");
controller.proccesGuess("B0");
controller.proccesGuess("B1");
controller.proccesGuess("B2");
*/
 function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
 }

 function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.proccesGuess(guess);
    guessInput.value = "";
 }
 window.onload = init;
 function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
 }
 // you can test the game automatically

 // кнопка "играть заново", break, блокнуть fire/messageArea