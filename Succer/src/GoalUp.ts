/// <reference path="./Game.ts" />
/// <reference path="./SoccerPitch.ts" />

class GoalUp extends BaseGameEntity {
    readonly width = 60;
    readonly depth = 20;
    readonly height = 10;
    constructor(readonly leftPost: Vector2, readonly rightPost: Vector2, private facing: Vector2) {
        super();
        //let game = Game.getInstance();
        //let pitch = game.getPitch();
        //let bottom = pitch.bottom;

        //this.position.y = bottom;
    }
    public scored(ball: SoccerBall) {
        let depth = this.depth;
        let height = this.height;
        let left = this.leftPost.x;
        let right = this.rightPost.x;
        let top = this.leftPost.y;
        if (left > right) {
            let temp = left;
            left = right;
            right = temp;
        }
        return ball.position.z < height
            && left < ball.position.x && ball.position.x < right
            && top + depth > Math.abs(ball.position.y)
            && Math.abs(ball.position.y) > top;
    }

    private testCollisionNet(ball: SoccerBall, prevball: IVector2, goal1: IVector2, goal2: IVector2) {
        let res = segment_intersect(prevball, ball.position, goal1, goal2);
        if (res) {
            if (goal1.x === goal2.x) {
                ball.velocity.x = -ball.velocity.x;
            } else {
                ball.velocity.y = -ball.velocity.y;
            }
            //muls_in_place(this.velocity, 0.25)
            ball.velocity.multiply(0.25);
            ball.position.x = res.x
            ball.position.y = res.y
        }
    }

    private testCollisionPost(p: IVector2, prevball: IVector2) {
        let game = Game.getInstance();
        let ball = game.ball;
        let d = Vector3.distance(ball.position, { x: p.x, y: p.y, z: 0 });
        if (d < ball.w) {
            let delta = Vector2.subtract(p, ball.position);
            let ballspeed = Vector3.distance(ball.position, { x: prevball.x, y: prevball.y, z: 0 });
            //plus_in_place(ball.position, muls(delta, -1 / d * ball.w))
            ball.position.add(Vector2.multiply(-1 / d * ball.w, delta).toVector3());
            //plus_in_place(ball.velocity, muls(delta, -1 / d * ballspeed))
            ball.velocity.add(Vector2.multiply(-1 / d * ballspeed, delta).toVector3());
            ballsfx();
        }
    }

    public testCollisionWithBall(ball: SoccerBall) {
        let prevball = ball.position.toVector2();
        //let post1 = { x: goalx1, y: top };
        let leftPost = this.leftPost;
        let post1_ = { x: leftPost.x, y: leftPost.y + this.depth / 2 };
        //let post2 = { x: goalx2, y: top };
        let rightPost = this.rightPost;
        let post2_ = { x: rightPost.x, y: rightPost.y + this.depth / 2 };
        //let post2_ = { x: goalx2, y: top + goalh / 2 };

        let height = this.height;

        //if (this.position.y < 0) {
        //    post1.y = -post1.y;
        //    post1_.y = -post1_.y;
        //    post2.y = -post2.y;
        //    post2_.y = -post2_.y;
        //}

        //--goal col
        if (this.position.z <= height) {
            //--nets
            this.testCollisionNet(ball, prevball, leftPost, post1_);
            this.testCollisionNet(ball, prevball, rightPost, post2_);
            this.testCollisionNet(ball, prevball, post1_, post2_);

            //--posts
            this.testCollisionPost(leftPost, prevball);
            this.testCollisionPost(rightPost, prevball);
            //--todo check horiz post
        }
    }

    public draw() {
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let top = pitch.top;
        let left = pitch.left;
        let right = pitch.right;
        let bottom = pitch.bottom;

        let leftPost = this.leftPost;
        let rightPost = this.rightPost;
        let depth = this.depth;
        let height = this.height;

        let clipstartx = leftPost.x - camtarget.x + 1 + 64;
        let clipstarty = -camtarget.y + 64 - top;
        let clipendx = rightPost.x - leftPost.x;
        let clipendy = depth / 2 + 1;
        //spr(60, goalx2, -fh2 - 17)
        clip(clipstartx, clipstarty - 10, clipendx + 8, clipendy);
        for (let x = leftPost.x - 1; x <= rightPost.x + 8; x += 8) {
            for (let y = -11; y <= 7; y += 8) {
                //spr(61, x, y - fh2)
            }
        }
        clip(clipstartx, clipstarty - depth, clipendx - 1, clipendy)
        for (let x = leftPost.x - 1; x <= rightPost.x + 8; x += 8) {
            for (let y = -depth + 1; y <= 8; y += 8) {
                //spr(62, x, y - fh2)
            }
        }
        clip();
        let a = -height - top;
        Renderer.line(leftPost.x, a, leftPost.x, bottom);
        Renderer.line(leftPost.x, a, rightPost.x, a);
        Renderer.line(rightPost.x, a, rightPost.x, bottom);
    }

    public drawshadow() {
    }
}