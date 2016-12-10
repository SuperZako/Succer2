
/// <reference path="./TextureAnimator.ts" />


class Billboard {
    private textureAnimator: TextureAnimator;
    private mesh: THREE.Mesh;
    constructor(scene: THREE.Scene) {
        let texture = new THREE.TextureLoader().load('images/run.png');
        this.textureAnimator = new TextureAnimator(texture, 10, 1, 10, 75); // texture, #horiz, #vert, #total, duration.
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        let geometry = new THREE.PlaneGeometry(36, 36, 1, 1);
        this.mesh = new THREE.Mesh(geometry, material);
        let mesh = this.mesh;
        mesh.position.set(-50, 8, 0);
        scene.add(mesh);
    }

    public quaternion(newQuaternion: THREE.Quaternion) {
        let mesh = this.mesh;
        mesh.quaternion.copy(newQuaternion);
    }

    public update(milliSec: number) {
        this.textureAnimator.update(milliSec);
    }
}