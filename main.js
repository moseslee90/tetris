var gameBoard;
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
