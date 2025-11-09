   const container = document.getElementById('container'); 
    
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
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
                
                if (!planes) return;

                const plane = document.createElement('div');
                plane.classList.add('plane');
                plane.style.backgroundPosition = `-${Math.floor(Math.random() * 4) * 60}px 0px`;

                const containerRect = container.getBoundingClientRect();

                if (e.id == 'verticaltop') {
                    plane.style.left = (containerRect.left + i * 60) + 'px';
                    plane.style.top = (containerRect.top - 60) + 'px';
                    plane.style.transform = 'rotate(180deg)';
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
                    plane.style.transform = 'rotate(90deg)';
                    setTimeout(() => {
                        plane.style.left = (containerRect.left + 600) + 'px';
                    }, 0);
                } else {
                    plane.style.left = (containerRect.left + 600) + 'px';
                    plane.style.top = (containerRect.top + i * 60) + 'px';
                    plane.style.transform = 'rotate(270deg)';
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
                            gridsquare.classList.add('farmland');
                            gridsquare.style.backgroundPosition = `-${Math.floor(Math.random() * 2) * 32}px 0px`;
                        } 
                    }, 100 * j);
                }
                if (planes == 1) CountFilledSquares();
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
            if (childbg == 'rgb(102, 76, 40)') {
                count++
            }

            if (childbg == 'rgb(128, 128, 126)') {
                stonescount++
            }
        }

        document.getElementById('Info').textContent = `You had planted ${count} seeds, which equals to ${(count / (100 - stonescount) * 100).toFixed(2)}% of the board (excluding bolders).`;
    }