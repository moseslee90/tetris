let gameBoard: number[][];
let sampleBlock: number[][] = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
let spawnX: number = 4;
let spawnY: number = 17;
let gameBoardDivs: NodeList = document.querySelectorAll("#game-board div");
let boardHeight: number = 21;
let boardWidth: number = 12;

interface pieceL {
    template: number[][];
}

function pieceL() {
    this.template = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
}

function boxClicked() {
  let element: HTMLDivElement = this;
  let x: number = parseInt(element.getAttribute("data-x"));
  let y: number = parseInt(element.getAttribute("data-y"));
  console.log("box clicked at " + element.getAttribute("id"));
}

function setupBoard() {
  let gridSquareDimension = 54;
  let gameBoardHTML = document.getElementById("game-board");
  gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
  gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
  gameBoard = [];
  //creates board from bottom right to top left, 
  for (let i = boardHeight - 1; i > -1; i--) {
    let array2d: number[] = [];
    for (let j = 0; j < boardWidth; j++) {
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
      if ( i === 0 || j === 0 || j === boardWidth - 1) {
          //add html class
          element.classList.add("border");
          //add object property for code computation
      }
    }
    gameBoard.push(array2d);
  }
}
setupBoard();
function generateNewPiece(piece: pieceL) {
    let pieceTemplate: number[][] = piece.template;
    for (let i = 0; i < pieceTemplate.length; i++) {
      for (let j = 0; j < pieceTemplate[i].length; j++) {
        if (pieceTemplate[i][j] === 1) {
          let yCoordinate: number = spawnY + i;
          let xCoordinate: number = spawnX + j;
          gameBoard[yCoordinate][xCoordinate] = pieceTemplate[i][j];
          let cellHTML: HTMLElement = document.getElementById(
            xCoordinate.toString() + "-" + yCoordinate.toString()
          );
          cellHTML.classList.add("moving-piece");
          //   element.classList.add("moving-piece");
        }
      }
    }
}
let newPieceL = new pieceL();
generateNewPiece(newPieceL);

function moveRight() {
    for (let i = boardWidth - 2; i > 0; i--) {
        for (let j = 1; j < boardHeight - 1; j++) {
            if (gameBoard[j][i] === 1 && gameBoard[j][i+1] === 0){
                gameBoard[j].splice(i,1,0);
                gameBoard[j].splice(i+1,1,1);
            }
        }
    }
}