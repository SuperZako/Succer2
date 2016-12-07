/// <reference path="./Game.ts" />
/// <reference path="./SoccerPitch.ts" />

enum TeamColor {
    Blue,
    Red
}

class SoccerTeam {
    //pointers to the team members
    public players: PlayerBase[] = [];

    public constructor(public color: TeamColor) {
        this.createPlayers();
    }


    /**

     * creates all the players for this team

    **/

    private createPlayers() {
        const fieldplayercount = 5;
        let game = Game.getInstance();
        let pitch = game.getPitch();
        let right = pitch.right;
        for (let i = 0; i < fieldplayercount; ++i) {
            let fieldPlayer = new FieldPlayer(this.color, i);
            fieldPlayer.position.x = right;
            fieldPlayer.position.y = 0;
            this.players.push(fieldPlayer);
        }

        this.players.push(new GoalKeeper(this.color, fieldplayercount));
    }

}