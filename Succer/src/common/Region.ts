class Region {
    public readonly width: number;
    public readonly height: number;

    public constructor(
        public readonly left: number,
        public readonly top: number,
        public readonly right: number,
        public readonly bottom: number) {
        this.width = Math.abs(right - left);
        this.height = Math.abs(bottom - top);
    }

}