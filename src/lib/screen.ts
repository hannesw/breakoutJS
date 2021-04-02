export interface Rectangle {
    width: number;
    height: number;
    margins?: {
        x?: number;
        y?: number;
    };
}

export function calcRectangleAmount(available: number | Rectangle, rect: Rectangle): number{
    if(available instanceof Rectangle)

}
