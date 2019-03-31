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
  rotate: number;
  constructor(right: boolean) {
    this.board = JSON.parse(JSON.stringify(gameBoard));
    this.right = right;
    this.points = 100;
  }
}

class aiGameBoardV2 {
  board: number[][];
  id: number;
  right: boolean;
  points: number;
  rotate: number;
  constructor(newBoard: number[][]) {
    this.board = JSON.parse(JSON.stringify(newBoard));
    this.points = 100;
  }
}

function FRIENDthinking() {
  let resultDecisionsAI: aiGameBoard[] = [];
  function examineBoard(aiGameBoardObject: aiGameBoard, baby: individual) {
    let points: number = baby.genes.pointsGene;
    //let's try to create an individual with genes
    //checking for blank pockets between 2 vertical blocks
    for (let i = 1; i < boardHeight - 1; i++) {
      for (let j = 1; j < boardWidth - 2; j++) {
        if (aiGameBoardObject.board[i][j] === 0) {
          for (let k = i + 1; k < boardHeight - 1; k++) {
            if (aiGameBoardObject.board[k][j] === 2) {
              points = points - baby.genes.blankPocketGene;
            }
          }
        }
      }
    }
    //checking for lines filled
    let rowsFilled: number = 0;
    for (let i = 1; i < boardHeight - 1; i++) {
      //everytime we commence scanning a new row, make sure rowFilled is reset to 0
      let rowFilled = 0;
      for (let j = boardWidth - 2; j > 0; j--) {
        if (aiGameBoardObject.board[i][j] === 2) {
          rowFilled++;
        }
      }
      if (rowFilled === boardWidth - 2) {
        rowsFilled++;
      }
    }
    switch (rowsFilled) {
      case 1:
        points = points + baby.genes.oneRowFilledGene;
        break;
      case 2:
        points = points + baby.genes.twoRowsFilledGene;
        break;
      case 3:
        points = points + baby.genes.threeRowsFilledGene;
        break;
      case 4:
        points = points + baby.genes.fourRowsFilledGene;
        break;

      default:
        break;
    }

    //penalise for high builds
    let heightPenalty = 0;
    for (let i = 1; i < boardHeight - 1; i++) {
      //everytime we commence scanning a new row, make sure rowFilled is reset to 0
      for (let j = boardWidth - 2; j > 0; j--) {
        if (aiGameBoardObject.board[i][j] === 2 && i > 4) {
          heightPenalty = baby.genes.heightPenaltyGene * i;
        }
      }
    }
    points = points - heightPenalty;
    //add points based on a consistent row
    for (let i = 1; i < boardHeight - 1; i++) {
      //everytime we commence scanning a new row, make sure rowFilled is reset to 0
      let rowlink = 0;
      for (let j = 1; j < boardWidth - 3; j++) {
        if (
          aiGameBoardObject.board[i][j] === 2 &&
          aiGameBoardObject.board[i][j + 1] === 2
        ) {
          rowlink++;
          points = points + Math.pow(baby.genes.consecutiveRowGene, rowlink);
        } else {
          rowlink = 0;
        }
      }
    }
    //add points if pieces are against wall
    for (let i = 1; i < boardHeight - 1; i++) {
      //everytime we commence scanning a new row, make sure rowFilled is reset to 0
      let borderPiece = 0;
      for (let j = 1; j < boardWidth - 2; j++) {
        if (
          (aiGameBoardObject.board[i][j] === 2 &&
            aiGameBoardObject.board[i][j + 1] === 3) ||
          (aiGameBoardObject.board[i][j] === 2 &&
            aiGameBoardObject.board[i][j - 1] === 3)
        ) {
          borderPiece++;
        }
      }
      points = points + baby.genes.borderGene * borderPiece;
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
    return minColumnsToLeftEdge;
  }
  function evaluateSecondBoard(secondBoard: number[][]) {
    const maximumRight: number = maxRight(secondBoard);
    const maximumLeft: number = maxLeft(secondBoard);
    for (let k = 1; k < maximumLeft; k++) {
      let aiBoard = new aiGameBoardV2(secondBoard);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 0;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }

    for (let k = 0; k < maximumRight; k++) {
      let aiBoard = new aiGameBoardV2(secondBoard);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 0;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
      resultDecisionsAI.push(aiBoard);
    }
    //for each rotation, we need to recalculate maximumRight and maximum Left
    //maximumLeft and Right can recalculate based on the board passed into them
    //rotate, pass resultant board into maximumRIght/Left, get a constant
    //and use that constant to loop through
    let firstRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(secondBoard);
    firstRotateBoardR.board = rotatePieceAI(
      firstRotateBoardR.board,
      currentPiece,
      1
    );
    const maxRightR1: number = maxRight(firstRotateBoardR.board);
    for (let k = 0; k < maxRightR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 1;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let secondRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(secondBoard);
    secondRotateBoardR.board = rotatePieceAI(
      secondRotateBoardR.board,
      currentPiece,
      2
    );
    const maxRightR2: number = maxRight(secondRotateBoardR.board);
    for (let k = 0; k < maxRightR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 2;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let thirdRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(secondBoard);
    thirdRotateBoardR.board = rotatePieceAI(
      thirdRotateBoardR.board,
      currentPiece,
      3
    );
    const maxRightR3: number = maxRight(thirdRotateBoardR.board);
    for (let k = 0; k < maxRightR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 3;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let firstRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      firstRotateBoardR.board
    );
    // firstRotateBoardL.board = rotatePieceAI(
    //   firstRotateBoardL.board,
    //   currentPiece,
    //   1
    // );
    const maxLeftR1: number = maxLeft(firstRotateBoardL.board);
    for (let k = 0; k < maxLeftR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 1;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let secondRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      secondRotateBoardR.board
    );
    // secondRotateBoardL.board = rotatePieceAI(
    //   secondRotateBoardL.board,
    //   currentPiece,
    //   2
    // );
    const maxLeftR2: number = maxLeft(secondRotateBoardL.board);
    for (let k = 0; k < maxLeftR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 2;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let thirdRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      thirdRotateBoardR.board
    );
    // thirdRotateBoardL.board = rotatePieceAI(
    //   thirdRotateBoardL.board,
    //   currentPiece,
    //   3
    // );
    const maxLeftR3: number = maxLeft(thirdRotateBoardL.board);
    for (let k = 0; k < maxLeftR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 3;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
  }
  //edgeHit would be a variable that helps us determine if the edge has been hit
  //to get a limit for moveRight/moveLeft
  if (gameOver === true) {
  } else {
    const maximumRight: number = maxRight(gameBoard);
    const maximumLeft: number = maxLeft(gameBoard);
    
    for (let k = 1; k < maximumLeft; k++) {
      let aiBoard = new aiGameBoardV2(gameBoard);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 0;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      //clear lines on board to prepare for next piece
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      //pass in the board with a new piece here and allow
      //this functions to iterate through all the possible
      //permutations with this second piece in consideration
      evaluateSecondBoard(aiBoard.board);
    }

    for (let k = 0; k < maximumRight; k++) {
      let aiBoard = new aiGameBoardV2(gameBoard);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 0;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    //for each rotation, we need to recalculate maximumRight and maximum Left
    //maximumLeft and Right can recalculate based on the board passed into them
    //rotate, pass resultant board into maximumRIght/Left, get a constant
    //and use that constant to loop through
    let firstRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(gameBoard);
    firstRotateBoardR.board = rotatePieceAI(
      firstRotateBoardR.board,
      currentPiece,
      1
    );
    const maxRightR1: number = maxRight(firstRotateBoardR.board);
    for (let k = 0; k < maxRightR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 1;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    let secondRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(gameBoard);
    secondRotateBoardR.board = rotatePieceAI(
      secondRotateBoardR.board,
      currentPiece,
      2
    );
    const maxRightR2: number = maxRight(secondRotateBoardR.board);
    for (let k = 0; k < maxRightR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 2;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    let thirdRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(gameBoard);
    thirdRotateBoardR.board = rotatePieceAI(
      thirdRotateBoardR.board,
      currentPiece,
      3
    );
    const maxRightR3: number = maxRight(thirdRotateBoardR.board);
    for (let k = 0; k < maxRightR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardR.board);
      aiBoard.right = true;
      aiBoard.id = k;
      aiBoard.rotate = 3;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    let firstRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      firstRotateBoardR.board
    );
    const maxLeftR1: number = maxLeft(firstRotateBoardL.board);
    for (let k = 0; k < maxLeftR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 1;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    let secondRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      secondRotateBoardR.board
    );
    // secondRotateBoardL.board = rotatePieceAI(
    //   secondRotateBoardL.board,
    //   currentPiece,
    //   2
    // );
    const maxLeftR2: number = maxLeft(secondRotateBoardL.board);
    for (let k = 0; k < maxLeftR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 2;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }
    let thirdRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      thirdRotateBoardR.board
    );
    // thirdRotateBoardL.board = rotatePieceAI(
    //   thirdRotateBoardL.board,
    //   currentPiece,
    //   3
    // );
    const maxLeftR3: number = maxLeft(thirdRotateBoardL.board);
    for (let k = 0; k < maxLeftR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardL.board);
      aiBoard.right = false;
      aiBoard.id = k;
      aiBoard.rotate = 3;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      aiBoard.board = checkLineFilledAI(aiBoard.board);
      aiBoard.board = generateNewPieceAI(
        aiBoard.board,
        holdingPiece.template[0],
        spawnX,
        spawnY
      );
      evaluateSecondBoard(aiBoard.board);
    }

    // console.log(resultDecisionsAI);
    for (let k = 0; k < resultDecisionsAI.length; k++) {
      examineBoard(resultDecisionsAI[k], goodBaby);
    }
    let highestScore: number = 0;
    let highestScoreID: number = 0;
    let highestScoreRight: boolean = true;
    let highestScoreRotate: number = 0;
    for (let k = 0; k < resultDecisionsAI.length; k++) {
      if (resultDecisionsAI[k].points > highestScore) {
        highestScore = resultDecisionsAI[k].points;
        highestScoreID = resultDecisionsAI[k].id;
        highestScoreRight = resultDecisionsAI[k].right;
        highestScoreRotate = resultDecisionsAI[k].rotate;
      }
    }
    let finalDecision = {
      rotations: highestScoreRotate,
      direction: highestScoreRight,
      moves: highestScoreID
    };
    function emptyDecisions() {
      resultDecisionsAI.length = 0;
    }
    emptyDecisions();
    return finalDecision;
  }
}
function FRIENDmove(decision: decision) {
  for (var i = 0; i < decision.rotations; i++) {
    rotatePiece(currentPiece, true);
  }
  if (decision.direction === true) {
    for (var i = 0; i < decision.moves; i++) {
      moveRight();
    }
  } else {
    for (var i = 0; i < decision.moves; i++) {
      moveLeft();
    }
  }
  allTheWayDown();
}
function generateNewPieceAI(
  board: number[][],
  template: number[][],
  positionX: number,
  positionY: number
) {
  //function generates a new piece based on the template given,
  //at the specified location entered, with the position being the left corner of the template

  //add a loop check of target cells to be filled with new template
  //if cells on the left currently contain a wall (3) or other piece (2),
  //but the ones on the right do not, move translation to the right posX+1
  //only do these checks if the transformation contains a piece in that row or column
  //vice versa for the cells containing occupants on the right side but not on the left posX-1
  //if both the left and right contain neighbors, do nothing
  //keep pieces from phasing into the ground by not allowing transformations which occupy already occupied bottom cells.

  for (let i = 0; i < template.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      if (template[i][j] === 1 || template[i][j] === 4) {
        let yCoordinate: number = positionY + i;
        let xCoordinate: number = positionX + j;
        board[yCoordinate][xCoordinate] = template[i][j];
      }
    }
  }
  return board;
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
  for (let i = 1; i < boardWidth - 2; i++) {
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

function checkLineFilledAI(board: number[][]) {
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
      if (board[i][j] === 2) {
        rowFilled++;
      }
    }
    //if a row is filled
    if (rowFilled === boardWidth - 2) {
      //deleteRow
      for (let j = boardWidth - 2; j > 0; j--) {
        //update array: delete that row in the array
        board[i].splice(j, 1, 0);
      }
      //up to this point, the row has been deleted, now we need to move the pieces
      //which have a value of 2 down
      //since we only want to delete one row first, we shld get out of the loop

      //save this row to rowWhichWasDeleted
      rowWhichWasDeleted = i;
      //move 2s still remaining down by scanning upwards of the row which was deleted
      for (let k = rowWhichWasDeleted + 1; k < boardHeight - 1; k++) {
        for (let l = boardWidth - 2; l > 0; l--) {
          if (board[k][l] === 2) {
            //change the value of that cell in the array to a blank cell
            board[k].splice(l, 1, 0);
            board[k - 1].splice(l, 1, 2);
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
  return board;
}

function rotatePieceAI(
  //pass in the very first boardTemplate and get this function to return
  //another boardTemplate
  boardTemplate: number[][],
  //we can probably pass in currentPiece for tetronomino
  tetronomino: tetronomino,
  //rotations will be some number from 0 to 3
  rotations: number
) {
  // let currentTemplate: number[][] = tetronomino.template[pieceRotationState];
  // let anchorTemplatePosX: number;
  // let anchorTemplatePosY: number;
  let nextTemplate: number[][] = tetronomino.template[rotations];
  // let xCorner: number;
  // let yCorner: number;
  // for (let i = 0; i < currentTemplate.length; i++) {
  //   for (let j = 0; j < currentTemplate[i].length; j++) {
  //     if (currentTemplate[i][j] === 4) {
  //       anchorTemplatePosY = i;
  //       anchorTemplatePosX = j;
  //     }
  //   }
  // }
  // for (let i = 1; i < boardWidth - 1; i++) {
  //   for (let j = 1; j < boardHeight; j++) {
  //     //finds anchor which is identified as 4
  //     if (boardTemplate[j][i] === 4) {
  //       console.log("anchor found at " + i + "-" + j);
  //       let anchorX = -anchorTemplatePosX;
  //       let anchorY = -anchorTemplatePosY;
  //       //xCoordinate and yCoordinate represent the location of the corner
  //       //of the template inside the gameBoard
  //       xCorner = i + anchorX;
  //       yCorner = j + anchorY;
  //     }
  //   }
  // }
  for (let k = 1; k < boardWidth - 1; k++) {
    for (let l = 1; l < boardHeight; l++) {
      if (boardTemplate[l][k] === 1 || boardTemplate[l][k] === 4) {
        boardTemplate[l].splice(k, 1, 0);
      }
    }
  }
  for (let i = 0; i < nextTemplate.length; i++) {
    for (let j = 0; j < nextTemplate[i].length; j++) {
      if (nextTemplate[i][j] === 1 || nextTemplate[i][j] === 4) {
        let yCoordinate: number = spawnY + i;
        let xCoordinate: number = spawnX + j;
        boardTemplate[yCoordinate][xCoordinate] = nextTemplate[i][j];
        //   element.classList.add("moving-piece");
      }
    }
  }
  return boardTemplate;
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
