const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this._field = field;
    this.hortPos = 0;
    this.vertPos = 0;
  }
  print() {
    /*
    The escape codes allow the game board to be 
    reprinted in same screen location each time.
    User sees only one game board being updated.
    hex code for ESC works, octal code does not.
    */

    //clear screen ANSI escape code
    console.log('\x1B[2J');
    //move cursor to home (0,0) ANSI escape code
    console.log('\x1B[H');

    //output array as a string
    this._field.forEach((element) => console.log(element.join("")));
  }
  moveDirection() {
    let direction = prompt("Enter direction to move: ");
    let continueKey = '';
    direction = direction.toLowerCase();
    switch (direction) {
      case "u":
        this.vertPos -= 1;
        if (this.vertPos < 0) {
          continueKey = prompt('Cannot move Up - out of bounds. Press any key to continue.');
          this.vertPos = 0;
        }
        break;
      case "d":
        this.vertPos += 1;
        if (this.vertPos >= this._field.length) {
          continueKey = prompt('Cannot move Down - out of bounds. Press any key to continue.');
          this.vertPos -= 1;
        }
        break;
      case "l":
        this.hortPos -= 1;
        if (this.hortPos < 0) {
          continueKey = prompt('Cannot move Left - out of bounds. Press any key to continue.');
          this.hortPos += 1;
        }
        break;
      case "r":
        this.hortPos += 1;
        if (this.hortPos >= this._field[this.vertPos].length) {
          continueKey = prompt('Cannot move Right - out of bounds. Press any key to continue.');
          //reset hortPos to rightmost value of game board
          this.hortPos -= 1;
        }
        break;
      default:
        console.log('invalid entry, try again.');
    }
  }
  playGame() {
    let continueGame = true;
    while (continueGame) {
      //print playing field
      this.print();
      
      //prompt user for direction to move
      this.moveDirection();
      
      //get current position character
      let character = this._field[this.vertPos][this.hortPos];

      //manages result of user inputted move
      switch (character) {
        case fieldCharacter:
          this._field[this.vertPos][this.hortPos] = pathCharacter;
          continueGame = true;
          break;
        case pathCharacter:
          continueGame = true;
          break;
        case hole:
          this._field[this.vertPos][this.hortPos] = pathCharacter;
          this.print();
          console.log('Sorry, you fell down a hole. Game over.');
          continueGame = false;
          break;
        case hat: 
          this._field[this.vertPos][this.hortPos] = pathCharacter;
          this.print();
          console.log('You found the hat! You are a Winner!');
          continueGame = false;
          break;
        default:
          console.log('Unknown error occured. Game over.');
          continueGame = false;
      }
    }
  }
  //create 2-dimensional area by iterating over 'parent' array
  static generateField(numRows, numCols, percent = .15) {
    let boardArray = new Array(numRows);
      for (let j = 0; j < numRows; j++) {
        boardArray[j] = new Array(numCols);
        for (let i = 0; i < numCols; i++) {
          if (j == 0 && i == 0) {
            boardArray[j][i] = pathCharacter;  
          } else {
          //couldn't figure out how to do the percent of holes
          //these two lines are from the solution code
          let randomNum = Math.random();
          boardArray[j][i] = randomNum > percent ? fieldCharacter : hole;
          }
        }
      }
    //set random location for hat, exclude hat from location 0,0
    let hatRow;
    let hatCol;
    do {
      hatRow = Math.floor(Math.random() * numRows);
      hatCol = Math.floor(Math.random() * numCols);
      boardArray[hatRow][hatCol] = hat;  
    } while (hatRow == 0 && hatCol == 0);
    return boardArray;
  }
} //end of Field class

  const myField = new Field(Field.generateField(5, 7, .25));
  myField.playGame();