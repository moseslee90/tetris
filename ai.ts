//since main.ts will be the main running script,
//ai.ts will be where our imagination/simulation functions will be
//functions here will manipulate an imaginary version of the gameBoardAI
//there will be an array of decisions that gets generated
//each decision is scored based on the number of objectives it achieves.

//moveRightAI and moveLeftAI have to have a limiter set into them
//get moveRightAI and moveLeftAI to return some value
//if they hit the edge or obstacle

class aiGameBoard {
  board: number[][];
  id: number;
  right: boolean;
  points: number;
  constructor(id: number, right: boolean) {
    this.board = JSON.parse(JSON.stringify(gameBoard));
    this.id = id;
    this.right = right;
    this.points = 100;
  }
}

function examineBoard(aiGameBoardObject: aiGameBoard) {
  let points: number = 100;
  //checking for blank pockets between 2 vertical blocks
  for (let i = 1; i < boardHeight - 1; i++) {
    for (let j = 1; j < boardWidth - 2; j++) {
      if (aiGameBoardObject.board[i][j] === 0 && aiGameBoardObject.board[i+1][j] === 2) {
        points = points - 5;
      }
    }
  }
  //checking for lines filled
  for (let i = 1; i < boardHeight - 1; i++) {
    //everytime we commence scanning a new row, make sure rowFilled is reset to 0
    let rowFilled = 0;
    for (let j = boardWidth - 2; j > 0; j--) {
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
  let minColumnsToRightEdge: number = boardWidth;
  for (let i = boardWidth - 2; i > 1; i--) {
    //this for-loop below scans the current row at the bottom for a floor, use it to
    //instead scan how many rows till the floor
    for (let j = boardHeight - 1; j > 1; j--) {
      //1 or 4 found at this row
      //need to check which cell containing a 1 or a 4 has the lowest number of
      //steps till it reaches the floor
      if (gameBoardAI[j][i] === 1 || gameBoardAI[j][i] === 4) {
        //pieces found is true
        //now execute code to find shortest number of downward translations till
        //we hit a floor on one of the pieces
        for (let k = 0; i + k <= boardWidth - 1; k++) {
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
  let minColumnsToLeftEdge: number = boardWidth;
  for (let i = 1; i < boardWidth - 2; i++) {
    //this for-loop below scans the current row at the bottom for a floor, use it to
    //instead scan how many rows till the floor
    for (let j = boardHeight - 1; j > 1; j--) {
      //1 or 4 found at this row
      //need to check which cell containing a 1 or a 4 has the lowest number of
      //steps till it reaches the floor
      if (gameBoardAI[j][i] === 1 || gameBoardAI[j][i] === 4) {
        //pieces found is true
        //now execute code to find shortest number of downward translations till
        //we hit a floor on one of the pieces
        for (let k = 0; i - k >= 0; k++) {
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
  let edgeHit: boolean = false;
  let rightMovesAI: number = 0;
  const maximumRight: number = maxRight(gameBoard);
  const maximumLeft: number = maxLeft(gameBoard);
  let resultDecisionsAI: aiGameBoard[] = [];

  for (let k = 0; k < maximumRight; k++) {
    let aiBoard = new aiGameBoard(k, true);
    aiBoard.board = moveRightAI(k, aiBoard.board);
    aiBoard.board = allTheWayDownAI(aiBoard.board);
    // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
    resultDecisionsAI.push(aiBoard);
  }
  for (let k = 1; k < maximumLeft; k++) {
    let aiBoard = new aiGameBoard(k, false);
    aiBoard.board = moveLeftAI(k, aiBoard.board);
    aiBoard.board = allTheWayDownAI(aiBoard.board);
    // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
    resultDecisionsAI.push(aiBoard);
  }
  for (let k = 0; k < resultDecisionsAI.length; k++) {
    examineBoard(resultDecisionsAI[k]);
  }
  let highestScore: number = 0;
  let highestScoreID: number = 0;
  let highestScoreRight: boolean = true;
  for (let k = 0; k < resultDecisionsAI.length; k++) {
    if (resultDecisionsAI[k].points > highestScore) {
      highestScore = resultDecisionsAI[k].points;
      highestScoreID = resultDecisionsAI[k].id;
      highestScoreRight = resultDecisionsAI[k].right;      
    }
  }
  let direction: string = "none";
  if (highestScoreRight === true) {
    direction = "right";
  } else {
    direction = "left";
  }
  console.log("Rotate: " + " " + "Move " + direction + " " + highestScoreID);
}

function moveRightAI(moves, gameBoardAI) {
  for (let i = boardWidth - 2; i > 0; i--) {
    for (let j = 1; j < boardHeight; j++) {
      //code to manipulate array
      if (gameBoardAI[j][i] === 4) {
        gameBoardAI[j].splice(i, 1, 0);
        gameBoardAI[j].splice(i + moves, 1, 4);
      } else if (gameBoardAI[j][i] === 1) {
        gameBoardAI[j].splice(i, 1, 0);
        gameBoardAI[j].splice(i + moves, 1, 1);
      }
    }
  }
  return gameBoardAI;
}
function moveLeftAI(moves, gameBoardAI) {
  for (let i = boardWidth - 2; i > 0; i--) {
    for (let j = 1; j < boardHeight; j++) {
      //code to manipulate array
      if (gameBoardAI[j][i] === 4) {
        gameBoardAI[j].splice(i, 1, 0);
        gameBoardAI[j].splice(i - moves, 1, 4);
      } else if (gameBoardAI[j][i] === 1) {
        gameBoardAI[j].splice(i, 1, 0);
        gameBoardAI[j].splice(i - moves, 1, 1);
      }
    }
  }
  return gameBoardAI;
}

function allTheWayDownAI(gameBoardAI) {
  let floorFound: boolean = false;
  let minRowsToFloor: number = boardHeight;
  for (let i = 1; i < boardHeight; i++) {
    //this for-loop below scans the current row at the bottom for a floor, use it to
    //instead scan how many rows till the floor
    for (let j = boardWidth - 2; j > 0; j--) {
      //1 or 4 found at this row
      //need to check which cell containing a 1 or a 4 has the lowest number of
      //steps till it reaches the floor
      if (gameBoardAI[i][j] === 1 || gameBoardAI[i][j] === 4) {
        //pieces found is true
        //now execute code to find shortest number of downward translations till
        //we hit a floor on one of the pieces
        for (let k = 0; i - k >= 0; k++) {
          if (gameBoardAI[i - k][j] === 2) {
            minRowsToFloor = Math.min(k, minRowsToFloor);
            floorFound = true;
          }
        }
      }
    }
  }
  //reset piece rotation state for the next piece

  for (let i = 1; i < boardHeight; i++) {
    for (let j = boardWidth - 2; j > 0; j--) {
      if (gameBoardAI[i][j] === 1 || gameBoardAI[i][j] === 4) {
        if (gameBoardAI[i][j] === 4) {
          gameBoardAI[i].splice(j, 1, 0);
          gameBoardAI[i - minRowsToFloor + 1].splice(j, 1, 2);
        } else {
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

function haveYouDiedAI() {
  for (let i = 1; i < boardWidth - 2; i++) {
    if (gameBoardAI[boardHeight - 4][i] === 2) {
      //you have died
      alert("You Died.");
    }
  }
}
*/
