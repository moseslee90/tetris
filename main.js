var gameBoard;
var sampleBlock = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
var spawnX = 5;
var spawnY = 16;
var gameBoardDivs = document.querySelectorAll("#game-board div");
function boxClicked() {
    var element = this;
    var x = parseInt(element.getAttribute("data-x"));
    var y = parseInt(element.getAttribute("data-y"));
    console.log("box clicked at " + x + "-" + y);
}
function setupBoard() {
    var boardHeight = 21;
    var boardWidth = 12;
    var gridSquareDimension = 54;
    var gameBoardHTML = document.getElementById("game-board");
    gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
    gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
    gameBoard = [];
    for (var i = boardHeight - 1; i > -1; i--) {
        var array2d = [];
        for (var j = 0; j < boardWidth; j++) {
            array2d.push(0);
            var element = document.createElement("div");
            var paragraph = document.createElement("p");
            element.setAttribute("id", i.toString() + "-" + j.toString());
            element.setAttribute("data-x", j.toString());
            element.setAttribute("data-y", i.toString());
            element.setAttribute("data-state", "0");
            element.setAttribute("class", "box");
            element.appendChild(paragraph);
            element.addEventListener("click", boxClicked);
            gameBoardHTML.appendChild(element);
        }
        gameBoard.push(array2d);
    }
}
setupBoard();
for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
        if (sampleBlock[i][j] === 1) {
            var yCoordinate = spawnY + i;
            var xCoordinate = spawnX + j;
            gameBoard[yCoordinate][xCoordinate] = sampleBlock[i][j];
            var cellHTML = document.getElementById(yCoordinate.toString() + "-" + xCoordinate.toString());
            cellHTML.classList.add("moving-piece");
            //   element.classList.add("moving-piece");
        }
    }
}
