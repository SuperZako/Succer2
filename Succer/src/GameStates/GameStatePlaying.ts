/// <reference path="../State.ts" />

class GameStatePlaying extends State<Game> {

    private static instance = new GameStatePlaying();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public init(game: Game) {
        game.controllingPlayers[0].isAI = (mode === 2);
        game.controllingPlayers[1].isAI = (mode > 0);
    }
}