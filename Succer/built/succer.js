﻿var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _SoccerPitch = (function () {
    function _SoccerPitch(scene) {
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
    return _SoccerPitch;
}());
var Vector3 = (function () {
    function Vector3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Object.defineProperty(Vector3, "Zero", {
        // Returns a Vector2 with all of its components set to zero.
        get: function () {
            return new Vector3();
        },
        enumerable: true,
        configurable: true
    });
    //overload the + operator
    Vector3.add = function (lhs, rhs) {
        var x = lhs.x + rhs.x;
        var y = lhs.y + rhs.y;
        var z = lhs.z + rhs.z;
        return new Vector3(x, y, z);
    };
    //overload the - operator
    Vector3.subtract = function (lhs, rhs) {
        var x = lhs.x - rhs.x;
        var y = lhs.y - rhs.y;
        var z = lhs.z - rhs.z;
        return new Vector3(x, y, z);
    };
    Vector3.multiply = function (lhs, rhs) {
        return new Vector3(lhs * rhs.x, lhs * rhs.y, lhs * rhs.z);
    };
    Vector3.distance = function (vector1, vector2) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    };
    Vector3.distanceSquared = function (vector1, vector2) {
        var x = vector1.x - vector2.x;
        var y = vector1.y - vector2.y;
        var z = vector1.z - vector2.z;
        return x * x + y * y + z * z;
    };
    /**
     *   normalizes a 2D Vector
     */
    Vector3.normalize = function (vector) {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        var length = Math.sqrt(x * x + y * y + z * z);
        if (length > MathHelper.EpsilonDouble) {
            vector.x /= length;
            vector.y /= length;
            vector.z /= length;
        }
        return vector;
    };
    Vector3.prototype.set = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    };
    //we need some overloaded operators
    Vector3.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
        return this;
    };
    Vector3.prototype.multiply = function (rhs) {
        this.x *= rhs;
        this.y *= rhs;
        this.z *= rhs;
        return this;
    };
    /**
     *   returns the length of a 2D vector
     */
    Vector3.prototype.length = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    };
    Vector3.prototype.clamp = function (max) {
        var length = this.length();
        if (length > max) {
            var factor = max / length;
            this.multiply(factor);
        }
    };
    Vector3.prototype.toVector2 = function () {
        return new Vector2(this.x, this.y);
    };
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    return Vector3;
}());
/// <reference path="./math/Vector3.ts" />
var BaseGameEntity = (function () {
    function BaseGameEntity() {
        this.position = new Vector3();
    }
    return BaseGameEntity;
}());
/// <reference path="./BaseGameEntity.ts" />
var MovingEntity = (function (_super) {
    __extends(MovingEntity, _super);
    function MovingEntity() {
        var _this = _super.apply(this, arguments) || this;
        _this.velocity = new Vector3();
        return _this;
    }
    MovingEntity.prototype.damp = function () {
        this.velocity.multiply(this.dampFactor);
    };
    return MovingEntity;
}(BaseGameEntity));
/// <reference path="./MovingEntity.ts" />
var SoccerBall = (function (_super) {
    __extends(SoccerBall, _super);
    function SoccerBall() {
        var _this = _super.call(this) || this;
        _this.w = 2;
        _this.h = 4;
        // public damp = 0.975;
        // damp=0.95,
        _this.dampair = 0.985;
        _this.dampFactor = 0.975;
        return _this;
    }
    SoccerBall.prototype.draw = function () {
        //Renderer.spr(44, this.position.x - this.w, this.position.y - this.h - this.position.z);
        Renderer.drawImage(Images.ball, this.position.x - this.w + 1, this.position.y - this.h + 1);
    };
    SoccerBall.prototype.drawshadow = function () {
        //Renderer.spr(45, this.position.x - this.w + 1, this.position.y - this.h + 1);
        //Renderer.drawImage(Images.ball, this.position.x - this.w + 1, this.position.y - this.h + 1);
    };
    SoccerBall.prototype.update = function () {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        var right = pitch.right;
        var prevball = this.position.toVector2();
        //plus_in_place(this.position, this.velocity);
        this.position.add(this.velocity);
        var gravity = 0.1;
        if (this.position.z > 0) {
            this.velocity.z -= gravity;
        }
        else {
            this.position.z = 0;
            if (Math.abs(this.velocity.z) < 2 * gravity) {
                this.velocity.z = 0;
            }
            else {
                this.velocity.z = Math.abs(this.velocity.z) * 0.5;
                ballsfx();
            }
        }
        this.position.z += this.velocity.z;
        var goals = pitch.getGoals();
        goals[0].testCollisionWithBall(this);
        goals[1].testCollisionWithBall(this);
        //--touch lines
        if (game.isPlaying() && Math.abs(this.position.x) > right) {
            throwin.init_throwin(FieldPlayerStateThrowin.getInstance(), new Vector2(right, MathHelper.clamp(Math.abs(this.position.y), -top, top)), { x: 1, y: 1 }, 1);
        }
        //--scoring_team
        //--todo check ball really entering the goal...
        if (game.isPlaying() &&
            game.scoring_team === 0 &&
            (goals[0].scored(this) || goals[1].scored(this))) {
            game.scoring_team = game.side_to_idx(this.position.y > 0 ? 1 : -1);
            game.kickoff_team = game.scoring_team;
            game.score[game.scoring_team] += 1;
            camlastpos = this.position.toVector2(); // copy(this.position);
            game.setState(GameStateGoalmarked.getInstance());
            sfx(0);
            sfx(15);
        }
        //--corner / goal kick
        if (game.isPlaying() && Math.abs(this.position.y) > top) {
            throwin.side = -balllasttouchedside;
            if (throwin.side * this.position.y < 0) {
                throwin.init_throwin(CornerKick.getInstance(), new Vector2(right, top), { x: 1.1, y: 1.03 }, 5);
            }
            else {
                throwin.init_throwin(Goalkick.getInstance(), new Vector2(MathHelper.randInRange(0, penaltyw2), fh2_penaltyh), { x: 1, y: 1.15 }, 25);
            }
        }
        var fieldw2 = right + border;
        var fieldh2 = top + border;
        //--field borders
        var bd = this.velocity;
        if (this.position.x < -fieldw2) {
            bd.x = Math.abs(bd.x) * 0.5;
            this.position.x = -fieldw2;
        }
        if (this.position.x > fieldw2) {
            bd.x = -Math.abs(bd.x) * 0.5;
            this.position.x = fieldw2;
        }
        if (this.position.y < -fieldh2) {
            bd.y = Math.abs(bd.y) * 0.5;
            this.position.y = -fieldh2;
        }
        if (this.position.y > fieldh2) {
            bd.y = -Math.abs(bd.y) * 0.5;
            this.position.y = fieldh2;
        }
        //--damping
        if (this.position.z < 0.1) {
            this.damp();
        }
        else {
            //muls_in_place(this.velocity, this.dampair);
            this.velocity.multiply(this.dampair);
        }
        bd.z *= this.dampFactor;
    };
    return SoccerBall;
}(MovingEntity));
var Region = (function () {
    function Region(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.width = Math.abs(right - left);
        this.height = Math.abs(bottom - top);
    }
    return Region;
}());
var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector2, "UnitY", {
        get: function () {
            return new Vector2(0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2, "Zero", {
        // Returns a Vector2 with all of its components set to zero.
        get: function () {
            return new Vector2();
        },
        enumerable: true,
        configurable: true
    });
    //overload the + operator
    Vector2.add = function (lhs, rhs) {
        var x = lhs.x + rhs.x;
        var y = lhs.y + rhs.y;
        return new Vector2(x, y);
    };
    //overload the - operator
    Vector2.subtract = function (lhs, rhs) {
        var x = lhs.x - rhs.x;
        var y = lhs.y - rhs.y;
        return new Vector2(x, y);
    };
    Vector2.multiply = function (lhs, rhs) {
        return new Vector2(lhs * rhs.x, lhs * rhs.y);
    };
    Vector2.dot = function (lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    };
    /**
     *   returns the length of a 2D vector
    */
    Vector2.length = function (vector) {
        var x = vector.x;
        var y = vector.y;
        return Math.sqrt(x * x + y * y);
    };
    /**
     *   normalizes a 2D Vector
     */
    Vector2.normalize = function (vector) {
        //let _length = Vector2.length(vector);
        var x = vector.x;
        var y = vector.y;
        var length = Math.sqrt(x * x + y * y);
        if (length > MathHelper.EpsilonDouble) {
            vector.x /= length;
            vector.y /= length;
        }
        return vector;
    };
    Vector2.distance = function (vector1, vector2) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    };
    Vector2.distanceSquared = function (vector1, vector2) {
        var x = vector1.x - vector2.x;
        var y = vector1.y - vector2.y;
        return x * x + y * y;
    };
    /**
    * calculates the dot product
    * @param v2
    * @return  dot product
    */
    Vector2.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };
    //we need some overloaded operators
    Vector2.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        return this;
    };
    Vector2.prototype.multiply = function (rhs) {
        this.x *= rhs;
        this.y *= rhs;
        return this;
    };
    Vector2.prototype.length = function () {
        var x = this.x;
        var y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    Vector2.prototype.clamp = function (max) {
        var length = this.length();
        if (length > max) {
            var factor = max / length;
            this.multiply(factor);
        }
    };
    Vector2.prototype.normalize = function () {
        var x = this.x;
        var y = this.y;
        var length = Math.sqrt(x * x + y * y);
        if (length > MathHelper.EpsilonDouble) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.toVector3 = function () {
        return new Vector3(this.x, this.y);
    };
    return Vector2;
}());
/// <reference path="./Game.ts" />
/// <reference path="./SoccerPitch.ts" />
var GoalUp = (function (_super) {
    __extends(GoalUp, _super);
    function GoalUp(leftPost, rightPost, facing) {
        var _this = _super.call(this) || this;
        _this.leftPost = leftPost;
        _this.rightPost = rightPost;
        _this.facing = facing;
        _this.width = 60;
        _this.depth = 20;
        _this.height = 10;
        return _this;
        //let game = Game.getInstance();
        //let pitch = game.getPitch();
        //let bottom = pitch.bottom;
        //this.position.y = bottom;
    }
    GoalUp.prototype.scored = function (ball) {
        var depth = this.depth;
        var height = this.height;
        var left = this.leftPost.x;
        var right = this.rightPost.x;
        var top = this.leftPost.y;
        if (left > right) {
            var temp = left;
            left = right;
            right = temp;
        }
        return ball.position.z < height
            && left < ball.position.x && ball.position.x < right
            && top + depth > Math.abs(ball.position.y)
            && Math.abs(ball.position.y) > top;
    };
    GoalUp.prototype.testCollisionNet = function (ball, prevball, goal1, goal2) {
        var res = segment_intersect(prevball, ball.position, goal1, goal2);
        if (res) {
            if (goal1.x === goal2.x) {
                ball.velocity.x = -ball.velocity.x;
            }
            else {
                ball.velocity.y = -ball.velocity.y;
            }
            //muls_in_place(this.velocity, 0.25)
            ball.velocity.multiply(0.25);
            ball.position.x = res.x;
            ball.position.y = res.y;
        }
    };
    GoalUp.prototype.testCollisionPost = function (p, prevball) {
        var game = Game.getInstance();
        var ball = game.ball;
        var d = Vector3.distance(ball.position, { x: p.x, y: p.y, z: 0 });
        if (d < ball.w) {
            var delta = Vector2.subtract(p, ball.position);
            var ballspeed = Vector3.distance(ball.position, { x: prevball.x, y: prevball.y, z: 0 });
            //plus_in_place(ball.position, muls(delta, -1 / d * ball.w))
            ball.position.add(Vector2.multiply(-1 / d * ball.w, delta).toVector3());
            //plus_in_place(ball.velocity, muls(delta, -1 / d * ballspeed))
            ball.velocity.add(Vector2.multiply(-1 / d * ballspeed, delta).toVector3());
            ballsfx();
        }
    };
    GoalUp.prototype.testCollisionWithBall = function (ball) {
        var prevball = ball.position.toVector2();
        //let post1 = { x: goalx1, y: top };
        var leftPost = this.leftPost;
        var post1_ = { x: leftPost.x, y: leftPost.y + this.depth / 2 };
        //let post2 = { x: goalx2, y: top };
        var rightPost = this.rightPost;
        var post2_ = { x: rightPost.x, y: rightPost.y + this.depth / 2 };
        //let post2_ = { x: goalx2, y: top + goalh / 2 };
        var height = this.height;
        //if (this.position.y < 0) {
        //    post1.y = -post1.y;
        //    post1_.y = -post1_.y;
        //    post2.y = -post2.y;
        //    post2_.y = -post2_.y;
        //}
        //--goal col
        if (this.position.z <= height) {
            //--nets
            this.testCollisionNet(ball, prevball, leftPost, post1_);
            this.testCollisionNet(ball, prevball, rightPost, post2_);
            this.testCollisionNet(ball, prevball, post1_, post2_);
            //--posts
            this.testCollisionPost(leftPost, prevball);
            this.testCollisionPost(rightPost, prevball);
        }
    };
    GoalUp.prototype.draw = function () {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        var left = pitch.left;
        var right = pitch.right;
        var bottom = pitch.bottom;
        var leftPost = this.leftPost;
        var rightPost = this.rightPost;
        var depth = this.depth;
        var height = this.height;
        var clipstartx = leftPost.x - camtarget.x + 1 + 64;
        var clipstarty = -camtarget.y + 64 - top;
        var clipendx = rightPost.x - leftPost.x;
        var clipendy = depth / 2 + 1;
        //spr(60, goalx2, -fh2 - 17)
        clip(clipstartx, clipstarty - 10, clipendx + 8, clipendy);
        for (var x = leftPost.x - 1; x <= rightPost.x + 8; x += 8) {
            for (var y = -11; y <= 7; y += 8) {
            }
        }
        clip(clipstartx, clipstarty - depth, clipendx - 1, clipendy);
        for (var x = leftPost.x - 1; x <= rightPost.x + 8; x += 8) {
            for (var y = -depth + 1; y <= 8; y += 8) {
            }
        }
        clip();
        var a = -height - top;
        Renderer.line(leftPost.x, a, leftPost.x, bottom);
        Renderer.line(leftPost.x, a, rightPost.x, a);
        Renderer.line(rightPost.x, a, rightPost.x, bottom);
    };
    GoalUp.prototype.drawshadow = function () {
    };
    return GoalUp;
}(BaseGameEntity));
/// <reference path="./common/Region.ts" />
/// <reference path="./math/Vector2.ts" />
/// <reference path="./GoalUp.ts" />
var SoccerPitch = (function () {
    function SoccerPitch(width, height) {
        this.goals = [];
        var left = -width / 2;
        var top = height / 2;
        var right = width / 2;
        var bottom = -height / 2;
        var GoalWidth = 60;
        // depth 
        this.playingArea = new Region(left, top, right, bottom);
        this.goals.push(new GoalUp(new Vector2(top, GoalWidth / 2), new Vector2(top, -GoalWidth / 2), new Vector2(0, -1)));
        this.goals.push(new GoalUp(new Vector2(bottom, -GoalWidth / 2), new Vector2(bottom, GoalWidth / 2), new Vector2(0, 1)));
    }
    SoccerPitch.prototype.getGoals = function () {
        return this.goals;
    };
    Object.defineProperty(SoccerPitch.prototype, "left", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoccerPitch.prototype, "top", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoccerPitch.prototype, "right", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoccerPitch.prototype, "bottom", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.bottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoccerPitch.prototype, "width", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoccerPitch.prototype, "height", {
        get: function () {
            var playingArea = this.playingArea;
            return playingArea.height;
        },
        enumerable: true,
        configurable: true
    });
    SoccerPitch.prototype.draw = function () {
        var top = this.top;
        var left = this.left;
        var right = this.right;
        var bottom = this.bottom;
        for (var y = bottom; y < top; y += 32) {
            Renderer.rectfill(left, y, right, y + 16, 3);
            Renderer.rectfill(left, y + 16, right, y + 32, 11);
        }
    };
    return SoccerPitch;
}());
/// <reference path="./Game.ts" />
/// <reference path="./SoccerPitch.ts" />
var TeamColor;
(function (TeamColor) {
    TeamColor[TeamColor["Blue"] = 0] = "Blue";
    TeamColor[TeamColor["Red"] = 1] = "Red";
})(TeamColor || (TeamColor = {}));
var SoccerTeam = (function () {
    function SoccerTeam(color) {
        this.color = color;
        //pointers to the team members
        this.players = [];
        this.createPlayers();
    }
    /**

     * creates all the players for this team

    **/
    SoccerTeam.prototype.createPlayers = function () {
        var fieldplayercount = 5;
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var right = pitch.right;
        for (var i = 0; i < fieldplayercount; ++i) {
            var fieldPlayer = new FieldPlayer(this.color, i);
            fieldPlayer.position.x = right;
            fieldPlayer.position.y = 0;
            this.players.push(fieldPlayer);
        }
        this.players.push(new GoalKeeper(this.color, fieldplayercount));
    };
    return SoccerTeam;
}());
/// <reference path="./SoccerBall.ts" />
/// <reference path="./SoccerTeam.ts" />
/// <reference path="./SoccerPitch.ts" />
var Game = (function () {
    function Game() {
        this.demo = true;
        this.score = [0, 0];
        this.ball = new SoccerBall();
        this.controllingPlayers = [];
        this.full_time = 2700;
        this.half_time = this.full_time / 2;
        this.pitch = new SoccerPitch(256, 384);
    }
    //this is a singleton
    Game.getInstance = function () {
        return this.instance;
    };
    Game.prototype.side_to_idx = function (s) {
        //-- return flr((s + 1) / 2 + 1)
        //return ((matchtimer >= half_time ? - s : s) + 1) / 2;// + 1
        return Math.floor(((this.matchtimer >= this.half_time ? -s : s) + 1) / 2); // + 1
    };
    Game.prototype.idx_to_side = function (i) {
        //return (matchtimer >= half_time ? - 1 : 1) * (2 * i - 3)
        return (this.matchtimer >= this.half_time ? -1 : 1) * (2 * i - 1);
    };
    Game.prototype.getPitch = function () {
        return this.pitch;
    };
    Game.prototype.get_controlled = function (side) {
        return this.controllingPlayers[this.side_to_idx(side)].player;
    };
    Game.prototype.create_player = function (_i) {
        //this.controllingPlayers.push(new ControllingPlayer(undefined, i));
    };
    Game.prototype.initialize = function () {
        Renderer.initialize();
        // canvas = <HTMLCanvasElement>document.getElementById("canvas");
        // canvas.width = 128;
        // canvas.height = 128;
        // context = canvas.getContext("2d");
        music(0, 0, 6);
        this.teams = [new SoccerTeam(TeamColor.Blue), new SoccerTeam(TeamColor.Red)];
        this.controllingPlayers.push(new ControllingPlayer(this.teams[0].players[0], 0));
        this.controllingPlayers.push(new ControllingPlayer(this.teams[1].players[0], 0));
        this.start_match(true);
    };
    Game.prototype.setState = function (state) {
        //if (newstate.init !== undefined) {
        state.init(this);
        //}
        this.state = state;
    };
    Game.prototype.isPlaying = function () {
        return this.state === GameStatePlaying.getInstance();
    };
    Game.prototype.is_throwin = function () {
        return this.state === GameStateBallin.getInstance();
    };
    Game.prototype.distance_men_ball = function () {
        var ball = this.ball;
        var nearestdist = [max_val, max_val];
        var teams = this.teams;
        for (var _a = 0, teams_1 = teams; _a < teams_1.length; _a++) {
            var team = teams_1[_a];
            for (var _b = 0, _c = team.players; _b < _c.length; _b++) {
                var player = _c[_b];
                if (!player.keeper && player.getState() !== Down.getInstance() && player.getState() !== Tackle.getInstance()) {
                    var d = Vector3.distance(player.position, ball.position);
                    player.ball_dist = d;
                    if (this.isPlaying()) {
                        var p = this.side_to_idx(player.side);
                        if (d < nearestdist[p]) {
                            this.controllingPlayers[p].player = player;
                            nearestdist[p] = d;
                        }
                    }
                }
            }
        }
    };
    Game.prototype.start_match = function (demo) {
        this.score = [0, 0];
        this.demo = demo;
        this.matchtimer = 0;
        camlastpos = camtarget.clone(); // copy(camtarget)
        this.scoring_team = 0;
        this.starting_team = Math.floor(MathHelper.randInRange(0, 2));
        this.kickoff_team = this.starting_team;
        this.setState(GameStateToKickoff.getInstance());
    };
    Game.prototype.update = function () {
        var ball = this.ball;
        ballsfxtime -= 1;
        if (this.isPlaying()) {
            //--time management
            var first_half = !(this.matchtimer >= this.half_time);
            if (!this.demo) {
                this.matchtimer += 1;
            }
            if (first_half && this.matchtimer >= this.half_time || this.matchtimer > this.full_time) {
                changing_side = first_half;
                for (var _a = 0, _b = this.teams; _a < _b.length; _a++) {
                    var team = _b[_a];
                    for (var _c = 0, _d = team.players; _c < _d.length; _c++) {
                        var player = _d[_c];
                        player.change_side();
                    }
                }
                camlastpos = camtarget.clone();
                this.setState(GameStateToKickoff.getInstance());
                this.kickoff_team = 1 - this.starting_team;
                sfx(this.matchtimer > this.full_time ? 1 : 0);
                return;
            }
            dribblen = 0;
            //foreach(men, dribble_ball)
            //for (let m of men) {
            //    m.dribble_ball();
            //}
            for (var _e = 0, _f = this.teams; _e < _f.length; _e++) {
                var team = _f[_e];
                for (var _g = 0, _h = team.players; _g < _h.length; _g++) {
                    var player = _h[_g];
                    player.dribble_ball();
                }
            }
            if (dribblen > 0) {
                ball.velocity.x = dribble.x / dribblen;
                ball.velocity.y = dribble.y / dribblen;
                //muls_in_place(dribble, 0)
                dribble.multiply(0);
                //--improving ball control
                if (dribblen === 1) {
                    this.man_with_ball.stick_ball();
                }
                ball.velocity.clamp(10);
                if (ball.velocity.length() > 1) {
                    ballsfx();
                }
            }
            this.distance_men_ball();
        }
        for (var _j = 0, _k = this.teams; _j < _k.length; _j++) {
            var team = _k[_j];
            for (var _l = 0, _m = team.players; _l < _m.length; _l++) {
                var player = _m[_l];
                player.damp();
            }
        }
        for (var _o = 0, _p = this.controllingPlayers; _o < _p.length; _o++) {
            var p = _p[_o];
            p.player_input();
        }
        for (var _q = 0, _r = this.teams; _q < _r.length; _q++) {
            var team = _r[_q];
            for (var _s = 0, _t = team.players; _s < _t.length; _s++) {
                var player = _t[_s];
                //man_update(m);
                player.update();
            }
        }
        ball.update();
        if (this.is_throwin()) {
            this.controllingPlayers[this.side_to_idx(throwin.side)].player = throwin.player;
        }
        if (this.state.update !== undefined) {
            this.state.update(this);
        }
        update_cam();
        if (this.demo) {
            if (menu.checktimer()) {
                menu.timer = 10;
                blink = !blink;
            }
            if (btnp(0)) {
                mode -= 1;
            }
            if (btnp(1)) {
                mode += 1;
            }
            if (mode < 0) {
                mode = 2;
            }
            if (mode > 2) {
                mode = 0;
            }
            if (btnp(2)) {
                changeshirt(1);
            }
            if (btnp(3)) {
                changeshirt(2);
            }
            if (btn(4)) {
                this.start_match(false);
            }
        }
    };
    Game.prototype.draw = function () {
        Renderer.camera();
        Renderer.rectfill(0, 0, 127, 127, 3);
        Renderer.camera(camtarget.x - 64, camtarget.y - 64);
        var pitch = this.pitch;
        var left = pitch.left;
        var bottom = pitch.bottom;
        var right = pitch.right;
        var top = pitch.top;
        pitch.draw();
        color(7);
        Renderer.rect(left, bottom, right, top);
        Renderer.line(left, 0, right, 0);
        Renderer.rect(-penaltyw2, bottom, penaltyw2, -fh2_penaltyh);
        Renderer.rect(-penaltyw2, top, penaltyw2, fh2_penaltyh);
        circ(0, 0, 30);
        Renderer.palt(3, true);
        Renderer.palt(0, false);
        var goals = pitch.getGoals();
        var draw_list = [];
        draw_list.push(goals[0]);
        draw_list.push(this.ball);
        //for (let i of men) {
        //    draw_list.push(i);
        //}
        for (var _a = 0, _b = this.teams; _a < _b.length; _a++) {
            var team = _b[_a];
            for (var _c = 0, _d = team.players; _c < _d.length; _c++) {
                var player = _d[_c];
                draw_list.push(player);
            }
        }
        //add(draw_list, goal_down)
        draw_list.push(goal_down);
        bubble_sort(draw_list);
        for (var _e = 0, draw_list_1 = draw_list; _e < draw_list_1.length; _e++) {
            var i = draw_list_1[_e];
            i.drawshadow();
        }
        for (var _f = 0, draw_list_2 = draw_list; _f < draw_list_2.length; _f++) {
            var i = draw_list_2[_f];
            i.draw();
        }
        draw_marker(this.controllingPlayers[0].player);
        draw_marker(this.controllingPlayers[1].player);
        //-- for i in all(men) do
        //--line(i.x, i.y, i.x + 10 * i.dir.x, i.y + 10 * i.dir.y, 10)
        //-- end
        pal();
        Renderer.palt();
        Renderer.camera();
        if (this.scoring_team !== 0) {
            Renderer.print_outlined("goal!", 55, 6, 7, 0);
        }
        if (this.matchtimer > this.full_time) {
            Renderer.print_outlined("game over", 47, 16, 7, 0);
        }
        if (changing_side) {
            Renderer.print_outlined("half time", 47, 16, 7, 0);
        }
        Renderer.print_outlined(this.score[0].toString(), 116, 1, 12, 0);
        Renderer.print_outlined("-", 120, 1, 7, 0);
        Renderer.print_outlined(this.score[1].toString(), 124, 1, 8, 0);
        if (this.demo) {
            menu_offset = Math.max(menu_offset / 2, 1);
        }
        else {
            menu_offset = Math.min(menu_offset * 2, 128);
            Renderer.print_outlined(Math.floor(this.matchtimer / 30).toString(), 1, 122, 7, 0);
        }
        Renderer.print_outlined("succer", 51 + menu_offset, 40, 7, 0);
        print_mode(0, "player vs player");
        print_mode(1, "player vs cpu");
        print_mode(2, "   cpu vs cpu");
        draw_button(0, 20, 74);
        draw_button(1, 100, 74);
        Renderer.print_outlined("team colors", 42 + menu_offset, 90, 6, 5);
        draw_button(2, 20, 89);
        draw_button(3, 100, 89);
        if (blink) {
            Renderer.print_outlined("press z to start", 32 - menu_offset, 110, 6, 5);
        }
    };
    Game.prototype.throw_in = function (dy) {
        var ball = this.ball;
        var dx = -1;
        if (throwin.ballpos.x < 0) {
            dx = -dx;
        }
        if (dy !== 0) {
            dx /= 2;
        }
        var power = 3;
        var d = Vector2.normalize(new Vector2(dx, dy));
        //ball.velocity = muls(d, power);
        ball.velocity.set(Vector2.multiply(power, d).toVector3());
        ball.velocity.z = 1.5;
    };
    return Game;
}());
Game.instance = new Game();
/// <reference path="./Game.ts" />
var cnt = 0;
function animate() {
    cnt++;
    requestAnimationFrame(animate);
    if (cnt % 2) {
        //_update();
        Game.getInstance().update();
        //_draw();
        Game.getInstance().draw();
    }
}
window.onload = function () {
    Game.getInstance().initialize();
    //game = new Game();  
    animate();
};
var Animations = (function () {
    function Animations() {
    }
    return Animations;
}());
var TextureAnimator = (function () {
    function TextureAnimator(texture, tilesHorizontal, tilesVertical, numberOfTiles, tileDisplayDuration) {
        // note: texture passed by reference, will be updated by the update function.
        this.texture = texture;
        this.tilesHorizontal = tilesHorizontal;
        this.tilesVertical = tilesVertical;
        this.numberOfTiles = numberOfTiles;
        this.tileDisplayDuration = tileDisplayDuration;
        this.currentDisplayTime = 0; // how long has the current image been displayed?
        this.currentTile = 0; // which image is currently being displayed?
        //this.tilesHorizontal = tilesHoriz;
        //this.tilesVertical = tilesVert;
        // how many images does this spritesheet contain?
        //  usually equals tilesHoriz * tilesVert, but not necessarily,
        //  if there at blank tiles at the bottom of the spritesheet.
        //this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        // how long should each image be displayed?
        //this.tileDisplayDuration = tileDispDuration;
    }
    TextureAnimator.prototype.update = function (milliSec) {
        var texture = this.texture;
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
    return TextureAnimator;
}());
/// <reference path="./TextureAnimator.ts" />
var Billboard = (function () {
    function Billboard(scene) {
        var texture = new THREE.TextureLoader().load('images/run.png');
        this.textureAnimator = new TextureAnimator(texture, 10, 1, 10, 75); // texture, #horiz, #vert, #total, duration.
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        var geometry = new THREE.PlaneGeometry(36, 36, 1, 1);
        this.mesh = new THREE.Mesh(geometry, material);
        var mesh = this.mesh;
        mesh.position.set(-50, 8, 0);
        scene.add(mesh);
    }
    Billboard.prototype.quaternion = function (newQuaternion) {
        var mesh = this.mesh;
        mesh.quaternion.copy(newQuaternion);
    };
    Billboard.prototype.update = function (milliSec) {
        this.textureAnimator.update(milliSec);
    };
    return Billboard;
}());
var MathHelper;
(function (MathHelper) {
    MathHelper.EpsilonDouble = 1e-6;
    MathHelper.Pi = Math.PI; // πの値を表します。
    MathHelper.PiOver2 = Math.PI / 2; // πを 2 で割った値 (π/2) を表します。
    MathHelper.PiOver4 = Math.PI / 4; // πを 4 で割った値 (π/4) を表します。
    MathHelper.TwoPi = Math.PI * 2; // pi の 2 倍の値を表します。
    function lerp(a, b, percent) {
        return a + (b - a) * percent;
    }
    MathHelper.lerp = lerp;
    function randInRange(a, b) {
        return lerp(a, b, Math.random());
    }
    MathHelper.randInRange = randInRange;
    function clamp(value, min, max) {
        if (min > max) {
            var temp = min;
            min = max;
            max = min;
        }
        return Math.min(Math.max(value, min), max);
    }
    MathHelper.clamp = clamp;
})(MathHelper || (MathHelper = {}));
/// <reference path="./MovingEntity.ts" />
/// <reference path="./math/MathHelper.ts" />
/// <reference path="./SoccerTeam.ts" />
var PlayerBase = (function (_super) {
    __extends(PlayerBase, _super);
    function PlayerBase() {
        var _this = _super.call(this) || this;
        _this.w = 4;
        _this.h = 8;
        _this.vel = 0;
        _this.dir = new Vector2(0, 1);
        //prevdir={ x = 0, y = 1 },
        _this.lastspr = 4;
        _this.hasball = false;
        _this.animtimer = 0;
        _this.timer = 0;
        // damp = 0.9;
        _this.lastflip = false;
        _this.justshot = 0;
        _this.ball_dist = max_val;
        _this.keeper = false;
        _this.skin = Math.floor(MathHelper.randInRange(0, skincolors.length));
        _this.attackpos = [
            { x: 0, y: -0.2 },
            { x: 0.4, y: -0.1 },
            { x: -0.4, y: -0.25 },
            { x: 0.3, y: 0.1 },
            { x: -0.3, y: 0.2 },
            { x: 0, y: 0.90 },
        ];
        _this.dampFactor = 0.9;
        return _this;
    }
    PlayerBase.prototype.checktimer = function () {
        this.timer -= 1;
        return this.timer < 0;
    };
    PlayerBase.prototype.check_tackle = function (other) {
        if (this !== other) {
            var distance = Vector3.distance(this.position, other.position);
            var tackleDistance = 5;
            if (distance < tackleDistance) {
                other.set_state(Down.getInstance());
            }
        }
    };
    PlayerBase.prototype.update = function () {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var right = pitch.right;
        var top = pitch.top;
        //--update state : draw, input or ai
        if (this.getState().update !== undefined) {
            this.getState().update(this);
        }
        //--update position & check borders
        var newposx = this.position.x + this.velocity.x;
        var newposy = this.position.y + this.velocity.y;
        if (Math.abs(newposx) > right + border) {
            newposx = this.position.x;
            this.velocity.x = 0;
        }
        if (Math.abs(newposy) > top + border) {
            newposy = this.position.y;
            this.velocity.y = 0;
        }
        this.position.x = newposx;
        this.position.y = newposy;
        if (!game.isPlaying()) {
            this.hasball = false;
        }
        //--velocity clamp
        if (this.getState() !== Tackle.getInstance()) {
            //this.vel = clampvec_getlen(this.velocity, this.hasball ? 1.4 : 1.6);
            this.velocity.clamp(this.hasball ? 1.4 : 1.6);
            this.vel = this.velocity.length();
        }
        //-- if (f.vel > min_vel) f.dir = unit(f.d)
        if (this.vel > min_vel) {
            this.dir = Vector3.multiply(1 / this.vel, this.velocity).toVector2();
        }
    };
    PlayerBase.prototype.change_side = function () {
        this.side = -this.side;
    };
    PlayerBase.prototype.can_kick = function () {
        var kickdist = 8;
        return this.touch_ball(kickdist);
    };
    PlayerBase.prototype.touch_ball = function (dist) {
        var game = Game.getInstance();
        var ball = game.ball;
        var x = this.position.x;
        var toBall = Vector3.subtract(ball.position, this.position);
        return dist >= toBall.length();
    };
    PlayerBase.prototype.pass = function () {
        var game = Game.getInstance();
        var ball = game.ball;
        //--find the nearest teammate
        //-- in the right direction
        var maxd = 0;
        var target = undefined;
        var teams = game.teams;
        for (var _i = 0, teams_2 = teams; _i < teams_2.length; _i++) {
            var team = teams_2[_i];
            for (var _a = 0, _b = team.players; _a < _b.length; _a++) {
                var player = _b[_a];
                if (player.side === this.side && !player.keeper && player !== this) {
                    var front = 20;
                    var futm = Vector3.add(player.position, Vector3.multiply(front, player.velocity));
                    var dist = Vector3.distance(this.position, futm);
                    if (dist < 96) {
                        var relpos = Vector3.subtract(futm, this.position);
                        var dir = Vector2.multiply(1 / dist, relpos);
                        var dirw = Vector2.dot(this.dir, dir);
                        if (dirw > sin22_5) {
                            var distw = MathHelper.clamp(-dist / 32 + 2, 0, 1);
                            var w = dirw * distw;
                            //--todo: add obstruction consideration
                            if (w > maxd && this.is_pass_ok(relpos, dist, dir)) {
                                maxd = w;
                                target = dir;
                            }
                        }
                    }
                }
            }
        }
        if (target) {
            //--kick the ball in his direction
            var pass_strength = 3.0;
            //ball.velocity = muls(target, pass_strength);
            ball.velocity.set(Vector2.multiply(pass_strength, target).toVector3());
            ball.velocity.z = 1;
            return true;
        }
        return false;
    };
    PlayerBase.prototype.go_to = function (destination, min_dist, _steps) {
        // destination
        var distane = Vector2.distance(destination, this.position);
        if (distane < min_dist) {
            return true;
        }
        var vel_inc = 0.2;
        var to = Vector2.subtract(destination, this.position);
        to.normalize();
        to.multiply(vel_inc);
        this.velocity.add(to.toVector3());
        return false;
    };
    PlayerBase.prototype.run_to = function (x, y) {
        return this.go_to(new Vector2(x, y), dribbledist - 1, 0);
    };
    PlayerBase.prototype.findpos = function () {
        var game = Game.getInstance();
        var ball = game.ball;
        if (this !== game.get_controlled(this.side)) {
            if (game.isPlaying() &&
                this.ball_dist < ball_dist_thres &&
                game.get_controlled(this.side).ball_dist > ball_dist_thres / 2) {
                this.run_to(ball.position.x, ball.position.y);
            }
            else {
                this.findpos2(ball.position);
            }
        }
    };
    PlayerBase.prototype.findpos2 = function (t) {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        var left = pitch.left;
        var right = pitch.right;
        var bottom = pitch.bottom;
        if (this === throwin.player) {
            return;
        }
        var dest = this.attackpos[this.startposidx];
        var sid = 1;
        if (game.is_throwin() && t.x * dest.x < 0) {
            sid = -0.5;
        }
        var x = sid * dest.x * right + t.x / 2;
        //--x = clampsym(x, is_throwin() and fw2/ 2 or fw2)
        x = MathHelper.clamp(x, left, right);
        var y = this.side * dest.y * top + t.y;
        y = MathHelper.clamp(y, bottom * 0.8, top * 0.8);
        this.run_to(x, y);
    };
    PlayerBase.prototype.stick_ball = function () {
        var ball = Game.getInstance().ball;
        var prevball = ball.position.clone();
        ball.position.multiply(0.8);
        ball.position.add(Vector3.multiply(0.2, Vector3.add(this.position, Vector2.multiply(3, this.dir).toVector3()))); // -- + lerp to wanted_ball
    };
    PlayerBase.prototype.is_pass_ok = function (_relpos, dist, dir) {
        var game = Game.getInstance();
        if (game.is_throwin()) {
            return true;
        }
        var teams = game.teams;
        for (var _i = 0, teams_3 = teams; _i < teams_3.length; _i++) {
            var team = teams_3[_i];
            for (var _a = 0, _b = team.players; _a < _b.length; _a++) {
                var player = _b[_a];
                var side = (player.side !== this.side);
                if (side) {
                    var relpos2 = Vector3.subtract(player.position, this.position);
                    var dist2 = Math.max(Math.sqrt(Vector2.dot(relpos2, relpos2)), 1);
                    var dir2 = { x: relpos2.x / dist2, y: relpos2.y / dist2 };
                    if (Vector2.dot(dir, dir2) > cos22_5 && dist2 / dist < 1.1) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    PlayerBase.prototype.look_at = function (b) {
        this.dir = Vector2.normalize(Vector3.subtract(b.position, this.position).toVector2());
        spr_from_dir(this);
    };
    PlayerBase.prototype.dribble_ball = function () {
        if (this.justshot > 0) {
            this.justshot -= 1;
            this.hasball = false;
            return;
        }
        // m.hasball = not m.keeper and touch_ball(m, dribbledist)
        this.hasball = this.touch_ball(dribbledist);
        if (this.hasball) {
            //plus_in_place(dribble, muls(m.velocity, 1.1));
            var v = Vector3.multiply(1.1, this.velocity);
            dribble.add(v.toVector2());
            dribblen += 1;
            balllasttouchedside = this.side;
            var game = Game.getInstance();
            game.man_with_ball = this;
        }
    };
    PlayerBase.prototype.ball_thrown = function () {
        var game = Game.getInstance();
        this.lastspr = 2;
        set_state_ok(this);
        balllasttouchedside = this.side;
        this.justshot = 10;
        game.setState(GameStatePlaying.getInstance());
    };
    return PlayerBase;
}(MovingEntity));
/// <reference path="./PlayerBase.ts" />
var ControllingPlayer = (function () {
    function ControllingPlayer(player, num, but, isAI) {
        if (but === void 0) { but = 0; }
        if (isAI === void 0) { isAI = false; }
        this.player = player;
        this.num = num;
        this.but = but;
        this.isAI = isAI;
    }
    ControllingPlayer.prototype.player_input = function () {
        var game = Game.getInstance();
        if (this.isAI || game.demo) {
            //if (this.man.getState().ai !== undefined)
            this.player.getState().ai(this);
        }
        else {
            //if (this.man.getState().input !== undefined)
            this.player.getState().input(this);
        }
    };
    ControllingPlayer.prototype.tackle = function () {
        this.player.set_state(Tackle.getInstance());
    };
    ControllingPlayer.prototype.kick = function () {
        var game = Game.getInstance();
        //--pass
        var passed = false;
        if (this.but < 5) {
            passed = this.player.pass();
        }
        if (!passed) {
            var kickfactor = 1.0 + 0.1 * this.but;
            //plus_in_place(game.ball.velocity, muls(this.man.dir, kickfactor))
            game.ball.velocity.add(Vector2.multiply(kickfactor, this.player.dir).toVector3());
            Game.getInstance().ball.velocity.z += kickfactor * 0.5;
            balllasttouchedside = this.player.side;
        }
        this.player.justshot = 5;
        ballsfx();
    };
    ControllingPlayer.prototype.button_released = function () {
        var f = this.player;
        if (f.can_kick()) {
            this.kick();
            balllasttouchedside = f.side;
        }
        else {
            if (f.justshot === 0) {
                this.tackle();
            }
        }
        this.but = 0;
    };
    return ControllingPlayer;
}());
/// <reference path="./PlayerBase.ts" />
var FieldPlayer = (function (_super) {
    __extends(FieldPlayer, _super);
    function FieldPlayer(p, i) {
        var _this = _super.call(this) || this;
        _this.state = FieldPlayerStateOK.getInstance();
        _this.startposidx = i;
        _this.side = p * 2 - 1;
        _this.teamcolors = p + 1;
        return _this;
    }
    FieldPlayer.prototype.getState = function () {
        return this.state;
    };
    FieldPlayer.prototype.set_state = function (state) {
        this.state = state;
        state.start(this);
    };
    FieldPlayer.prototype.draw = function () {
        //let fo = this;
        this.state.draw(this);
    };
    //public update() {
    //    this.state.update(this);
    //}
    FieldPlayer.prototype.drawshadow = function () {
        Renderer.spr(46, this.position.x - 2, this.position.y - 2);
    };
    return FieldPlayer;
}(PlayerBase));
var State = (function () {
    function State() {
    }
    State.prototype.init = function (_e) { };
    State.prototype.draw = function (_e) { };
    State.prototype.update = function (_e) { };
    State.prototype.ai = function (_e) { };
    State.prototype.start = function (_e) { };
    State.prototype.input = function (_e) { };
    return State;
}());
/// <reference path="../State.ts" />
var CornerKick = (function (_super) {
    __extends(CornerKick, _super);
    function CornerKick() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    CornerKick.getInstance = function () {
        return this.instance;
    };
    CornerKick.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.position.x;
        throwin.player.position.y = throwin.position.y;
        //muls_in_place(throwin_f.velocity, 0);
        throwin.player.velocity.set(Vector3.Zero);
    };
    CornerKick.prototype.ai = function (_p) {
        //--todo : move the player
        if (throwin.checktimer()) {
            kick_dir();
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    CornerKick.prototype.input = function (p) {
        var vel_inc = 0.2;
        if (btn(0, p.num)) {
            throwin.player.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            throwin.player.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            throwin.player.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            throwin.player.velocity.y += vel_inc;
        }
        kick_dir();
        if (btn(4, p.num)) {
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    CornerKick.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        Renderer.spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return CornerKick;
}(State));
CornerKick.instance = new CornerKick();
/// <reference path="../State.ts" />
var Down = (function (_super) {
    __extends(Down, _super);
    function Down() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Down.getInstance = function () {
        return this.instance;
    };
    Down.prototype.start = function (f) {
        f.timer = 60;
        if (f.keeper) {
            f.lastspr = 0;
        }
    };
    Down.prototype.draw = function (f) {
        var down_spr = 37;
        var pos = sprite_pos(f);
        jersey_color(f);
        Renderer.spr(down_spr + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    };
    Down.prototype.update = function (f) {
        if (f.checktimer()) {
            set_state_ok(f);
        }
        else {
            f.damp();
        }
    };
    return Down;
}(State));
Down.instance = new Down();
/// <reference path="../State.ts" />
var FieldPlayerStateOK = (function (_super) {
    __extends(FieldPlayerStateOK, _super);
    function FieldPlayerStateOK() {
        return _super.apply(this, arguments) || this;
    }
    // this is a singleton
    FieldPlayerStateOK.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateOK.prototype.ai = function (p) {
        var game = Game.getInstance();
        var ball = game.ball;
        var pitch = game.getPitch();
        var f = p.player;
        if (f === null) {
            return;
        }
        //-- if (is_throwin()) findpos2(f, ball)
        if (game.is_throwin()) {
            f.findpos2({ x: 0, y: 0 });
        }
        if (game.isPlaying()) {
            //-- if running after the ball and it's going to leave the field on the throwin side
            //-- and a team mate is in front of the ball... let him handle the situation
            if ((f.hasball || f.run_to(ball.position.x, ball.position.y)) && ball.position.z < 8 && f.justshot <= 0) {
                //-- try to shoot
                var goal = { x: 0, y: f.side * pitch.top, z: 0 };
                if (Vector3.distance(goal, f.position) < 75) {
                    f.dir = Vector2.normalize(Vector2.subtract(goal, f.position.toVector2()));
                    p.but = MathHelper.randInRange(0, max_kick / 2) + max_kick / 3;
                    p.kick();
                    return;
                }
                //-- try to pass
                if (!f.pass()) {
                    //-- try to get near the goal
                    if (f.hasball) {
                        var togoal = Vector2.subtract(goal, f.position); //--unit(minus(goal, f))
                        if (Vector2.dot(f.dir, togoal) < sin22_5) {
                            var side = { x: -f.dir.y, y: f.dir.x };
                            var turn = Vector3.add(f.position, Vector2.multiply(35, side).toVector3());
                            f.run_to(turn.x, turn.y);
                        }
                        else {
                            f.run_to(0, goal.y * 0.75);
                        }
                    }
                }
            }
        }
    };
    FieldPlayerStateOK.prototype.input = function (p) {
        var game = Game.getInstance();
        if (p.player == null || (!game.isPlaying() && !game.is_throwin())) {
            return;
        }
        var man = p.player;
        var vel_inc = 0.2;
        if (btn(0, p.num)) {
            man.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            man.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            man.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            man.velocity.y += vel_inc;
        }
        if (game.isPlaying()) {
            if (btn(4, p.num)) {
                p.but += 1;
                if (p.but >= max_kick) {
                    p.button_released();
                }
            }
            else {
                if (p.but > 0) {
                    p.button_released();
                }
            }
        }
    };
    FieldPlayerStateOK.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        Renderer.spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    FieldPlayerStateOK.prototype.update = function (f) {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        if (game.isPlaying()) {
            f.findpos();
        }
        if (game.is_throwin() || game.state === GameStateToBallout.getInstance()) {
            if (throwin.type === FieldPlayerStateThrowin.getInstance()) {
                f.findpos();
            }
            if (throwin.type === Goalkick.getInstance()) {
                f.findpos2({ x: 0, y: 0 });
            }
            if (throwin.type === CornerKick.getInstance()) {
                f.findpos2({ x: 0, y: top * throwin.side });
            }
        }
    };
    return FieldPlayerStateOK;
}(State));
FieldPlayerStateOK.instance = new FieldPlayerStateOK();
/// <reference path="../State.ts" />
var FieldPlayerStateRunning = (function (_super) {
    __extends(FieldPlayerStateRunning, _super);
    function FieldPlayerStateRunning() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    FieldPlayerStateRunning.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateRunning.prototype.ai = function (_p) {
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            var game = Game.getInstance();
            var ball = game.ball;
            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    };
    FieldPlayerStateRunning.prototype.input = function (_p) {
        var game = Game.getInstance();
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            var ball = game.ball;
            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    };
    FieldPlayerStateRunning.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        Renderer.spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return FieldPlayerStateRunning;
}(State));
FieldPlayerStateRunning.instance = new FieldPlayerStateRunning();
/// <reference path="../State.ts" />
var FieldPlayerStateThrowin = (function (_super) {
    __extends(FieldPlayerStateThrowin, _super);
    function FieldPlayerStateThrowin() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    FieldPlayerStateThrowin.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateThrowin.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.position.x;
        throwin.player.position.y = throwin.position.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity = Vector3.Zero; //.multiply(0);
    };
    FieldPlayerStateThrowin.prototype.ai = function (p) {
        var game = Game.getInstance();
        var ball = game.ball;
        var pitch = game.getPitch();
        var top = pitch.top;
        var left = pitch.left;
        var right = pitch.right;
        var bottom = pitch.bottom;
        var f = p.player;
        var dy = 0;
        if (ball.position.y * f.side > 0) {
            dy = -2;
        }
        else {
            if (ball.position.y * f.side > -top / 2) {
                dy = -1;
            }
        }
        dy *= f.side;
        if (throwin.checktimer()) {
            game.throw_in(dy);
            f.ball_thrown();
            return;
        }
        f.lastspr = 2 + dy;
        if (f.pass()) {
            f.ball_thrown();
        }
    };
    FieldPlayerStateThrowin.prototype.input = function (p) {
        var game = Game.getInstance();
        var dy = 0;
        if (btn(2, p.num)) {
            dy -= 2;
        }
        if (btn(3, p.num)) {
            dy += 2;
        }
        if ((btn(0, p.num) || btn(1, p.num))) {
            dy /= 2;
        }
        p.player.lastspr = 2 + dy;
        if (btn(4, p.num)) {
            //--if (not pass(p.man)) throw_in(dy)
            game.throw_in(dy);
            p.player.ball_thrown();
        }
    };
    FieldPlayerStateThrowin.prototype.draw = function (f) {
        var game = Game.getInstance();
        var ball = game.ball;
        jersey_color(f);
        var pos = sprite_pos(f);
        f.lastflip = f.position.x > 0;
        Renderer.spr(48 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
        ball.position.x = f.position.x;
        ball.position.y = f.position.y;
        ball.position.z = 7;
        ball.velocity.z = 0;
    };
    return FieldPlayerStateThrowin;
}(State));
FieldPlayerStateThrowin.instance = new FieldPlayerStateThrowin();
/// <reference path="../State.ts" />
var Tackle = (function (_super) {
    __extends(Tackle, _super);
    function Tackle() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Tackle.getInstance = function () {
        return this.instance;
    };
    Tackle.prototype.start = function (f) {
        f.timer = 45;
        //plus_in_place(f.velocity, muls(f.dir, 3.0));
        var result = Vector2.multiply(3.0, f.dir).toVector3();
        f.velocity.add(result);
    };
    Tackle.prototype.draw = function (f) {
        var pos = sprite_pos(f);
        jersey_color(f);
        Renderer.spr(32 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    };
    Tackle.prototype.update = function (f) {
        var game = Game.getInstance();
        var teams = game.teams;
        if (f.checktimer()) {
            set_state_ok(f);
        }
        else {
            f.damp();
            //-- check collision
            for (var _i = 0, _a = teams[0].players; _i < _a.length; _i++) {
                var player = _a[_i];
                f.check_tackle(player);
            }
            for (var _b = 0, _c = teams[1].players; _b < _c.length; _b++) {
                var player = _c[_b];
                f.check_tackle(player);
            }
        }
    };
    return Tackle;
}(State));
Tackle.instance = new Tackle();
/// <reference path="../State.ts" />
var GameStateBallin = (function (_super) {
    __extends(GameStateBallin, _super);
    function GameStateBallin() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStateBallin.getInstance = function () {
        return this.instance;
    };
    GameStateBallin.prototype.init = function (game) {
        var ball = game.ball;
        ball.position.x = throwin.ballpos.x;
        ball.position.y = throwin.ballpos.y;
        // ball.velocity.multiply(0);
        ball.velocity = Vector3.Zero;
        throwin.player.set_state(throwin.type);
    };
    return GameStateBallin;
}(State));
GameStateBallin.instance = new GameStateBallin();
/// <reference path="../State.ts" />
var GameStateGoalmarked = (function (_super) {
    __extends(GameStateGoalmarked, _super);
    function GameStateGoalmarked() {
        var _this = _super.apply(this, arguments) || this;
        _this.timer = 60;
        return _this;
    }
    // this is a singleton
    GameStateGoalmarked.getInstance = function () {
        return this.instance;
    };
    GameStateGoalmarked.prototype.init = function () {
        this.timer = 60;
    };
    GameStateGoalmarked.prototype.checktimer = function () {
        this.timer -= 1;
        return this.timer < 0;
    };
    GameStateGoalmarked.prototype.update = function (game) {
        if (this.checktimer()) {
            game.setState(GameStateToKickoff.getInstance());
        }
    };
    return GameStateGoalmarked;
}(State));
GameStateGoalmarked.instance = new GameStateGoalmarked();
/// <reference path="../State.ts" />
var GameStatePlaying = (function (_super) {
    __extends(GameStatePlaying, _super);
    function GameStatePlaying() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStatePlaying.getInstance = function () {
        return this.instance;
    };
    GameStatePlaying.prototype.init = function (game) {
        game.controllingPlayers[0].isAI = (mode === 2);
        game.controllingPlayers[1].isAI = (mode > 0);
    };
    return GameStatePlaying;
}(State));
GameStatePlaying.instance = new GameStatePlaying();
/// <reference path="../State.ts" />
var GameStateToBallout = (function (_super) {
    __extends(GameStateToBallout, _super);
    function GameStateToBallout() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStateToBallout.getInstance = function () {
        return this.instance;
    };
    GameStateToBallout.prototype.update = function (game) {
        //-- todo : tout le monde se met en place
        var l = Vector3.distance(throwin.player.position, { x: throwin.position.x, y: throwin.position.y, z: 0 }) / throwin.dist;
        camtarget = Vector2.add(Vector2.multiply(1 - l, throwin.ballpos), Vector2.multiply(l, camlastpos));
        if (throwin.player.go_to(throwin.position, 2, 10)) {
            game.setState(GameStateBallin.getInstance());
        }
    };
    return GameStateToBallout;
}(State));
GameStateToBallout.instance = new GameStateToBallout();
/// <reference path="../State.ts" />
var GameStateToKickoff = (function (_super) {
    __extends(GameStateToKickoff, _super);
    function GameStateToKickoff() {
        var _this = _super.apply(this, arguments) || this;
        _this.timer = 60;
        _this.startpos = [
            { x: 0, y: 0.2 },
            { x: 0.4, y: 0.2 },
            { x: -0.4, y: 0.2 },
            { x: 0.35, y: 0.5 },
            { x: -0.35, y: 0.5 },
            { x: 0, y: 0.90 },
        ];
        return _this;
    }
    // this is a singleton
    GameStateToKickoff.getInstance = function () {
        return this.instance;
    };
    GameStateToKickoff.prototype.checktimer = function () {
        this.timer -= 1;
        return this.timer < 0;
    };
    GameStateToKickoff.prototype.init = function () {
        this.timer = 60;
        var game = Game.getInstance();
        var teams = game.teams;
        for (var _i = 0, _a = teams[0].players; _i < _a.length; _i++) {
            var player = _a[_i];
            set_state_ok(player);
        }
        for (var _b = 0, _c = teams[1].players; _b < _c.length; _b++) {
            var player = _c[_b];
            set_state_ok(player);
        }
        //-- keepers
        teams[0].players[5].set_state(KeeperStateRun.getInstance());
        teams[1].players[5].set_state(KeeperStateRun.getInstance());
    };
    GameStateToKickoff.prototype.update = function (game) {
        var pitch = game.getPitch();
        var right = pitch.right;
        var top = pitch.top;
        // -- scroll to the center of the field
        var l = Math.max(this.timer / 60, 0);
        camtarget = Vector2.multiply(l, camlastpos); //muls(camlastpos, l);
        var to_exit = game.matchtimer > game.full_time;
        // --  if (to_exit) plus_in_place(camtarget, muls({ x=fw2, y=0 }, 1 - l))
        var allok = true;
        var teams = game.teams;
        for (var _i = 0, teams_4 = teams; _i < teams_4.length; _i++) {
            var team = teams_4[_i];
            for (var _a = 0, _b = team.players; _a < _b.length; _a++) {
                var player = _b[_a];
                var i = player.startposidx;
                //--if not m.keeper then
                var dest = to_exit ? { x: 1, y: 0 } : this.startpos[i];
                //--    if 2* kickoff_team - 3 == m.side then
                if (game.idx_to_side(game.kickoff_team) === player.side && !to_exit) {
                    if (i === 1) {
                        dest = { x: 0, y: 0.01 };
                    }
                    if (i === 2 || i === 3) {
                        dest = { x: dest.x, y: 0.02 };
                    }
                }
                var ok = player.run_to(dest.x * right, dest.y * player.side * top);
                ok = ok && (player.vel < min_vel);
                allok = ok && allok;
            }
        }
        if (this.checktimer() && allok) {
            if (to_exit) {
                game.start_match(true);
            }
            else {
                //--keepers
                // set_state_ok(men[men.length - 1 - 1]);
                set_state_ok(teams[0].players[4]);
                // set_state_ok(men[men.length - 1]);
                set_state_ok(teams[1].players[4]);
                game.setState(Kickoff.getInstance());
            }
        }
    };
    return GameStateToKickoff;
}(State));
GameStateToKickoff.instance = new GameStateToKickoff();
/// <reference path="../State.ts" />
var Kickoff = (function (_super) {
    __extends(Kickoff, _super);
    function Kickoff() {
        return _super.call(this) || this;
    }
    // this is a singleton
    Kickoff.getInstance = function () {
        return this.instance;
    };
    Kickoff.prototype.init = function (game) {
        var ball = game.ball;
        //muls_in_place(ball.position, 0);
        ball.position.multiply(0);
        //muls_in_place(ball.velocity, 0);
        ball.velocity.multiply(0);
        game.scoring_team = 0;
        changing_side = false;
        var teams = game.teams;
        for (var _i = 0, teams_5 = teams; _i < teams_5.length; _i++) {
            var team = teams_5[_i];
            for (var _a = 0, _b = team.players; _a < _b.length; _a++) {
                var player = _b[_a];
                player.look_at(ball);
            }
        }
    };
    Kickoff.prototype.update = function (game) {
        //  --debug("kickoff")
        //--wait for the player to kick off
        //--he can't move just kick in the direction he wants
        game.setState(GameStatePlaying.getInstance());
        //--local p = players[kickoff_team]
        //--local dir = { x=0, y=-p.man.side }
        //-- if (btn(0, p.num)) dir.x = -fw
        //-- if (btn(1, p.num)) dir.x = fw
        //--local do_kick= btn(4, p.num)--kickoff_team)
        //-- if (p.ia or demo) do_kick = true --dir.x = rnd(1) <= 0.5 and fw or - fw
        //--look_at(p.man, dir)
        //-- if (do_kick) then
        //--kick(p)
        //--sfx(0)
        //--kickoff_team = 0
        //--ball_thrown(p.man)
        //--end
    };
    return Kickoff;
}(State));
Kickoff.instance = new Kickoff();
var GoalDown = (function (_super) {
    __extends(GoalDown, _super);
    //public y = fh2 + goalh;
    function GoalDown() {
        var _this = _super.call(this) || this;
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        return _this;
        // this.position.y = top + goalh;
    }
    GoalDown.prototype.draw = function () {
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var top = pitch.top;
        var left = pitch.left;
        var right = pitch.right;
        var bottom = pitch.bottom;
        //spr(60, goalx2, fh2, 1, 1, false, true)
        color(7);
        //rect(goalx1, -goall + top, goalx2, top)
        //clip(goalx1 - camtarget.x + 64 + 1, -goall - camtarget.y + 64 + top + 1, goalx2 - goalx1 - 1, goalh - 1)
        //for (let x = goalx1; x <= goalx2 + 7; x += 8) {
        //    for (let y = -goall; y <= goall; y += 8) {
        //        //spr(62, x, y + fh2)
        //    }
        //}
        clip();
    };
    GoalDown.prototype.drawshadow = function () {
    };
    return GoalDown;
}(BaseGameEntity));
var goal_down = new GoalDown();
var GoalKeeper = (function (_super) {
    __extends(GoalKeeper, _super);
    function GoalKeeper(p, i) {
        var _this = _super.call(this) || this;
        var game = Game.getInstance();
        var pitch = game.getPitch();
        var height = pitch.height;
        _this.startposidx = i;
        _this.side = p * 2 - 1;
        //this.teamcolors = p + 1;
        _this.state = KeeperStateOk.getInstance();
        _this.position.y = (p - 0.5) * (height - 8);
        _this.keeper = true;
        _this.teamcolors = 0;
        return _this;
    }
    GoalKeeper.prototype.draw = function () {
        this.state.draw(this);
    };
    GoalKeeper.prototype.drawshadow = function () {
        Renderer.spr(46, this.position.x - 2, this.position.y - 2);
    };
    GoalKeeper.prototype.getState = function () {
        return this.state;
    };
    GoalKeeper.prototype.set_state = function (st) {
        this.state = st;
        if (st !== null && st.start !== undefined) {
            st.start(/*fo*/ this);
        }
    };
    return GoalKeeper;
}(PlayerBase));
/// <reference path="../State.ts" />
var Goalkick = (function (_super) {
    __extends(Goalkick, _super);
    function Goalkick() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Goalkick.getInstance = function () {
        return this.instance;
    };
    Goalkick.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.position.x;
        throwin.player.position.y = throwin.position.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity.multiply(0);
    };
    Goalkick.prototype.ai = function (_p) {
        //--todo : move the player
        if (throwin.checktimer()) {
            kick_dir();
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    Goalkick.prototype.input = function (p) {
        var vel_inc = 0.2;
        if (btn(0, p.num)) {
            throwin.player.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            throwin.player.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            throwin.player.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            throwin.player.velocity.y += vel_inc;
        }
        kick_dir();
        if (btn(4, p.num)) {
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    Goalkick.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        Renderer.spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return Goalkick;
}(State));
Goalkick.instance = new Goalkick();
/// <reference path="../State.ts" />
var KeeperStateDive = (function (_super) {
    __extends(KeeperStateDive, _super);
    function KeeperStateDive() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateDive.getInstance = function () {
        return this.instance;
    };
    KeeperStateDive.prototype.draw = function (k) {
        jersey_color(k);
        var pos = sprite_pos(k);
        Renderer.spr(k.lastspr, pos.x, pos.y, 1, 1, k.velocity.x < 0);
    };
    KeeperStateDive.prototype.start = function (k) {
        k.timer = 30;
    };
    KeeperStateDive.prototype.update = function (k) {
        var game = Game.getInstance();
        k.lastspr = k.timer > 25 ? 55 : 56;
        if (k.checktimer()) {
            k.lastspr = 0;
            k.set_state(KeeperStateOk.getInstance());
            return;
        }
        if (k.touch_ball(5) && game.isPlaying()) {
            game.ball.velocity.y = 3.0 * (-k.position.y / Math.abs(k.position.y));
            game.ball.velocity.x += k.velocity.x;
            sfx(15);
            balllasttouchedside = k.side;
        }
    };
    return KeeperStateDive;
}(State));
KeeperStateDive.instance = new KeeperStateDive();
/// <reference path="../State.ts" />
/// <reference path="../math/MathHelper.ts" />
var KeeperStateOk = (function (_super) {
    __extends(KeeperStateOk, _super);
    function KeeperStateOk() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateOk.getInstance = function () {
        return this.instance;
    };
    KeeperStateOk.prototype.draw = function (k) {
        var pos = sprite_pos(k);
        var sp = pos.y < 0 ? 57 : 54;
        jersey_color(k);
        Renderer.spr(sp, pos.x, pos.y);
    };
    KeeperStateOk.prototype.update = function (k) {
        var game = Game.getInstance();
        var ball = game.ball;
        var pitch = game.getPitch();
        var top = pitch.top;
        var left = pitch.left;
        var right = pitch.right;
        var bottom = pitch.bottom;
        //-- try to stay in front of the ball
        //--dive ?
        var future = 7;
        var futureball = Vector3.add(ball.position, Vector3.multiply(future, ball.velocity));
        var goals = pitch.getGoals();
        var leftPost = goals[0].leftPost;
        var rightPost = goals[0].rightPost;
        var res = segment_intersect(ball.position, futureball, { x: leftPost.x, y: top * k.side }, { x: rightPost.x, y: top * k.side });
        if (res) {
            var divefactor = 0.99;
            var divemax = 10;
            k.velocity.x = MathHelper.clamp((res.x - k.position.x) * divefactor, -divemax, divemax);
            k.set_state(KeeperStateDive.getInstance());
            return;
        }
        else {
            var wantedx = MathHelper.clamp(ball.position.x, leftPost.x, rightPost.x);
            var mx = 1.0; // -- max move per frame
            k.position.x = MathHelper.clamp(wantedx, k.position.x - mx, k.position.x + mx);
            if (Math.abs(k.position.y) < top - 4) {
                k.position.y += k.side;
            }
        }
        if (k.touch_ball(5) && game.isPlaying()) {
            ball.velocity.y = -3.0 * k.side;
            balllasttouchedside = k.side;
        }
    };
    return KeeperStateOk;
}(State));
KeeperStateOk.instance = new KeeperStateOk();
/// <reference path="../State.ts" />
var KeeperStateRun = (function (_super) {
    __extends(KeeperStateRun, _super);
    function KeeperStateRun() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateRun.getInstance = function () {
        return this.instance;
    };
    KeeperStateRun.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        Renderer.spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return KeeperStateRun;
}(State));
KeeperStateRun.instance = new KeeperStateRun();
var Images;
(function (Images) {
    Images.ball = new Image();
    Images.ball.src = "images/ball.png";
})(Images || (Images = {}));
// THREEx.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//
/** @namespace */
var THREEx;
(function (THREEx) {
    /**
     * - NOTE: it would be quite easy to push event-driven too
     *   - microevent.js for events handling
     *   - in this._onkeyChange, generate a string from the DOM event
     *   - use this as event name
    */
    var KeyboardState = (function () {
        function KeyboardState(domElement) {
            //this.domElement = domElement || document;
            // to store the current state
            //this.keyCodes = {};
            //this.modifiers = {};
            if (domElement === void 0) { domElement = document; }
            var _this = this;
            this.domElement = domElement;
            this.keyCodes = {};
            this.modifiers = {};
            this._onBlur = function () {
                for (var prop in _this.keyCodes) {
                    _this.keyCodes[prop] = false;
                }
                for (var prop in _this.modifiers) {
                    _this.modifiers[prop] = false;
                }
            };
            /**
             * to process the keyboard dom event
            */
            this._onKeyChange = function (event) {
                // log to debug
                //console.log("onKeyChange", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
                // update this.keyCodes
                var keyCode = event.keyCode;
                var pressed = event.type === "keydown" ? true : false;
                _this.keyCodes[keyCode] = pressed;
                // update this.modifiers
                _this.modifiers["shift"] = event.shiftKey;
                _this.modifiers["ctrl"] = event.ctrlKey;
                _this.modifiers["alt"] = event.altKey;
                _this.modifiers["meta"] = event.metaKey;
            };
            // create callback to bind/unbind keyboard events
            //var _this = this;
            //this._onKeyDown = function (event) { _this._onKeyChange(event) }
            //this._onKeyUp = function (event) { _this._onKeyChange(event) }
            // bind keyEvents
            this.domElement.addEventListener("keydown", this._onKeyChange, false);
            this.domElement.addEventListener("keyup", this._onKeyChange, false);
            // create callback to bind/unbind window blur event
            //this._onBlur = () => {
            //    for (var prop in this.keyCodes)
            //        this.keyCodes[prop] = false;
            //    for (var prop in this.modifiers)
            //        this.modifiers[prop] = false;
            //}
            // bind window blur
            window.addEventListener("blur", this._onBlur, false);
        }
        /**
         * To stop listening of the keyboard events
        */
        KeyboardState.prototype.destroy = function () {
            // unbind keyEvents
            this.domElement.removeEventListener("keydown", this._onKeyChange, false);
            this.domElement.removeEventListener("keyup", this._onKeyChange, false);
            // unbind window blur event
            window.removeEventListener("blur", this._onBlur, false);
        };
        /**
         * query keyboard state to know if a key is pressed of not
         *
         * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
         * @returns {Boolean} true if the key is pressed, false otherwise
        */
        KeyboardState.prototype.pressed = function (keyDesc) {
            var keys = keyDesc.split("+");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (KeyboardState.MODIFIERS.indexOf(key) !== -1) {
                    pressed = this.modifiers[key];
                }
                else if (Object.keys(KeyboardState.ALIAS).indexOf(key) !== -1) {
                    pressed = this.keyCodes[KeyboardState.ALIAS[key]];
                }
                else {
                    pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
                }
                if (!pressed) {
                    return false;
                }
            }
            ;
            return true;
        };
        /**
         * return true if an event match a keyDesc
         * @param  {KeyboardEvent} event   keyboard event
         * @param  {String} keyDesc string description of the key
         * @return {Boolean}         true if the event match keyDesc, false otherwise
         */
        KeyboardState.prototype.eventMatches = function (event, keyDesc) {
            var aliases = KeyboardState.ALIAS;
            var aliasKeys = Object.keys(aliases);
            var keys = keyDesc.split("+");
            // log to debug
            // console.log("eventMatches", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (key === "shift") {
                    pressed = (event.shiftKey ? true : false);
                }
                else if (key === "ctrl") {
                    pressed = (event.ctrlKey ? true : false);
                }
                else if (key === "alt") {
                    pressed = (event.altKey ? true : false);
                }
                else if (key === "meta") {
                    pressed = (event.metaKey ? true : false);
                }
                else if (aliasKeys.indexOf(key) !== -1) {
                    pressed = (event.keyCode === aliases[key] ? true : false);
                }
                else if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
                    pressed = true;
                }
                if (!pressed) {
                    return false;
                }
            }
            return true;
        };
        return KeyboardState;
    }());
    KeyboardState.MODIFIERS = ["shift", "ctrl", "alt", "meta"];
    KeyboardState.ALIAS = {
        "left": 37, "up": 38, "right": 39, "down": 40,
        "space": 32, "pageup": 33, "pagedown": 34, "tab": 9, "escape": 27,
    };
    THREEx.KeyboardState = KeyboardState;
})(THREEx || (THREEx = {}));
// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code
//
/** @namespace */
var THREEx;
(function (THREEx) {
    /**
     * Update renderer and camera when the window is resized
     *
     * @param {Object} renderer the renderer to update
     * @param {Object} Camera the camera to update
    */
    function WindowResize(renderer, camera) {
        var callback = function () {
            // notify the renderer of the size change
            renderer.setSize(window.innerWidth, window.innerHeight);
            // update the camera
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        // bind the resize event
        window.addEventListener('resize', callback, false);
        // return .stop() the function to stop watching window resize
        return {
            /**
             * Stop watching window resize
            */
            stop: function () {
                window.removeEventListener('resize', callback);
            }
        };
    }
    THREEx.WindowResize = WindowResize;
})(THREEx || (THREEx = {}));
// This THREEx helper makes it easy to handle the fullscreen API
// * it hides the prefix for each browser
// * it hides the little discrepencies of the various vendor API
// * at the time of this writing (nov 2011) it is available in 
//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).
// # Code
/** @namespace */
var THREEx;
(function (THREEx) {
    var FullScreen;
    (function (FullScreen) {
        /**
         * test if it is possible to have fullscreen
         *
         * @returns {Boolean} true if fullscreen API is available, false otherwise
        */
        function available() {
            return true;
            // return this._hasWebkitFullScreen || this._hasMozFullScreen;
        }
        FullScreen.available = available;
        /**
         * test if fullscreen is currently activated
         *
         * @returns {Boolean} true if fullscreen is currently activated, false otherwise
        */
        function activated() {
            return document.webkitIsFullScreen;
        }
        FullScreen.activated = activated;
        /**
         * Request fullscreen on a given element
         * @param {DomElement} element to make fullscreen. optional. default to document.body
        */
        function request(element) {
            element = element || document.body;
            element.webkitRequestFullScreen();
        }
        FullScreen.request = request;
        /**
         * Cancel fullscreen
        */
        function cancel() {
            document.webkitCancelFullScreen();
        }
        FullScreen.cancel = cancel;
        // internal functions to know which fullscreen API implementation is available
        var _hasWebkitFullScreen = 'webkitCancelFullScreen' in document ? true : false;
        var _hasMozFullScreen = 'mozCancelFullScreen' in document ? true : false;
        /**
         * Bind a key to renderer screenshot
         * usage: THREEx.FullScreen.bindKey({ charCode : 'a'.charCodeAt(0) });
        */
        function bindKey(opts) {
            opts = opts || {};
            var charCode = opts.charCode || 'f'.charCodeAt(0);
            var dblclick = opts.dblclick !== undefined ? opts.dblclick : false;
            var element = opts.element;
            var toggle = function () {
                if (activated()) {
                    cancel();
                }
                else {
                    request(element);
                }
            };
            var onKeyPress = function (event) {
                if (event.which !== charCode)
                    return;
                toggle();
            }; //.bind(this);
            document.addEventListener('keypress', onKeyPress, false);
            dblclick && document.addEventListener('dblclick', toggle, false);
            return {
                unbind: function () {
                    document.removeEventListener('keypress', onKeyPress, false);
                    dblclick && document.removeEventListener('dblclick', toggle, false);
                }
            };
        }
        FullScreen.bindKey = bindKey;
    })(FullScreen = THREEx.FullScreen || (THREEx.FullScreen = {}));
})(THREEx || (THREEx = {}));
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
var Main;
(function (Main) {
    // standard global variables
    var container;
    var scene;
    var camera;
    var renderer;
    //var stats: Stats;
    var keyboard = new THREEx.KeyboardState();
    var clock = new THREE.Clock();
    // custom global variables
    var boomer; // animators
    var man;
    var controls;
    // FUNCTIONS
    function init() {
        // SCENE
        scene = new THREE.Scene();
        // CAMERA
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 90;
        var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        var NEAR = 0.1;
        var FAR = 1000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.z = SCREEN_HEIGHT / 2; //set(0, 150, 400);
        camera.lookAt(scene.position);
        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container = document.getElementById('ThreeJS');
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
        var pitch = new _SoccerPitch(scene);
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
    Main.init = init;
    function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }
    Main.animate = animate;
    function update() {
        var delta = clock.getDelta();
        boomer.update(1000 * delta);
        man.update(1000 * delta);
        if (keyboard.pressed("z")) {
        }
        controls.update();
        // stats.update();
        man.quaternion(camera.quaternion);
    }
    function render() {
        renderer.render(scene, camera);
    }
})(Main || (Main = {}));
Main.init();
Main.animate();
var Renderer;
(function (Renderer) {
    var offsetX = 0;
    var offsetY = 0;
    var canvas;
    var context;
    function initialize() {
        canvas = document.getElementById("canvas");
        canvas.width = 128;
        canvas.height = 128;
        context = canvas.getContext("2d");
    }
    Renderer.initialize = initialize;
    function _print(_str, _x, _y, _col) {
    }
    Renderer._print = _print;
    function print_outlined(t, x, y, c, oc) {
        for (var i = x - 1; i <= x + 1; ++i) {
            for (var j = y - 1; j <= y + 1; ++j) {
                _print(t, i, j, oc);
            }
        }
        _print(t, x, y, c);
    }
    Renderer.print_outlined = print_outlined;
    function spr(n, x, y, _w, _h, _flip_x, _flip_y) {
        if (_w === void 0) { _w = 0; }
        if (_h === void 0) { _h = 0; }
        if (_flip_x === void 0) { _flip_x = false; }
        if (_flip_y === void 0) { _flip_y = false; }
        switch (n) {
            case 45:
                rectfill(x, y, x + 8, y + 8, 6);
                break;
            case 46:
                rectfill(x, y, x + 8, y + 8, 6);
                break;
            default:
                rectfill(x, y, x + 8, y + 8, 7);
                break;
        }
    }
    Renderer.spr = spr;
    function camera(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        offsetX = x;
        offsetY = y;
    }
    Renderer.camera = camera;
    function palt(_col, _t) {
        if (_col === void 0) { _col = 0; }
        if (_t === void 0) { _t = false; }
    }
    Renderer.palt = palt;
    function line(x0, y0, x1, y1, _col) {
        if (_col === void 0) { _col = 0; }
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;
        if (context) {
            context.save();
            //新しいパスを開始する
            context.beginPath();
            //パスの開始座標を指定する
            context.moveTo(x0, y0);
            //座標を指定してラインを引いていく
            context.lineTo(x1, y1);
            //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
            context.closePath();
            //現在のパスを輪郭表示する
            context.stroke();
            context.restore();
        }
    }
    Renderer.line = line;
    function rect(x0, y0, x1, y1, _col) {
        if (x0 === void 0) { x0 = 0; }
        if (y0 === void 0) { y0 = 0; }
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (_col === void 0) { _col = 0; }
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;
        if (context) {
            context.save();
            context.strokeRect(x0, y0, x1 - x0, y1 - y0);
            context.restore();
        }
    }
    Renderer.rect = rect;
    function rectfill(x0, y0, x1, y1, col) {
        if (x0 === void 0) { x0 = 0; }
        if (y0 === void 0) { y0 = 0; }
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        x0 -= offsetX;
        x1 -= offsetX;
        y0 -= offsetY;
        y1 -= offsetY;
        if (context) {
            context.save();
            switch (col) {
                case 3:
                    context.fillStyle = 'green';
                    break;
                case 4:
                    context.fillStyle = 'red';
                    break;
                case 6:
                    context.fillStyle = "gray";
                    break;
                case 7:
                    context.fillStyle = 'white';
                    break;
                default:
                    break;
            }
            context.fillRect(x0, y0, x1 - x0, y1 - y0);
            context.restore();
        }
    }
    Renderer.rectfill = rectfill;
    function drawImage(image, _offsetX, _offsetY, _width, _height, _canvasOffsetX, _canvasOffsetY, _canvasImageWidth, _canvasImageHeight) {
        _offsetX -= offsetX;
        _offsetY -= offsetY;
        // y0 -= offsetY;
        // y1 -= offsetY;
        if (context) {
            context.save();
            //context.drawImage(image, _offsetX, _offsetY, 7, 7);//, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight);
            context.drawImage(image, 0, 0, 7, 7, _offsetX, _offsetY, 7, 7);
            context.restore();
        }
    }
    Renderer.drawImage = drawImage;
})(Renderer || (Renderer = {}));
/// <reference path="./SoccerTeam.ts" />
var Throwin = (function () {
    function Throwin() {
        this.position = new Vector2();
        this.ballpos = new Vector2();
        this.timer = 10;
        this.balld = new Vector2();
        this.kickmax = 0;
        this.dist = 0;
    }
    Throwin.prototype.checktimer = function () {
        this.timer -= 1;
        return this.timer < 0;
    };
    Throwin.prototype.init_throwin = function (t, p, v, m) {
        var game = Game.getInstance();
        var ball = game.ball;
        this.type = t;
        this.kickmax = m;
        this.side = -balllasttouchedside;
        this.ballpos = p;
        if (ball.position.x < 0) {
            this.ballpos.x *= -1;
        }
        if (ball.position.y < 0) {
            this.ballpos.y *= -1;
        }
        //throwin.pos = mulv(throwin.ballpos, v);
        this.position.x = this.ballpos.x * v.x;
        this.position.y = this.ballpos.y * v.y;
        var idx = game.side_to_idx(this.side);
        if (t === Goalkick.getInstance()) {
            // this.player = men[men.length + idx - 2]; //keeper
            var teams = game.teams;
            this.player = teams[idx].players[5];
            this.player.set_state(KeeperStateRun.getInstance());
        }
        else {
            this.player = game.controllingPlayers[idx].player;
        }
        this.dist = Vector3.distance({ x: this.position.x, y: this.position.y, z: 0 }, this.player.position);
        camlastpos = camtarget.clone(); //copy(camtarget);
        game.setState(GameStateToBallout.getInstance());
        sfx(0);
    };
    return Throwin;
}());
var throwin = new Throwin();
/// <reference path="./math/MathHelper.ts" />
/// <reference path="./math/Vector2.ts" />
/// <reference path="./State.ts" />
/// <reference path="./FieldPlayer.ts" />
/// <reference path="./GoalKeeper.ts" />
/// <reference path="./SoccerBall.ts" />
/// <reference path="./ControllingPlayer.ts" />
/// <reference path="./Game.ts" />
/// <reference path="./GameStates/GameStatePlaying.ts" />
/// <reference path="./GameStates/Kickoff.ts" />
/// <reference path="./GameStates/GameStateToKickoff.ts" />
/// <reference path="./GameStates/GameStateBallin.ts" />
/// <reference path="./GameStates/GameStateToBallout.ts" />
/// <reference path="./GameStates/GameStateGoalmarked.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateOk.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateDive.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateRun.ts" />
/// <reference path="./FieldPlayerStates/Tackle.ts" />
/// <reference path="./FieldPlayerStates/Down.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateOK.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateRunning.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateThrowin.ts" />
/// <reference path="./FieldPlayerStates/CornerKick.ts" />
/// <reference path="./Throwin.ts" />
/// <reference path="./SoccerTeam.ts" />
function btn(_i, _p) {
    return true;
}
function btnp(_i, _p) {
    return true;
}
function sfx(_n) {
}
function clip(_x, _y, _w, _h) {
    if (_x === void 0) { _x = 0; }
    if (_y === void 0) { _y = 0; }
    if (_w === void 0) { _w = 0; }
    if (_h === void 0) { _h = 0; }
}
function pal(_c0, _c1, _p) {
    if (_c0 === void 0) { _c0 = 0; }
    if (_c1 === void 0) { _c1 = 0; }
    if (_p === void 0) { _p = 0; }
}
function color(_col) {
    if (_col === void 0) { _col = 0; }
}
function circ(_x, _y, _r, _col) {
    if (_x === void 0) { _x = 0; }
    if (_y === void 0) { _y = 0; }
    if (_r === void 0) { _r = 0; }
    if (_col === void 0) { _col = 0; }
}
function music(_n, _a, _b) {
    if (_n === void 0) { _n = 0; }
    if (_a === void 0) { _a = 0; }
    if (_b === void 0) { _b = 0; }
}
// succer
// by rylauchelmi
var menu_offset = 128;
var menu_inc = 1;
var timer = 10;
var blink = false;
var mode = 1;
var max_val = 32767;
var cos22_5 = 0.9239;
var sin22_5 = 0.3827;
// const fh = 384;
// const fw = 256;
// const fh2 = fh / 2;
// const fw2 = fw / 2;
var penaltyw2 = 64;
var fh2_penaltyh = Game.getInstance().getPitch().top - 60;
// let goalw = 60;
// let goalh = 20;
// let goall = 10;
// let goalx2 = goalw / 2;
// let goalx1 = -goalx2;
var border = 20;
var teamcolors = [0, 1, 5];
//let teamcolors[0] = 0
var shirtcolors = [[1, 2], [8, 2], [9, 8], [10, 9], [11, 3], [12, 1], [13, 5], [6, 13], [7, 6], [15, 14]];
//let shirtcolors[0] = { 1,2}
var skincolors = [[4, 5, 0], [15, 14, 4], [15, 14, 4], [15, 14, 9]];
var max_kick = 20;
var dribbledist = 4;
var camtarget = new Vector2(/*fw2*/ Game.getInstance().getPitch().right, 0);
var min_vel = 0.1;
var ball_dist_thres = 64;
var Menu = (function () {
    function Menu() {
        this.timer = 10;
    }
    Menu.prototype.checktimer = function () {
        this.timer -= 1;
        return this.timer < 0;
    };
    return Menu;
}());
var menu = new Menu(); // { timer: 10 };
//function dist_manh(a: IVector2, b: IVector2) {
//    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
//}
function draw_marker(f) {
    var sp = 29;
    if (f.can_kick()) {
        sp = 30;
    }
    if (f.hasball) {
        sp = 31;
    }
    Renderer.spr(sp, f.position.x - 4, f.position.y - 6);
}
function jersey_color(f) {
    var shirt = shirtcolors[teamcolors[f.teamcolors]];
    pal(8, shirt[0]);
    pal(2, shirt[1]);
    pal(4, skincolors[f.skin][2]);
    pal(14, skincolors[f.skin][1]);
    pal(15, skincolors[f.skin][0]);
}
function spr_from_dir(f) {
    f.lastflip = true;
    var fdirx = f.dir.x;
    var fdiry = f.dir.y;
    if (fdirx < -cos22_5) {
        f.lastspr = 2;
    }
    else {
        if (fdirx < -sin22_5) {
            if (fdiry < 0) {
                f.lastspr = 1;
            }
            else {
                f.lastspr = 3;
            }
        }
        else {
            f.lastflip = false;
            if (fdirx < sin22_5) {
                if (fdiry < 0) {
                    f.lastspr = 0;
                }
                else {
                    f.lastspr = 4;
                }
            }
            else {
                if (fdirx < cos22_5) {
                    if (fdiry < 0) {
                        f.lastspr = 1;
                    }
                    else {
                        f.lastspr = 3;
                    }
                }
                else {
                    f.lastspr = 2;
                }
            }
        }
    }
}
function sprite_pos(f) {
    return { x: f.position.x - f.w, y: f.position.y - f.h };
}
var balllasttouchedside = 0;
var dribble = new Vector2(); // { x: 0, y: 0 };
var dribblen = 0;
//function checktimer(a: { timer: number }) {
//    a.timer -= 1;
//    return a.timer < 0;
//}
function segment_intersect(a1, a2, b1, b2) {
    var ax = a2.x - a1.x;
    var ay = a2.y - a1.y;
    var bx = b2.x - b1.x;
    var by = b2.y - b1.y;
    var a1x = a1.x - b1.x;
    var den = ax * by - ay * bx;
    if (den === 0) {
        return null;
    }
    var a1y = a1.y - b1.y;
    var r = (a1y * bx - a1x * by) / den;
    var s = (a1y * ax - a1x * ay) / den;
    // if 0<= r <= 1 & 0 <= s <= 1, intersection exists
    if (r < 0 || 1 < r || s < 0 || 1 < s) {
        return null;
    }
    return {
        x: a1.x + r * ax,
        y: a1.y + r * ay
    };
}
var ballsfxtime = 0;
function ballsfx() {
    if (ballsfxtime <= 0) {
        sfx(5);
        ballsfxtime = 7;
    }
}
function update_cam() {
    var game = Game.getInstance();
    var ball = game.ball;
    var pitch = game.getPitch();
    var right = pitch.right;
    var top = pitch.top;
    if (game.isPlaying()) {
        camtarget = ball.position.toVector2();
    }
    var bx = right + border - 64;
    var by = top + border - 64;
    camtarget.x = Math.floor(MathHelper.clamp(camtarget.x, -bx, bx));
    camtarget.y = Math.floor(MathHelper.clamp(camtarget.y, -by, by));
}
function bubble_sort(t) {
    var len = t.length;
    var active = true;
    //let tmp = nil
    while (active) {
        active = false;
        for (var i = 0; i < len - 1; ++i) {
            if (t[i + 1].position.y < t[i].position.y) {
                var tmp = t[i];
                t[i] = t[i + 1];
                t[i + 1] = tmp;
                active = true;
            }
        }
    }
}
var camlastpos;
function print_mode(m, t) {
    if (m === mode) {
        Renderer.print_outlined(t, 32 - menu_offset, 75, 6, 5);
    }
}
function set_state_ok(f) {
    if (f.keeper) {
        f.set_state(KeeperStateOk.getInstance());
    }
    else {
        f.set_state(FieldPlayerStateOK.getInstance());
    }
}
function kick_dir() {
    var game = Game.getInstance();
    var ball = game.ball;
    //let toBall = 
    throwin.balld = Vector2.multiply(0.25, { x: throwin.ballpos.x - throwin.player.position.x, y: throwin.ballpos.y - throwin.player.position.y });
    //clampvec_getlen(throwin.balld, throwin.kickmax);
    throwin.balld.clamp(throwin.kickmax);
    throwin.player.look_at(ball);
}
var changing_side;
function changeshirt(i) {
    teamcolors[i] += 1;
    if (teamcolors[i] >= shirtcolors.length) {
        teamcolors[i] = 1;
    }
    if (teamcolors[i] === teamcolors[3 - i]) {
        teamcolors[i] += 1;
    }
}
function draw_button(s, x, y) {
    Renderer.spr(64 + s, x - menu_offset, y + (btnp(s) ? 1 : 0));
}
//# sourceMappingURL=succer.js.map