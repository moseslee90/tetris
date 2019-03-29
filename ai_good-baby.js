//since main.ts will be the main running script,
//ai.ts will be where our imagination/simulation functions will be
//functions here will manipulate an imaginary version of the gameBoardAI
//there will be an array of decisions that gets generated
//each decision is scored based on the number of objectives it achieves.
//moveRightAI and moveLeftAI have to have a limiter set into them
//get moveRightAI and moveLeftAI to return some value
//if they hit the edge or obstacle
var aiGameBoard = /** @class */ (function () {
    function aiGameBoard(right) {
        this.board = JSON.parse(JSON.stringify(gameBoard));
        this.right = right;
        this.points = 100;
    }
    return aiGameBoard;
}());
var aiGameBoardV2 = /** @class */ (function () {
    function aiGameBoardV2(newBoard) {
        this.board = JSON.parse(JSON.stringify(newBoard));
        this.points = 100;
    }
    return aiGameBoardV2;
}());
function examineBoard(aiGameBoardObject) {
    var points = 2000;
    //checking for blank pockets between 2 vertical blocks
    for (var i = 1; i < boardHeight - 1; i++) {
        for (var j = 1; j < boardWidth - 2; j++) {
            if (aiGameBoardObject.board[i][j] === 0) {
                for (var k = i + 1; k < boardHeight - 1; k++) {
                    if (aiGameBoardObject.board[k][j] === 2) {
                        points = points - 20;
                    }
                }
            }
        }
    }
    //checking for lines filled
    var rowsFilled = 0;
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        var rowFilled = 0;
        for (var j = boardWidth - 2; j > 0; j--) {
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
            points = points + 10;
            break;
        case 2:
            points = points + 25;
            break;
        case 3:
            points = points + 45;
            break;
        case 4:
            points = points + 70;
            break;
        default:
            break;
    }
    //penalise for high builds
    var heightPenalty = 0;
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        for (var j = boardWidth - 2; j > 0; j--) {
            if (aiGameBoardObject.board[i][j] === 2 && i > 4) {
                heightPenalty = Math.pow(1.5, i);
            }
        }
    }
    points = points - heightPenalty;
    //add points based on a consistent row
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        var rowlink = 0;
        for (var j = 1; j < boardWidth - 3; j++) {
            if (aiGameBoardObject.board[i][j] === 2 &&
                aiGameBoardObject.board[i][j + 1] === 2) {
                rowlink++;
                points = points + Math.pow(1.3, rowlink);
            }
            else {
                rowlink = 0;
            }
        }
    }
    //add points if pieces are against wall
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        var borderPiece = 0;
        for (var j = 1; j < boardWidth - 2; j++) {
            if ((aiGameBoardObject.board[i][j] === 2 &&
                aiGameBoardObject.board[i][j + 1] === 3) ||
                (aiGameBoardObject.board[i][j] === 2 &&
                    aiGameBoardObject.board[i][j - 1] === 3)) {
                borderPiece++;
            }
        }
        points = points + 1.5 * borderPiece;
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
    return minColumnsToLeftEdge;
}
function FRIENDthinking() {
    //edgeHit would be a variable that helps us determine if the edge has been hit
    //to get a limit for moveRight/moveLeft
    var edgeHit = false;
    var rightMovesAI = 0;
    var maximumRight = maxRight(gameBoard);
    var maximumLeft = maxLeft(gameBoard);
    var resultDecisionsAI = [];
    for (var k = 1; k < maximumLeft; k++) {
        var aiBoard = new aiGameBoardV2(gameBoard);
        aiBoard.right = false;
        aiBoard.id = k;
        aiBoard.rotate = 0;
        aiBoard.board = moveLeftAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
        resultDecisionsAI.push(aiBoard);
    }
    for (var k = 0; k < maximumRight; k++) {
        var aiBoard = new aiGameBoardV2(gameBoard);
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
    var firstRotateBoardR = new aiGameBoardV2(gameBoard);
    firstRotateBoardR.board = rotatePieceAI(firstRotateBoardR.board, currentPiece, 1);
    var maxRightR1 = maxRight(firstRotateBoardR.board);
    for (var k = 0; k < maxRightR1; k++) {
        var aiBoard = new aiGameBoardV2(firstRotateBoardR.board);
        aiBoard.right = true;
        aiBoard.id = k;
        aiBoard.rotate = 1;
        aiBoard.board = moveRightAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    var secondRotateBoardR = new aiGameBoardV2(gameBoard);
    secondRotateBoardR.board = rotatePieceAI(secondRotateBoardR.board, currentPiece, 2);
    var maxRightR2 = maxRight(secondRotateBoardR.board);
    for (var k = 0; k < maxRightR2; k++) {
        var aiBoard = new aiGameBoardV2(secondRotateBoardR.board);
        aiBoard.right = true;
        aiBoard.id = k;
        aiBoard.rotate = 2;
        aiBoard.board = moveRightAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    var thirdRotateBoardR = new aiGameBoardV2(gameBoard);
    thirdRotateBoardR.board = rotatePieceAI(thirdRotateBoardR.board, currentPiece, 3);
    var maxRightR3 = maxRight(thirdRotateBoardR.board);
    for (var k = 0; k < maxRightR3; k++) {
        var aiBoard = new aiGameBoardV2(thirdRotateBoardR.board);
        aiBoard.right = true;
        aiBoard.id = k;
        aiBoard.rotate = 3;
        aiBoard.board = moveRightAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    var firstRotateBoardL = new aiGameBoardV2(firstRotateBoardR.board);
    // firstRotateBoardL.board = rotatePieceAI(
    //   firstRotateBoardL.board,
    //   currentPiece,
    //   1
    // );
    var maxLeftR1 = maxLeft(firstRotateBoardL.board);
    for (var k = 0; k < maxLeftR1; k++) {
        var aiBoard = new aiGameBoardV2(firstRotateBoardL.board);
        aiBoard.right = false;
        aiBoard.id = k;
        aiBoard.rotate = 1;
        aiBoard.board = moveLeftAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    var secondRotateBoardL = new aiGameBoardV2(secondRotateBoardR.board);
    // secondRotateBoardL.board = rotatePieceAI(
    //   secondRotateBoardL.board,
    //   currentPiece,
    //   2
    // );
    var maxLeftR2 = maxLeft(secondRotateBoardL.board);
    for (var k = 0; k < maxLeftR2; k++) {
        var aiBoard = new aiGameBoardV2(secondRotateBoardL.board);
        aiBoard.right = false;
        aiBoard.id = k;
        aiBoard.rotate = 2;
        aiBoard.board = moveLeftAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    var thirdRotateBoardL = new aiGameBoardV2(thirdRotateBoardR.board);
    // thirdRotateBoardL.board = rotatePieceAI(
    //   thirdRotateBoardL.board,
    //   currentPiece,
    //   3
    // );
    var maxLeftR3 = maxLeft(thirdRotateBoardL.board);
    for (var k = 0; k < maxLeftR3; k++) {
        var aiBoard = new aiGameBoardV2(thirdRotateBoardL.board);
        aiBoard.right = false;
        aiBoard.id = k;
        aiBoard.rotate = 3;
        aiBoard.board = moveLeftAI(k, aiBoard.board);
        aiBoard.board = allTheWayDownAI(aiBoard.board);
        resultDecisionsAI.push(aiBoard);
    }
    console.log(resultDecisionsAI);
    for (var k = 0; k < resultDecisionsAI.length; k++) {
        examineBoard(resultDecisionsAI[k]);
    }
    var highestScore = 0;
    var highestScoreID = 0;
    var highestScoreRight = true;
    var highestScoreRotate = 0;
    for (var k = 0; k < resultDecisionsAI.length; k++) {
        if (resultDecisionsAI[k].points > highestScore) {
            highestScore = resultDecisionsAI[k].points;
            highestScoreID = resultDecisionsAI[k].id;
            highestScoreRight = resultDecisionsAI[k].right;
            highestScoreRotate = resultDecisionsAI[k].rotate;
        }
    }
    var direction = "none";
    if (highestScoreRight === true) {
        direction = "right";
    }
    else {
        direction = "left";
    }
    console.log("Rotate: " +
        highestScoreRotate +
        " Move " +
        direction +
        " " +
        highestScoreID);
    function FRIENDmove() {
        for (var i = 0; i < highestScoreRotate; i++) {
            rotatePiece(currentPiece, true);
        }
        if (highestScoreRight === true) {
            for (var i = 0; i < highestScoreID; i++) {
                moveRight();
            }
        }
        else {
            for (var i = 0; i < highestScoreID; i++) {
                moveLeft();
            }
        }
        allTheWayDown();
    }
    FRIENDmove();
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
    for (var i = 1; i < boardWidth - 2; i++) {
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
function rotatePieceAI(
//pass in the very first boardTemplate and get this function to return
//another boardTemplate
boardTemplate, 
//we can probably pass in currentPiece for tetronomino
tetronomino, 
//rotations will be some number from 0 to 3
rotations) {
    // let currentTemplate: number[][] = tetronomino.template[pieceRotationState];
    // let anchorTemplatePosX: number;
    // let anchorTemplatePosY: number;
    var nextTemplate = tetronomino.template[rotations];
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
    for (var k = 1; k < boardWidth - 1; k++) {
        for (var l = 1; l < boardHeight; l++) {
            if (boardTemplate[l][k] === 1 || boardTemplate[l][k] === 4) {
                boardTemplate[l].splice(k, 1, 0);
            }
        }
    }
    for (var i = 0; i < nextTemplate.length; i++) {
        for (var j = 0; j < nextTemplate[i].length; j++) {
            if (nextTemplate[i][j] === 1 || nextTemplate[i][j] === 4) {
                var yCoordinate = spawnY + i;
                var xCoordinate = spawnX + j;
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
