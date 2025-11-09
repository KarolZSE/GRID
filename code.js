    const container = document.getElementById('container');
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.textContent = i;
        square.style.background = '#664c28';
        if (Math.random() > 0.7) square.style.background = '#80807e';
        container.appendChild(square);
    }

    let planes = 5;
    const contr = document.querySelectorAll('.contr');
    contr.forEach(e => {
        for (let i = 0; i < 10; i++) {
            const square = document.createElement('button');
            square.textContent = i;
            e.appendChild(square);
            square.onclick = function() {
                if (!planes) {
                    CountFilledSquares();
                    return;
                };

                const plane = document.createElement('div');
                plane.classList.add('plane');

                const containerRect = container.getBoundingClientRect();

                if (e.id == 'verticaltop') {
                    plane.style.left = (containerRect.left + i * 60) + 'px';
                    plane.style.top = (containerRect.top - 60) + 'px';
                    setTimeout(() => {
                        plane.style.top = (containerRect.top + 600) + 'px';
                    }, 0);
                } else if (e.id == 'verticalbottom') {
                    plane.style.left = (containerRect.left + i * 60) + 'px';
                    plane.style.top = (containerRect.top + 600) + 'px';
                    setTimeout(() => {
                        plane.style.top = (containerRect.top - 60) + 'px';
                    }, 0);
                } else if (e.id == 'horizontalleft'){
                    plane.style.left = (containerRect.left - 60) + 'px';
                    plane.style.top = (containerRect.top + i * 60) + 'px';
                    setTimeout(() => {
                        plane.style.left = (containerRect.left + 600) + 'px';
                    }, 0);
                } else {
                    plane.style.left = (containerRect.left + 600) + 'px';
                    plane.style.top = (containerRect.top + i * 60) + 'px';
                    setTimeout(() => {
                        plane.style.left = (containerRect.left - 60) + 'px';
                    }, 0);
                }
                setTimeout(() => {
                    plane.remove();
                }, 1000);

                document.body.appendChild(plane);

                for (let j = 0; j < 10; j++) {
                    let gridsquare;
                    if (e.id == 'verticaltop') {
                        gridsquare = container.children[i + j * 10];
                    } else if (e.id == 'verticalbottom') {
                        gridsquare = container.children[100 - (10 - i + j * 10)];
                    } else if (e.id == 'horizontalleft'){
                        gridsquare = container.children[i * 10 + j];
                    } else {
                        gridsquare = container.children[i * 10 + 9 - j];
                    }

                    setTimeout(() => {
                        if (gridsquare.style.background !== 'rgb(128, 128, 126)') {
                            gridsquare.style.background = '#000000';
                        } 
                    }, 100 * j);
                }
                square.onclick = '';
                planes--;
            }
        }
    });

    function CountFilledSquares() {
        let count = stonescount = 0;
        const child = container.children;

        for (let i = 0; i < 100; i++) {
            const childbg = child[i].style.background;
            if (childbg == 'rgb(0, 0, 0)') {
                count++
            }

            if (childbg == 'rgb(128, 128, 126)') {
                stonescount++
            }
        }

        console.log(`You had filled in ${count}, which equals to ${(count / (100 - stonescount) * 100).toFixed(2)}% of the board (excluding bolders).`);
    }


    planes = 0;
    let grid = [];
    let squares = [];
    let playerPipes = [];
    let pipeData = [];
    let currentCheckpointIndex = 0;
    let allCheckpoints = [];

    const pipe_types = {
        'Vertical': [0, 2],
        'Horizontal': [1, 3],
        'corner-0': [1, 0],
        'corner-1': [2, 1],
        'corner-2': [3, 2],
        'corner-3': [0, 3]
    }

    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    function ArraySetup(x = false) {
        return Array.from({length: 10}, () => Array(10).fill(x))
    }

    function ResetGrid() {
        container.innerHTML = '';
        grid = [];
        squares = [];
        playerPipes = ArraySetup();
        pipeData = ArraySetup(null);

        for (let i = 0; i < 10; i++) {
            grid[i] = [];
            squares[i] = [];
            for (let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                if (Math.random() > 0.6) {
                    square.style.background = '#80807e';
                    grid[i][j] = 1;
                } else {
                    grid[i][j] = 0;
                }

                /*
                square.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', null);
                    draggedSquare = square;
                })
                */

                square.addEventListener('dragover', (e) => {
                    e.preventDefault();
                })

                square.addEventListener('drop', (e) => {
                    e.preventDefault();

                    const pipeType = e.dataTransfer.getData('pipe-type');
                    if (pipeType) {
                        placePipe(i, j, pipeType, e);
                    }
                });

                square.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    playerPipes[i][j] = false;
                    pipeData[i][j] = null;
                    square.classList.remove('player-pipe', 'straightPipes', 'cornerPipes');
                });

                container.appendChild(square);
                squares[i][j] = square;
            }
        }
    }

    function isValidPlacement(row, col, tempPipe) {
        const old = pipeData[row][col];
        pipeData[row][col] = tempPipe;

        let adjacentCount = 0;
        let connectingCount = 0;

        for (let [dx, dy] of directions) {
            let nx = row + dx;
            let ny = col + dy;

            if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue;

            const isCheckPoint = allCheckpoints.some(([cx, cy]) => cx === nx && cy === ny);
            const hasPipe = playerPipes[nx][ny];

            if (!isCheckPoint && !hasPipe) continue;

            adjacentCount++;

            if (canConnect(row, col, nx, ny)) connectingCount++;
        }

        pipeData[row][col] = old;

        if (adjacentCount > 0) {
            return connectingCount > 0;
        }

        return true;
    }

    function UpdateVisual(row, col) {
        const square = squares[row][col];
        const data = pipeData[row][col];

        if (data) square.style.transform = `rotate(${data.rotation * 90}deg)`;
    }

    function getPipeConnections(row, col) {
        const data = pipeData[row][col];
        
        if (!data) return allCheckpoints.some(([cx, cy]) => cx === row && cy === col) ? [0, 1, 2, 3] : [];

        return pipe_types[data.type] || [];
    }

    function canConnect(row1, col1, row2, col2) {
        let dir1 = -1;
        let dir2 = -1;

        if (row2 === row1 - 1) {
            dir1 = 0;
            dir2 = 2;
        } else if (row2 === row1 + 1) {
            dir1 = 2;
            dir2 = 0;
        } else if (col2 === col1 + 1) {
            dir1 = 1;
            dir2 = 3;
        } else if (col2 === col1 - 1) {
            dir1 = 3;
            dir2 = 1;
        }
        
        if (dir1 === -1) return false;

        return getPipeConnections(row1, col1).includes(dir1) && getPipeConnections(row2, col2).includes(dir2);
    }

    function placePipe(row, col, pipeType, e) {
        const r = parseInt(e?.dataTransfer?.getData('pipe-rotation') || 0);

        const next = allCheckpoints[currentCheckpointIndex + 1];
        const isTargetCheckPoint = next && next[0] === row && next[1] === col;

        if (playerPipes[row][col] && !isTargetCheckPoint) {
            console.log('Cannot place');
            return false;
        }

        const [sx, sy] = allCheckpoints[0];
        const direct = directions.some(([dx, dy]) => {
            let [nx, ny] = [row + dx, col + dy];
            playerPipes[nx][ny] || allCheckpoints.some(([cx, cy]) => cx === nx && cy === ny);
        });

        if (direct && Math.abs(sx - row) + Math.abs (sy - col) === 1) return false;

        let baseType, type, rotation;
        if (pipeType === 'straight') {
            baseType = 'straight';
            type = r % 2 === 0 ? 'Vertical' : 'Horizontal';
            rotation = r;
        } else if (pipeType === 'corner') {
            baseType = 'corner';
            type = `corner-${r}`;
            rotation = r;
        }

        const candidate = { baseType, type, rotation };

        if (!isValidPlacement(row, col, candidate)) {
            console.log('Missalign');
            return false;
        }

        playerPipes[row][col] = true;
        pipeData[row][col] = candidate;

        const square = squares[row][col];
        square.classList.add('player-pipe', pipeType === 'corner' ? 'cornerPipes' : 'straightPipes');

        UpdateVisual(row, col);

        if (currentCheckpointIndex >= allCheckpoints.length - 1 && checkAllConnections()) console.log('Game Completed');

        return true;
    }

    function setupPipes() {
        document.querySelectorAll('#pipes div').forEach(pipe => {
            let rotation = 0;
            pipe.setAttribute('draggable', 'true');
            pipe.addEventListener('click', () => {
                rotation = (rotation + 1) % 4;
                pipe.style.transform = `rotate(${rotation * 90}deg)`;
                pipe.dataset.rotation = rotation;
            });

            pipe.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('pipe-type', pipe.dataset.type || 'straight');
                e.dataTransfer.setData('pipe-rotation', pipe.dataset.rotation || 0);
            })
        })
    }

    function getRandomEdgePoint() {
        let edge = Math.floor(Math.random() * 4);
        let random = Math.floor(Math.random() * 10);

        return edge === 0 ? [0, random] : edge === 1 ? [9, random] : edge === 2 ? [random, 0] : [random, 9];
    }

    function findPath(start, end, maxL = 100) {
        let queue = [[[start], null, 0]];
        let visited = ArraySetup();
        visited[start[0]][start[1]] = true;

        while (queue.length) {
            let [path, lastDir, lCount] = queue.shift();
            let [x, y] = path.at(-1);

            if (x === end[0] && y === end[1]) return path;

            for (let [dx, dy] of directions) {
                let [nx, ny] = [x + dx, y + dy];

                if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10 || grid[nx][ny]) continue;

                    let isTurn = lastDir && (dx !== lastDir[0] || dy !== lastDir[1]);
                    let newLCount = lCount + (isTurn ? 1 : 0);

                    if (newLCount > maxL || visited[nx][ny]) continue;

                    visited[nx][ny] = true;
                    queue.push([[...path, [nx, ny]], [dx, dy], newLCount]);
            }
        }

        return null;
    }

function generatePath() {
    let allPathsValid = false;
    while (!allPathsValid) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                squares[i][j].classList.remove('pipe', 'start', 'end', 'hidden-check');
            }
        }

        let start, middles = [], end;
        let attemps = 0;

        while (attemps < 50) {
            start = getRandomEdgePoint();
            middles = [];

            for (let i = 0; i < 3; i++) {
                middles.push([3 + Math.floor(Math.random() * 4), 3 + Math.floor(Math.random() * 4)]);
            }
            
            end = getRandomEdgePoint();

            const [sx, sy] = start;
            const [ex, ey] = end;

            let allValid = grid[sx][sy] === 0 && grid[ex][ey] === 0;

            for (let [mx, my] of middles) {
                if (grid[mx][my] !== 0) {
                    allValid = false;
                    break;
                }
            }

            if (allValid) {
                let points = [start, ...middles, end];
                let distancesValid = true;

                for (let i = 0; i < points.length - 1; i++) {
                    const distance = Math.abs(points[i][0] - points[i + 1][0]) + Math.abs(points[i][1] - points[i + 1][1]);
                    if (distance < 5 || distance > 18) {
                        distancesValid = false;
                        break;
                    }
                }

                if (distancesValid) break;
            }
            attemps++;
        }

        if (attemps >= 50) {
            console.log('No solution');
            ResetGrid();
            continue;
        }

        let allPoints = [start, ...middles, end];
        allPathsValid = true;

        for (let i = 0; i < allPoints.length - 1; i++) {
            const path = findPath(allPoints[i], allPoints[i + 1]);
            if (path) {
                path.slice(1, -1).forEach(([x, y]) => grid[x][y] = 1);
            } else {
                allPathsValid = false;
                break;
            }
        }

        if (allPathsValid) {
            allCheckpoints = [start, ...middles, end];
            const observers = [];

            allCheckpoints.forEach(([cx, cy], index) => {
                const sq = squares[cx][cy];
                sq.classList.remove('start', 'end', 'middle-end', 'hidden-check');

                if (index === 0) {
                    sq.classList.add('start');
                    sq.style.opacity = '1';
                } else if (index === allCheckpoints.length - 1) {
                    sq.classList.add('hidden-check');
                    sq.classList.add('end');
                    sq.style.opacity = '0';
                } else {
                    sq.classList.add('hidden-check');
                    sq.classList.add('middle-end');
                    sq.style.opacity = '0';
                }

                const observer = new MutationObserver((mutation) => {
                    let first = true;
                    mutation.forEach((mutation) => {
                        if (!first) return;
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if (sq.classList.contains('player-pipe') && sq.classList.contains('middle-end') && !sq.classList.contains('hidden-check')) {
                                console.log('test1');
                                first = false;
                                observer.disconnect();
                                setTimeout(() => {
                                    revealNextCheckpoint();
                                }, 300);
                            }
                        }
                    });
                });
            
                observer.observe(sq, {
                    attributes: true,
                    attributeFilter: ['class']
                });

                observers.push(observer);
            });

            currentCheckpointIndex = 0;
            playerPipes[start[0]][start[1]] = true;

            // console.log(end, end[0] > 2 && end[0] < 7 && end[1] > 2 && end[1] < 7);
            console.log(Date.now() - date);            
            // console.log(start, end);
            setupPipes();

            revealCurrentCheckpoint();

            revealNextCheckpoint();

            break;
        } else {
            console.log('No path found!')
            ResetGrid();
            continue;
        }
    }
}

function revealCurrentCheckpoint() {
    if (currentCheckpointIndex >= allCheckpoints.length) {
        console.log('All check reveal');
        return;
    }

    const [x, y] = allCheckpoints[currentCheckpointIndex];
    const square = squares[x][y];

    square.classList.remove('hidden-check');
    square.style.opacity = '1';

    if (currentCheckpointIndex === 0) {
        square.classList.add('start');
        playerPipes[x][y] = true;
    } else if (currentCheckpointIndex === allCheckpoints.length - 1) {
        square.classList.add('end');
    } else {
        square.classList.add('middle-end');
    }
}

function revealNextCheckpoint() {
    currentCheckpointIndex++;

    if (currentCheckpointIndex < allCheckpoints.length) {
        revealCurrentCheckpoint()
        return true;
    } else {
        console.log('No more');
        return false;
    }
}

function isConnected(start, end) {
        const [startX, startY] = start;
        const [endX, endY] = end;

        let queue = [[startX, startY]];
        let visited = Array.from({ length: 10 }, () => Array(10).fill(false));
        visited[startX][startY] = true;

        while (queue.length > 0) {
            let [x, y] = queue.shift();

            if (x === endX && y === endY) return true;

            for (let [dx, dy] of directions) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue;

                if (visited[nx][ny]) continue;

                const isCheckPoint = allCheckpoints.some(([cx, cy]) => cx === nx && cy === ny);
                const hasPipe = playerPipes[nx][ny];

                if (hasPipe || isCheckPoint) {
                    if (canConnect(x, y, nx, ny)) {
                        visited[nx][ny] = true;
                        queue.push([nx, ny]);
                    }
                }
            }
        }

    return false;
}

function checkAllConnections() {
    for (let i = 0; i < allCheckpoints.length - 1; i++) {
        if (!isConnected(allCheckpoints[i], allCheckpoints[i + 1])) {
            return false;
        }
    }

    return true;
}

function checkConnection(playerPath) {
    if (currentCheckpointIndex >= allCheckpoints.length) return false;
    const [targetX, targetY] = allCheckpoints[currentCheckpointIndex];

    for (let [x, y] of playerPath) {
        if (x === targetX && y === targetY) {
            revealNextCheckpoint()
            return true;
        }
    }

    return false;
}

const date = Date.now();
ResetGrid();
generatePath();


// minesweeper
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
    
function CountStones() {
        stonescount = 0;
        const child = container.children;

        for (let i = 0; i < 100; i++) {
            const childbg = child[i].style.background;
            if (childbg == 'rgb(128, 128, 126)') {
                stonescount++
            }
        }

        return stonescount;
    }

    const flagsCount = document.getElementById('flagsCount');

function ReplicateStones() {
    let Flags = CountStones();
    flagsCount.textContent = Flags;

    let revealed = ArraySetup();
    let flagged = ArraySetup();
    let gameOver = false;
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let square = squares[i][j];

            square.className = '';
            square.classList.add('square', 'unrevealed');
            square.textContent = '';

            square.addEventListener('click', (e) => {
                e.preventDefault();
                if (gameOver || revealed[i][j] || flagged[i][j]) return;
                if (square.style.background == 'rgb(128, 128, 126)') {
                    square.classList.remove('unrevealed');
                    square.classList.add('mine-hit');
                    square.textContent = 'BOOM!';
                    gameOver = true;
                    RevealAllMines();
                } else {
                    revealCell(i, j);
                }
            });
            
                square.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('You shovel broke!')
                });

            } else {
                square.addEventListener('click', () => {
                    let BolderCount = 0;

                    for (let [dx, dy] of directionsExtended) {
                        let ni = i + dx;
                        let nj = j + dy;
                        if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10) {
                            if (grid[ni][nj] === 1) {
                                BolderCount++;
                            }
                        }
                    }
                    square.textContent = BolderCount;
                });
            }

            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                square.classList.add('flag');
                flagsCount.textContent = --Flags;
                if (Flags <= 0) {
                    console.log('Done!');
                }
            });

            square.style = '';
        }
    }
}