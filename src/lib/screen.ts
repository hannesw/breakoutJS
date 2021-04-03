export interface Rectangle {
    width: number;
    height: number;
    margins: {
        x: number;
        y: number;
    };
}

export enum Axis {
    X,
    Y,
}

export function calcBrickOrigins(
    canvasSize: Rectangle,
    box: Rectangle
): number[][] {
    const availableWidth = canvasSize.width - 2 * canvasSize.margins.x;
    const availableHeight = canvasSize.height - 8 * canvasSize.margins.y; // Add more margin to the bottom
    let gapX = box.margins.x;
    let gapY = box.margins.y;

    // calculate the amount of columns
    const fractionColumns = availableWidth / (box.width + gapX);
    let columns = Math.floor(fractionColumns);
    let remainerColumns = fractionColumns - columns;
    // Check if there is enough space left to add another gap
    // e.g. for 5 bricks we need 6 gaps. If not enough space is left - remove one column
    if (remainerColumns < gapX) {
        columns = columns - 1;
    }
    gapX = (availableWidth - columns * box.width) / (columns + 1);

    // Do the same thing for rows
    const fractionRows = availableHeight / (box.width + gapY);
    let rows = Math.floor(fractionRows);
    let remainerRows = fractionRows - rows;
    // Check if there is enough space left to add another gap
    // e.g. for 5 bricks we need 6 gaps. If not enough space is left - remove one column
    if (remainerRows < gapY) {
        rows = rows - 1;
    }
    gapY = (availableHeight - rows * box.height) / (rows + 1);

    let origins: number[][] = [];
    let x = gapX + canvasSize.margins.x;
    let y = gapY + canvasSize.margins.y;
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            origins.push([
                x + c * (box.width + gapX),
                y + r * (box.height + gapY),
            ]);
        }
    }

    return origins;
}
