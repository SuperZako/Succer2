


class SoccerPitch {
    //defines the dimensions of the playing area
    private playingArea: Region;

    public constructor(width: number, height: number) {
        let left = -width / 2;
        let top = height / 2;
        let right = width / 2;
        let bottom = -height / 2;
        this.playingArea = new Region(left, top, right, bottom);
    }

    public draw() {
        for (let y = -fh2; y <= fh2 - 1; y += 32) {
            rectfill(-fw2, y, fw2, y + 16, 3);
            rectfill(-fw2, y + 16, fw2, y + 32, 11);
        }
    }
}