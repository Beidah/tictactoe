// Important elements;

const playerName = document.getElementById("player-name");
const cells = document.getElementsByClassName("board-space");
const turnIndicator = document.getElementById("turn-indicator");
const winnerIndicator = document.getElementById("winner-indicator");
const resetButton = document.getElementById("reset-button");

// Todo: Set up error display html
const setError = (errMsg) => {
  console.error(errMsg);
}

/// Player Factory
const playerFactory = (playerSymbol) => {
  return { playerSymbol };
}

const gameManager = (() => {
  const board = [[], [], []];
  const playerX = playerFactory("X");
  const playerO = playerFactory("O");
  let winningPlayer = null;

  let currentPlayer = playerX;

  const checkMoveIsLegal = (x, y) => {
    return board[y - 1][x - 1] === " ";
  }

  const drawBoard = () => {
    for (const cell of cells) {
      const { row, col } = cell.dataset;
      cell.innerHTML = board[row - 1][col - 1];
    }
  }

  const makeMove = (x, y) => {
    if (winningPlayer !== null) {
      setError("Game is over. Reset to keep playing.");
      return;
    }
    if (checkMoveIsLegal(x, y)) {
      board[y - 1][x - 1] = currentPlayer.playerSymbol;
      switchPlayer();
      drawBoard();

      const winner = checkWinner();
      if (winner !== " ") {
        displayWinner(winner);
      }
      if (checkTie()) {
        displayTie();
      }
    } else {
      setError("Space already occupied.");
    }
  }

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    playerName.innerHTML = currentPlayer.playerSymbol;
  }

  const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
      // check vertical
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }

      // check horizontal
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }

    // check diagnols
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return " ";
  }

  const checkTie = () => {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[y][x] === " ") {
          return false;
        }
      }
    }
    return true;
  }

  const displayWinner = (winner) => {
    turnIndicator.hidden = true;
    winnerIndicator.innerHTML = `Congratulations! Player ${winner} has won!`;
    winnerIndicator.hidden = false;
    winningPlayer = winner;
  }

  const displayTie = () => {
    turnIndicator.hidden = true;
    winnerIndicator.innerHTML = `No more moves left! Looks like a draw!`;
    winnerIndicator.hidden = false;
    winningPlayer = "tie";
  }

  const resetBoard = () => {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        board[y][x] = " ";
      }
    }

    winningPlayer = null;
    turnIndicator.hidden = false;
    winnerIndicator.hidden = true;
    if (currentPlayer === playerO) {
      switchPlayer();
    }
    drawBoard();
  }

  resetBoard();

  return { 
    playerX, 
    playerO, 
    board, 
    makeMove,
    resetBoard
  };
})();

const setupGame = () => {
  for (const cell of cells) {
      const onclick = ({target}) => {
        const {row, col} = target.dataset;
        gameManager.makeMove(col, row);
      }

      cell.onclick = onclick;
  };

  resetButton.onclick = gameManager.resetBoard;
}


setupGame();