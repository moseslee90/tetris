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
        heightPenalty = Math.pow(baby.genes.heightPenaltyGene, i);
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
    points = points + (baby.genes.borderGene * borderPiece);
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

function FRIENDthinking() {
  //edgeHit would be a variable that helps us determine if the edge has been hit
  //to get a limit for moveRight/moveLeft
  let edgeHit: boolean = false;
  let rightMovesAI: number = 0;
  const maximumRight: number = maxRight(gameBoard);
  const maximumLeft: number = maxLeft(gameBoard);
  let resultDecisionsAI: aiGameBoard[] = [];
  for (let k = 1; k < maximumLeft; k++) {
    let aiBoard = new aiGameBoardV2(gameBoard);
    aiBoard.right = false;
    aiBoard.id = k;
    aiBoard.rotate = 0;
    aiBoard.board = moveLeftAI(k, aiBoard.board);
    aiBoard.board = allTheWayDownAI(aiBoard.board);
    // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
    resultDecisionsAI.push(aiBoard);
  }

  for (let k = 0; k < maximumRight; k++) {
    let aiBoard = new aiGameBoardV2(gameBoard);
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
    resultDecisionsAI.push(aiBoard);
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
    resultDecisionsAI.push(aiBoard);
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

  console.log(resultDecisionsAI);
  for (let k = 0; k < resultDecisionsAI.length; k++) {
    examineBoard(resultDecisionsAI[k], firstBaby);
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
  let direction: string = "none";
  if (highestScoreRight === true) {
    direction = "right";
  } else {
    direction = "left";
  }
  console.log(
    "Rotate: " +
      highestScoreRotate +
      " Move " +
      direction +
      " " +
      highestScoreID
  );
  function FRIENDmove() {
    for (let i = 0; i < highestScoreRotate; i++) {
      rotatePiece(currentPiece, true);
    }
    if (highestScoreRight === true) {
      for (let i = 0; i < highestScoreID; i++) {
        moveRight();
      }
    } else {
      for (let i = 0; i < highestScoreID; i++) {
        moveLeft();
      }
    }
    allTheWayDown();
  }
  FRIENDmove();
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
