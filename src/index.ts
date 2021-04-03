import * as screen from "./lib/screen";

// Settings
const canvasSize: screen.Rectangle = {
    width: 720,
    height: 500,
    margins: {
        x: 20,
        y: 40,
    },
};

const brickSize: screen.Rectangle = {
    width: 50,
    height: 50,
    margins: {
        x: 25,
        y: 25,
    },
};

// Setup
let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
canvas.setAttribute("width", String(canvasSize.width));
canvas.setAttribute("height", String(canvasSize.height));
let ctx = canvas.getContext("2d");

function initialize(ctx: CanvasRenderingContext2D) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Calculate brick amount based on widths
    const brickColumnCount = screen.calcBoxAmount(
        canvasSize,
        brickSize,
        screen.Axis.X
    );
    const brickRowCount = screen.calcBoxAmount(
        canvasSize,
        brickSize,
        screen.Axis.Y
    );
    // Draw the bricks on screen
    const tickX =
        (canvasSize.width - 2 * canvasSize.margins.x) / (brickColumnCount + 1);
    const tickY =
        (canvasSize.height - 2 * canvasSize.margins.y) / (brickRowCount + 1);
    let cursor: number[] = [canvasSize.margins.x, canvasSize.margins.y];

    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
            ctx.beginPath();
            ctx.rect(cursor[0] + j * tickY, cursor[1] + i * tickX, 50, 50);
            ctx.fillStyle = "#FF0000";
            ctx.fill();
            ctx.closePath();
        }
    }
}

initialize(ctx);
