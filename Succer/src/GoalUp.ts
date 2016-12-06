/// <reference path="./Game.ts" />
/// <reference path="./SoccerPitch.ts" />

class GoalUp extends BaseGameEntity {

    constructor(private leftPost: Vector2, private rightPost: Vector2, private facing: Vector2) {
        super();
        //let game = Game.getInstance();
        //let pitch = game.getPitch();
        //let bottom = pitch.bottom;

        //this.position.y = bottom;
    }

    public draw() {
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let top = pitch.top;
        let left = pitch.left;
        let right = pitch.right;
        let bottom = pitch.bottom;

        let clipstartx = goalx1 - camtarget.x + 1 + 64;
        let clipstarty = -camtarget.y + 64 - top;
        let clipendx = goalx2 - goalx1;
        let clipendy = goalh / 2 + 1;
        //spr(60, goalx2, -fh2 - 17)
        clip(clipstartx, clipstarty - 10, clipendx + 8, clipendy);
        for (let x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (let y = -11; y <= 7; y += 8) {
                //spr(61, x, y - fh2)
            }
        }
        clip(clipstartx, clipstarty - goalh, clipendx - 1, clipendy)
        for (let x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (let y = -goalh + 1; y <= 8; y += 8) {
                //spr(62, x, y - fh2)
            }
        }
        clip();
        let a = -goall - top;
        line(goalx1, a, goalx1, bottom);
        line(goalx1, a, goalx2, a);
        line(goalx2, a, goalx2, bottom);
    }

    public drawshadow() {
    }
}