const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.reset');
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = true;
let mode = "player";

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");
            gameActive = false;
            setTimeout(() => alert(`${currentPlayer} Wins!`), 300);
            return true;
        }
    }
    if (!board.includes("") && gameActive) {
        setTimeout(() => alert("It's a Draw!"), 300);
        gameActive = false;
    }
    return false;
}


function minimax(board, depth, isMaximizing) {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}


function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = "O";
    cells[move].innerText = "O";
    if (checkWin()) return;
    currentPlayer = "X";
}


function checkWinner(player) {
    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

function handleClick(event) {
    const index = event.target.dataset.index;
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;

    if (checkWin()) return;

    currentPlayer = (currentPlayer === "X") ? "O" : "X";

    if (mode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function resetGame() {
    board.fill("");
    gameActive = true;
    currentPlayer = "X";
    cells.forEach(cell => { cell.innerText = ""; cell.classList.remove("win"); });
}

modeSelect.addEventListener("change", () => { mode = modeSelect.value; resetGame(); });
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
