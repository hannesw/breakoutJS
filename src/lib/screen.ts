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

export function calcBoxAmount(
    canvasSize: Rectangle,
    box: Rectangle,
    axis: Axis = Axis.X
): number {
    let availableSpace: number;
    let boxSize: number;
    let gap: number;
    if (axis == Axis.X) {
        availableSpace = canvasSize.width - 2 * canvasSize.margins.x;
        gap = box.margins.x;
        boxSize = box.width + gap;
    } else if (axis == Axis.Y) {
        availableSpace = canvasSize.height - 2 * canvasSize.margins.y;
        gap = box.margins.y;
        boxSize = box.height + gap;
    }
    let amount = Math.floor(availableSpace / boxSize);
    let remainer = availableSpace % boxSize;

    /*
    if (remainer < gap) {
        amount = amount - 1;
    }
    */

    return amount;
}
