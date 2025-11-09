const container = document.getElementById('container');
const flagsCount = document.getElementById('flagsCount');
let squares = [];

    const directionsExtended = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1]
    ];

function ArraySetup(x = false) {
        return Array.from({length: 10}, () => Array(10).fill(x))
    }

function CountStones() {
        let stonescount = 0;
        const child = container.children;

        for (let i = 0; i < 100; i++) {
            const childbg = child[i].style.background;
            if (childbg == 'rgba(128, 128, 126, 0)') {
                stonescount++
            }
        }

        return stonescount;
    }


function ReplicateStones() {
    container.innerHTML = '';
    squares = [];

    let revealed = ArraySetup();
    let flagged = ArraySetup();
    let gameOver = false;

    for (let i = 0; i < 10; i++) {
        squares[i] = [];

        for (let j = 0; j < 10; j++) {
            const square = document.createElement('div');
            square.classList.add('square', 'unrevealed');
            square.dataset.row = i;
            square.dataset.col = j;

            if (Math.random() > 0.6) {
                square.style.background = 'rgba(128, 128, 126, 0)';
            }

            container.appendChild(square);
            squares[i][j] = square;
        }
    }

    let Flags = CountStones();
    const totalMines = Flags;
    flagsCount.textContent = Flags;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let square = squares[i][j];

            square.addEventListener('click', (e) => {
                e.preventDefault();
                if (gameOver || revealed[i][j] || flagged[i][j]) return;

                if (square.style.background == 'rgba(128, 128, 126, 0)') {
                    square.classList.remove('unrevealed');
                    square.classList.add('mine-hit');
                    square.classList.add('mine');
                    gameOver = true;

                    for (let k = 0; k < 10; k++) {
                        for (let l = 0; l < 10; l++) {
                            if (squares[k][l].style.background == 'rgba(128, 128, 126, 0)' && !flagged[k][l]) {
                                squares[k][l].classList.remove('unrevealed');
                                squares[k][l].classList.add('mine');
                            }
                        }
                    }
                } else {
                    revealCell(i, j);
                }
            });

            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (gameOver || revealed[i][j]) return;

                if (flagged[i][j]) {
                    square.classList.remove('flag');
                    square.textContent = '';
                    flagged[i][j] = false;
                    Flags++;
                } else if (Flags > 0) {
                    square.classList.add('flag');
                    flagged[i][j] = true;
                    Flags--;
                }
  
                flagsCount.textContent = Flags;
                checkWinCondition();
            });
        }
    }


    function revealCell(i, j) {
        if (i < 0 || i >= 10 || j < 0 || j >= 10) return;
        if (revealed[i][j] || flagged[i][j]) return;

        let square = squares[i][j];
        
        revealed[i][j] = true;
        square.classList.remove('unrevealed');
        square.classList.add('revealed');

        let BolderCount = 0;
        for (let [dx, dy] of directionsExtended) {
            let ni = i + dx;
            let nj = j + dy;
            if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10 && squares[ni][nj].style.background == 'rgba(128, 128, 126, 0)') BolderCount++;
        }

        if (BolderCount > 0) {
            square.textContent = BolderCount;
        } else {
            for (let [dx, dy] of directionsExtended) {
                revealCell(i + dx, j + dy);
            }
        }

        checkWinCondition();
    }

    function checkWinCondition() {
        let revealedCount = 0;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (revealed[i][j]) revealedCount++;
            }
        }

        if (revealedCount === 100 - totalMines) {
            gameOver = true;
            console.log('You found all stones!');
        }
    }

    function revealRandomSafeCell() {
        let safeCells = [];
    
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (squares[i][j].style.background != 'rgba(128, 128, 126, 0)') {
                    safeCells.push([i, j]);
                }
            }
        }

        if (safeCells.length > 0) {
            const [startX, startY] = safeCells[Math.floor(Math.random() * safeCells.length)];
            revealCell(startX, startY);
        }
    }

    revealRandomSafeCell();
}

ReplicateStones();