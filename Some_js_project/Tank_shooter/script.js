const icons = ["bars","bug","bowling-ball","coffee","couch","football-ball",
                "gem","laptop"];
const btnStart = document.querySelector('.btnStart');
const gameOver = document.getElementById('gameOver');
const container = document.getElementById('container');
const box = document.querySelector('.box');
const base = document.querySelector('.base');
const scoreDash = document.querySelector('.scoreDash');
const progressbar = document.querySelector('.progress-bar');
const boxCenter = [
    box.offsetLeft + (box.offsetWidth/2),
    box.offsetTop + (box.offsetHeight/2),
];
let gamePlay = false;
let player;
let animateGame;

btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mouseDown);
container.addEventListener('mousemove', mouseMove);

function mouseMove(e) {
    let mouseAngle = getDegs(e);
    box.style.webkitTransform = 'rotate('+mouseAngle+'deg)';
    box.style.mozTransform = 'rotate('+mouseAngle+'deg)';
    box.style.oTransform = 'rotate('+mouseAngle+'deg)';
    box.style.Transform = 'rotate('+mouseAngle+'deg)';
}

function isCollide(a,b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function getDegs(e) {
    let angle = Math.atan2((e.x - boxCenter[0]), -(e.y - boxCenter[1]));
    return angle * 180 / Math.PI;
}

function degRad(deg) {
    return deg * (Math.PI / 180);
}

function mouseDown(e) {
    if (gamePlay) {
        let div = document.createElement('div');
        let deg = getDegs(e);
        div.setAttribute('class','fireme');
        div.moverx = 5 * Math.sin(degRad(deg));
        div.movery = -5 * Math.cos(degRad(deg));
        div.style.left = (boxCenter[0]-5) + 'px';
        div.style.top = (boxCenter[1]-5) + 'px';
        div.style.width = 10 + 'px';
        div.style.height = 10 + 'px';
        container.appendChild(div);
    }
}

function startGame() {
    gamePlay = true;
    gameOver.style.display = 'none';
    player = {
        score: 0,
        barwidth: 100,
        lives: 100,
    }
    setupBadguys(10);
    animateGame = requestAnimationFrame(playGame);
}
function setupBadguys(num) {
    for (let x=0; x<num; x++) {
        badmaker();
    }
}
function randomNum(num) {
    return Math.floor(Math.random()*num);
}
function badmaker() {
    let div = document.createElement('div');
    let myIcon = 'fa-' + icons[randomNum(icons.length)];
    let x,y,xmove,ymove;
    let randomStart = randomNum(4);
    let dirSet = randomNum(5)+2;
    let dirPos = randomNum(7)-3;
    switch(randomStart) {
        case 0:
            x=0;
            y=randomNum(600);
            ymove=dirPos;
            xmove=dirSet;
            break;
        case 1:
            x=800;
            y=randomNum(600);
            ymove=dirPos;
            xmove=dirSet*-1;
            break;
        case 2:
            x=randomNum(800);
            y=0;
            ymove=dirSet;
            xmove=dirPos;
            break;
        case 3:
            x=randomNum(800);
            y=600;
            ymove=dirSet*-1;
            xmove=dirPos;
            break;
    }
    div.style.color = randomColor();
    div.innerHTML = '<i class="fas '+myIcon+'"></i>';
    div.setAttribute('class','baddy');
    div.style.fontSize = randomNum(20)+30 + 'px';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.point = randomNum(5)+1;
    div.moverx = xmove;
    div.movery = ymove;
    container.appendChild(div);
}
function randomColor() {
    function c() {
        let hex = randomNum(256).toString(16);
        return ('0'+hex).substr(-2);
    }
    return '#'+c()+c()+c();
}

function playGame() {
    if (gamePlay) {
        moveShots();
        UpdateDashboard();
        moveEnemies();
        animateGame = requestAnimationFrame(playGame);
    }
}
function UpdateDashboard() {
    scoreDash.innerHTML = player.score;
    let tempPer = (player.lives / player.barwidth)*100 + '%';
    progressbar.style.width = tempPer;
}
function moveEnemies() {
    let tempEnemies = document.querySelectorAll('.baddy');
    let hitter = false;
    let tempShots = document.querySelectorAll('.fireme');
    for (let enemy of tempEnemies) {
        if (enemy.offsetTop > 550 || enemy.offsetTop < 0 ||
            enemy.offsetLeft > 750 || enemy.offsetLeft < 0) {
                enemy.parentNode.removeChild(enemy);
                badmaker();
        } else {
            enemy.style.top = enemy.offsetTop + enemy.movery + 'px';
            enemy.style.left = enemy.offsetLeft + enemy.moverx + 'px';
            for (let shot of tempShots) {
                if (isCollide(shot, enemy) && gamePlay) {
                    console.log('HIT');
                    player.score += enemy.point;
                    enemy.parentNode.removeChild(enemy);
                    shot.parentNode.removeChild(shot);
                    UpdateDashboard();
                    badmaker();
                    break;
                }
            }
        }
        if (isCollide(box,enemy)) {
            player.lives--;
            hitter = true;
            if (player.lives < 0) {
                fgameOver();
            }
        }
    }
    if (hitter) {
        base.style.backgroundColor = 'red';
    } else {
        base.style.backgroundColor = '';
    }
}

function moveShots() {
    let tempShots = document.querySelectorAll('.fireme');
    for (let shot of tempShots) {
        if (shot.offsetTop > 600 || shot.offsetTop < 0 ||
            shot.offsetLeft > 800 || shot.offsetLeft < 0) {
                shot.parentNode.removeChild(shot);
        } else {
            shot.style.top = shot.offsetTop + shot.movery + 'px';
            shot.style.left = shot.offsetLeft + shot.moverx + 'px';
        }
    }
}

function fgameOver() {
    cancelAnimationFrame(animateGame);
    gameOver.style.display = 'block';
    gameOver.querySelector('span').innerText = 'GAME OVER \n \
                                                    Your Score: '
                                                    +player.score;
    gamePlay = false;
    let tempEnemies = document.querySelectorAll('.baddy');
    for (let enemy of tempEnemies) {
        enemy.parentNode.removeChild(enemy);
    }
    let tempShots = document.querySelectorAll('.fireme');
    for (let shot of tempShots) {
        shot.parentNode.removeChild(shot);
    }
    window.setTimeout(() => {
        base.style.backgroundColor = '#333';
        btnStart.style.paddingBottom = 10 + 'px';
    },0.1);
    console.log('END');
}