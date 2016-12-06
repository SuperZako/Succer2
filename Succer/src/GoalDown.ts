

class GoalDown extends BaseGameEntity {
    //public y = fh2 + goalh;

    constructor() {
        super();
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let top = pitch.top;
        // this.position.y = top + goalh;
    }
    public draw() {
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let top = pitch.top;
        let left = pitch.left;
        let right = pitch.right;
        let bottom = pitch.bottom;
        //spr(60, goalx2, fh2, 1, 1, false, true)
        color(7)
        //rect(goalx1, -goall + top, goalx2, top)
        //clip(goalx1 - camtarget.x + 64 + 1, -goall - camtarget.y + 64 + top + 1, goalx2 - goalx1 - 1, goalh - 1)
        //for (let x = goalx1; x <= goalx2 + 7; x += 8) {
        //    for (let y = -goall; y <= goall; y += 8) {
        //        //spr(62, x, y + fh2)
        //    }
        //}
        clip();
    }
    public drawshadow() {
    }
}
var goal_down = new GoalDown();