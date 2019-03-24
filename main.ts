let gameBoard: number[][];
let spawnX: number = 4;
let spawnY: number = 17;
let gameBoardDivs: NodeList = document.querySelectorAll("#game-board div");
let boardHeight: number = 21;
let boardWidth: number = 12;
let gravity;
let gameBoardHTML: HTMLElement = document.getElementById("game-board");
// let pieceRotationState: number = 4;
let currentPiece: tetronominoV2;
let pieceRotationStateV2: number = 0;

//generic Piece
interface tetronomino {
  template: number[][];
  templateTwo: number[][];
  templateThree: number[][];
  templateFour: number[][];
  anchor: number[];
}
interface tetronominoV2 {
  template: number[][][];
  templateOne: number[][];
  templateTwo: number[][];
  templateThree: number[][];
  templateFour: number[][];
}
//template 1 to 4 go in clockwise
function pieceL() {
  this.template = [
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateTwo = [
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateThree = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateFour = [
    [1, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.anchor = [-4, -2];
}
function pieceLV2() {
  this.template = [
    [[0, 4, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 4, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 4, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 4, 0], [0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  ];
  this.templateOne = [
    [0, 4, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  this.templateTwo = [
    [0, 4, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  this.templateThree = [
    [0, 0, 4, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  this.templateFour = [
    [1, 1, 4, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
function pieceJ() {
  this.template = [
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateTwo = [
    [0, 1, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateThree = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateFour = [
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.anchor = [-4, -2];
}

function pieceO() {
  this.template = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateTwo = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateThree = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateFour = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.anchor = [-4, -2];
}

function pieceZ() {
  this.template = [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateTwo = [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateThree = [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateFour = [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.anchor = [-4, -2];
}

function pieceS() {
  this.template = [
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateTwo = [
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateThree = [
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.templateFour = [
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 0, 0]
  ];
  this.anchor = [-4, -2];
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

  //add a loop check of target cells to be filled with new template
  //if cells on the left currently contain a wall (3) or other piece (2), but the ones on the right do not, move translation to the right posX+1
  //only do these checks if the transformation contains a piece in that row or column
  //vice versa for the cells containing occupants on the right side but not on the left posX-1
  //if both the left and right contain neighbors, do nothing
  //keep pieces from phasing into the ground by not allowing transformations which occupy already occupied bottom cells.

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
        (gameBoard[j][i + 1] === 3 || gameBoard[j][i + 1] === 2)
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
        (gameBoard[j][i - 1] === 3 || gameBoard[j][i - 1] === 2)
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
function checkLineFilled() {
  //delete all rows before pushing lines above down
  for (let i = 1; i < boardHeight - 1; i++) {
    let rowFilled = 0;
    for (let j = boardWidth - 2; j > 0; j--) {
      if (gameBoard[i][j] === 2) {
        rowFilled++;
      }
    }
    if (rowFilled === boardWidth - 2) {
      //deleteRow
      for (let j = boardWidth - 2; j > 0; j--) {
        //update array
        gameBoard[i].splice(j, 1, 0);
        //update html
        let cell: HTMLElement = document.getElementById(coordinates(j, i));
        cell.classList.remove("fixed-piece");
      }
      for (let k = 1; k < boardHeight - 1; k++) {
        for (let l = boardWidth - 2; l > 0; l--) {
          if (gameBoard[k][l] === 2) {
            //update array
            gameBoard[k].splice(l, 1, 0);
            gameBoard[k - 1].splice(l, 1, 2);
            //update html
          }
        }
      }
    }
  }
  //move 2s still remaining down
}
function moveDown() {
  let floorFound: boolean = false;
  //scan 4 rows first before moving to execute translation on individual cells
  for (let i = 1; i < boardHeight - 1; i++) {
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
      pieceRotationStateV2 = 0;
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
      spawnNewPiece();
      checkLineFilled();
      goGoGravity();
      return;
    }
  }
  for (let i = 1; i < boardHeight - 1; i++) {
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

function rotatePieceV2(tetronomino: tetronominoV2, clockwise: boolean) {
  //get reference position of anchor
  let currentTemplate: number[][] = tetronomino.template[pieceRotationStateV2];
  let anchorTemplatePosX: number;
  let anchorTemplatePosY: number;
  for (let i = 0; i < currentTemplate.length; i++) {
    for (let j = 0; j < currentTemplate[i].length; j++) {
      if (currentTemplate[i][j] === 4) {
        anchorTemplatePosY = i;
        anchorTemplatePosX = j;
      }
    }
  }
  //prepare next template
  if (clockwise === true) {
    //next template is the clockwise transformation of the current template which is the the 2d array in the 3d template array
    pieceRotationStateV2++;
  } else {
    //else next template is the ACW transformation
    pieceRotationStateV2--;
  }
  if (pieceRotationStateV2 > 3) {
    pieceRotationStateV2 = 0;
  } else if (pieceRotationStateV2 < 0) {
    pieceRotationStateV2 = 3;
  }
  let nextTemplate: number[][] = tetronomino.template[pieceRotationStateV2];
  let anchorNextTemplatePosX: number;
  let anchorNextTemplatePosY: number;
  for (let i = 0; i < nextTemplate.length; i++) {
    for (let j = 0; j < nextTemplate[i].length; j++) {
      if (nextTemplate[i][j] === 4) {
        anchorNextTemplatePosY = i;
        anchorNextTemplatePosX = j;
      }
    }
  }
  //need to ensure rotatePiece function checks board for collisions and adjusts replacement of piece template accordingly to avoid 'phasing' of blocks into walls and floor and other pieces
  for (let i = 1; i < boardWidth - 1; i++) {
    for (let j = 1; j < boardHeight - 1; j++) {
      //finds anchor which is identified as 4
      if (gameBoard[j][i] === 4) {
        console.log("anchor found at " + i + "-" + j);
        let anchorX = -anchorTemplatePosX;
        let anchorY = -anchorTemplatePosY;
        let xCoordinate = i + anchorX;
        let yCoordinate = j + anchorY;
        //clear ONEs  and FOURs currently on board only after check has been done that replacement template does not have collisions
        let collision: boolean = true;
        let leftCollision: number = 0;
        let rightCollision: number = 0;
        let collisionCount: number = 0;
        while (collision === true && collisionCount < 2) {
          for (let k = 0; k < nextTemplate.length; k++) {
            for (let l = 0; l < nextTemplate[k].length; l++) {
              if (nextTemplate[k][l] === 1 || nextTemplate[k][l] === 4) {
                let cellPosY: number = yCoordinate + k;
                let cellPosX: number =
                  xCoordinate + l + leftCollision - rightCollision;
                //check left side of board
                if (
                  gameBoard[cellPosY][cellPosX] === 2 ||
                  gameBoard[cellPosY][cellPosX] === 3
                ) {
                  console.log("collision encountered in rotation");
                  collision = true;

                  //find location of collision
                  if (l === 0) {
                    collisionCount++;
                    leftCollision = leftCollision + 1;
                  } else if (l === 1) {
                    collisionCount++;
                    leftCollision = leftCollision + 2;
                  } else if (l === 2) {
                    collisionCount++;
                    rightCollision = rightCollision + 2;
                  } else if (l === 3) {
                    collisionCount++;
                    rightCollision = rightCollision + 1;
                  }
                } else {
                  //declare collision as false if current value of leftCollision or rightCollision presents a scenario where a collision is avoided
                  collision = false;
                }
              }
            }
          }
        }
        //clear piece from table if collisions is false ie no collisions or collision resolved through displacement
        if (collision === true) {
          //do nothing
        } else {
          for (let k = 1; k < boardWidth - 1; k++) {
            for (let l = 1; l < boardHeight - 1; l++) {
              if (gameBoard[l][k] === 1 || gameBoard[l][k] === 4) {
                gameBoard[l].splice(k, 1, 0);
                let cell: HTMLElement = document.getElementById(
                  coordinates(k, l)
                );
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
}

//gravity in intervals
function goGoGravity() {
  gravity = setInterval(moveDown, 800);
}
let number = 0;
function spawnNewPiece() {
  //encapsulate this later in a function that randomly creates new pieces and spawns them.
  // let randomNum: number = Math.floor(Math.random() * 5 + 1);
  number++;
  if (number > 5) {
    number = 1;
  }
  let newPiece: tetronominoV2 = new pieceLV2();
  // switch (number) {
  //   case 1:
  //     newPiece = new pieceJ();
  //     break;
  //   case 2:
  //     newPiece = new pieceL();
  //     break;
  //   case 3:
  //     newPiece = new pieceO();
  //     break;
  //   case 4:
  //     newPiece = new pieceS();
  //     break;
  //   case 5:
  //     newPiece = new pieceZ();
  //     break;
  //   default:
  //     newPiece = new pieceJ();
  //     break;
  // }
  //code to generate a new piece at spawn point
  generateNewPiece(newPiece.template[0], spawnX, spawnY);
  currentPiece = newPiece;
}
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
    rotatePieceV2(currentPiece, true);
  }
  if (x === 219) {
    rotatePieceV2(currentPiece, false);
  }
}
document.onkeydown = keydownEvent;
