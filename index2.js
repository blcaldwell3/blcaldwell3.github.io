import  {LEVEL2, OBJECT_TYPE } from './setup.js';
import {randomMovement} from './ghostMoves.js';
// Classes
import GameBoard from './GameBoard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';

// DOM Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button')

//Game Constants
const POWER_PILL_TIME = 10000; //10000 ms
const GLOBAL_SPEED = 80; //80 ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL2);

//Initial Setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;
let stopwatchStart = 0;
let stopwatchNow = 0;
let stopwatchDiff = 0;
let min = 0;
let sec = 0;
let ms = 0;
let printme = "";

function gameOver(pacman, grid)
{
    document.removeEventListener('keydown', e =>
        pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard)));

    gameBoard.showGameStatus(gameWin);

    clearInterval(timer);

    startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts)
{
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

    if(collidedGhost)
    {
        if(pacman.powerPill)
        {
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        }else{
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
}

function gameLoop(pacman, ghosts)
{
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);

    ghosts.forEach(ghost => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);

    //Check if Pacman eats a dot
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT))
    {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += 10;
    }

    //Check if Pacman eats a powerpill
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL))
    {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
        
        pacman.powerPill = true;
        score += 50;

        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(
            () => (pacman.powerPill = false),
            POWER_PILL_TIME
        );
    }

    // Change ghost scare mode depending on the powerpill
    if (pacman.powerPill !== powerPillActive)
    {
        powerPillActive = pacman.powerPill;
        ghosts.forEach(ghost => ghost.isScared = pacman.powerPill);
    }

    if (gameBoard.dotCount === 0)
    {
        gameWin = true;
        gameOver(pacman, ghosts);
    }

    // Show the score
    stopwatchNow = Date.now();
    stopwatchDiff = stopwatchNow - stopwatchStart;
    min = Math.floor((stopwatchDiff / 1000) / 60);
    sec = Math.floor((stopwatchDiff / 1000) % 60);
    ms = Math.floor((stopwatchDiff % 1000) / 10);
    printme = min.toString() + ":" + sec.toString() + ":" + ms.toString();
    scoreTable.innerHTML = printme;
}

function startGame()
{
    gameWin = false;
    powerPillActive = false;
    score = 0;

    startButton.classList.add('hide');

    gameBoard.createGrid(LEVEL2);

    const pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
    );

    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ]

    stopwatchStart = Date.now();
    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

// Initialize game
startButton.addEventListener('click', startGame);