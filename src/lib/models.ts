export interface Rectangle {
    width: number;
    height: number;
    margins: {
        x: number;
        y: number;
    };
}

export class Brick implements Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    margins: {
        x: number;
        y: number;
    };
    hit: boolean;
}
