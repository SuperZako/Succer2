/// <reference path="./PlayerBase.ts" />

class ControllingPlayer {
    constructor(public player: PlayerBase, public num: number, public but = 0, public isAI = false) {
    }



    public player_input() {
        let game = Game.getInstance();
        if (this.isAI || game.demo) {
            //if (this.man.getState().ai !== undefined)
            this.player.getState().ai(this);
        } else {
            //if (this.man.getState().input !== undefined)
            this.player.getState().input(this);
        }
    }

    public tackle() {
        this.player.set_state(Tackle.getInstance());
    }

    public kick() {
        let game = Game.getInstance();
        //--pass
        let passed = false;
        if (this.but < 5) {
            passed = this.player.pass();
        }

        if (!passed) {
            let kickfactor = 1.0 + 0.1 * this.but;
            //plus_in_place(game.ball.velocity, muls(this.man.dir, kickfactor))
            game.ball.velocity.add(Vector2.multiply(kickfactor, this.player.dir).toVector3());
            Game.getInstance().ball.velocity.z += kickfactor * 0.5;
            balllasttouchedside = this.player.side;
        }

        this.player.justshot = 5;
        ballsfx();
    }

    public button_released() {
        let f = this.player;
        if (f.can_kick()) {
            this.kick();
            balllasttouchedside = f.side;
        } else {
            if (f.justshot === 0) {
                this.tackle();
            }
        }
        this.but = 0;
    }

}