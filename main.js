var gameBoard;
var sampleBlock = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
var spawnX = 4;
var spawnY = 17;
var gameBoardDivs = document.querySelectorAll("#game-board div");
var boardHeight = 21;
var boardWidth = 12;
function pieceL() {
    this.template = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
}
function boxClicked() {
    var element = this;
    var x = parseInt(element.getAttribute("data-x"));
    var y = parseInt(element.getAttribute("data-y"));
    console.log("box clicked at " + element.getAttribute("id"));
}
function setupBoard() {
    var gridSquareDimension = 54;
    var gameBoardHTML = document.getElementById("game-board");
    gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
    gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
    gameBoard = [];
    //creates board from bottom right to top left, 
    for (var i = boardHeight - 1; i > -1; i--) {
        var array2d = [];
        for (var j = 0; j < boardWidth; j++) {
            array2d.push(0);
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
            if (i === 0 || j === 0 || j === boardWidth - 1) {
                //add html class
                element.classList.add("border");
                //add object property for code computation
            }
        }
        gameBoard.push(array2d);
    }
}
setupBoard();
function generateNewPiece(piece) {
    var pieceTemplate = piece.template;
    for (var i = 0; i < pieceTemplate.length; i++) {
        for (var j = 0; j < pieceTemplate[i].length; j++) {
            if (pieceTemplate[i][j] === 1) {
                var yCoordinate = spawnY + i;
                var xCoordinate = spawnX + j;
                gameBoard[yCoordinate][xCoordinate] = pieceTemplate[i][j];
                var cellHTML = document.getElementById(xCoordinate.toString() + "-" + yCoordinate.toString());
                cellHTML.classList.add("moving-piece");
                //   element.classList.add("moving-piece");
            }
        }
    }
}
var newPieceL = new pieceL();
generateNewPiece(newPieceL);
function moveRight() {
    for (var i = boardWidth - 2; i > 0; i--) {
        for (var j = 1; j < boardHeight - 1; j++) {
            if (gameBoard[j][i] === 1 && gameBoard[j][i + 1] === 0) {
                gameBoard[j].splice(i, 1, 0);
                gameBoard[j].splice(i + 1, 1, 1);
            }
        }
    }
}
