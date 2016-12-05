
enum TeamColor {
    Blue,
    Red
}

class SoccerTeam {
    //pointers to the team members
    /*private*/ public players: PlayerBase[] = [];//new Array<PlayerBase>(5);

    public constructor(public color: TeamColor) {
        this.createPlayers();
    }


    /**

     * creates all the players for this team

    **/

    private createPlayers() {
        const fieldplayercount = 5;

        for (let i = 0; i < fieldplayercount; ++i) {
            let fieldPlayer = new FieldPlayer(this.color, i);
            fieldPlayer.position.x = fw2;
            fieldPlayer.position.y = 0;
            this.players.push(fieldPlayer);
        }

        this.players.push(new GoalKeeper(this.color, fieldplayercount));
    }

}