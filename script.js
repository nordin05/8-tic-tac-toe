const Player = function (name, token) {
    const getName = () => name;
    const getToken = () => token;
    return { getName, getToken };
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const boardArray = [];

    let c1, c2, c3, c4, c5, c6, c7, c8, c9;

    for (let i = 0; i < rows; i++) {
        boardArray[i] = [];
        for (let j = 0; j < columns; j++) {
            boardArray[i].push(".");
        }
    }

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
    };

    const changeCell = function (row, column, token) {
        boardArray[row][column] = token;
    };

    const IsEmpty = function (row, column) {
        return boardArray[row][column] == ".";
    };

    const renderBoard = function () {
        console.table(boardArray);
    };

    const IsGameOver = function () {
        renderBoard();
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
        if (isTokenInArray(boardArray, ".")) {
            return false;
        }

        return true;
    };

    renderBoard();
    return { changeCell, IsEmpty, IsGameOver };
})();

const GameController = (function () {
    let currentTurn = player1;
    let winner;

    const getWinner = () => winner;

    const switchTurn = function () {
        currentTurn = currentTurn === player1 ? player2 : player1;
    };

    const printTurn = function () {
        console.log(`${currentTurn.getName()}'s turn.`);
    };

    const getClickedCell = function () {
        return [prompt("Choose row"), prompt("Choose column")];
    };

    const startRound = function () {
        printTurn();

        cell = getClickedCell();
        row = cell[0];
        column = cell[1];

        if (Gameboard.IsEmpty(row, column)) {
            Gameboard.changeCell(row, column, currentTurn.getToken());
            outcome = Gameboard.IsGameOver();
            if (outcome == true) {
                winner = currentTurn.getName();
                console.log("WINNER!");
                console.log(currentTurn.getName());
            } else if (outcome == undefined) {
                winner = "Tied";
                console.log("TIE!");
            } else switchTurn();
        } else {
            console.log(
                "This cell has already been picked, please choose another."
            );
        }
    };

    return { startRound, getWinner };
})();

while (GameController.getWinner() == undefined) {
    GameController.startRound();
}
