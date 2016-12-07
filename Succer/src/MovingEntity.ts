/// <reference path="./BaseGameEntity.ts" />

abstract class MovingEntity extends BaseGameEntity {
    public velocity = new Vector3();
    public dampFactor:number;
    public damp() {
        //muls_in_place(m.velocity, m.damp)
        this.velocity.multiply(this.dampFactor);
    }
}