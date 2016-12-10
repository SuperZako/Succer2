/// <reference path="THREEx.KeyboardState.ts" />
/// <reference path="THREEx.WindowResize.ts" />
/// <reference path="THREEx.FullScreen.ts" />
/// <reference path="Billboard.ts" />
/// <reference path="SoccerPitch.ts" />

/*
       Three.js "tutorials by example"
       Author: Lee Stemkoski
       Date: July 2013 (three.js v59dev)
 */

// MAIN
namespace Main {
    // standard global variables
    var container: HTMLDivElement;
    var scene: THREE.Scene;
    var camera: THREE.PerspectiveCamera;
    var renderer: THREE.WebGLRenderer;
    //var stats: Stats;
    var keyboard = new THREEx.KeyboardState();
    var clock = new THREE.Clock();
    // custom global variables
    var boomer: TextureAnimator; // animators
    var man: Billboard;
    var controls: THREE.OrbitControls;

    // FUNCTIONS
    export function init() {
        // SCENE
        scene = new THREE.Scene();

        // CAMERA
        const SCREEN_WIDTH = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;
        const VIEW_ANGLE = 90;
        const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        const NEAR = 0.1;
        const FAR = 1000;

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        scene.add(camera);

        camera.position.z = SCREEN_HEIGHT / 2;//set(0, 150, 400);

        camera.lookAt(scene.position);





        // RENDERER

        renderer = new THREE.WebGLRenderer({ antialias: true });



        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container = <HTMLDivElement>document.getElementById('ThreeJS');

        container.appendChild(renderer.domElement);

        // EVENTS
        THREEx.WindowResize(renderer, camera);
        THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

        // CONTROLS
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        // STATS

        // stats = new Stats();
        // stats.dom.style.position = 'absolute';
        // stats.dom.style.bottom = '0px';
        // stats.dom.style.zIndex = '100';

        // container.appendChild(stats.dom);



        //// LIGHT

        //var light = new THREE.PointLight(0xffffff);

        //light.position.set(0, 250, 0);

        //scene.add(light);



        //var directionalLight = new THREE.DirectionalLight(0xffffff);

        //directionalLight.position.set(0, 0.7, 0.7);

        //scene.add(directionalLight);



        // FLOOR

        let pitch = new _SoccerPitch(scene);



        // SKYBOX/FOG

        var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);

        var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });

        var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

        // scene.add(skyBox);

        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

        ////////////
        // CUSTOM //
        ////////////



        // MESHES WITH ANIMATED TEXTURES!


        man = new Billboard(scene);



        var explosionTexture = new THREE.TextureLoader().load('images/explosion.jpg');

        boomer = new TextureAnimator(explosionTexture, 4, 4, 16, 55); // texture, #horiz, #vert, #total, duration.

        var explosionMaterial = new THREE.MeshBasicMaterial({ map: explosionTexture });

        var cubeGeometry = new THREE.CubeGeometry(50, 50, 50);
        var cube = new THREE.Mesh(cubeGeometry, explosionMaterial);
        cube.position.set(0, 26, 0);
        scene.add(cube);
    }

    export function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }

    function update() {

        var delta = clock.getDelta();



        boomer.update(1000 * delta);

        man.update(1000 * delta);
        if (keyboard.pressed("z")) {
            // do something
        }

        controls.update();
        // stats.update();
        man.quaternion(camera.quaternion);
    }

    function render() {
        renderer.render(scene, camera);
    }
}

Main.init();
Main.animate();