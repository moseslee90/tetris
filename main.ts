let gameBoard: number[][];
let sampleBlock: number[][] = [[0, 1, 1], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
let spawnX: number = 5;
let spawnY: number = 16;
let gameBoardDivs: NodeList = document.querySelectorAll("#game-board div");

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
    }
    gameBoard.push(array2d);
  }
}
setupBoard();

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 3; j++) {
    if (sampleBlock[i][j] === 1) {
      let yCoordinate: number = spawnY + i;
      let xCoordinate: number = spawnX + j;
      gameBoard[yCoordinate][xCoordinate] = sampleBlock[i][j];
      let cellHTML: HTMLElement = document.getElementById(
        yCoordinate.toString() + "-" + xCoordinate.toString()
      );
      cellHTML.classList.add("moving-piece");
      //   element.classList.add("moving-piece");
    }
  }
}
