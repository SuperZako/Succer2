/// <reference path="./MovingEntity.ts" />

class SoccerBall extends MovingEntity {
    public w = 2;
    public h = 4;
    // public damp = 0.975;
    // damp=0.95,
    public dampair = 0.985;

    constructor() {
        super();
        this.dampFactor = 0.975;
    }

    public draw() {
        //Renderer.spr(44, this.position.x - this.w, this.position.y - this.h - this.position.z);
        Renderer.drawImage(Images.ball, this.position.x - this.w + 1, this.position.y - this.h + 1);
    }

    public drawshadow() {
        //Renderer.spr(45, this.position.x - this.w + 1, this.position.y - this.h + 1);
        //Renderer.drawImage(Images.ball, this.position.x - this.w + 1, this.position.y - this.h + 1);
    }

    public update() {
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let top = pitch.top;
        let right = pitch.right;
        let prevball = this.position.toVector2();
        //plus_in_place(this.position, this.velocity);
        this.position.add(this.velocity);
        let gravity = 0.1;
        if (this.position.z > 0) {
            this.velocity.z -= gravity;
        } else {
            this.position.z = 0;
            if (Math.abs(this.velocity.z) < 2 * gravity) {
                this.velocity.z = 0;
            } else {
                this.velocity.z = Math.abs(this.velocity.z) * 0.5;
                ballsfx();
            }
        }
        this.position.z += this.velocity.z;

        let goals = pitch.getGoals();
        goals[0].testCollisionWithBall(this);
        goals[1].testCollisionWithBall(this);

        //--touch lines
        if (game.isPlaying() && Math.abs(this.position.x) > right) {
            throwin.init_throwin(FieldPlayerStateThrowin.getInstance(), new Vector2(right, MathHelper.clamp(Math.abs(this.position.y), -top, top)), { x: 1, y: 1 }, 1);
        }

        //--scoring_team
        //--todo check ball really entering the goal...
        if (game.isPlaying() &&
            game.scoring_team === 0 &&
            (goals[0].scored(this) || goals[1].scored(this))) {
            game.scoring_team = game.side_to_idx(this.position.y > 0 ? 1 : - 1);
            game.kickoff_team = game.scoring_team;
            game.score[game.scoring_team] += 1;
            camlastpos = this.position.toVector2(); // copy(this.position);
            game.setState(GameStateGoalmarked.getInstance());
            sfx(0);
            sfx(15);
        }

        //--corner / goal kick
        if (game.isPlaying() && Math.abs(this.position.y) > top) {
            throwin.side = -balllasttouchedside;
            if (throwin.side * this.position.y < 0) {
                throwin.init_throwin(CornerKick.getInstance(), new Vector2(right, top), { x: 1.1, y: 1.03 }, 5);
            } else {
                throwin.init_throwin(Goalkick.getInstance(), new Vector2(MathHelper.randInRange(0, penaltyw2), fh2_penaltyh), { x: 1, y: 1.15 }, 25);
                //--init_throwin(fstate_goalkick, { x=penaltyw2, y=fh2_penaltyh }, { x=1, y=1.15 }, 25)
            }
        }

        let fieldw2 = right + border;
        let fieldh2 = top + border;

        //--field borders
        let bd = this.velocity;
        if (this.position.x < -fieldw2) {
            bd.x = Math.abs(bd.x) * 0.5;
            this.position.x = -fieldw2;
        }
        if (this.position.x > fieldw2) {
            bd.x = -Math.abs(bd.x) * 0.5;
            this.position.x = fieldw2;
        }
        if (this.position.y < -fieldh2) {
            bd.y = Math.abs(bd.y) * 0.5;
            this.position.y = -fieldh2;
        }
        if (this.position.y > fieldh2) {
            bd.y = -Math.abs(bd.y) * 0.5;
            this.position.y = fieldh2;
        }

        //--damping
        if (this.position.z < 0.1) {
            this.damp();
        } else {
            //muls_in_place(this.velocity, this.dampair);
            this.velocity.multiply(this.dampair);
        }
        bd.z *= this.dampFactor;
    }
}