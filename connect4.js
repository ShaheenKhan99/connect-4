/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let isOver = false;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(){
  for (let y = 0; y < HEIGHT; y++){
    for (let x = 0; x < WIDTH; x++){
      if (!board[y]){
        board[y] = [];
      }
      board[y][x] = null;
    }
  }
}


// makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");
  // create top row for the board where players can click to play and its id attribute is set to 'column-top'
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // listen for click on top row 
  top.addEventListener("click", handleClick);
  // this for loop creates a number of table cells equal to WIDTH and adds each to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // append top row to the board
  htmlBoard.append(top);

  // this for loop creates all of the table rows for the rest of the board by iterating over the board array
  // create each row element and then a cell for each location 
  // Each cell is given the id attribute of its coordinates as 'y-x' and added to the row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    // add row to the board
    htmlBoard.append(row);
  }
}

//findSpotForCol: given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--){
    if (!board[y][x]) return y;
  }
  return null;
}

// placeInTable: update DOM to place piece into HTML table of board
//create div and insert into the related table cell
function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`)
  const cellLocation = document.getElementById(`${y}-${x}`);
  cellLocation.append(piece);
}


/** endGame: announce game end */
function endGame(msg) {
  isOver = true;
   // set delayed pop up alert message 
   setTimeout(function(){
    alert(msg);
   }, 300);   
}



/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
// exit if game is done
  if (isOver) {
    return;
  }
  // get x from ID of clicked cell and convert id string to number
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x); 


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie by checking if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
      return endGame(`It's a tie!`);
    }
  
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  }

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //these two nested for loops iterate through every cell
  // for each cell, an array of four consecutive cells is generated to check if they line up horizontally, vertically, diagonally right, or diagonally left 
  // the _win function runs on each array - if any of them returns true, then return true

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function reset(){
  // reset in-memory board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
  // reset HTML board
  Array.from(document.querySelectorAll('td div.piece')).forEach((el) => el.remove());
  // reset starting player
  currPlayer = 1;
  isOver = false;
}

makeBoard();
makeHtmlBoard();

// add reset event
document.querySelector('#reset').addEventListener('click', function(event){
  reset();
})

