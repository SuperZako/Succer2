


class _SoccerPitch {
    constructor(scene: THREE.Scene) {
        var texture = new THREE.TextureLoader().load('images/pitch1L.jpg');
        var greenMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        var planeGeometry = new THREE.PlaneGeometry(1024, 1024); // 幅20、高さ10の平面
        var plane = new THREE.Mesh(planeGeometry, greenMaterial);
        scene.add(plane);

        //GridHelper(大きさ, １マスの大きさ)
        //var grid = new THREE.GridHelper(1000, 100);

        //シーンオブジェクトに追加
        //scene.add(grid);
    }
}