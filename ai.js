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
function FRIENDthinking() {
    var resultDecisionsAI = [];
    function examineBoard(aiGameBoardObject, baby) {
        var points = baby.genes.pointsGene;
        //let's try to create an individual with genes
        //checking for blank pockets between 2 vertical blocks
        for (var i = 1; i < boardHeight - 1; i++) {
            for (var j = 1; j < boardWidth - 2; j++) {
                if (aiGameBoardObject.board[i][j] === 0) {
                    for (var k = i + 1; k < boardHeight - 1; k++) {
                        if (aiGameBoardObject.board[k][j] === 2) {
                            points = points - baby.genes.blankPocketGene;
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
        var heightPenalty = 0;
        for (var i = 1; i < boardHeight - 1; i++) {
            //everytime we commence scanning a new row, make sure rowFilled is reset to 0
            for (var j = boardWidth - 2; j > 0; j--) {
                if (aiGameBoardObject.board[i][j] === 2 && i > 4) {
                    heightPenalty = Math.pow(baby.genes.heightPenaltyGene, i);
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
                    points = points + Math.pow(baby.genes.consecutiveRowGene, rowlink);
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
            points = points + baby.genes.borderGene * borderPiece;
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
    function evaluateSecondBoard(secondBoard, rotations, direction, moves) {
        var maximumRight = maxRight(secondBoard);
        var maximumLeft = maxLeft(secondBoard);
        for (var k = 1; k < maximumLeft; k++) {
            var aiBoard = new aiGameBoardV2(secondBoard);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveLeftAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        for (var k = 0; k < maximumRight; k++) {
            var aiBoard = new aiGameBoardV2(secondBoard);
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
        var firstRotateBoardR = new aiGameBoardV2(secondBoard);
        firstRotateBoardR.board = rotatePieceAI(firstRotateBoardR.board, holdingPiece, 1);
        var maxRightR1 = maxRight(firstRotateBoardR.board);
        for (var k = 0; k < maxRightR1; k++) {
            var aiBoard = new aiGameBoardV2(firstRotateBoardR.board);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveRightAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        var secondRotateBoardR = new aiGameBoardV2(secondBoard);
        secondRotateBoardR.board = rotatePieceAI(secondRotateBoardR.board, holdingPiece, 2);
        var maxRightR2 = maxRight(secondRotateBoardR.board);
        for (var k = 0; k < maxRightR2; k++) {
            var aiBoard = new aiGameBoardV2(secondRotateBoardR.board);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveRightAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        var thirdRotateBoardR = new aiGameBoardV2(secondBoard);
        thirdRotateBoardR.board = rotatePieceAI(thirdRotateBoardR.board, holdingPiece, 3);
        var maxRightR3 = maxRight(thirdRotateBoardR.board);
        for (var k = 0; k < maxRightR3; k++) {
            var aiBoard = new aiGameBoardV2(thirdRotateBoardR.board);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveRightAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        var firstRotateBoardL = new aiGameBoardV2(firstRotateBoardR.board);
        var maxLeftR1 = maxLeft(firstRotateBoardL.board);
        for (var k = 0; k < maxLeftR1; k++) {
            var aiBoard = new aiGameBoardV2(firstRotateBoardL.board);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveLeftAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        var secondRotateBoardL = new aiGameBoardV2(secondRotateBoardR.board);
        var maxLeftR2 = maxLeft(secondRotateBoardL.board);
        for (var k = 0; k < maxLeftR2; k++) {
            var aiBoard = new aiGameBoardV2(secondRotateBoardL.board);
            aiBoard.right = direction;
            aiBoard.id = moves;
            aiBoard.rotate = rotations;
            aiBoard.board = moveLeftAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            resultDecisionsAI.push(aiBoard);
        }
        var thirdRotateBoardL = new aiGameBoardV2(thirdRotateBoardR.board);
        var maxLeftR3 = maxLeft(thirdRotateBoardL.board);
        for (var k = 0; k < maxLeftR3; k++) {
            var aiBoard = new aiGameBoardV2(thirdRotateBoardL.board);
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
    }
    else {
        var maximumRight = maxRight(gameBoard);
        var maximumLeft = maxLeft(gameBoard);
        for (var k = 1; k < maximumLeft; k++) {
            var aiBoard = new aiGameBoardV2(gameBoard);
            aiBoard.right = false;
            aiBoard.id = k;
            aiBoard.rotate = 0;
            aiBoard.board = moveLeftAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            //clear lines on board to prepare for next piece
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            //pass in the board with a new piece here and allow
            //this functions to iterate through all the possible
            //permutations with this second piece in consideration
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
        }
        for (var k = 0; k < maximumRight; k++) {
            var aiBoard = new aiGameBoardV2(gameBoard);
            aiBoard.right = true;
            aiBoard.id = k;
            aiBoard.rotate = 0;
            aiBoard.board = moveRightAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            // resultDecisionsAI.push(allTheWayDownAI(moveRightAI(k, aiBoard.board)));
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
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
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
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
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
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
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
        }
        var firstRotateBoardL = new aiGameBoardV2(firstRotateBoardR.board);
        var maxLeftR1 = maxLeft(firstRotateBoardL.board);
        for (var k = 0; k < maxLeftR1; k++) {
            var aiBoard = new aiGameBoardV2(firstRotateBoardL.board);
            aiBoard.right = false;
            aiBoard.id = k;
            aiBoard.rotate = 1;
            aiBoard.board = moveLeftAI(k, aiBoard.board);
            aiBoard.board = allTheWayDownAI(aiBoard.board);
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
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
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
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
            aiBoard.board = checkLineFilledAI(aiBoard.board);
            aiBoard.board = generateNewPieceAI(aiBoard.board, holdingPiece.template[0], spawnX, spawnY);
            evaluateSecondBoard(aiBoard.board, aiBoard.rotate, aiBoard.right, aiBoard.id);
        }
        // console.log(resultDecisionsAI);
        for (var k = 0; k < resultDecisionsAI.length; k++) {
            examineBoard(resultDecisionsAI[k], goodBaby);
        }
        // console.log(resultDecisionsAI);
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
        var finalDecision = {
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
function FRIENDmove(decision) {
    for (var i = 0; i < decision.rotations; i++) {
        rotatePiece(currentPiece, true);
    }
    if (decision.direction === true) {
        for (var i = 0; i < decision.moves; i++) {
            moveRight();
        }
    }
    else {
        for (var i = 0; i < decision.moves; i++) {
            moveLeft();
        }
    }
    allTheWayDown();
}
function generateNewPieceAI(board, template, positionX, positionY) {
    //function generates a new piece based on the template given,
    //at the specified location entered, with the position being the left corner of the template
    //add a loop check of target cells to be filled with new template
    //if cells on the left currently contain a wall (3) or other piece (2),
    //but the ones on the right do not, move translation to the right posX+1
    //only do these checks if the transformation contains a piece in that row or column
    //vice versa for the cells containing occupants on the right side but not on the left posX-1
    //if both the left and right contain neighbors, do nothing
    //keep pieces from phasing into the ground by not allowing transformations which occupy already occupied bottom cells.
    for (var i = 0; i < template.length; i++) {
        for (var j = 0; j < template[i].length; j++) {
            if (template[i][j] === 1 || template[i][j] === 4) {
                var yCoordinate = positionY + i;
                var xCoordinate = positionX + j;
                board[yCoordinate][xCoordinate] = template[i][j];
            }
        }
    }
    return board;
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
function checkLineFilledAI(board) {
    //delete all rows before pushing lines above down
    //actually we shld delete a row, move lines down, then repeat the check and
    //delete new rows if they exist
    var rowWhichWasDeleted = 1;
    //keep a reference of the row which was deleted so we know to only move
    //rows above this row down
    for (var i = 1; i < boardHeight - 1; i++) {
        //everytime we commence scanning a new row, make sure rowFilled is reset to 0
        var rowFilled = 0;
        for (var j = boardWidth - 2; j > 0; j--) {
            if (board[i][j] === 2) {
                rowFilled++;
            }
        }
        //if a row is filled
        if (rowFilled === boardWidth - 2) {
            //deleteRow
            for (var j = boardWidth - 2; j > 0; j--) {
                //update array: delete that row in the array
                board[i].splice(j, 1, 0);
            }
            //up to this point, the row has been deleted, now we need to move the pieces
            //which have a value of 2 down
            //since we only want to delete one row first, we shld get out of the loop
            //save this row to rowWhichWasDeleted
            rowWhichWasDeleted = i;
            //move 2s still remaining down by scanning upwards of the row which was deleted
            for (var k = rowWhichWasDeleted + 1; k < boardHeight - 1; k++) {
                for (var l = boardWidth - 2; l > 0; l--) {
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
