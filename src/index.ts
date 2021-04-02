import * as screen from "./lib/screen";

// Settings
const windowSize: screen.Rectangle = {
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
canvas.setAttribute("width", String(windowSize.width));
canvas.setAttribute("height", String(windowSize.height));
let ctx = canvas.getContext("2d");

function initialize(ctx: CanvasRenderingContext2D) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const brickCount = windowSize.width % (brickSize.width * 1.5); // times 1.5 because gap is half of width
    for (let i = 0; i < brickCount; i++) {
        ctx.beginPath();
        ctx.rect(20, 40, 50, 50);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }
}

initialize(ctx);
