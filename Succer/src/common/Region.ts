class Region {
    readonly width: number;
    readonly height: number;
    public constructor(readonly left: number, readonly top: number, readonly right: number, readonly bottom: number) {
        this.width = Math.abs(right - left);
        this.height = Math.abs(bottom - top);
    }

}