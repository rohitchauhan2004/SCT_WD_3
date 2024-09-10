const board = document.getElementById('game-board');
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('reset-button');
const statusElement = document.getElementById('status');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsComputerButton = document.getElementById('player-vs-computer');

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameOver = false;
let gameMode = 'player-vs-player'; // Default mode

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
playerVsPlayerButton.addEventListener('click', () => setGameMode('player-vs-player'));
playerVsComputerButton.addEventListener('click', () => setGameMode('player-vs-computer'));

// Set game mode
function setGameMode(mode) {
    gameMode = mode;
    resetGame();
}

// Handle cell click
function handleClick(event) {
    const cell = event.target;
    const cellIndex = Array.from(cells).indexOf(cell);
    
    if (boardState[cellIndex] || gameOver) return;

    boardState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        gameOver = true;
        updateStatus(`${currentPlayer} wins!`);
        return;
    }

    if (boardState.every(cell => cell)) {
        gameOver = true;
        updateStatus('Draw!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`${currentPlayer}'s turn`);

    if (gameMode === 'player-vs-computer' && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500);
    }
}

// Computer's move
function computerMove() {
    const availableCells = boardState
        .map((value, index) => value === null ? index : null)
        .filter(index => index !== null);

    if (availableCells.length === 0) return;

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    boardState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    if (checkWin()) {
        gameOver = true;
        updateStatus('O wins!');
        return;
    }

    if (boardState.every(cell => cell)) {
        gameOver = true;
        updateStatus('Draw!');
    }

    currentPlayer = 'X';
    updateStatus(`${currentPlayer}'s turn`);
}

// Check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

// Update game status
function updateStatus(message) {
    statusElement.textContent = message;
}

// Reset the game
function resetGame() {
    boardState = Array(9).fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameOver = false;
    updateStatus(`${currentPlayer}'s turn`);
}
