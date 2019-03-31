const jsonFile = require("jsonfile");
const file = "data.json";
class genes {
  pointsGene: number;
  heightPenaltyGene: number;
  oneRowFilledGene: number;
  twoRowsFilledGene: number;
  threeRowsFilledGene: number;
  fourRowsFilledGene: number;
  consecutiveRowGene: number;
  blankPocketGene: number;
  borderGene: number;

  constructor() {}
}

interface genes {
  pointsGene: number;
  heightPenaltyGene: number;
  oneRowFilledGene: number;
  twoRowsFilledGene: number;
  threeRowsFilledGene: number;
  fourRowsFilledGene: number;
  consecutiveRowGene: number;
  blankPocketGene: number;
  borderGene: number;
}

class individual {
  genes: genes;
  fitness: number;
  constructor() {
    this.genes = {
      pointsGene: 0,
      heightPenaltyGene: 0,
      oneRowFilledGene: 0,
      twoRowsFilledGene: 0,
      threeRowsFilledGene: 0,
      fourRowsFilledGene: 0,
      consecutiveRowGene: 0,
      blankPocketGene: 0,
      borderGene: 0
    };
  }
  randomGenes() {
    let points = 2000;
    let heightPenalty: number = Math.random() * 5 + 1;

    let oneRowFilled: number = Math.random() * 21;
    let twoRowsFilled: number = Math.random() * 21 + 20;
    let threeRowsFilled: number = Math.random() * 21 + 40;
    let fourRowsFilled: number = Math.random() * 21 + 60;

    let consecutiveRow: number = Math.random() * 3 + 1;

    let blankPocket: number = Math.random() * 31;

    let borderPoints: number = Math.random() * 3 + 1;

    this.genes = {
      pointsGene: points,
      heightPenaltyGene: heightPenalty,
      oneRowFilledGene: oneRowFilled,
      twoRowsFilledGene: twoRowsFilled,
      threeRowsFilledGene: threeRowsFilled,
      fourRowsFilledGene: fourRowsFilled,
      consecutiveRowGene: consecutiveRow,
      blankPocketGene: blankPocket,
      borderGene: borderPoints
    };
  }
}

class population {
  individuals: individual[];

  constructor() {
    for (let i = 0; i < 100; i++) {
      const newIndividual = new individual();
      newIndividual.randomGenes();
      this.individuals.push(newIndividual);
    }
  }
}
//since main.ts will be the main running script,
//ai.ts will be where our imagination/simulation functions will be
//functions here will manipulate an imaginary version of the gameBoardAI
//there will be an array of decisions that gets generated
//each decision is scored based on the number of objectives it achieves.

//moveRightAI and moveLeftAI have to have a limiter set into them
//get moveRightAI and moveLeftAI to return some value
//if they hit the edge or obstacle
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
  function evaluateSecondBoard(
    secondBoard: number[][],
    rotations: number,
    direction: boolean,
    moves: number
  ) {
    const maximumRight: number = maxRight(secondBoard);
    const maximumLeft: number = maxLeft(secondBoard);
    for (let k = 1; k < maximumLeft; k++) {
      let aiBoard = new aiGameBoardV2(secondBoard);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }

    for (let k = 0; k < maximumRight; k++) {
      let aiBoard = new aiGameBoardV2(secondBoard);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
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
      holdingPiece,
      1
    );
    const maxRightR1: number = maxRight(firstRotateBoardR.board);
    for (let k = 0; k < maxRightR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardR.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let secondRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(secondBoard);
    secondRotateBoardR.board = rotatePieceAI(
      secondRotateBoardR.board,
      holdingPiece,
      2
    );
    const maxRightR2: number = maxRight(secondRotateBoardR.board);
    for (let k = 0; k < maxRightR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardR.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let thirdRotateBoardR: aiGameBoardV2 = new aiGameBoardV2(secondBoard);
    thirdRotateBoardR.board = rotatePieceAI(
      thirdRotateBoardR.board,
      holdingPiece,
      3
    );
    const maxRightR3: number = maxRight(thirdRotateBoardR.board);
    for (let k = 0; k < maxRightR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardR.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveRightAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let firstRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      firstRotateBoardR.board
    );
    const maxLeftR1: number = maxLeft(firstRotateBoardL.board);
    for (let k = 0; k < maxLeftR1; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(firstRotateBoardL.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let secondRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      secondRotateBoardR.board
    );
    const maxLeftR2: number = maxLeft(secondRotateBoardL.board);
    for (let k = 0; k < maxLeftR2; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(secondRotateBoardL.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
      aiBoard.board = moveLeftAI(k, aiBoard.board);
      aiBoard.board = allTheWayDownAI(aiBoard.board);
      resultDecisionsAI.push(aiBoard);
    }
    let thirdRotateBoardL: aiGameBoardV2 = new aiGameBoardV2(
      thirdRotateBoardR.board
    );
    const maxLeftR3: number = maxLeft(thirdRotateBoardL.board);
    for (let k = 0; k < maxLeftR3; k++) {
      let aiBoard: aiGameBoardV2 = new aiGameBoardV2(thirdRotateBoardL.board);
      aiBoard.right = direction;
      aiBoard.id = moves;
      aiBoard.rotate = rotations;
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
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
      evaluateSecondBoard(
        aiBoard.board,
        aiBoard.rotate,
        aiBoard.right,
        aiBoard.id
      );
    }

    // console.log(resultDecisionsAI);
    for (let k = 0; k < resultDecisionsAI.length; k++) {
      examineBoard(resultDecisionsAI[k], firstBaby);
    }
    // console.log(resultDecisionsAI);
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


let gameBoard: number[][];
let holdingBoardArray: number[][];
let boardHeight: number = 25;
let boardWidth: number = 12;
let holdingHeight: number = 4;
let holdingWidth: number = 4;
let spawnX: number = 4;
let spawnY: number = boardHeight - 4;
let gravity;
// let pieceRotationState: number = 4;
let currentPiece: tetronomino;
let pieceRotationState: number = 0;
let linesClearedScore: number = 0;
let speedOfGravity: number = 800;
let holdingPiece: tetronomino;
let newGame: boolean = true;
let pause: boolean = false;

let gameOver: boolean = false;
let gameTime: number = 0;
let gameClockToggleState: boolean = true;
let gameClockIntervalFunction;
let sixtiethOfASecondInMilliseconds: number = 50 / 3;
let currentDecision: decision;

let firstBaby = new individual();
let numberOfRuns = 0;
let goodBabies: individual[] = [];

let goodBaby = new individual();
goodBaby.randomGenes();
goodBaby.genes.pointsGene = 2000;
goodBaby.genes.blankPocketGene = 20;
goodBaby.genes.oneRowFilledGene = 10;
goodBaby.genes.twoRowsFilledGene = 25;
goodBaby.genes.threeRowsFilledGene = 45;
goodBaby.genes.fourRowsFilledGene = 70;
goodBaby.genes.heightPenaltyGene = 1.5;
goodBaby.genes.consecutiveRowGene = 1.3;
goodBaby.genes.borderGene = 1.3;

interface decision {
  rotations: number;
  direction: boolean;
  moves: number;
}

interface tetronomino {
  template: number[][][];
}
//template 1 to 4 go in clockwise
function pieceL() {
  this.template = [
    [[0, 4, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 1, 1]],
    [[0, 0, 4, 0], [0, 0, 1, 0], [0, 1, 1, 0]],
    [[1, 1, 4, 0], [0, 0, 1, 0]]
  ];
}
function pieceJ() {
  this.template = [
    [[0, 4, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 4, 1, 1], [0, 1, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]],
    [[0, 0, 4, 0], [1, 1, 1, 0]]
  ];
}

function pieceO() {
  this.template = [
    [[0, 4, 1, 0], [0, 1, 1, 0]],
    [[0, 4, 1, 0], [0, 1, 1, 0]],
    [[0, 4, 1, 0], [0, 1, 1, 0]],
    [[0, 4, 1, 0], [0, 1, 1, 0]]
  ];
}

function pieceZ() {
  this.template = [
    [[0, 4, 1, 0], [1, 1, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0]],
    [[0, 4, 1, 0], [1, 1, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0]]
  ];
}

function pieceS() {
  this.template = [
    [[0, 1, 4, 0], [0, 0, 1, 1]],
    [[0, 0, 4, 0], [0, 1, 1, 0], [0, 1, 0, 0]],
    [[0, 1, 4, 0], [0, 0, 1, 1]],
    [[0, 0, 4, 0], [0, 1, 1, 0], [0, 1, 0, 0]]
  ];
}

function pieceT() {
  this.template = [
    [[0, 1, 4, 1], [0, 0, 1, 0]],
    [[0, 0, 4, 0], [0, 0, 1, 1], [0, 0, 1, 0]],
    [[0, 0, 4, 0], [0, 1, 1, 1]],
    [[0, 0, 4, 0], [0, 1, 1, 0], [0, 0, 1, 0]]
  ];
}

function pieceI() {
  this.template = [
    [[0, 4, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    [[4, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    [[4, 1, 1, 1], [0, 0, 0, 0]]
  ];
}

function coordinates(x: number, y: number) {
  let xCoordinate: string = x.toString();
  let yCoordinate: string = y.toString();
  let coordinates: string = xCoordinate + "-" + yCoordinate;
  return coordinates;
}

function coordinatesHolding(x: number, y: number) {
  let xCoordinate: string = x.toString();
  let yCoordinate: string = y.toString();
  let coordinates: string = xCoordinate + "h" + yCoordinate;
  return coordinates;
}

function setupBoard() {
  numberOfRuns++;
  firstBaby = new individual();
  firstBaby.randomGenes();


  gameBoard = [];

  //creates board from bottom right to top left,
  for (let i = boardHeight - 1; i > -1; i--) {
    let array2d: number[] = [];
    for (let j = 0; j < boardWidth; j++) {
      //make borders
      if (i === boardHeight - 1) {
        array2d.push(2);
      } else if (j === 0 || j === boardWidth - 1) {
        //add object property for code computation
        array2d.push(3);
      } else {
        array2d.push(0);
      }

    }
    gameBoard.push(array2d);
  }

  // holding area code to be finalised

  holdingBoardArray = [];
  for (let i = holdingHeight - 1; i > -1; i--) {
    let array2d: number[] = [];
    for (let j = 0; j < holdingWidth; j++) {
      array2d.push(0);
    }
    holdingBoardArray.push(array2d);
  }
}

setupBoard();

function generateNewPiece(
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
        gameBoard[yCoordinate][xCoordinate] = template[i][j];
      }
    }
  }
}

function clearHoldingArea() {
  for (let i = 0; i < holdingWidth; i++) {
    for (let j = 0; j < holdingHeight; j++) {
      holdingBoardArray[j][i] = 0;
    }
  }
}

function generateNewPieceHolding(
  template: number[][],
  positionX: number,
  positionY: number
) {
  clearHoldingArea();
  //generating the nextPiece on the holding area
  for (let i = 0; i < template.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      if (template[i][j] === 1 || template[i][j] === 4) {
        let yCoordinate: number = positionY + i;
        let xCoordinate: number = positionX + j;
        holdingBoardArray[yCoordinate][xCoordinate] = template[i][j];
      }
    }
  }
}

function haveYouDied() {
  for (let i = 1; i < boardWidth - 2; i++) {
    if (gameBoard[boardHeight - 4][i] === 2) {
      //you have died
      if (linesClearedScore > 80) {
        //good babies go here
        console.log("good baby found! Fitness: " + linesClearedScore);
        firstBaby.fitness = linesClearedScore;
        goodBabies.push(firstBaby);
      }
      if (numberOfRuns > 1000) {
        gameOver = true;
        console.log("100 runs over!");
        jsonFile.readFile(file, (err, obj) => {
            if (err) {
              console.log(err);
            }
            goodBabies.forEach(baby => {
                obj.population.push(baby);
            });
            jsonFile.writeFile(file, obj, err => {
              console.log(err);
            });
          });
        return;
      } else {
        linesClearedScore = 0;
        setupBoard();
        return;
      }
    }
  }
}

function moveRight() {
  for (let i = boardWidth - 2; i > 0; i--) {
    for (let j = 1; j < boardHeight; j++) {
      if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        (gameBoard[j][i + 1] === 3 || gameBoard[j][i + 1] === 2)
      ) {
        return;
      } else if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        gameBoard[j][i + 1] === 0
      ) {
        //code to manipulate array
        if (gameBoard[j][i] === 4) {
          gameBoard[j].splice(i, 1, 0);
          gameBoard[j].splice(i + 1, 1, 4);
        } else {
          gameBoard[j].splice(i, 1, 0);
          gameBoard[j].splice(i + 1, 1, 1);
        }
      }
    }
  }
}

function moveLeft() {
  for (let i = 1; i < boardWidth - 1; i++) {
    for (let j = 1; j < boardHeight; j++) {
      if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        (gameBoard[j][i - 1] === 3 || gameBoard[j][i - 1] === 2)
      ) {
        return;
      } else if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        gameBoard[j][i - 1] === 0
      ) {
        //code to manipulate array
        if (gameBoard[j][i] === 4) {
          gameBoard[j].splice(i, 1, 0);
          gameBoard[j].splice(i - 1, 1, 4);
        } else {
          gameBoard[j].splice(i, 1, 0);
          gameBoard[j].splice(i - 1, 1, 1);
        }
      }
    }
  }
}
//time for gravity
function checkLineFilled() {
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
      if (gameBoard[i][j] === 2) {
        rowFilled++;
      }
    }
    //if a row is filled
    if (rowFilled === boardWidth - 2) {
      //deleteRow
      linesClearedScore++;
      for (let j = boardWidth - 2; j > 0; j--) {
        //update array: delete that row in the array
        gameBoard[i].splice(j, 1, 0);
      }
      //up to this point, the row has been deleted, now we need to move the pieces
      //which have a value of 2 down
      //since we only want to delete one row first, we shld get out of the loop

      //save this row to rowWhichWasDeleted
      rowWhichWasDeleted = i;
      //move 2s still remaining down by scanning upwards of the row which was deleted
      for (let k = rowWhichWasDeleted + 1; k < boardHeight - 1; k++) {
        for (let l = boardWidth - 2; l > 0; l--) {
          if (gameBoard[k][l] === 2) {
            //change the value of that cell in the array to a blank cell
            gameBoard[k].splice(l, 1, 0);
            gameBoard[k - 1].splice(l, 1, 2);
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
function moveDown() {
  let floorFound: boolean = false;
  //scan 4 rows first before moving to execute translation on individual cells
  for (let i = 1; i < boardHeight; i++) {
    for (let j = boardWidth - 2; j > 0; j--) {
      if (
        (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
        gameBoard[i - 1][j] === 2
      ) {
        floorFound = true;
      }
    }
    if (floorFound === true) {
      //reset piece rotation state for the next piece
      pieceRotationState = 0;
      //turn piece into fixed piece
      for (let i = 1; i < boardHeight - 1; i++) {
        for (let j = boardWidth - 2; j > 0; j--) {
          if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
            gameBoard[i].splice(j, 1, 2);
          }
        }
      }
      //code to generate new piece here
      spawnNewPiece();
      checkLineFilled();
      //kill game here if resultant board has a piece at the ceiling
      haveYouDied();
      // goGoGravity();
      return;
    }
  }
  for (let i = 1; i < boardHeight; i++) {
    for (let j = boardWidth - 2; j > 0; j--) {
      if (
        (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
        gameBoard[i - 1][j] === 3
      ) {
        return;
        //add ability to detect other pieces too later
      } else if (
        (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
        gameBoard[i - 1][j] === 0
      ) {
        //code to manipulate array
        if (gameBoard[i][j] === 4) {
          gameBoard[i].splice(j, 1, 0);
          gameBoard[i - 1].splice(j, 1, 4);
        } else {
          gameBoard[i].splice(j, 1, 0);
          gameBoard[i - 1].splice(j, 1, 1);
        }
        //code to manipulate HTML
      }
    }
  }
}

//in order to create an allTheWayDown function,
//code scans template and board, to find floor===true situation
function allTheWayDown() {
  let floorFound: boolean = false;
  let minRowsToFloor: number = boardHeight;
  for (let i = 1; i < boardHeight; i++) {
    //this for-loop below scans the current row at the bottom for a floor, use it to
    //instead scan how many rows till the floor
    for (let j = boardWidth - 2; j > 0; j--) {
      //1 or 4 found at this row
      //need to check which cell containing a 1 or a 4 has the lowest number of
      //steps till it reaches the floor
      if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
        //pieces found is true
        //now execute code to find shortest number of downward translations till
        //we hit a floor on one of the pieces
        for (let k = 0; i - k >= 0; k++) {
          if (gameBoard[i - k][j] === 2) {
            minRowsToFloor = Math.min(k, minRowsToFloor);
            floorFound = true;
          }
        }
      }
    }
  }
  //reset piece rotation state for the next piece
  pieceRotationState = 0;
  for (let i = 1; i < boardHeight; i++) {
    for (let j = boardWidth - 2; j > 0; j--) {
      if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
        if (gameBoard[i][j] === 4) {
          gameBoard[i].splice(j, 1, 0);
          gameBoard[i - minRowsToFloor + 1].splice(j, 1, 2);
        } else {
          gameBoard[i].splice(j, 1, 0);
          gameBoard[i - minRowsToFloor + 1].splice(j, 1, 2);
        }
        //code to manipulate HTML
      }
    }
  }
  //code to generate new piece here
  spawnNewPiece();
  checkLineFilled();
  //kill game here if resultant board has a piece at the ceiling
  haveYouDied();
  // FRIENDthinking();
}

function rotatePiece(tetronomino: tetronomino, clockwise: boolean) {
  //get reference position of anchor
  let currentTemplate: number[][] = tetronomino.template[pieceRotationState];
  let anchorTemplatePosX: number;
  let anchorTemplatePosY: number;
  //loop through template to find reference of 4 relative within the template
  for (let i = 0; i < currentTemplate.length; i++) {
    for (let j = 0; j < currentTemplate[i].length; j++) {
      if (currentTemplate[i][j] === 4) {
        anchorTemplatePosY = i;
        anchorTemplatePosX = j;
      }
    }
  }
  //establish rotation direction
  if (clockwise === true) {
    //next template is the clockwise transformation of the current template which is the the 2d array in the 3d template array
    pieceRotationState++;
  } else {
    //else next template is the ACW transformation
    pieceRotationState--;
  }
  if (pieceRotationState > 3) {
    pieceRotationState = 0;
  } else if (pieceRotationState < 0) {
    pieceRotationState = 3;
  }
  //prepare next template
  let nextTemplate: number[][] = tetronomino.template[pieceRotationState];

  //need to ensure rotatePiece function checks board for collisions and adjusts replacement of piece template accordingly to avoid 'phasing' of blocks into walls and floor and other pieces

  //loop through entire board to find anchor of current piece
  for (let i = 1; i < boardWidth - 1; i++) {
    for (let j = 1; j < boardHeight; j++) {
      //finds anchor which is identified as 4
      if (gameBoard[j][i] === 4) {
        let anchorX = -anchorTemplatePosX;
        let anchorY = -anchorTemplatePosY;
        //xCoordinate and yCoordinate represent the location of the corner
        //of the template inside the gameBoard
        let xCoordinate = i + anchorX;
        let yCoordinate = j + anchorY;
        //clear ONEs  and FOURs currently on board only after check
        //has been done that replacement template does not have collisions

        //first initialise collision as true
        //change value later on to false if checks yield no collisions
        let collision: boolean = true;
        let leftCollision: number = 0;
        let rightCollision: number = 0;
        let collisionCount: number = 0;
        //we need to go to the top of the loop again as soon as left collision or
        //right collision have been updated after finding a collision to ensure
        //we don't get multiple updates of left or right collision.
        collisionWhile: while (collision === true) {
          //loop through template coordinates
          for (let k = 0; k < nextTemplate.length; k++) {
            for (let l = 0; l < nextTemplate[k].length; l++) {
              //on the nextTemplate coordinates which have a value of 1 or 4
              if (nextTemplate[k][l] === 1 || nextTemplate[k][l] === 4) {
                //using the location of the corner on the gameBoard, create a
                //reference of nextTemplate's individual coordinates with
                //cellPosY and cellPosX
                let cellPosY: number = yCoordinate + k;
                let cellPosX: number =
                  xCoordinate + l + leftCollision - rightCollision;
                if (
                  gameBoard[cellPosY][cellPosX] === 2 ||
                  gameBoard[cellPosY][cellPosX] === 3
                ) {
                  //if a value of 2 or 3 is found already present on the gameBoard
                  //at the location that we would like to place nextTemplate's
                  //1 or 4; collision found
                  collision = true;

                  //find column of collision
                  if (l === 0) {
                    //leftmost column
                    collisionCount++;
                    //if collision is found on the left, add 1 to leftCollision
                    leftCollision = leftCollision + 1;
                  } else if (l === 1) {
                    //center left column
                    collisionCount++;
                    //if collision is found on the center left, add 1 to leftCollision
                    leftCollision = leftCollision + 1;
                  } else if (l === 2) {
                    //center right column
                    collisionCount++;
                    //if collision is found on the center right, add 1 to rightCollision
                    rightCollision = rightCollision + 1;
                  } else if (l === 3) {
                    //right most column
                    collisionCount++;
                    //if collision is found on the right, add 1 to rightCollision
                    rightCollision = rightCollision + 1;
                  }
                  if (leftCollision > 0 && rightCollision > 0) {
                    //get out of loop since left collision and right collision have been met which means piece is phasing through pieces/walls
                    //restore previous rotation state
                    if (clockwise === true) {
                      //next template is the clockwise transformation of the current template which is the the 2d array in the 3d template array
                      pieceRotationState--;
                    } else {
                      //else next template is the ACW transformation
                      pieceRotationState++;
                    }
                    if (pieceRotationState > 3) {
                      pieceRotationState = 0;
                    } else if (pieceRotationState < 0) {
                      pieceRotationState = 3;
                    }
                    //probably don't need to do this, but just to be sure that collision is still true
                    collision = true;
                    //we can exit function since rotate shld not be executed with collisions on the left and right
                    return;
                  }
                  //continue to the top of the while loop and go through the
                  //for loops again to find out if the new values of right/left collision
                  //have modified the position of nextTemplate to be in a non-collision state
                  continue collisionWhile;
                } else {
                  //declare collision as false if current value of leftCollision or rightCollision presents a scenario where a collision is avoided
                  //only way to exit the loop and
                  collision = false;
                }
                //if left or right collision displaces the piece by 2, we can still allow
                //the loop to run one more time to check if the collision still exists
                //but if the colli
                if (leftCollision > 2 || rightCollision > 2) {
                  //if collisions result in a displacement of more than 2, exit immediately
                  //and stop function
                  if (clockwise === true) {
                    //ensure that we put pieceRotationState back into
                    //the value it was before the function was called
                    pieceRotationState--;
                  } else {
                    //else next template is the ACW transformation
                    pieceRotationState++;
                  }
                  if (pieceRotationState > 3) {
                    pieceRotationState = 0;
                  } else if (pieceRotationState < 0) {
                    pieceRotationState = 3;
                  }
                  return;
                }
              }
            }
          }
        }
        //add in another loop to check for floor collisions
        //clear piece from table if collisions is false ie no collisions or collision resolved through displacement
        for (let k = 1; k < boardWidth - 1; k++) {
          for (let l = 1; l < boardHeight; l++) {
            if (gameBoard[l][k] === 1 || gameBoard[l][k] === 4) {
              gameBoard[l].splice(k, 1, 0);
            }
          }
        }
        //replace ONEs around anchor
        generateNewPiece(
          nextTemplate,
          xCoordinate + leftCollision - rightCollision,
          yCoordinate
        );
        // goGoGravity();
        return;
      }
    }
  }
}

function pauseGame() {
  if (pause === true) {
    pause = false;
  } else {
    pause = true;
  }
}

function gameClock() {
  while (gameOver === false) {
    currentDecision = FRIENDthinking();
    FRIENDmove(currentDecision);
  }
}

function spawnNewPiece() {
  //encapsulate this later in a function that randomly creates new pieces and spawns them.
  if (newGame) {
    let randomNum: number = Math.floor(Math.random() * 7 + 1);
    let newPiece: tetronomino = new pieceL();
    switch (randomNum) {
      case 1:
        newPiece = new pieceJ();
        break;
      case 2:
        newPiece = new pieceL();
        break;
      case 3:
        newPiece = new pieceO();
        break;
      case 4:
        newPiece = new pieceS();
        break;
      case 5:
        newPiece = new pieceZ();
        break;
      case 6:
        newPiece = new pieceT();
        break;
      case 7:
        newPiece = new pieceI();
        break;
      default:
        newPiece = new pieceT();
        break;
    }
    holdingPiece = newPiece;
    newGame = false;
  }
  generateNewPiece(holdingPiece.template[0], spawnX, spawnY);
  currentPiece = holdingPiece;

  let randomNum: number = Math.floor(Math.random() * 7 + 1);
  let newPiece: tetronomino = new pieceL();
  switch (randomNum) {
    case 1:
      newPiece = new pieceJ();
      break;
    case 2:
      newPiece = new pieceL();
      break;
    case 3:
      newPiece = new pieceO();
      break;
    case 4:
      newPiece = new pieceS();
      break;
    case 5:
      newPiece = new pieceZ();
      break;
    case 6:
      newPiece = new pieceT();
      break;
    case 7:
      newPiece = new pieceI();
      break;
    default:
      newPiece = new pieceT();
      break;
  }
  holdingPiece = newPiece;
  generateNewPieceHolding(holdingPiece.template[0], 0, 0);
  // code to generate a new piece at spawn point
}

//code below this initialises the game
console.log("starting tetris-node.js");
spawnNewPiece();
gameClock();
