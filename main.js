var gameBoard;
var holdingBoardArray;
var gameBoardDivs = document.querySelectorAll("#game-board div");
var boardHeight = 25;
var boardWidth = 12;
var holdingHeight = 4;
var holdingWidth = 4;
var spawnX = 4;
var spawnY = boardHeight - 4;
var gravity;
var gameBoardHTML = document.getElementById("game-board");
var holdingArea = document.getElementById("holding-area");
// let pieceRotationState: number = 4;
var currentPiece;
var pieceRotationState = 0;
var linesClearedScore = 0;
var speedOfGravity = 800;
var holdingPiece;
var newGame = true;
var pause = false;
var scoreHTML = document.querySelector(".score-p");
scoreHTML.innerText = linesClearedScore.toString();
var firstBaby = new individual();
var numberOfRuns = 0;
var goodBabies = [];
var goodBaby = new individual();
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
function coordinates(x, y) {
    var xCoordinate = x.toString();
    var yCoordinate = y.toString();
    var coordinates = xCoordinate + "-" + yCoordinate;
    return coordinates;
}
function coordinatesHolding(x, y) {
    var xCoordinate = x.toString();
    var yCoordinate = y.toString();
    var coordinates = xCoordinate + "h" + yCoordinate;
    return coordinates;
}
function boxClicked() {
    var element = this;
    var x = parseInt(element.getAttribute("data-x"));
    var y = parseInt(element.getAttribute("data-y"));
    console.log("box clicked at " + element.getAttribute("id"));
}
function setupBoard() {
    numberOfRuns++;
    firstBaby = new individual();
    firstBaby.randomGenes();
    var gridSquareDimension = 30;
    gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
    gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
    gameBoard = [];
    holdingArea.innerHTML = "";
    gameBoardHTML.innerHTML = "";
    //creates board from bottom right to top left,
    for (var i = boardHeight - 1; i > -1; i--) {
        var array2d = [];
        for (var j = 0; j < boardWidth; j++) {
            var element = document.createElement("div");
            var paragraph = document.createElement("p");
            element.setAttribute("id", j.toString() + "-" + i.toString());
            element.setAttribute("data-x", j.toString());
            element.setAttribute("data-y", i.toString());
            element.setAttribute("data-state", "0");
            element.setAttribute("class", "box");
            element.appendChild(paragraph);
            element.addEventListener("click", boxClicked);
            gameBoardHTML.appendChild(element);
            //make borders
            if (i === boardHeight - 1) {
                array2d.push(2);
            }
            else if (j === 0 || j === boardWidth - 1) {
                //add object property for code computation
                array2d.push(3);
            }
            else {
                array2d.push(0);
            }
            if (i === 0 || j === 0 || j === boardWidth - 1) {
                //add html class
                element.classList.add("border");
            }
        }
        gameBoard.push(array2d);
    }
    // holding area code to be finalised
    holdingArea.style.width = gridSquareDimension * holdingWidth + "px";
    holdingArea.style.height = gridSquareDimension * holdingHeight + "px";
    holdingBoardArray = [];
    for (var i = holdingHeight - 1; i > -1; i--) {
        var array2d = [];
        for (var j = 0; j < holdingWidth; j++) {
            var element = document.createElement("div");
            element.setAttribute("id", j.toString() + "h" + i.toString());
            element.setAttribute("data-x", j.toString());
            element.setAttribute("data-y", i.toString());
            element.setAttribute("data-state", "0");
            element.setAttribute("class", "box");
            element.addEventListener("click", boxClicked);
            holdingArea.appendChild(element);
            array2d.push(0);
        }
        holdingBoardArray.push(array2d);
    }
}
setupBoard();
function generateNewPiece(template, positionX, positionY) {
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
                gameBoard[yCoordinate][xCoordinate] = template[i][j];
                var cellHTML = document.getElementById(coordinates(xCoordinate, yCoordinate));
                cellHTML.classList.add("moving-piece");
                //   element.classList.add("moving-piece");
            }
        }
    }
}
function clearHoldingArea() {
    for (var i = 0; i < holdingWidth; i++) {
        for (var j = 0; j < holdingHeight; j++) {
            holdingBoardArray[j][i] = 0;
            var cellHTML = document.getElementById(coordinatesHolding(i, j));
            cellHTML.classList.remove("moving-piece");
            //   element.classList.add("moving-piece");
        }
    }
}
function generateNewPieceHolding(template, positionX, positionY) {
    clearHoldingArea();
    //generating the nextPiece on the holding area
    for (var i = 0; i < template.length; i++) {
        for (var j = 0; j < template[i].length; j++) {
            if (template[i][j] === 1 || template[i][j] === 4) {
                var yCoordinate = positionY + i;
                var xCoordinate = positionX + j;
                holdingBoardArray[yCoordinate][xCoordinate] = template[i][j];
                var cellHTML = document.getElementById(coordinatesHolding(xCoordinate, yCoordinate));
                cellHTML.classList.add("moving-piece");
                //   element.classList.add("moving-piece");
            }
        }
    }
}
function haveYouDied() {
    for (var i = 1; i < boardWidth - 2; i++) {
        if (gameBoard[boardHeight - 4][i] === 2) {
            //you have died
            if (linesClearedScore > 80) {
                //good babies go here
                goodBabies.push(firstBaby);
            }
            if (numberOfRuns > 100) {
                alert("5 runs over");
            }
            else {
                linesClearedScore = 0;
                setupBoard();
            }
        }
    }
}
function moveRight() {
    for (var i = boardWidth - 2; i > 0; i--) {
        for (var j = 1; j < boardHeight; j++) {
            if ((gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
                (gameBoard[j][i + 1] === 3 || gameBoard[j][i + 1] === 2)) {
                return;
            }
            else if ((gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
                gameBoard[j][i + 1] === 0) {
                //code to manipulate array
                if (gameBoard[j][i] === 4) {
                    gameBoard[j].splice(i, 1, 0);
                    gameBoard[j].splice(i + 1, 1, 4);
                }
                else {
                    gameBoard[j].splice(i, 1, 0);
                    gameBoard[j].splice(i + 1, 1, 1);
                }
                //code to manipulate HTML
                var cell = document.getElementById(coordinates(i, j));
                cell.classList.remove("moving-piece");
                var cell2 = document.getElementById(coordinates(i + 1, j));
                cell2.classList.add("moving-piece");
            }
        }
    }
}
function moveLeft() {
    for (var i = 1; i < boardWidth - 1; i++) {
        for (var j = 1; j < boardHeight; j++) {
            if ((gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
                (gameBoard[j][i - 1] === 3 || gameBoard[j][i - 1] === 2)) {
                return;
            }
            else if ((gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
                gameBoard[j][i - 1] === 0) {
                //code to manipulate array
                if (gameBoard[j][i] === 4) {
                    gameBoard[j].splice(i, 1, 0);
                    gameBoard[j].splice(i - 1, 1, 4);
                }
                else {
                    gameBoard[j].splice(i, 1, 0);
                    gameBoard[j].splice(i - 1, 1, 1);
                }
                //code to manipulate HTML
                var cell = document.getElementById(coordinates(i, j));
                cell.classList.remove("moving-piece");
                var cell2 = document.getElementById(coordinates(i - 1, j));
                cell2.classList.add("moving-piece");
            }
        }
    }
}
//time for gravity
function checkLineFilled() {
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
            if (gameBoard[i][j] === 2) {
                rowFilled++;
            }
        }
        //if a row is filled
        if (rowFilled === boardWidth - 2) {
            //deleteRow
            linesClearedScore++;
            scoreHTML.innerText = linesClearedScore.toString();
            for (var j = boardWidth - 2; j > 0; j--) {
                //update array: delete that row in the array
                gameBoard[i].splice(j, 1, 0);
                //update html: delete that row in the html
                var cell = document.getElementById(coordinates(j, i));
                cell.classList.remove("fixed-piece");
            }
            //up to this point, the row has been deleted, now we need to move the pieces
            //which have a value of 2 down
            //since we only want to delete one row first, we shld get out of the loop
            //save this row to rowWhichWasDeleted
            rowWhichWasDeleted = i;
            //move 2s still remaining down by scanning upwards of the row which was deleted
            for (var k = rowWhichWasDeleted + 1; k < boardHeight - 1; k++) {
                for (var l = boardWidth - 2; l > 0; l--) {
                    if (gameBoard[k][l] === 2) {
                        //change the value of that cell in the array to a blank cell
                        gameBoard[k].splice(l, 1, 0);
                        gameBoard[k - 1].splice(l, 1, 2);
                        //remove the fixed piece property of the cell's previous occupied cell
                        var cellWas = document.getElementById(coordinates(l, k));
                        cellWas.classList.remove("fixed-piece");
                        //add that fixed piece property to the new cell's home
                        var cellIs = document.getElementById(coordinates(l, k - 1));
                        cellIs.classList.add("fixed-piece");
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
    var floorFound = false;
    //scan 4 rows first before moving to execute translation on individual cells
    for (var i = 1; i < boardHeight; i++) {
        for (var j = boardWidth - 2; j > 0; j--) {
            if ((gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
                gameBoard[i - 1][j] === 2) {
                floorFound = true;
            }
        }
        if (floorFound === true) {
            clearInterval(gravity);
            //reset piece rotation state for the next piece
            pieceRotationState = 0;
            //turn piece into fixed piece
            for (var i_1 = 1; i_1 < boardHeight - 1; i_1++) {
                for (var j = boardWidth - 2; j > 0; j--) {
                    if (gameBoard[i_1][j] === 1 || gameBoard[i_1][j] === 4) {
                        gameBoard[i_1].splice(j, 1, 2);
                        var cell = document.getElementById(coordinates(j, i_1));
                        cell.classList.remove("moving-piece");
                        cell.classList.add("fixed-piece");
                    }
                }
            }
            //code to generate new piece here
            spawnNewPiece();
            checkLineFilled();
            //kill game here if resultant board has a piece at the ceiling
            haveYouDied();
            goGoGravity();
            return;
        }
    }
    for (var i = 1; i < boardHeight; i++) {
        for (var j = boardWidth - 2; j > 0; j--) {
            if ((gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
                gameBoard[i - 1][j] === 3) {
                return;
                //add ability to detect other pieces too later
            }
            else if ((gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
                gameBoard[i - 1][j] === 0) {
                //code to manipulate array
                if (gameBoard[i][j] === 4) {
                    gameBoard[i].splice(j, 1, 0);
                    gameBoard[i - 1].splice(j, 1, 4);
                }
                else {
                    gameBoard[i].splice(j, 1, 0);
                    gameBoard[i - 1].splice(j, 1, 1);
                }
                //code to manipulate HTML
                var cell = document.getElementById(coordinates(j, i));
                cell.classList.remove("moving-piece");
                var cell2 = document.getElementById(coordinates(j, i - 1));
                cell2.classList.add("moving-piece");
            }
        }
    }
}
//in order to create an allTheWayDown function,
//code scans template and board, to find floor===true situation
function allTheWayDown() {
    var floorFound = false;
    var minRowsToFloor = boardHeight;
    for (var i = 1; i < boardHeight; i++) {
        //this for-loop below scans the current row at the bottom for a floor, use it to
        //instead scan how many rows till the floor
        for (var j = boardWidth - 2; j > 0; j--) {
            //1 or 4 found at this row
            //need to check which cell containing a 1 or a 4 has the lowest number of
            //steps till it reaches the floor
            if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
                //pieces found is true
                //now execute code to find shortest number of downward translations till
                //we hit a floor on one of the pieces
                for (var k = 0; i - k >= 0; k++) {
                    if (gameBoard[i - k][j] === 2) {
                        minRowsToFloor = Math.min(k, minRowsToFloor);
                        floorFound = true;
                    }
                }
            }
        }
    }
    clearInterval(gravity);
    //reset piece rotation state for the next piece
    pieceRotationState = 0;
    for (var i = 1; i < boardHeight; i++) {
        for (var j = boardWidth - 2; j > 0; j--) {
            if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
                if (gameBoard[i][j] === 4) {
                    gameBoard[i].splice(j, 1, 0);
                    gameBoard[i - minRowsToFloor + 1].splice(j, 1, 2);
                }
                else {
                    gameBoard[i].splice(j, 1, 0);
                    gameBoard[i - minRowsToFloor + 1].splice(j, 1, 2);
                }
                //code to manipulate HTML
                var cell = document.getElementById(coordinates(j, i));
                cell.classList.remove("moving-piece");
                var cell2 = document.getElementById(coordinates(j, i - minRowsToFloor + 1));
                //turn piece into fixed piece
                cell2.classList.add("fixed-piece");
            }
        }
    }
    //code to generate new piece here
    spawnNewPiece();
    checkLineFilled();
    //kill game here if resultant board has a piece at the ceiling
    haveYouDied();
    goGoGravity();
    // FRIENDthinking();
    setTimeout(FRIENDthinking, 10);
}
function rotatePiece(tetronomino, clockwise) {
    //get reference position of anchor
    var currentTemplate = tetronomino.template[pieceRotationState];
    var anchorTemplatePosX;
    var anchorTemplatePosY;
    //loop through template to find reference of 4 relative within the template
    for (var i = 0; i < currentTemplate.length; i++) {
        for (var j = 0; j < currentTemplate[i].length; j++) {
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
    }
    else {
        //else next template is the ACW transformation
        pieceRotationState--;
    }
    if (pieceRotationState > 3) {
        pieceRotationState = 0;
    }
    else if (pieceRotationState < 0) {
        pieceRotationState = 3;
    }
    //prepare next template
    var nextTemplate = tetronomino.template[pieceRotationState];
    //may not need to get reference for nextTemplate's anchor
    var anchorNextTemplatePosX;
    var anchorNextTemplatePosY;
    for (var i = 0; i < nextTemplate.length; i++) {
        for (var j = 0; j < nextTemplate[i].length; j++) {
            if (nextTemplate[i][j] === 4) {
                anchorNextTemplatePosY = i;
                anchorNextTemplatePosX = j;
            }
        }
    }
    //need to ensure rotatePiece function checks board for collisions and adjusts replacement of piece template accordingly to avoid 'phasing' of blocks into walls and floor and other pieces
    //loop through entire board to find anchor of current piece
    for (var i = 1; i < boardWidth - 1; i++) {
        for (var j = 1; j < boardHeight; j++) {
            //finds anchor which is identified as 4
            if (gameBoard[j][i] === 4) {
                console.log("anchor found at " + i + "-" + j);
                var anchorX = -anchorTemplatePosX;
                var anchorY = -anchorTemplatePosY;
                //xCoordinate and yCoordinate represent the location of the corner
                //of the template inside the gameBoard
                var xCoordinate = i + anchorX;
                var yCoordinate = j + anchorY;
                //clear ONEs  and FOURs currently on board only after check
                //has been done that replacement template does not have collisions
                //first initialise collision as true
                //change value later on to false if checks yield no collisions
                var collision = true;
                var leftCollision = 0;
                var rightCollision = 0;
                var collisionCount = 0;
                //we need to go to the top of the loop again as soon as left collision or
                //right collision have been updated after finding a collision to ensure
                //we don't get multiple updates of left or right collision.
                collisionWhile: while (collision === true) {
                    //loop through template coordinates
                    for (var k = 0; k < nextTemplate.length; k++) {
                        for (var l = 0; l < nextTemplate[k].length; l++) {
                            //on the nextTemplate coordinates which have a value of 1 or 4
                            if (nextTemplate[k][l] === 1 || nextTemplate[k][l] === 4) {
                                //using the location of the corner on the gameBoard, create a
                                //reference of nextTemplate's individual coordinates with
                                //cellPosY and cellPosX
                                var cellPosY = yCoordinate + k;
                                var cellPosX = xCoordinate + l + leftCollision - rightCollision;
                                if (gameBoard[cellPosY][cellPosX] === 2 ||
                                    gameBoard[cellPosY][cellPosX] === 3) {
                                    //if a value of 2 or 3 is found already present on the gameBoard
                                    //at the location that we would like to place nextTemplate's
                                    //1 or 4; collision found
                                    console.log("collision encountered in rotation");
                                    collision = true;
                                    //find column of collision
                                    if (l === 0) {
                                        //leftmost column
                                        collisionCount++;
                                        //if collision is found on the left, add 1 to leftCollision
                                        leftCollision = leftCollision + 1;
                                    }
                                    else if (l === 1) {
                                        //center left column
                                        collisionCount++;
                                        //if collision is found on the center left, add 1 to leftCollision
                                        leftCollision = leftCollision + 1;
                                    }
                                    else if (l === 2) {
                                        //center right column
                                        collisionCount++;
                                        //if collision is found on the center right, add 1 to rightCollision
                                        rightCollision = rightCollision + 1;
                                    }
                                    else if (l === 3) {
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
                                        }
                                        else {
                                            //else next template is the ACW transformation
                                            pieceRotationState++;
                                        }
                                        if (pieceRotationState > 3) {
                                            pieceRotationState = 0;
                                        }
                                        else if (pieceRotationState < 0) {
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
                                }
                                else {
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
                                    }
                                    else {
                                        //else next template is the ACW transformation
                                        pieceRotationState++;
                                    }
                                    if (pieceRotationState > 3) {
                                        pieceRotationState = 0;
                                    }
                                    else if (pieceRotationState < 0) {
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
                for (var k = 1; k < boardWidth - 1; k++) {
                    for (var l = 1; l < boardHeight; l++) {
                        if (gameBoard[l][k] === 1 || gameBoard[l][k] === 4) {
                            gameBoard[l].splice(k, 1, 0);
                            var cell = document.getElementById(coordinates(k, l));
                            cell.classList.remove("moving-piece");
                        }
                    }
                }
                //replace ONEs around anchor
                generateNewPiece(nextTemplate, xCoordinate + leftCollision - rightCollision, yCoordinate);
                // goGoGravity();
                return;
            }
        }
    }
}
//gravity in intervals
function goGoGravity() {
    var speedFactor = Math.floor(linesClearedScore / 10);
    speedOfGravity = 800 - speedFactor * 100;
    if (speedOfGravity < 200) {
        speedOfGravity = 150;
    }
    gravity = setInterval(moveDown, speedOfGravity);
}
function pauseGame() {
    if (pause === true) {
        pause = false;
        goGoGravity();
    }
    else {
        pause = true;
        clearInterval(gravity);
    }
}
function spawnNewPiece() {
    //encapsulate this later in a function that randomly creates new pieces and spawns them.
    if (newGame) {
        var randomNum_1 = Math.floor(Math.random() * 7 + 1);
        var newPiece_1 = new pieceL();
        switch (randomNum_1) {
            case 1:
                newPiece_1 = new pieceJ();
                break;
            case 2:
                newPiece_1 = new pieceL();
                break;
            case 3:
                newPiece_1 = new pieceO();
                break;
            case 4:
                newPiece_1 = new pieceS();
                break;
            case 5:
                newPiece_1 = new pieceZ();
                break;
            case 6:
                newPiece_1 = new pieceT();
                break;
            case 7:
                newPiece_1 = new pieceI();
                break;
            default:
                newPiece_1 = new pieceT();
                break;
        }
        holdingPiece = newPiece_1;
        newGame = false;
    }
    generateNewPiece(holdingPiece.template[0], spawnX, spawnY);
    currentPiece = holdingPiece;
    var randomNum = Math.floor(Math.random() * 7 + 1);
    var newPiece = new pieceL();
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
spawnNewPiece();
goGoGravity();
function keydownEvent(event) {
    var x = event.keyCode || event.which;
    console.log(x + " was pressed");
    if (x === 65) {
        moveLeft();
    }
    if (x === 68) {
        moveRight();
    }
    if (x === 83) {
        moveDown();
    }
    if (x === 221) {
        rotatePiece(currentPiece, true);
    }
    if (x === 219) {
        rotatePiece(currentPiece, false);
    }
    if (x === 80) {
        allTheWayDown();
    }
    if (x === 32) {
        pauseGame();
    }
}
document.onkeydown = keydownEvent;
//implement this as game clock to call functions
// var i =0;
// setInterval(function(){
//     i++;
//     if(i % speed === 0){
//         moveDown();
//     }
// },100)
