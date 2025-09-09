const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const twoPlayerBtn = document.getElementById("twoPlayer");
const vsAIBtn = document.getElementById("vsAI");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let vsAI = false;
let boardState = Array(9).fill("");

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (boardState[index] !== "" || !gameActive) return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("taken");

  if (checkWinner()) {
    statusText.textContent = `${currentPlayer} Wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Turn: ${currentPlayer}`;

  if (vsAI && currentPlayer === "O" && gameActive) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let emptyIndices = boardState.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  
  boardState[randomIndex] = "O";
  cells[randomIndex].textContent = "O";
  cells[randomIndex].classList.add("taken");

  if (checkWinner()) {
    statusText.textContent = "O Wins! 🤖";
    gameActive = false;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `Turn: ${currentPlayer}`;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
  ];
  
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
  });
}

function startGame(modeAI = false) {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  vsAI = modeAI;
  statusText.textContent = `Turn: ${currentPlayer}`;
  createBoard();
}

resetBtn.addEventListener("click", () => startGame(vsAI));
twoPlayerBtn.addEventListener("click", () => startGame(false));
vsAIBtn.addEventListener("click", () => startGame(true));

// Start default as 2-player
startGame(false);
