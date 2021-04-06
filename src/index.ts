import * as Models from "./lib/models";

// Settings
const canvasSize: Models.Rectangle = {
    width: 800,
    height: 625,
    margins: {
        x: 20,
        y: 25,
    },
};

const brickSize: Models.Rectangle = {
    width: 50,
    height: 50,
    margins: {
        x: 10,
        y: 10,
    },
};

const paddleSize: Models.Rectangle = {
    width: 100,
    height: 25,
    margins: {
        x: 0,
        y: 0,
    },
};

const ballRadius = 20;
let dX = 3;
let dY = 3;
let rightPressed = false;
let leftPressed = false;
const paddleTick = 7;
let gameover = false;
let won = false;
let paused = true;

// Setup
let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
canvas.setAttribute("width", String(canvasSize.width));
canvas.setAttribute("height", String(canvasSize.height));
let ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Globals
let ballPosition: number[] = [0, 0];
let paddlePosition: number[] = [
    canvasSize.width / 2 - paddleSize.width / 2,
    canvasSize.height - paddleSize.height * 2,
];
let bricks: Models.Brick[] = [];
let maxY = 0;

/*
 * Run the game
 */
initialize();
let gameLoop = setInterval(run, 10);

/*
 * Actual game logic
 */

function run() {
    if (won == true) {
        clearInterval(gameLoop);
        alert("you won! Please reload the page.");
    }
    if (gameover == true) {
        clearInterval(gameLoop);
        alert("GAME OVER! Please reload the page to try again.");
    }

    checkWin();
    clearCanvas();
    drawBall();
    drawBricks();
    drawPaddle();
}

function initialize() {
    clearCanvas();
    // draw bricks
    const brickCoords = calcBrickOrigins(canvasSize, brickSize);
    for (let i = 0; i < brickCoords.length; i++) {
        // Save reference of each brick to global bricks array
        const tmp = {
            x: brickCoords[i][0],
            y: brickCoords[i][1],
        };
        let brick = new Models.Brick();
        brick = { ...tmp, ...brickSize, hit: false };
        bricks.push(brick);

        // Keep track of max y for drawing the ball later on
        if (brick.y > maxY) {
            maxY = brick.y;
        }
    }

    drawBricks();

    // draw paddle
    drawPaddle();

    const ballOrigin = calcBallOrigin(canvasSize, brickSize, ballRadius);
    ballPosition[0] = ballOrigin[0];
    ballPosition[1] = ballOrigin[1];
    drawBall();
}

/*
 * Functions to draw entities
 */
function drawBall(): void {
    collisionDetection();
    ballPosition[0] = ballPosition[0] + dX;
    ballPosition[1] = ballPosition[1] + dY;
    ctx.beginPath();
    ctx.arc(
        ballPosition[0],
        ballPosition[1],
        ballRadius,
        0,
        Math.PI * 2,
        false
    );
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    if (ballPosition[1] > canvasSize.height + ballRadius) {
        gameover = true;
    }
}

function drawBricks(): void {
    for (let brick of bricks) {
        // If brick is already hit - don't draw
        if (brick.hit == true) {
            continue;
        }
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = "#90ee90";
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle(): void {
    if (rightPressed) {
        if (
            paddlePosition[0] + paddleSize.width >=
            canvasSize.width - canvasSize.margins.x
        ) {
            paddlePosition[0] =
                canvasSize.width - canvasSize.margins.x - paddleSize.width;
        } else {
            paddlePosition[0] = paddlePosition[0] + paddleTick;
        }
    } else if (leftPressed) {
        if (paddlePosition[0] <= 0 + canvasSize.margins.x) {
            paddlePosition[0] = 0 + canvasSize.margins.x;
        } else {
            paddlePosition[0] = paddlePosition[0] - paddleTick;
        }
    }
    ctx.beginPath();
    ctx.rect(
        paddlePosition[0],
        paddlePosition[1],
        paddleSize.width,
        paddleSize.height
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * Helper functions
 */

function checkWin() {
    const nonhitBricks = bricks.filter((brick) => brick.hit == false).length;
    if (nonhitBricks <= 0) {
        won = true;
    }
}

function collisionDetection() {
    // Check for collision with the walls
    if (
        ballPosition[0] + dX < 0 + ballRadius ||
        ballPosition[0] + ballRadius > canvasSize.width - canvasSize.margins.x
    ) {
        dX = -dX;
    }

    if (ballPosition[1] + dY < 0 + ballRadius) {
        dY = -dY;
    }

    // Check for collision with paddle
    // two conditions are needed because of the refresh rate of the game loop
    if (
        circleRectangleCollide(
            ballPosition[0],
            ballPosition[1],
            ballRadius,
            paddlePosition[0],
            paddlePosition[1],
            paddleSize.width,
            paddleSize.height
        )
    ) {
        dX = -dX + getRandomArbitrary(-5, 5); // add some randomness to change direction of ball
        if (dX > 5 || dX < -5) {
            // Prevent to big or small dX
            dX = 3;
        }
        dY = -dY;
    }

    // Check for collision with the bricks

    for (let brick of bricks) {
        if (brick.hit == true) {
            continue;
        }
        if (
            circleRectangleCollide(
                ballPosition[0],
                ballPosition[1],
                ballRadius,
                brick.x,
                brick.y,
                brick.width,
                brick.height
            )
        ) {
            brick.hit = true;
            dY = -dY;
        }
    }
}

function circleRectangleCollide(
    circleX: number,
    circleY: number,
    radius: number,
    rectangleX: number,
    rectangleY: number,
    rectangleWidth: number,
    rectangleHeight: number
): boolean {
    // Inspired by http://www.jeffreythompson.org/collision-detection/circle-rect.php
    let testX = circleX;
    let testY = circleY;

    if (circleX < rectangleX) {
        testX = rectangleX; // left edge
    } else if (circleX > rectangleX + rectangleWidth) {
        testX = rectangleX + rectangleWidth; // right edge
    }

    if (circleY < rectangleY) {
        testY = rectangleY; // top edge
    } else if (circleY > rectangleY + rectangleHeight) {
        testY = rectangleY + rectangleHeight; // bottom ege
    }
    const distX = circleX - testX;
    const distY = circleY - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance <= radius) {
        return true;
    }
    return false;
}

function calcBrickOrigins(
    canvasSize: Models.Rectangle,
    brick: Models.Rectangle
): number[][] {
    const availableWidth = canvasSize.width - 2 * canvasSize.margins.x;
    const availableHeight = canvasSize.height - 8 * canvasSize.margins.y; // Add more margin to the bottom
    let gapX = brick.margins.x;
    let gapY = brick.margins.y;

    // calculate the amount of columns
    const fractionColumns = availableWidth / (brick.width + gapX);
    let columns = Math.floor(fractionColumns);
    let remainerColumns = fractionColumns - columns;
    // Check if there is enough space left to add another gap
    // e.g. for 5 bricks we need 6 gaps. If not enough space is left - remove one column
    if (remainerColumns < gapX) {
        columns = columns - 1;
    }
    gapX = (availableWidth - columns * brick.width) / (columns + 1);

    // Do the same thing for rows
    const fractionRows = availableHeight / (brick.width + gapY);
    let rows = Math.floor(fractionRows);
    let remainerRows = fractionRows - rows;
    // Check if there is enough space left to add another gap
    // e.g. for 5 bricks we need 6 gaps. If not enough space is left - remove one column
    if (remainerRows < gapY) {
        rows = rows - 1;
    }
    gapY = (availableHeight - rows * brick.height) / (rows + 1);

    let origins: number[][] = [];
    let x = gapX + canvasSize.margins.x;
    let y = gapY + canvasSize.margins.y;
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            origins.push([
                x + c * (brick.width + gapX),
                y + r * (brick.height + gapY),
            ]);
        }
    }

    return origins;
}

function calcBallOrigin(
    canvasSize: Models.Rectangle,
    brick: Models.Rectangle,
    radius: number
): number[] {
    const x = canvasSize.width / 2;
    const y = maxY + brick.height + 2 * radius;
    return [x, y];
}

function keyDownHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == " ") {
        console.log(paused, !paused);
        paused = !paused;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
