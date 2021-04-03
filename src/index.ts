import * as screen from "./lib/screen";

// Settings
const canvasSize: screen.Rectangle = {
    width: 800,
    height: 625,
    margins: {
        x: 20,
        y: 25,
    },
};

const brickSize: screen.Rectangle = {
    width: 50,
    height: 50,
    margins: {
        x: 10,
        y: 10,
    },
};

const paddleSize: screen.Rectangle = {
    width: 100,
    height: 25,
    margins: {
        x: 0,
        y: 0,
    },
};

// Setup
let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
canvas.setAttribute("width", String(canvasSize.width));
canvas.setAttribute("height", String(canvasSize.height));
let ctx = canvas.getContext("2d");

// globals
let ballPosition: number[];

function initialize(ctx: CanvasRenderingContext2D) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw bricks
    const brickCoords = screen.calcBrickOrigins(canvasSize, brickSize);
    let maxY = 0; // needed later for ball drawing
    for (let i = 0; i < brickCoords.length; i++) {
        ctx.beginPath();
        ctx.rect(
            brickCoords[i][0],
            brickCoords[i][1],
            brickSize.width,
            brickSize.height
        );
        ctx.fillStyle = "#90ee90";
        ctx.fill();
        ctx.closePath();
        // keep track of max y for drawing the ball later on
        if (brickCoords[i][1] > maxY) {
            maxY = brickCoords[i][1];
        }
    }

    // draw paddle
    ctx.beginPath();
    ctx.rect(
        canvasSize.width / 2 - paddleSize.width / 2,
        canvasSize.height - paddleSize.height * 2,
        paddleSize.width,
        paddleSize.height
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // draw ball
    ctx.beginPath();
    const radius = 20;
    const ballX = canvasSize.width / 2;
    const ballY = maxY + brickSize.height + 2 * radius;
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    ballPosition = [ballX, ballY];
}

function gameLoop() {}

initialize(ctx);
setInterval(gameLoop, 10);
