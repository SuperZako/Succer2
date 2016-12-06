/// <reference path="../State.ts" />
/// <reference path="../math/MathHelper.ts" />

class KeeperStateOk extends State<GoalKeeper> {

    private static instance = new KeeperStateOk();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }


    public draw(k: GoalKeeper) {
        let pos = sprite_pos(k);
        let sp = pos.y < 0 ? 57 : 54;
        jersey_color(k);
        spr(sp, pos.x, pos.y);
    }

    public update(k: GoalKeeper) {
        let game = Game.getInstance();

        let ball = game.ball;
        let pitch = game.getPitch();
        let top = pitch.top;
        let left = pitch.left;
        let right = pitch.right;
        let bottom = pitch.bottom;

        //-- try to stay in front of the ball
        //--dive ?
        let future = 7;
        let futureball = Vector3.add(ball.position, Vector3.multiply(future, ball.velocity));
        let goals = pitch.getGoals();
        let leftPost = goals[0].leftPost;
        let rightPost = goals[0].rightPost;
        let res = segment_intersect(ball.position, futureball, { x: leftPost.x, y: top * k.side }, { x: rightPost.x, y: top * k.side });
        if (res) {// -- and abs(ball.dx) > 0.15 then
            let divefactor = 0.99;
            let divemax = 10;
            k.velocity.x = MathHelper.clamp((res.x - k.position.x) * divefactor, -divemax, divemax);
            k.set_state(KeeperStateDive.getInstance());
            return;
        } else { //--just move
            let wantedx = MathHelper.clamp(ball.position.x, leftPost.x, rightPost.x);
            let mx = 1.0; // -- max move per frame
            k.position.x = MathHelper.clamp(wantedx, k.position.x - mx, k.position.x + mx);
            if (Math.abs(k.position.y) < top - 4) {
                k.position.y += k.side;
            }
        }

        if (k.touch_ball(5) && game.isPlaying()) {
            ball.velocity.y = -3.0 * k.side;
            balllasttouchedside = k.side;
        }
    }
}