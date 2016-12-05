/// <reference path="../State.ts" />


class GameStateToBallout extends State<Game> {

    private static instance = new GameStateToBallout();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public update(game: Game) {
        //-- todo : tout le monde se met en place
        let l = Vector3.distance(throwin.player.position, { x: throwin.position.x, y: throwin.position.y, z: 0 }) / throwin.dist;
        camtarget = Vector2.add(Vector2.multiply(1 - l, throwin.ballpos), Vector2.multiply(l, camlastpos));
        if (throwin.player.go_to(throwin.position.x, throwin.position.y, 2, 10)) {
            game.setState(GameStateBallin.getInstance());
        }
    }
}