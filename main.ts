let gameBoard: number[][];
let spawnX: number = 4;
let spawnY: number = 17;
let gameBoardDivs: NodeList = document.querySelectorAll("#game-board div");
let boardHeight: number = 21;
let boardWidth: number = 12;
let gravity;
let gameBoardHTML: HTMLElement = document.getElementById("game-board");
let pieceRotationState: number = 1;
let currentPiece: tetronomino;

//generic Piece
interface tetronomino {
  template: number[][];
  templateTwo: number[][];
  templateThree: number[][];
  templateFour: number[][];
  anchor: number[];
}

function pieceL() {
  this.template = [[0, 1, 1], [0, 4, 0], [0, 1, 0], [0, 0, 0]];
  this.templateTwo = [[1, 0, 0], [1, 4, 1], [0, 0, 0], [0, 0, 0]];
  this.templateThree = [[0, 1, 0], [0, 4, 0], [1, 1, 0], [0, 0, 0]];
  this.templateFour = [[0, 0, 0], [1, 4, 1], [0, 0, 1], [0, 0, 0]];
  this.anchor = [-1, -1];
}

function pieceJ() {
  this.template = [[1, 1, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]];
}

function coordinates(x: number, y: number) {
  let xCoordinate = x.toString();
  let yCoordinate = y.toString();
  let coordinates = xCoordinate + "-" + yCoordinate;
  return coordinates;
}
function boxClicked() {
  let element: HTMLDivElement = this;
  let x: number = parseInt(element.getAttribute("data-x"));
  let y: number = parseInt(element.getAttribute("data-y"));
  console.log("box clicked at " + element.getAttribute("id"));
}

function setupBoard() {
  let gridSquareDimension = 54;
  gameBoardHTML.style.width = gridSquareDimension * boardWidth + "px";
  gameBoardHTML.style.height = gridSquareDimension * boardHeight + "px";
  gameBoard = [];
  //creates board from bottom right to top left,
  for (let i = boardHeight - 1; i > -1; i--) {
    let array2d: number[] = [];
    for (let j = 0; j < boardWidth; j++) {
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
      } else if (j === 0 || j === boardWidth - 1) {
        //add object property for code computation
        array2d.push(3);
      } else {
        array2d.push(0);
      }
      if (i === 0 || j === 0 || j === boardWidth - 1) {
        //add html class
        element.classList.add("border");
      }
    }
    gameBoard.push(array2d);
  }
}
setupBoard();
function generateNewPiece(
  template: number[][],
  positionX: number,
  positionY: number
) {
  //function generates a new piece based on the template given, at the specified location entered, with the position being the left corner of the template
  for (let i = 0; i < template.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      if (template[i][j] === 1 || template[i][j] === 4) {
        let yCoordinate: number = positionY + i;
        let xCoordinate: number = positionX + j;
        gameBoard[yCoordinate][xCoordinate] = template[i][j];
        let cellHTML: HTMLElement = document.getElementById(
          coordinates(xCoordinate, yCoordinate)
        );
        cellHTML.classList.add("moving-piece");
        //   element.classList.add("moving-piece");
      }
    }
  }
}
function moveRight() {
  for (let i = boardWidth - 2; i > 0; i--) {
    for (let j = 1; j < boardHeight - 1; j++) {
      if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        gameBoard[j][i + 1] === 3
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
        //code to manipulate HTML
        let cell: HTMLElement = document.getElementById(coordinates(i, j));
        cell.classList.remove("moving-piece");
        let cell2: HTMLElement = document.getElementById(coordinates(i + 1, j));
        cell2.classList.add("moving-piece");
      }
    }
  }
}

function moveLeft() {
  for (let i = 1; i < boardWidth - 1; i++) {
    for (let j = 1; j < boardHeight - 1; j++) {
      if (
        (gameBoard[j][i] === 1 || gameBoard[j][i] === 4) &&
        gameBoard[j][i - 1] === 3
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
        //code to manipulate HTML
        let cell: HTMLElement = document.getElementById(coordinates(i, j));
        cell.classList.remove("moving-piece");
        let cell2: HTMLElement = document.getElementById(coordinates(i - 1, j));
        cell2.classList.add("moving-piece");
      }
    }
  }
}
//time for gravity
function moveDown() {
  for (let i = 1; i < boardHeight - 1; i++) {
    //scan entire row first before moving to execute translation on individual cells
    let floorFound: boolean = false;
    for (let j = boardWidth - 2; j > 0; j--) {
      if (
        (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) &&
        gameBoard[i - 1][j] === 2
      ) {
        floorFound = true;
      }
    }
    if (floorFound === true) {
      clearInterval(gravity);
      //reset piece rotation state for the next piece
      pieceRotationState = 1;
      //turn piece into fixed piece
      for (let i = 1; i < boardHeight - 1; i++) {
        for (let j = boardWidth - 2; j > 0; j--) {
          if (gameBoard[i][j] === 1 || gameBoard[i][j] === 4) {
            gameBoard[i].splice(j, 1, 2);
            let cell: HTMLElement = document.getElementById(coordinates(j, i));
            cell.classList.remove("moving-piece");
            cell.classList.add("fixed-piece");
          }
        }
      }
      //code to generate new piece here
      goGoGravity();
      return;
    }
    //fix and turn moving-pieces to fixed-pieces
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
        let cell: HTMLElement = document.getElementById(coordinates(j, i));
        cell.classList.remove("moving-piece");
        let cell2: HTMLElement = document.getElementById(coordinates(j, i - 1));
        cell2.classList.add("moving-piece");
      }
    }
  }
}
function rotatePiece(tetronomino: tetronomino) {
  //get reference position of anchor
  clearInterval(gravity);
  for (let i = 1; i < boardWidth - 1; i++) {
    for (let j = 1; j < boardHeight - 1; j++) {
      if (gameBoard[j][i] === 4) {
        console.log("anchor found at " + i + "-" + j);
        let anchorX = tetronomino.anchor[1];
        let anchorY = tetronomino.anchor[0];
        let xCoordinate = i + anchorX;
        let yCoordinate = j + anchorY;
        //clear ONEs currently on board
        
        for (let k = 1; k < boardWidth - 1; k++) {
          for (let l = 1; l < boardHeight - 1; l++) {
            if (gameBoard[l][k] === 1) {
              gameBoard[l].splice(k, 1, 0);
              let cell: HTMLElement = document.getElementById(coordinates(k, l));
              cell.classList.remove("moving-piece");
            }
          }
        }
        //replace ONEs around anchor
        switch (pieceRotationState) {
          case 1:
            generateNewPiece(
              currentPiece.templateTwo,
              xCoordinate,
              yCoordinate
            );
            break;
          case 2:
            generateNewPiece(
              currentPiece.templateThree,
              xCoordinate,
              yCoordinate
            );
            break;
          case 3:
            generateNewPiece(
              currentPiece.templateFour,
              xCoordinate,
              yCoordinate
            );
            break;
          case 4:
            generateNewPiece(currentPiece.template, xCoordinate, yCoordinate);
            break;

          default:
            pieceRotationState = 0;
            break;
        }
        pieceRotationState++;
        goGoGravity();
        return;
      }
    }
  }
}
//gravity in intervals
function goGoGravity() {
  gravity = setInterval(moveDown, 800);
}
function spawnNewPiece() {
  //encapsulate this later in a function that randomly creates new pieces and spawns them.
  let newPiece = new pieceL();
  //code to generate a new piece at spawn point
  generateNewPiece(newPiece.template, spawnX, spawnY);
  currentPiece = newPiece;
}

spawnNewPiece();

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
  if (x === 219){
    rotatePiece(currentPiece);
  }
}
document.onkeydown = keydownEvent;