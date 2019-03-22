let gameBoard: number[][];
let sampleBlock: number[][] = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
let spawnX: number = 4;
let spawnY: number = 17;
let gameBoardDivs: NodeList = document.querySelectorAll("#game-board div");

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
  console.log("box clicked at " + x + "-" + y);
}

function setupBoard() {
  let boardHeight: number = 21;
  let boardWidth: number = 12;
  let gridSquareDimension = 54;
  let gameBoardHTML = document.getElementById("game-board");
  gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
  gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
  gameBoard = [];
  for (let i = boardHeight - 1; i > -1; i--) {
    let array2d: number[] = [];
    for (let j = 0; j < boardWidth; j++) {
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
      //make borders
      if ( i === 0 || j === 0 || j === boardHeight-1) {
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
            yCoordinate.toString() + "-" + xCoordinate.toString()
          );
          cellHTML.classList.add("moving-piece");
          //   element.classList.add("moving-piece");
        }
      }
    }
}
let newPieceL = new pieceL();
generateNewPiece(newPieceL);
