//since main.ts will be the main running script,
//ai.ts will be where our imagination/simulation functions will be
//functions here will manipulate an imaginary version of the gameBoardAI
//there will be an array of decisions that gets generated
//each decision is scored based on the number of objectives it achieves.
//moveRightAI and moveLeftAI have to have a limiter set into them
//get moveRightAI and moveLeftAI to return some value
//if they hit the edge or obstacle
var aiGameBoard = /** @class */ (function () {
    function aiGameBoard(id, right) {
        this.board = JSON.parse(JSON.stringify(gameBoard));
        this.id = id;
        this.right = right;
        this.points = 100;
    }
    return aiGameBoard;
}());
function examineBoard(aiGameBoardObject) {
    var points = 100;
    //checking for blank pockets between 2 vertical blocks
    for (var i = 1; i < boardHeight - 1; i++) {
        for (var j = 1; j < boardWidth - 2; j++) {
            if (aiGameBoardObject.board[i][j] === 0 && aiGameBoardObject.board[i + 1][j] === 2) {
                points = points - 5;
            }
        }
    }
    //checking for lines filled
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        var rowFilled = 0;
        for (var j = boardWidth - 2; j > 0; j--) {
            if (aiGameBoardObject.board[i][j] === 2) {
                rowFilled++;
            }
        }
        if (rowFilled === boardWidth - 2) {
            points = points + 10;
        }
    }
    aiGameBoardObject.points = points;
}
function maxRight(gameBoardAI) {
    var minColumnsToRightEdge = boardWidth;
    for (var i = boardWidth - 2; i > 1; i--) {
        //this for-loop below scans the current row at the bottom for a floor, use it to
        //instead scan how many rows till the floor
        for (var j = boardHeight - 1; j > 1; j--) {
            //1 or 4 found at this row
            //need to check which cell containing a 1 or a 4 has the lowest number of
            //steps till it reaches the floor
            if (gameBoardAI[j][i] === 1 || gameBoardAI[j][i] === 4) {
                //pieces found is true
                //now execute code to find shortest number of downward translations till
                //we hit a floor on one of the pieces
                for (var k = 0; i + k <= boardWidth - 1; k++) {
                    if (gameBoardAI[j][i + k] === 2 || gameBoardAI[j][i + k] === 3) {
                        minColumnsToRightEdge = Math.min(k, minColumnsToRightEdge);
                    }
                }
            }
        }
    }
    return minColumnsToRightEdge;
}
function maxLeft(gameBoardAI) {
    var minColumnsToLeftEdge = boardWidth;
    for (var i = 1; i < boardWidth - 2; i++) {
        //this for-loop below scans the current row at the bottom for a floor, use it to
        //instead scan how many rows till the floor
        for (var j = boardHeight - 1; j > 1; j--) {
            //1 or 4 found at this row
            //need to check which cell containing a 1 or a 4 has the lowest number of
            //steps till it reaches the floor
            if (gameBoardAI[j][i] === 1 || gameBoardAI[j][i] === 4) {
                //pieces found is true
                //now execute code to find shortest number of downward translations till
                //we hit a floor on one of the pieces
                for (var k = 0; i - k >= 0; k++) {
                    if (gameBoardAI[j][i - k] === 2 || gameBoardAI[j][i - k] === 3) {
                        minColumnsToLeftEdge = Math.min(k, minColumnsToLeftEdge);
                    }
                }
            }
        }
    }
    return minColumnsToLeftEdge - 1;
}
function FRIENDthinking() {
    //edgeHit would be a variable that helps us determine if the edge has been hit
    //to get a limit for moveRight/moveLeft
    var edgeHit = false;
    var rightMovesAI = 0;
    var maximumRight = maxRight(gameBoard);
    var maximumLeft = maxLeft(gameBoard);
    var resultDecisionsAI = [];
    for (var k = 0; k < maximumRight; k++) {
        var aiBoard = new aiGameBoard(k, true);
        aiBoard.board = moveRightAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
        resultDecisionsAI.push(aiBoard);
    }
    for (var k = 1; k < maximumLeft; k++) {
        var aiBoard = new aiGameBoard(k, false);
        aiBoard.board = moveLeftAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
        resultDecisionsAI.push(aiBoard);
    }
    for (var k = 0; k < resultDecisionsAI.length; k++) {
        examineBoard(resultDecisionsAI[k]);
    }
    for (var k = 0; k < resultDecisionsAI.length; k++) {
        console.log(resultDecisionsAI[k].points);
    }
}
function moveRightAI(moves, gameBoardAI) {
    for (var i = boardWidth - 2; i > 0; i--) {
        for (var j = 1; j < boardHeight; j++) {
            //code to manipulate array
            if (gameBoardAI[j][i] === 4) {
                gameBoardAI[j].splice(i, 1, 0);
                gameBoardAI[j].splice(i + moves, 1, 4);
            }
            else if (gameBoardAI[j][i] === 1) {
                gameBoardAI[j].splice(i, 1, 0);
                gameBoardAI[j].splice(i + moves, 1, 1);
            }
        }
    }
    return gameBoardAI;
}
function moveLeftAI(moves, gameBoardAI) {
    for (var i = boardWidth - 2; i > 0; i--) {
        for (var j = 1; j < boardHeight; j++) {
            //code to manipulate array
            if (gameBoardAI[j][i] === 4) {
                gameBoardAI[j].splice(i, 1, 0);
                gameBoardAI[j].splice(i - moves, 1, 4);
            }
            else if (gameBoardAI[j][i] === 1) {
                gameBoardAI[j].splice(i, 1, 0);
                gameBoardAI[j].splice(i - moves, 1, 1);
            }
        }
    }
    return gameBoardAI;
}
function allTheWayDownAI(gameBoardAI) {
    var floorFound = false;
    var minRowsToFloor = boardHeight;
    for (var i = 1; i < boardHeight; i++) {
        //this for-loop below scans the current row at the bottom for a floor, use it to
        //instead scan how many rows till the floor
        for (var j = boardWidth - 2; j > 0; j--) {
            //1 or 4 found at this row
            //need to check which cell containing a 1 or a 4 has the lowest number of
            //steps till it reaches the floor
            if (gameBoardAI[i][j] === 1 || gameBoardAI[i][j] === 4) {
                //pieces found is true
                //now execute code to find shortest number of downward translations till
                //we hit a floor on one of the pieces
                for (var k = 0; i - k >= 0; k++) {
                    if (gameBoardAI[i - k][j] === 2) {
                        minRowsToFloor = Math.min(k, minRowsToFloor);
                        floorFound = true;
                    }
                }
            }
        }
    }
    //reset piece rotation state for the next piece
    for (var i = 1; i < boardHeight; i++) {
        for (var j = boardWidth - 2; j > 0; j--) {
            if (gameBoardAI[i][j] === 1 || gameBoardAI[i][j] === 4) {
                if (gameBoardAI[i][j] === 4) {
                    gameBoardAI[i].splice(j, 1, 0);
                    gameBoardAI[i - minRowsToFloor + 1].splice(j, 1, 2);
                }
                else {
                    gameBoardAI[i].splice(j, 1, 0);
                    gameBoardAI[i - minRowsToFloor + 1].splice(j, 1, 2);
                }
            }
        }
    }
    return gameBoardAI;
    //code to generate new piece here
    // checkLineFilled();
    //kill game here if resultant board has a piece at the ceiling
    // haveYouDied();
}
/*

function checkLineFilledAI() {
  //delete all rows before pushing lines above down
  //actually we shld delete a row, move lines down, then repeat the check and
  //delete new rows if they exist
  let rowWhichWasDeleted: number = 1;
  //keep a reference of the row which was deleted so we know to only move
  //rows above this row down
  for (let i = 1; i < boardHeight - 1; i++) {
    //everytime we commence scanning a new row, make sure rowFilled is reset to 0
    let rowFilled = 0;
    for (let j = boardWidth - 2; j > 0; j--) {
      if (gameBoardAI[i][j] === 2) {
        rowFilled++;
      }
    }
    //if a row is filled
    if (rowFilled === boardWidth - 2) {
      //deleteRow
      linesClearedScore++;
      scoreHTML.innerText = linesClearedScore.toString();
      for (let j = boardWidth - 2; j > 0; j--) {
        //update array: delete that row in the array
        gameBoardAI[i].splice(j, 1, 0);
      }
      //up to this point, the row has been deleted, now we need to move the pieces
      //which have a value of 2 down
      //since we only want to delete one row first, we shld get out of the loop

      //save this row to rowWhichWasDeleted
      rowWhichWasDeleted = i;
      //move 2s still remaining down by scanning upwards of the row which was deleted
      for (let k = rowWhichWasDeleted + 1; k < boardHeight - 1; k++) {
        for (let l = boardWidth - 2; l > 0; l--) {
          if (gameBoardAI[k][l] === 2) {
            //change the value of that cell in the array to a blank cell
            gameBoardAI[k].splice(l, 1, 0);
            gameBoardAI[k - 1].splice(l, 1, 2);
            //remove the fixed piece property of the cell's previous occupied cell
          }
        }
      }
      //modifier to i to ensure that after a row is deleted, code checks that line again
      //after the cells have dropped down to see if that new row has a filled row.
      i--;
    }
    //code to delete row ends here, scanning of next line continues
  }
}

function haveYouDiedAI() {
  for (let i = 1; i < boardWidth - 2; i++) {
    if (gameBoardAI[boardHeight - 4][i] === 2) {
      //you have died
      alert("You Died.");
    }
  }
}
*/
