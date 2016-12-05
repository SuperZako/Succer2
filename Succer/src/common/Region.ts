class Region {
    private width: number;
    private height: number;
    public constructor(private left: number, private top: number, private right: number, private bottom: number) {
        this.width = Math.abs(right - left);
        this.height = Math.abs(bottom - top);
    }

}