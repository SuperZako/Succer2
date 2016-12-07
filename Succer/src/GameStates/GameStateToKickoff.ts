/// <reference path="../State.ts" />


class GameStateToKickoff extends State<Game> {

    private static instance = new GameStateToKickoff();

    public timer = 60;

    private startpos: IVector2[] = [
        { x: 0, y: 0.2 },
        { x: 0.4, y: 0.2 },
        { x: -0.4, y: 0.2 },
        { x: 0.35, y: 0.5 },
        { x: -0.35, y: 0.5 },
        { x: 0, y: 0.90 },
    ];

    // this is a singleton
    public static getInstance() {
        return this.instance;
    }
    public checktimer() {
        this.timer -= 1;
        return this.timer < 0;
    }
    public init() {
        this.timer = 60;

        let game = Game.getInstance();
        let teams = game.teams;
        for (let player of teams[0].players) {
            set_state_ok(player);
        }
        for (let player of teams[1].players) {
            set_state_ok(player);
        }
        //-- keepers
        // men[men.length - 1 - 1].set_state(KeeperStateRun.getInstance());
        teams[0].players[5].set_state(KeeperStateRun.getInstance());
        // men[men.length - 1].set_state(KeeperStateRun.getInstance());
        teams[1].players[5].set_state(KeeperStateRun.getInstance());
    }

    public update(game: Game) {
        let pitch = game.getPitch();
        let right = pitch.right;
        let top = pitch.top;

        // -- scroll to the center of the field
        let l = Math.max(this.timer / 60, 0);
        camtarget = Vector2.multiply(l, camlastpos);//muls(camlastpos, l);

        let to_exit = game.matchtimer > game.full_time;

        // --  if (to_exit) plus_in_place(camtarget, muls({ x=fw2, y=0 }, 1 - l))

        let allok = true;
        let teams = game.teams;
        for (let team of teams) {
            for (let player of team.players) {
                let i = player.startposidx;
                //--if not m.keeper then
                let dest = to_exit ? { x: 1, y: 0 } : this.startpos[i];
                //--    if 2* kickoff_team - 3 == m.side then
                if (game.idx_to_side(game.kickoff_team) === player.side && !to_exit) {
                    if (i === 1) {
                        dest = { x: 0, y: 0.01 };
                    }
                    if (i === 2 || i === 3) {
                        dest = { x: dest.x, y: 0.02 };
                    }
                }
                let ok = player.run_to(dest.x * right, dest.y * player.side * top);
                ok = ok && (player.vel < min_vel);
                allok = ok && allok;
                //--    if (ok) look_at(m, ball)
                //--end
            }
        }


      
        if (this.checktimer() && allok) {
            if (to_exit) {
                game.start_match(true);
            } else {
                //--keepers
                // set_state_ok(men[men.length - 1 - 1]);
                set_state_ok(teams[0].players[4]);
                // set_state_ok(men[men.length - 1]);
                set_state_ok(teams[1].players[4]);
                game.setState(Kickoff.getInstance());
            }
        }
    }
}