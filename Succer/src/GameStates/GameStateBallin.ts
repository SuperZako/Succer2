/// <reference path="../State.ts" />

class GameStateBallin extends State<Game> {
    private static instance = new GameStateBallin();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public init(game: Game) {
        let ball = game.ball;
        ball.position.x = throwin.ballpos.x;
        ball.position.y = throwin.ballpos.y;

        // ball.velocity.multiply(0);
        ball.velocity = Vector3.Zero;

        throwin.player.set_state(throwin.type);
    }
}