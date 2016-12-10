namespace Renderer {
    let offsetX = 0;
    let offsetY = 0;

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    export function initialize() {
        canvas = <HTMLCanvasElement>document.getElementById("canvas");
        canvas.width = 128;
        canvas.height = 128;


        context = canvas.getContext("2d");
    }
    export function _print(_str: string, _x: number, _y: number, _col: number) {
    }


    export function print_outlined(t: string, x: number, y: number, c: number, oc: number) {
        for (let i = x - 1; i <= x + 1; ++i) {
            for (let j = y - 1; j <= y + 1; ++j) {
                _print(t, i, j, oc);
            }
        }
        _print(t, x, y, c);
    }

    export function spr(n: number, x: number, y: number, _w = 0, _h = 0, _flip_x = false, _flip_y = false) {
        switch (n) {
            case 45:
                rectfill(x, y, x + 8, y + 8, 6);
                break;
            case 46:
                rectfill(x, y, x + 8, y + 8, 6);
                break;
            default:
                rectfill(x, y, x + 8, y + 8, 7);
                break;
        }

    }

    export function camera(x = 0, y = 0) {
        offsetX = x;
        offsetY = y;
    }

    export function palt(_col = 0, _t = false) { }

    export function line(x0: number, y0: number, x1: number, y1: number, _col = 0) {
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;

        if (context) {
            context.save();
            //新しいパスを開始する
            context.beginPath();
            //パスの開始座標を指定する
            context.moveTo(x0, y0);
            //座標を指定してラインを引いていく
            context.lineTo(x1, y1);

            //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
            context.closePath();
            //現在のパスを輪郭表示する
            context.stroke();
            context.restore();
        }
    }

    export function rect(x0 = 0, y0 = 0, x1 = 0, y1 = 0, _col = 0) {
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;

        if (context) {
            context.save();

            context.strokeRect(x0, y0, x1 - x0, y1 - y0);

            context.restore();
        }
    }

    export function rectfill(x0 = 0, y0 = 0, x1 = 0, y1 = 0, col: number) {
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;

        if (context) {
            context.save();
            switch (col) {
                case 3:
                    context.fillStyle = 'green';
                    break;
                case 4:
                    context.fillStyle = 'red';
                    break;
                case 6:
                    context.fillStyle = "gray";
                    break;
                case 7:
                    context.fillStyle = 'white';
                    break;
                default:
                    break;
            }

            context.fillRect(x0, y0, x1 - x0, y1 - y0);
            context.restore();
        }
    }

    export function drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, _offsetX: number, _offsetY: number, _width?: number, _height?: number, _canvasOffsetX?: number, _canvasOffsetY?: number, _canvasImageWidth?: number, _canvasImageHeight?: number): void {
        _offsetX -= offsetX;
        _offsetY -= offsetY;
        // y0 -= offsetY;
        // y1 -= offsetY;
        if (context) {
            context.save();
            //context.drawImage(image, _offsetX, _offsetY, 7, 7);//, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight);
            context.drawImage(image, 0, 0, 7, 7, _offsetX, _offsetY, 7, 7);
            context.restore();
        }
    }
}