
/// <reference path="./common/Region.ts" />

/// <reference path="./math/Vector2.ts" />

/// <reference path="./GoalUp.ts" />

class SoccerPitch {
    //defines the dimensions of the playing area
    private playingArea: Region;
    private goals: GoalUp[] = [];

    public constructor(width: number, height: number) {
        let left = -width / 2;
        let top = height / 2;
        let right = width / 2;
        let bottom = -height / 2;

        const GoalWidth = 60;
        // depth 

        this.playingArea = new Region(left, top, right, bottom);
        this.goals.push(new GoalUp(new Vector2(top, GoalWidth / 2), new Vector2(top, -GoalWidth / 2), new Vector2(0, -1)));
        this.goals.push(new GoalUp(new Vector2(bottom, -GoalWidth / 2), new Vector2(bottom, GoalWidth / 2), new Vector2(0, 1)));
    }

    public getGoals() {
        return this.goals;
    }

    get left() {
        let playingArea = this.playingArea;
        return playingArea.left;
    }

    get top() {
        let playingArea = this.playingArea;
        return playingArea.top;
    }

    get right() {
        let playingArea = this.playingArea;
        return playingArea.right;
    }

    get bottom() {
        let playingArea = this.playingArea;
        return playingArea.bottom;
    }

    get width() {
        let playingArea = this.playingArea;
        return playingArea.width;
    }

    get height() {
        let playingArea = this.playingArea;
        return playingArea.height;
    }

    public draw() {
        let top = this.top;
        let left = this.left;
        let right = this.right;
        let bottom = this.bottom;
        for (let y = bottom; y < top; y += 32) {
            Renderer.rectfill(left, y, right, y + 16, 3);
            Renderer.rectfill(left, y + 16, right, y + 32, 11);
        }
    }
}