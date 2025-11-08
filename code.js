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
    
    let playerPipes = Array.from({length: 10}, () => Array(10).fill(false));
    let pipeData = Array.from({length: 10}, () => Array(10).fill(null));

    const pipe_types = {
        'Vertical': [0, 2],
        'Horizontal': [1, 3],
        'corner-0': [1, 0],
        'corner-1': [2, 1],
        'corner-2': [3, 2],
        'corner-3': [0, 3]
    }

    function ResetGrid() {
        container.innerHTML = '';
        grid = [];
        squares = [];
        playerPipes = Array.from({length: 10}, () => Array(10).fill(false));
        pipeData = Array.from({length: 10}, () => Array(10).fill(null));

        for (let i = 0; i < 10; i++) {
            grid[i] = [];
            squares[i] = [];
            for (let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                square.textContent = i * j;
                square.setAttribute('draggable', 'true');
                square.style.background = '';

                if (Math.random() > 0.6) {
                    square.style.background = '#80807e';
                    grid[i][j] = 1;
                } else {
                    grid[i][j] = 0;
                }

                square.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', null);
                    draggedSquare = square;
                })

                square.addEventListener('dragover', (e) => {
                    e.preventDefault();
                })

                square.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const row = parseInt(square.dataset.row);
                    const col = parseInt(square.dataset.col);

                    const pipeType = e.dataTransfer.getData('pipe-type');
                    if (pipeType) {
                        placePipe(row, col, pipeType);
                    }
                });

                square.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const row = parseInt(square.dataset.row);
                    const col = parseInt(square.dataset.col);

                    playerPipes[row][col] = false;
                    pipeData[row][col] = null;

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

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

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

            if (canConnect(row, col, nx, ny)) {
                connectingCount++;
            }
        }

        pipeData[row][col] = old;

        if (adjacentCount > 0) {
            return connectingCount > 0;
        }

        return true;
    }

    function rotatePipe(row, col) {
        if (!pipeData[row][col]) return;

        const OldData = pipeData[row][col];
        const data = { ...OldData};

        if (data.baseType === 'straight') {
            data.rotation = (data.rotation + 1) % 2;
            data.type = data.rotation === 0 ? 'Vertical' : 'Horizontal';
        } else if (data.baseType === 'corner') {
            data.rotation = (data.rotation + 1) % 4;
            data.type = `corner-${data.rotation}`;
        }

        if (!isValidPlacement(row, col, data)) {
            return;
        }

        pipeData[row][col] = data;
        UpdateVisual(row, col);
        checkForConnections();
    }

    function UpdateVisual(row, col) {
        const square = squares[row][col];
        const data = pipeData[row][col];

        if (!data) return;
        let rotation = 0;
        rotation = data.rotation * 90;

        square.style.transform = `rotate(${rotation}deg)`;
    }

    function getPipeConnections(row, col) {
        const data = pipeData[row][col];
        if (!data) {
            const isCheckPoint = allCheckpoints.some(([cx, cy]) => cx === row && cy === col);
            if (isCheckPoint) {
                return [0, 1, 2, 3];
            }

            return [];
        }
        
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

        const connection1 = getPipeConnections(row1, col1);
        const connection2 = getPipeConnections(row2, col2);

        return connection1.includes(dir1) && connection2.includes(dir2);
    }

    function placePipe(row, col, pipeType) {
        const isTargetCheckPoint = currentCheckpointIndex < allCheckpoints.length - 1 && allCheckpoints[currentCheckpointIndex + 1][0] === row && allCheckpoints[currentCheckpointIndex + 1][1] === col;
        const rotationdrag = parseInt(event?.dataTransfer?.getData('pipe-rotation') || 0);

        if (playerPipes[row][col] && !isTargetCheckPoint) {
            console.log('Cannot place');
            return false;
        }

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        let isConnectedToPipe = false;

        for (let [dx, dy] of directions) {
            let nx = row + dx;
            let ny = col + dy;

            if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue;
            
            const NeighborisCheckPoint = allCheckpoints.some(([cx, cy]) => cx === nx && cy === ny);
            const NeighborhasPipe = playerPipes[nx][ny];

            if (NeighborhasPipe || NeighborisCheckPoint) {
                    isConnectedToPipe = true;
                    break;
            }
        }

        const [startX, startY] = allCheckpoints[0];
        const nearStart = Math.abs(startX - row) + Math.abs(startY - col) === 1;

        if (!isConnectedToPipe && !nearStart) {
            console.log('not connected to any pipe');
            return false;
        }

        let baseType, type, rotation;
        if (pipeType === 'straight') {
            baseType = 'straight';
            type = rotationdrag % 2 === 0 ? 'Vertical' : 'Horizontal';
            rotation = rotationdrag;
        } else if (pipeType === 'corner') {
            baseType = 'corner';
            type = `corner-${rotationdrag}`;
            rotation = rotationdrag;
        }

        const candidate = { baseType, type, rotation };

        if (!isValidPlacement(row, col, candidate)) {
            console.log('Missalign');
            return false;
        }

        playerPipes[row][col] = true;
        pipeData[row][col] = candidate;

        const square = squares[row][col];
        square.classList.add('player-pipe');
        
        if (pipeType === 'corner') {
            square.classList.add('cornerPipes');
        } else {
            square.classList.add('straightPipes');
        }

        UpdateVisual(row, col);

        checkForConnections();

        return true;
    }

    function setupPipes() {
        const pipes = document.querySelectorAll('#pipes div');
        pipes.forEach(pipe => {
            let rotation = 0;
            pipe.setAttribute('draggable', 'true');
            pipe.addEventListener('click', (e) => {
                e.preventDefault();
                rotation = (rotation + 1) % 4;
                pipe.style.transform = `rotate(${rotation * 90}deg)`;
                pipe.dataset.rotation = rotation;
            });

            pipe.addEventListener('dragstart', (e) => {
                const pipeType = pipe.dataset.type || 'straight';
                const rotationValue = pipe.dataset.rotation || 0;
                e.dataTransfer.setData('pipe-type', pipeType);
                e.dataTransfer.setData('pipe-rotation', rotationValue);
            })
        })
    }

    /*
        square.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPipe) {
                const color = e.dataTransfer.getData('text');
                square.style.background = color;
            }

            if (draggedSquare && draggedSquare !== square) {
                const container = square.parentNode;
                const temp = document.createElement('div');
                container.replaceChild(temp, square);
                container.replaceChild(square, draggedSquare);
                container.replaceChild(draggedSquare, temp);
            }
        });
        }
        container.appendChild(document.createElement('br'));
    }
    const pipes = document.querySelectorAll('#pipes div');

    pipes.forEach(pipe => {
        pipe.addEventListener('dragstart', (e) => {
            draggedPipe = pipe;
            e.dataTransfer.setData('text', pipe.style.background);
        });
    });

    */

    function getRandomEdgePoint() {
        let edge = Math.floor(Math.random() * 4);
        let x, y;

        if (edge === 0) {
            x = 0;
            y = Math.floor(Math.random() * 10);
        } else if (edge === 1) {
            x = 10 - 1;
            y = Math.floor(Math.random() * 10);
        } else if (edge === 2) {
            x = Math.floor(Math.random() * 10);
            y = 0;
        } else {
            x = Math.floor(Math.random() * 10);
            y = 10 - 1; 
        }
        return [x, y];
    }

    function getRandomInnerPoint() {
        const x = 3 + Math.floor(Math.random() * 4);
        const y = 3 + Math.floor(Math.random() * 4);
        return [x, y];
    }

    function findPath(start, end, maxL = 10) {
        let queue = [[[start], null, 0]];
        let visited = Array.from({ length: 10 }, () => Array(10).fill(false));
        visited[start[0]][start[1]] = true;

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        while (queue.length > 0) {
            let [path, lastDir, lCount] = queue.shift();
            let [x, y] = path[path.length - 1];

            if (x === end[0] && y === end[1]) return path;

            for (let [dx, dy] of directions) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx >= 0 && ny >= 0 && nx < 10 && ny < 10 && grid[nx][ny] === 0) {

                    let isTurn = lastDir && (dx !== lastDir[0] || dy !== lastDir[1]);
                    let newLCount = lCount + (isTurn ? 1 : 0);

                    if (newLCount > maxL) continue;

                    if (!visited[nx][ny]) {
                        visited[nx][ny] = true;
                        queue.push([
                            [...path, [nx, ny]],
                            [dx, dy],
                            newLCount
                        ]);
                    }
                }
            }
        }

        return null;
    }

    function drawPipe(path) {
        if (!path) return;
        for (let j = 1; j < path.length - 1; j++) {
            grid[path[j][0]][path[j][1]] = 1;
        }
    }

    let currentCheckpointIndex = 0;
    let allCheckpoints = [];

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
                middles.push(getRandomInnerPoint());
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
                drawPipe(path);
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

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

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

function checkForConnections() {
    if (currentCheckpointIndex >= allCheckpoints.length - 1) {
        const allComplete = checkAllConnections();
        if (allComplete) {
            console.log('Game Completed');
        }
    }
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
