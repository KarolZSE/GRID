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
    
    function ResetGrid() {
        container.innerHTML = '';
        grid = [];
        squares = [];

        for (let i = 0; i < 10; i++) {
            grid[i] = [];
            squares[i] = [];
            for (let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                square.textContent = i;
                square.setAttribute('draggable', 'true');
                square.style.background = '';

                if (Math.random() > 0.6) {
                    square.style.background = '#80807e';
                    grid[i][j] = 1;
                } else {
                    grid[i][j] = 0;
                };

                container.appendChild(square);
                squares[i][j] = square;
            }
        }
    }

    /*
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            const square = document.createElement('div');
            square.dataset.row = i;
            square.dataset.col = j;
            square.textContent = i;
            square.setAttribute('draggable', 'true');
            square.style.background = '';
        if (Math.random() > 0.7) {
            square.style.background = '#80807e';
            grid[i][j] = 1;
        } else {
            grid[i][j] = 0;
        };
        container.appendChild(square);

        let deg = 1;
        square.onclick = function() {
            square.style.transform = `rotate(${deg * 90}deg)`;
            deg++;
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
        path.forEach(([x, y]) => {
            const square = squares[x][y];
            square.classList.add('pipe');
        });
    }

function generatePath() {
    let allPathsValid = false;
    while (!allPathsValid) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                squares[i][j].classList.remove('pipe', 'start', 'end');
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

                for (let j = 1; j < path.length - 1; j++) {
                    grid[path[j][0]][path[j][1]] = 1;
                }
            } else {
                allPathsValid = false;
                break;
            }
        }

        if (allPathsValid) {
            squares[start[0]][start[1]].classList.add('start');

            console.log(end, end[0] > 2 && end[0] < 7 && end[1] > 2 && end[1] < 7);

            for (let [mx, my] of middles) {
                squares[mx][my].classList.add('middle-end');
            }

            squares[end[0]][end[1]].classList.add('end');
            console.log(start, end);
            break;
        } else {
            console.log('No path found!')
            ResetGrid();
            continue;
        }
    }
}

ResetGrid();
generatePath();