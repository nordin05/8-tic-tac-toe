const Player = function (name, token) {
    const getName = () => name;
    const getToken = () => token;
    const changeName = function (newName) {
        name = newName;
    };
    return { getName, getToken, changeName };
};

Player.prototype.changeName = function (newName) {
    this.name = newName;
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const boardArray = [];

    let c1, c2, c3, c4, c5, c6, c7, c8, c9;

    const create2DArray = function () {
        for (let i = 0; i < rows; i++) {
            boardArray[i] = [];
            for (let j = 0; j < columns; j++) {
                boardArray[i].push("");
            }
        }
    };

    create2DArray();

    const updateCellVar = function () {
        c1 = boardArray[0][0];
        c2 = boardArray[0][1];
        c3 = boardArray[0][2];
        c4 = boardArray[1][0];
        c5 = boardArray[1][1];
        c6 = boardArray[1][2];
        c7 = boardArray[2][0];
        c8 = boardArray[2][1];
        c9 = boardArray[2][2];

        return [c1, c2, c3, c4, c5, c6, c7, c8, c9];
    };

    const changeCell = function (row, column, token) {
        boardArray[row][column] = token;
    };

    const IsEmpty = function (row, column) {
        return boardArray[row][column] == "";
    };

    const IsGameOver = function () {
        updateCellVar();

        checkArray = [checkHorizontals(), checkVerticals(), checkDiagonals()];

        if (isTokenInArray(checkArray, player1.getToken())) {
            return true;
        } else if (isTokenInArray(checkArray, player2.getToken())) {
            return true;
        } else if (isTied()) {
            return undefined;
        }

        return false;
    };

    const isTokenInArray = function (arr, token) {
        return arr.some((row) => row.includes(token));
    };

    const checkHorizontals = function () {
        h1 = CheckThreeCells(c1, c2, c3);
        h2 = CheckThreeCells(c4, c5, c6);
        h3 = CheckThreeCells(c7, c8, c9);

        return [h1, h2, h3];
    };

    const checkVerticals = function () {
        v1 = CheckThreeCells(c1, c4, c7);
        v2 = CheckThreeCells(c2, c5, c8);
        v3 = CheckThreeCells(c3, c6, c9);

        return [v1, v2, v3];
    };

    const checkDiagonals = function () {
        d1 = CheckThreeCells(c1, c5, c9);
        d2 = CheckThreeCells(c7, c5, c3);

        return [d1, d2];
    };

    const CheckThreeCells = function (a, b, c) {
        token1 = player1.getToken();
        token2 = player2.getToken();

        if (a == token1 && b == token1 && c == token1) {
            return token1;
        } else if (a == token2 && b == token2 && c == token2) {
            return token2;
        } else {
            return false;
        }
    };

    const isTied = function () {
        if (isTokenInArray(boardArray, "")) {
            return false;
        }

        return true;
    };

    const convert1Dto2D = function (str) {
        index = parseInt(str) - 1;
        row = Math.floor(index / 3);
        column = index % 3;

        return [row, column];
    };

    const reset = function () {
        boardArray.length = 0;
        create2DArray();
    };

    return {
        changeCell,
        IsEmpty,
        IsGameOver,
        updateCellVar,
        convert1Dto2D,
        reset,
    };
})();

const GameController = (function () {
    let currentTurn = player1;
    let winner;

    const getWinner = () => winner;

    const getTurn = () => currentTurn;

    const switchTurn = function () {
        currentTurn = currentTurn === player1 ? player2 : player1;
    };

    const startRound = function (row, column) {
        if (Gameboard.IsEmpty(row, column)) {
            Gameboard.changeCell(row, column, currentTurn.getToken());
            outcome = Gameboard.IsGameOver();
            if (outcome == true) {
                winner = currentTurn.getName();
                screenController.createWinnerDiv();
            } else if (outcome == undefined) {
                winner = "You Tied!";
                screenController.createWinnerDiv();
            } else switchTurn();
        }
    };

    const reset = function () {
        winner = undefined;
        currentTurn = player1;
    };

    return { startRound, getWinner, getTurn, reset };
})();

const screenController = (function () {
    const grid_container = document.querySelector(".grid-container");
    const context_text = document.querySelector(".game-context p");

    const createGridDivs = function () {
        for (let i = 0; i < 3 * 3; i++) {
            const newDiv = document.createElement("div");
            newDiv.id = `c${i + 1}`;
            grid_container.appendChild(newDiv);
        }
    };

    const updateCellDivs = function () {
        cellValues = Gameboard.updateCellVar();
        grid_cells = [...grid_container.querySelectorAll(":scope > div")];

        i = 0;
        grid_cells.forEach((cell) => {
            cell.innerHTML = cellValues[i];
            i += 1;
        });

        return grid_cells;
    };

    const showScreen = function () {
        createGridDivs();
        grid_cells = updateCellDivs();

        i = 1;
        grid_cells.forEach((cell) => {
            cell.style.zIndex = i;
            setTimeout(function () {
                console.log(i);
                cell.style.animation = `positionIN 1.25s forwards, cellOpacityIN 1.25s forwards, cellColorIN 1.25s forwards`;
                cell.addEventListener("click", divClicked);
            }, 200 * i);
            i = i + 1;
        });
    };

    const removeScreen = function () {
        grid_cells = updateCellDivs();

        grid_cells.forEach((cell) => {
            cell.removeEventListener("click", divClicked);
            cell.remove();
        });
    };

    function divClicked() {
        if (GameController.getWinner() == undefined) {
            index = Gameboard.convert1Dto2D(this.id.charAt(1));

            GameController.startRound(index[0], index[1]);
            updateCellDivs();
            updateTurnText();
        }
    }

    const updateTurnText = function () {
        context_text.innerHTML = `${GameController.getTurn().getName()}'s turn`;
    };

    const createWinnerDiv = function () {
        const newDiv = document.createElement("div");
        newDiv.id = "winner-popup";

        const p = document.createElement("p");
        winner = GameController.getWinner();
        if (winner != "You Tied!") {
            winner = `${winner} won!`;
        }
        p.innerHTML = winner;

        const btn = document.createElement("button");
        btn.addEventListener("click", resetClicked);
        btn.innerHTML = "Retry?";

        newDiv.appendChild(p);
        newDiv.appendChild(btn);
        document.body.appendChild(newDiv);

        document.querySelector(".tint").style.display = "block";
    };

    const removeWinnerDiv = function () {
        const btn = document.querySelector("#winner-popup button");
        btn.removeEventListener("click", resetClicked);
        document.querySelector("#winner-popup").remove();
        document.querySelector(".tint").style.display = "none";
    };

    function resetClicked() {
        player1.changeName("Player 1");
        player2.changeName("Player 2");

        Gameboard.reset();
        GameController.reset();
        context_text.innerHTML = "";
        removeScreen();
        removeWinnerDiv();
        document.querySelector("#myForm").style.display = "grid";
    }

    return { createWinnerDiv, updateTurnText, showScreen };
})();

const form = document.querySelector("#myForm");
const input_player1 = document.querySelector('[id = "player 1"]');
const input_player2 = document.querySelector('[id = "player 2"]');

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name1 = input_player1.value;
    let name2 = input_player2.value;

    player1.changeName(name1);
    player2.changeName(name2);

    form.style.display = "none";
    input_player1.value = "";
    input_player2.value = "";

    screenController.showScreen();
    screenController.updateTurnText();
});
