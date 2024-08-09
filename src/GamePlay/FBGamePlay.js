"use strict";

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var WorldScale = 32;
var FBGamePlayLayerRef = null;

var FBGamePlayLayer = FBBaseLayer.extend({
    bird: null,
    bgImage: null,
    bgImage2: null,
    botPipes: [],
    topPipes: [],
    humanObstacle: [],
    world: null,
    isGamePause: true,
    countDown: 3,
    startLabel: null,
    pipeScrollingSpeed: null,
    obstacle: null,
    obstacleSpeed: null,
    questionArray: [],
    questionCounter: 0,
    userAnswerArray: [],
    userCorrectAnswerArray: [],
    resumeLabel: null,
    tip: null,
    tips: [],
    userAnswer: null,
    moveTimeForPipe: 7,
    obstacleMoveTime: 6,
    distanceTravelByPipes: null,
    // pipeGeneratorUpdateStatus   :   false,
    touchPreventButton: null,
    birdID: null,
    bgLayer: null,
    upSkyLine: null,
    upSkyLine2: null,
    downSkyLine: null,
    downSkyLine2: null,
    hudLayer: null,
    initialCloudArray: [],
    isDataAvailableInServer: true,
    pageNumber: 0,
    multiplier: 0,
    moveTimeForTip: 7,
    physicsBodyCount: 0,

    InitialCloudsPositions: [], //[cc.p(cc.winSize.width * 1.2, cc.winSize.height * 0.6), cc.p(cc.winSize.width * 1.4, cc.winSize.height * 0.75), cc.p(cc.winSize.width * 1.8, cc.winSize.height * 0.7), cc.p(cc.winSize.width * 2.0, cc.winSize.height * 0.775), cc.p(cc.winSize.width * 1.6, cc.winSize.height * 0.65), cc.p(cc.winSize.width * 2.4, cc.winSize.height * 0.74)],

    ctor: function ctor(birdID) {
        this._super();
        this.birdID = birdID;
        var birdDetail = Utility.getCharacterDetail(birdID);
        this.multiplier = birdDetail.multiplier;
        this.loadAsset(birdDetail.characterPlist, birdDetail.characterSpriteSheetPng);
        this.loadAsset(res.Cloud_SpriteSheet_Plist, res.Cloud_SpriteSheet_Png);
        this.loadAsset(birdDetail.gamePlayCharacterPlist, birdDetail.gamePlayCharacterPng);
        this.startLabel = this.createLabel(this, this.countDown.toString(), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 100, cc.p(winsize.width * 0.54, winsize.height * 0.5), TAG_COUNDOWNLABEL, cc.color.WHITE);
        this.startLabel.setLocalZOrder(20);
        var contentSize = this.getContentSize();

        this.InitialCloudsPositions = [cc.p(contentSize.width * 1.2, contentSize.height * 0.6), cc.p(contentSize.width * 1.4, contentSize.height * 0.75), cc.p(contentSize.width * 1.8, contentSize.height * 0.7), cc.p(contentSize.width * 2.0, contentSize.height * 0.775), cc.p(contentSize.width * 1.6, contentSize.height * 0.65), cc.p(contentSize.width * 2.4, contentSize.height * 0.74)];
    },

    onEnter: function onEnter() {
        this._super();
        FBGamePlayLayerRef = this;
        FBGameState.setPreviousHighScore(FBGameState.getHigScore());
        this.setUpWorld();

        // this.drawCanvas();
        // this.onDebugDrawMask();

        this.pageNumber = 0;
        this.userAnswerArray.length = 0;
        this.questionArray.length = 0;
        this.userCorrectAnswerArray.length = 0;
        this.botPipes.length = 0;
        this.topPipes.length = 0;
        this.humanObstacle.length = 0;
        this.tips.length = 0;

        FBGamePlayLayerRef.isDataAvailableInServer = true;
        this.getTipFromServer();
        this.setUpUI();
        this.addKeyboardEventListener();
        this.addMouseListener();
        this.addContactListener();
        this.addSound();
        this.inflateHumanObstacle();

        Utility.sendGoogleEvent("GameScene", "Started", FBGameState.getUTMToken());
    },

    onExit: function onExit() {
        this._super();
        FBGamePlayLayerRef = null;
    },

    //-------- set up world -------------
    setUpWorld: function setUpWorld() {
        var gravity = new b2Vec2(0, 0);
        this.world = new Box2D.Dynamics.b2World(gravity, false);
    },

    ////////////----- canvas -----------------
    drawCanvas: function drawCanvas() {
        var gameCanvas = document.getElementById("gameCanvas");
        var gameContainer = document.getElementById("Cocos2dGameContainer");
        var testCanvas = document.createElement("canvas");
        testCanvas.id = 'debugDrawCanvas';
        testCanvas.height = gameCanvas.height;
        testCanvas.width = gameCanvas.width;
        testCanvas.style.height = gameCanvas.style.height;
        testCanvas.style.width = gameCanvas.style.width;
        testCanvas.style.position = "absolute";
        testCanvas.style.outline = "none";
        testCanvas.style.left = "20px";
        testCanvas.style.top = gameContainer.style.paddingTop;
        testCanvas.style["-webkit-transform"] = "rotate(180deg) scale(-1, 1)";
        testCanvas.style["pointer-events"] = "none";
        testCanvas.style.border = " 5px solid #d0cdff";
        gameContainer.appendChild(testCanvas);
    },

    update: function update(dt) {
        this.world.Step(dt, 8, 3);
        // this.world.DrawDebugData();
        this.bird.velocityInY -= this.bird.fallingSpeed;
        this.bird.flyDistance += this.bird.flySpeed;
        this.setInfiniteBackground(dt);
        if (!this.isGamePause) {
            // call of every update method
            this.bird.birdUpdate(dt);

            /// delete bodies and pipes
            // this.clearPipes();
            // this.clearObstacles();
            // this.clearTips();
        }

        // update body positions
        for (var object = this.world.GetBodyList(); object; object = object.GetNext()) {
            this.physicsBodyCount++;
            if (object.GetUserData() == null) {
                this.world.DestroyBody(object);
            } else {
                var mySprite = object.GetUserData().asset;
                if (object.GetUserData().bodyType == TYPE_TOP_PIPE) {
                    object.SetPosition(cc.p(mySprite.getPosition().x / WorldScale, (mySprite.getPosition().y + mySprite.getContentSize().height * 0.5) / WorldScale));
                } else if (object.GetUserData().bodyType == TYPE_BOTTOM_PIPE) {
                    object.SetPosition(cc.p(mySprite.getPosition().x / WorldScale, (mySprite.getPosition().y - mySprite.getContentSize().height * 0.5) / WorldScale));
                } else {
                    object.SetPosition(cc.p(mySprite.getPosition().x / WorldScale, mySprite.getPositionY() / WorldScale));
                    object.SetAngle(0);
                }
            }
        }

        this.physicsBodyCount = 0;
    },

    /// method to add humanBody obstacles in game play

    inflateHumanObstacle: function inflateHumanObstacle() {
        for (var i = 1; i <= 5; i++) {
            var fileName = StringConstants.HUMAN_PNG_PATH + i + ExtentionPng;
            this.obstacle = new FBHumanObstacles(fileName, cc.p(-winsize.width * 0.25, 0), this.world, i);
            this.addChild(this.obstacle, 15);
            this.humanObstacle.push(this.obstacle);
        }
    },
    addObstacle: function addObstacle() {

        var obstaclePosInY = Math.floor(Math.random() * winsize.height * 0.75 + winsize.height * 0.25);
        var indexPooledObstacle = this.getHumanObstacleFromPooledArray();

        if (this.humanObstacle.length > 0 && indexPooledObstacle >= 0) {
            this.obstacle = this.humanObstacle[indexPooledObstacle];
            this.obstacle.setPosition(cc.p(winsize.width * 1.5, obstaclePosInY));
        } else {
            var humanCount = Math.floor(Math.random() * 4 + 1);
            var humanPng = StringConstants.HUMAN_PNG_PATH + humanCount + ExtentionPng;
            this.obstacle = new FBHumanObstacles(humanPng, cc.p(winsize.width * 1.5, obstaclePosInY), this.world, humanCount);
            this.addChild(this.obstacle, 15);
            this.humanObstacle.push(this.obstacle);
        }
        var distance = Math.abs(this.obstacle.getPositionX() - -winsize.width * .1);
        this.obstacleSpeed = distance / this.obstacleMoveTime;
        this.obstacle.runAction(new cc.MoveTo(this.obstacleMoveTime, cc.p(-(winsize.width * 0.1), this.obstacle.getPositionY())));
    },

    /// Method to clear humanBody obstacles when they reached out of screen.
    clearObstacles: function clearObstacles() {
        /*for (var obstacle = 0; obstacle < this.humanObstacle.length; obstacle++) {
            if (this.humanObstacle[obstacle].getPositionX() < (-winsize.width * 0.03)) {
                var humanObstacle = this.humanObstacle.splice(obstacle, 1);
                this.world.DestroyBody(humanObstacle[0].body);
                this.removeChild(humanObstacle[0]);
                obstacle--;
            }
        }*/

    },

    /// Method to add Tips in game play.
    addTips: function addTips() {
        if (this.questionArray.length > 0) {
            var tipPosInY = Math.floor(Math.random() * winsize.height * 0.5 + winsize.height * 0.25);
            if (this.tip != null && this.tip.getPositionX() <= -winsize.width * 0.029) {
                this.tip.stopAllActions();
                this.tip.setPosition(cc.p(winsize.width * 1.5, tipPosInY));
            } else {
                this.tip = new FBTips(res.Tip_Png, cc.p(winsize.width * 1.5, tipPosInY), this.world);
                this.addChild(this.tip, 15);
                this.tips.push(this.tip);
            }
            this.tip.runAction(new cc.MoveTo(this.moveTimeForTip, cc.p(-(winsize.width * 0.1), this.tip.getPositionY())));
        }
    },

    /// Method to clear tips in game play when it goes outside of the screen
    clearTips: function clearTips() {
        /*for (var tip = 0; tip < this.tips.length; tip++) {
            if (this.tips[tip].getPositionX() < (-winsize.width * 0.03)) {
                var tipObstacle = this.tips.splice(tip, 1);
                this.world.DestroyBody(tipObstacle[0].body);
                this.removeChild(tipObstacle[0]);
                tip--;
            }
        }
        */
    },

    ///------------ debug draw -----------------//
    onDebugDrawMask: function onDebugDrawMask() {
        var scale = WorldScale * cc.EGLView._getInstance().getViewPortRect().width / cc.EGLView._getInstance().getDesignResolutionSize().width;
        var debugDraw = new Box2D.Dynamics.b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("debugDrawCanvas").getContext("2d"));
        debugDraw.SetDrawScale(scale);
        debugDraw.SetFillAlpha(1.3);
        debugDraw.SetLineThickness(0.5);
        debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit | Box2D.Dynamics.b2DebugDraw.e_edgeShape);
        this.world.SetDebugDraw(debugDraw);
    },

    ////--------- setUpUI ------------------//
    setUpUI: function setUpUI() {
        var _this = this;

        var groundSprite = this.createSprite(this, res.GroundTransparent_Png, cc.p(winsize.width * 0.5, 0), cc.p(0.5, 0.5), 2);
        var ground = FBPhysicsBody.addBody(groundSprite.getPositionX(), groundSprite.getPositionY(), false, groundSprite, TYPE_GROUND, this.world);
        FBPhysicsBody.addRectangularShape(ground, groundSprite.getContentSize().width * 0.5, groundSprite.getContentSize().height * 0.15);
        FBPhysicsBody.setCategoryBits(ground, 0x0032);
        FBPhysicsBody.setMaskBits(ground, 0x0002);

        this.addBackgrounds();

        this.bird = new FBBird(this.birdID, cc.p(winsize.width * 0.25, winsize.height * 0.5), this.world);
        VERTICAL_DISTANCE = this.bird.getContentSize().height * this.bird.getScale() * this.multiplier;

        this.addChild(this.bird, 15);
        this.bird.runAnimation();

        /// scheduler called

        this.scheduleUpdate();

        this.hudLayer = new FBHUDLayer();
        this.addChild(this.hudLayer, 16);

        if (FBGameState.getGameState() == GameState.initial) {
            this.runAction(new cc.Repeat(new cc.Sequence(new cc.DelayTime(1), new cc.CallFunc(function () {
                _this.countDown--;
                _this.startLabel.setString(_this.countDown >= 0 ? _this.countDown.toString() : StringConstants.TAP_TO_START_TEXT);
                _this.countDown = _this.countDown < 0 ? -1 : _this.countDown;
            }, this)), 5));
        }
    },

    /////--------- generate bottom and top pipes at random position
    createPipes: function createPipes() {
        var pipePosY = Math.floor(Math.random() * winsize.height * 0.533 + winsize.height * 0.06);
        HORIZONTAL_DISTANCE = winsize.width * 0.1;
        var bottomPipePosition = cc.p(winsize.width + HORIZONTAL_DISTANCE, pipePosY);
        var topPipePosition = cc.p(bottomPipePosition.x, bottomPipePosition.y + VERTICAL_DISTANCE);
        var indexPipePooled = this.getPipeFromPooledArray();
        // console.log("Index for pooled pipes ",indexPipePooled );
        if (this.botPipes.length > 0 && this.topPipes.length > 0 && indexPipePooled >= 0) {
            // console.log("Bottom Pipe");
            var pipeBottom = this.botPipes[indexPipePooled];
            pipeBottom.setPosition(bottomPipePosition);
            pipeBottom.stopPipeAction();
            this.distanceTravelByPipes = Math.abs(bottomPipePosition.x - -pipeBottom.getContentSize().width);
            pipeBottom.runAction(new cc.Sequence(new cc.MoveTo(this.moveTimeForPipe, -pipeBottom.getContentSize().width, pipeBottom.getPosition().y)));

            // console.log("Top Pipe");
            var pipeTop = this.topPipes[indexPipePooled];
            pipeTop.stopPipeAction();
            pipeTop.setPosition(topPipePosition);
            this.distanceTravelByPipes = Math.abs(topPipePosition.x - -pipeTop.getContentSize().width);
            pipeTop.runAction(new cc.Sequence(new cc.MoveTo(this.moveTimeForPipe, -pipeTop.getContentSize().width, pipeTop.getPosition().y)));
        } else {
            var bottomPipe = this.addPipe(res.Building_Png, bottomPipePosition, cc.p(0.5, 1), TYPE_BOTTOM_PIPE);
            bottomPipe.setLocalZOrder(11);
            this.botPipes.push(bottomPipe);
            var topPipe = this.addPipe(res.Building_Png, topPipePosition, cc.p(0.5, 0), TYPE_TOP_PIPE);
            topPipe.setFlippedY(true);
            topPipe.setLocalZOrder(11);
            this.topPipes.push(topPipe);

            HORIZONTAL_DISTANCE = winsize.width * 0.25;
        }
    },

    getPipeFromPooledArray: function getPipeFromPooledArray() {
        for (var i = 0; i < this.botPipes.length; i++) {
            if (this.botPipes[i].getPositionX() <= -(this.botPipes[i].getContentSize().width * 0.98)) {
                return i;
            }
        }
        return -1;
    },

    getHumanObstacleFromPooledArray: function getHumanObstacleFromPooledArray() {
        for (var i = 0; i < this.humanObstacle.length; i++) {
            if (this.humanObstacle[i].getPositionX() <= -winsize.width * 0.03) {
                return i;
            }
        }
        return -1;
    },

    ///---- add a pipe
    addPipe: function addPipe(imageName, position, anchorPoint, type) {
        var pipe = new FBPipe(imageName, position, type, this.world);
        pipe.setAnchorPoint(anchorPoint);
        this.addChild(pipe, 2);

        this.distanceTravelByPipes = Math.abs(position.x - -pipe.getContentSize().width);
        pipe.runAction(new cc.Sequence(new cc.MoveTo(this.moveTimeForPipe, -pipe.getContentSize().width, pipe.getPosition().y)));

        return pipe;
    },

    //// clear pipes from game
    clearPipes: function clearPipes() {
        /*for (var pipe = 0; pipe < this.botPipes.length; pipe++) {
            if ((this.botPipes[pipe].getPositionX() <= -(this.botPipes[pipe].getContentSize().width * 0.98))) {
                var bottomPipe = this.botPipes.splice(pipe, 1);
                var topPipe = this.topPipes.splice(pipe, 1);
                this.world.DestroyBody(bottomPipe[0].body);
                this.world.DestroyBody(topPipe[0].body);
                this.removeChild(topPipe[0]);
                this.removeChild(bottomPipe[0]);
                pipe--;
            }
        }*/
    },

    ///---------- listeners ------------
    addKeyboardEventListener: function addKeyboardEventListener() {
        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function onKeyPressed(key, event) {
                    switch (key) {
                        case cc.KEY.space:
                            FBGamePlayLayerRef.resumeGame(); // resume game initialy.
                            FBGamePlayLayerRef.bird.velocityInY = FBGamePlayLayerRef.bird.jumpDistance; // jump
                            FBGamePlayLayerRef.bird.setRotation(0);
                            break;
                    }
                }
            }, this);
        }
    },

    addMouseListener: function addMouseListener() {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touch, event) {
                FBGamePlayLayerRef.resumeGame();
                // resume game initialy.
                FBGamePlayLayerRef.bird.velocityInY = FBGamePlayLayerRef.bird.jumpDistance; // jump
                FBGamePlayLayerRef.bird.setRotation(0);
            }
        }, this);
    },

    //// contact listener for collision detection
    addContactListener: function addContactListener() {
        var listener = new Box2D.Dynamics.b2ContactListener();
        listener.BeginContact = function (contact) {
            var bodyA = contact.GetFixtureA().GetBody();
            var bodyB = contact.GetFixtureB().GetBody();
            if (bodyA && bodyB) {
                var userDataA = bodyA.GetUserData();
                var userDataB = bodyB.GetUserData();

                if (userDataA && userDataB) {
                    if (userDataA.bodyType == TYPE_TOP_PIPE && userDataB.bodyType == TYPE_BIRD || userDataA.bodyType == TYPE_BIRD && userDataB.bodyType == TYPE_TOP_PIPE) {
                        FBGamePlayLayerRef.stopGame();
                    } else if (userDataA.bodyType == TYPE_BIRD && userDataB.bodyType == TYPE_BOTTOM_PIPE || userDataA.bodyType == TYPE_BOTTOM_PIPE && userDataB.bodyType == TYPE_BIRD) {
                        FBGamePlayLayerRef.stopGame();
                    } else if (userDataA.bodyType == TYPE_BIRD && userDataB.bodyType == TYPE_GROUND || userDataA.bodyType == TYPE_GROUND && userDataB.bodyType == TYPE_BIRD) {
                        FBGamePlayLayerRef.stopGame();
                    } else if (userDataA.bodyType == HUMAN_OBSTACLES && userDataB.bodyType == TYPE_BIRD || userDataA.bodyType == TYPE_BIRD && userDataB.bodyType == HUMAN_OBSTACLES) {
                        FBGamePlayLayerRef.stopGame();
                    } else if (userDataA.bodyType == TYPE_TIP && userDataB.bodyType == TYPE_BIRD || userDataA.bodyType == TYPE_BIRD && userDataB.bodyType == TYPE_TIP) {
                        var obstacleBody = userDataA.bodyType == TYPE_TIP ? bodyA : bodyB;
                        obstacleBody.GetUserData().asset.removeFromParent(true);
                        obstacleBody.SetUserData(null);
                        FBGamePlayLayerRef.showQuestionAlert();
                    }
                }
            }
        };
        listener.EndContact = function (contact) {};
        this.world.SetContactListener(listener);
    },

    addSound: function addSound() {
        SoundManager.playMusic(res.GamePlaySound, true);
    },

    //// start game after countdown
    resumeGame: function resumeGame() {
        if (this.countDown < 0) {
            if (this.isGamePause) {
                this.addHurdles(); /// to add hurdels in game ( buildings, tips, humanObstacle)
                this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(SCORE_INCREMENT_TIMER), new cc.CallFunc(this.hudLayer.updateScore, this.hudLayer))));
            }
            this.isGamePause = false;
            this.removeChild(this.getChildByTag(TAG_COUNDOWNLABEL));
            SoundManager.playSound(res.BirdFlapSound);
        }
    },

    ///// method is used to add hurdles (buildings, , tips, humanObstacle))
    addHurdles: function addHurdles() {

        // create pipes call
        this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.CallFunc(this.createPipes, this), new cc.DelayTime(PIPE_GENERATE_TIMER))));
        //  humanObstacles added here
        this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(OBSTACLE_GENERATE_TIMER), new cc.CallFunc(this.addObstacle, this))));
        if (this.questionArray.length > 0) {
            this.showTips();
        }
    },

    /// speedUP obstacle
    speedUpObstacle: function speedUpObstacle() {
        // OBSTACLE_GENERATE_TIMER = (OBSTACLE_GENERATE_TIMER <= 4) ? 4 : OBSTACLE_GENERATE_TIMER--;
        // PIPE_GENERATE_TIMER = (PIPE_GENERATE_TIMER <= 1.5)? 1.5 : PIPE_GENERATE_TIMER - 2.5 * 0.126 ;
        this.moveTimeForPipe = this.moveTimeForPipe <= 4 ? 4 : --this.moveTimeForPipe;
        this.obstacleMoveTime = this.obstacleMoveTime <= 3 ? 3 : --this.obstacleMoveTime;
        this.moveTimeForTip = this.moveTimeForTip <= 4 ? 4 : --this.moveTimeForTip;
    },

    /// speedDown obstacles
    speedDownObstacles: function speedDownObstacles() {
        // OBSTACLE_GENERATE_TIMER = (OBSTACLE_GENERATE_TIMER >= 210) ? 210 : OBSTACLE_GENERATE_TIMER * 2;
        // PIPE_GENERATE_TIMER = (PIPE_GENERATE_TIMER >= 2)? 2 : PIPE_GENERATE_TIMER + 2.5 * 0.126 ;
        this.moveTimeForPipe = this.moveTimeForPipe >= 7 ? 7 : ++this.moveTimeForPipe;
        this.obstacleMoveTime = this.obstacleMoveTime >= 6 ? 6 : ++this.obstacleMoveTime;
        this.moveTimeForTip = this.moveTimeForTip >= 7 ? 7 : ++this.moveTimeForTip;
    },

    ///  stop game when bird collide with obstacles.
    stopGame: function stopGame() {
        this.addDieSoundEffect();
        this.stopSkyLineAction();
        this.unscheduleUpdate();
        this.stopAllActions();
        this.bird.stopAllActions();
        this.pauseHurdles();

        this.bird.runAction(new cc.MoveTo(0.25, this.bird.getPositionX(), winsize.height * 0.03));
        this.countDown = 3;
        this.bird.setRotation(90);
        this.gameOver(); /// show game over screen.
    },

    pauseHurdles: function pauseHurdles() {

        for (var pipe = 0; pipe < this.botPipes.length; pipe++) {
            this.botPipes[pipe].stopPipeAction();
            this.topPipes[pipe].stopPipeAction();
        }

        for (var obstacle = 0; obstacle < this.humanObstacle.length; obstacle++) {
            this.humanObstacle[obstacle].stopObstacleAction();
        }

        for (var tip = 0; tip < this.tips.length; tip++) {
            this.tips[tip].stopTipAction();
        }
    },

    addDieSoundEffect: function addDieSoundEffect() {
        SoundManager.playSound(res.BirdDieSound);
    },

    /// show game over screen after bird fall down.
    gameOver: function gameOver() {
        // OBSTACLE_GENERATE_COUNTER = 1;
        // TIP_GENERATE_COUNTER = 1 ;
        // PIPE_GENERATE_TIMER = 2.5;

        if (this.userCorrectAnswerArray.length > 0) {
            var summaryLayer = new FBSummeryLayer(this.hudLayer.score, this.userCorrectAnswerArray, this.birdID);
            this.addChild(summaryLayer, 1000);
        } else {

            var scoreSubmissionLayer = new FBScoreSubmissionLayer(cc.winSize, this.birdID, this.hudLayer.score);
            this.addChild(scoreSubmissionLayer, 1000);
        }
    },

    /// add background of game
    addBackgrounds: function addBackgrounds() {

        this.bgImage = this.createSprite(this, res.GamePlayBg_png, cc.p(0, 0), cc.p(0, 0), 1);
        this.bgImage.setLocalZOrder(-20);
        this.addSkyLines();
        this.addClouds();
    },

    /////// ------------- infinite background ------------------
    setInfiniteBackground: function setInfiniteBackground(dt) {
        this.updateSkyLines();
    },

    /// sky lines

    addSkyLines: function addSkyLines() {

        this.upSkyLineDark = this.createSprite(this, res.SkyLine1_Png, cc.p(0, winsize.height), cc.p(0, 1), TAG_UPSKYLINE);
        this.upSkyLineDark.setLocalZOrder(10);

        this.upSkyLineDark2 = this.createSprite(this, res.SkyLine1_Png, cc.p(this.getContentSize().width, winsize.height), cc.p(0, 1), TAG_UPSKYLINE);
        this.upSkyLineDark2.setLocalZOrder(10);

        this.upSkyLineLight = this.createSprite(this, res.SkyLine2_Png, cc.p(0, winsize.height), cc.p(0, 1), TAG_UPSKYLINE);
        this.upSkyLineLight.setLocalZOrder(-10);

        this.upSkyLineLight2 = this.createSprite(this, res.SkyLine2_Png, cc.p(this.getContentSize().width, winsize.height), cc.p(0, 1), TAG_UPSKYLINE);
        this.upSkyLineLight2.setLocalZOrder(-10);

        this.upSkyLineDark.runAction(new cc.MoveBy(10, cc.p(-winsize.width, 0)).repeatForever());
        this.upSkyLineDark2.runAction(new cc.MoveBy(10, cc.p(-winsize.width, 0)).repeatForever());

        this.upSkyLineLight.runAction(new cc.MoveBy(8, cc.p(-winsize.width, 0)).repeatForever());
        this.upSkyLineLight2.runAction(new cc.MoveBy(8, cc.p(-winsize.width, 0)).repeatForever());
    },

    //// update sky lines.
    updateSkyLines: function updateSkyLines() {
        if (this.upSkyLineLight.getPositionX() < -this.upSkyLineLight.getContentSize().width) {
            this.upSkyLineLight.setPositionX(this.getContentSize().width * 0.985);
        }
        if (this.upSkyLineLight2.getPositionX() < -this.upSkyLineLight2.getContentSize().width) {
            this.upSkyLineLight2.setPositionX(this.getContentSize().width * 0.985);
        }
        if (this.upSkyLineDark.getPositionX() <= -this.upSkyLineDark.getContentSize().width) {
            this.upSkyLineDark.setPositionX(this.upSkyLineDark.getContentSize().width * 0.985);
        }
        if (this.upSkyLineDark2.getPositionX() <= -this.upSkyLineDark2.getContentSize().width) {
            this.upSkyLineDark2.setPositionX(this.upSkyLineDark2.getContentSize().width * 0.985);
        }
    },

    //// Add clouds in game Play
    addClouds: function addClouds() {
        for (var cloudCounter = 1; cloudCounter <= 6; cloudCounter++) {
            var randomNumber = Math.floor(Math.random() * 100) % this.InitialCloudsPositions.length;
            var position = this.InitialCloudsPositions[randomNumber];

            var cloudRef = this.createCloud(position, cloudCounter);
            var timeToMove = this.getTimeToMove(position, cloudRef.getContentSize().width);
            cloudRef.runAction(new cc.Sequence(new cc.MoveTo(timeToMove, -cloudRef.getContentSize().width * 1.1, cloudRef.getPositionY()), new cc.CallFunc(this.updateCloudPosition, this, cloudRef)));
            this.initialCloudArray.push(cloudRef);
        }
    },

    updateCloudPosition: function updateCloudPosition(cloudRef) {
        var randomNumber = Math.floor(Math.random() * 100) % this.InitialCloudsPositions.length;
        var position = this.InitialCloudsPositions[randomNumber];
        var timeToMove = this.getTimeToMove(position, cloudRef.getContentSize().width);
        cloudRef.setPosition(position);
        cloudRef.runAction(new cc.Sequence(new cc.MoveTo(timeToMove, -cloudRef.getContentSize().width * 1.1, cloudRef.getPositionY()), new cc.CallFunc(this.updateCloudPosition, this, cloudRef)));
    },

    getTimeToMove: function getTimeToMove(position, cloudWidth) {
        var baseTime = 8;
        var baseDistance = this.getContentSize().width;
        var distanceToMove = Math.abs(position.x + cloudWidth * 1.1);
        var newTime = distanceToMove / baseDistance * baseTime;
        return newTime;
    },

    createCloud: function createCloud(position, cloudCounter) {
        var cloudPng = "#" + StringConstants.CLOUD_TEXT + cloudCounter + ExtentionPng;
        var cloud = this.createSprite(this, cloudPng, position, cc.p(0.5, 0.5));
        cloud.setLocalZOrder(11);
        return cloud;
    },

    /// load animation sprites
    loadAsset: function loadAsset(plist, png) {
        cc.spriteFrameCache.addSpriteFrames(plist);
        var texture = cc.textureCache.addImage(png);
        var textureImage = cc.SpriteBatchNode.create(texture);
        this.addChild(textureImage);
    },

    showQuestionAlert: function showQuestionAlert() {
        this.pauseGame();
        var questionAlert = new FBQuetionAlertLayer(10, this.questionArray[this.questionCounter], this, GamePlayConstants.QUESTION_ALERT_BOX_TAG);
        this.addChild(questionAlert, 1000);
    },

    // Question alert delegate methods callback ;

    optionTwoButtonCallback: function optionTwoButtonCallback(pSender) {
        var correctAnswer = this.questionArray[this.questionCounter].getAnswer();
        var optionTwo = Utility.getNumberFromString(pSender.getTag());

        this.userAnswer = correctAnswer == optionTwo ? true : false;

        this.getChildByTag(GamePlayConstants.QUESTION_ALERT_BOX_TAG).showAnswerAlert(this.userAnswer);
        this.userCorrectAnswerArray.push(new FBUserCorrectAnswer(this.questionArray[this.questionCounter].question, this.questionArray[this.questionCounter].getOption(correctAnswer), this.questionArray[this.questionCounter].getOption(2)));

        this.addDataInResponseArray(correctAnswer);
    },

    optionOneButtonCallback: function optionOneButtonCallback(pSender) {

        var correctAnswer = this.questionArray[this.questionCounter].getAnswer();
        var optionOne = Utility.getNumberFromString(pSender.getTag());
        this.userAnswer = correctAnswer == optionOne ? true : false;

        this.getChildByTag(GamePlayConstants.QUESTION_ALERT_BOX_TAG).showAnswerAlert(this.userAnswer);
        this.userCorrectAnswerArray.push(new FBUserCorrectAnswer(this.questionArray[this.questionCounter].question, this.questionArray[this.questionCounter].getOption(correctAnswer), this.questionArray[this.questionCounter].getOption(1)));

        this.addDataInResponseArray(correctAnswer);
    },

    continueButtonCallback: function continueButtonCallback(pSender) {

        this.getChildByTag(GamePlayConstants.QUESTION_ALERT_BOX_TAG).removeAlertBox();

        this.touchPreventButton = this.createButton(this, res.TouchPreventButton_Png, res.TouchPreventButton_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBGameOverLayerConst.TOUCH_PREVENT_TAG);

        this.addResumeTimer();
        this.questionArray.splice(this.questionCounter, 1);

        if (this.userAnswer) {

            this.speedDownObstacles();
        } else {
            this.speedUpObstacle();
        }

        if (this.questionArray.length == 0 && FBGamePlayLayerRef.isDataAvailableInServer) {
            this.getTipFromServer();
        }
    },

    timeOverCallback: function timeOverCallback() {
        this.getChildByTag(GamePlayConstants.QUESTION_ALERT_BOX_TAG).showAnswerAlert(false);
    },

    /////// Custome Alert Box delegate methods

    okButtonCallBack: function okButtonCallBack(pSender) {
        this.getChildByTag(GamePlayConstants.ALERT_BOX_TAG).removeCustomeAlertBox();
        this.resumeAllActions();
    },

    cancelButtonCallBack: function cancelButtonCallBack(pSender) {
        this.getChildByTag(GamePlayConstants.ALERT_BOX_TAG).removeCustomeAlertBox();
        this.resumeAllActions();
    },

    pauseGame: function pauseGame() {
        this.bird.stopAllActions();
        this.unscheduleUpdate();
        this.stopSkyLineAction();
        this.stopAllActions();
        this.pauseHurdles();

        ///// code of removing pipes after tip collisiion
        // for(var pipe = 0 ; pipe < this.botPipes.length;) {
        //     var bottomPipe = this.botPipes.shift();
        //     var topPipe    = this.topPipes.shift();
        //
        //     bottomPipe.body.GetUserData().asset.removeFromParent(true);
        //     bottomPipe.body.SetUserData(null);
        //
        //     topPipe.body.GetUserData().asset.removeFromParent(true);
        //     topPipe.body.SetUserData(null);
        //
        // }
        // for(var obstacle = 0 ; obstacle < this.humanObstacle.length; ) {
        //     var humanObstacle = this.humanObstacle.shift();
        //     humanObstacle.body.GetUserData().asset.removeFromParent(true);
        //     humanObstacle.body.SetUserData(null);
        // }
        //
        // for(var tip = 0 ; tip < this.tips.length; tip++){
        //     this.tips[tip].stopTipAction();
        // }
    },

    ///// stop skyLine Actions

    stopSkyLineAction: function stopSkyLineAction() {
        this.upSkyLineLight.stopAllActions();
        this.upSkyLineLight2.stopAllActions();
        this.upSkyLineDark.stopAllActions();
        this.upSkyLineDark2.stopAllActions();
    },

    addResumeTimer: function addResumeTimer() {
        this.resumeLabel = this.createLabel(this, "3", FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 100, cc.p(winsize.width * 0.5, winsize.height * 0.5), TAG_RESUMEGAMECOUNTER, cc.color.WHITE);
        this.resumeLabel.setLocalZOrder(15);
        this.schedule(this.decrementTime, 1, cc.repeatForever(), 0);
    },

    getTipFromServer: function getTipFromServer() {
        this.pageNumber = this.pageNumber + 1;
        var serverURL = URLConstants.BaseURL + URLConstants.APITipQuestion + this.pageNumber;
        FBNetworkManager.getCall(serverURL, null, function (error, response) {
            FBGamePlayLayerRef.isDataAvailableInServer = false;
            if (response && response.status == 200) {
                if (response.data.tipdata) {
                    FBGamePlayLayerRef.addDataInQuestionnaireModel(response.data.tipdata);
                    FBGamePlayLayerRef.isDataAvailableInServer = true;
                }
            }
        });
    },

    addDataInQuestionnaireModel: function addDataInQuestionnaireModel(questionnaireData) {
        for (var i = 0; i < questionnaireData.length; i++) {
            var questionnaireModel = new FBQuestionnaireModel(questionnaireData[i]);
            FBGamePlayLayerRef.questionArray.push(questionnaireModel);
        }
    },

    showTips: function showTips() {
        // tips added here
        if (this.questionArray.length > 0) {
            this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(8), new cc.CallFunc(this.addTips, this))));
        }
    },

    //// resume skyLine actions.

    resumeSkyLineActions: function resumeSkyLineActions() {

        this.upSkyLineDark.runAction(new cc.MoveBy(10, cc.p(-winsize.width, 0)).repeatForever());
        this.upSkyLineDark2.runAction(new cc.MoveBy(10, cc.p(-winsize.width, 0)).repeatForever());

        this.upSkyLineLight.runAction(new cc.MoveBy(8, cc.p(-winsize.width, 0)).repeatForever());
        this.upSkyLineLight2.runAction(new cc.MoveBy(8, cc.p(-winsize.width, 0)).repeatForever());
    },

    resumeAllActions: function resumeAllActions() {

        this.bird.runAnimation();
        this.resumeHurdles();
        this.addHurdles();
        this.resumeSkyLineActions();
        this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(SCORE_INCREMENT_TIMER), new cc.CallFunc(this.hudLayer.updateScore, this.hudLayer))));
        this.scheduleUpdate();
    },

    resumeHurdles: function resumeHurdles() {

        this.pipeScrollingSpeed = this.distanceTravelByPipes / this.moveTimeForPipe;
        if (this.botPipes[this.botPipes.length - 1].getPositionX() > winsize.width * 0.9) {
            this.botPipes[this.botPipes.length - 1].body.SetUserData(null);
            this.botPipes[this.botPipes.length - 1].removeFromParent(true);

            this.topPipes[this.topPipes.length - 1].body.SetUserData(null);
            this.topPipes[this.topPipes.length - 1].removeFromParent(true);
        }

        for (var pipe = 0; pipe < this.botPipes.length; pipe++) {
            var moveTime = Math.abs(this.botPipes[pipe].getPositionX() - -this.botPipes[pipe].getContentSize().width) / this.pipeScrollingSpeed;
            this.botPipes[pipe].runAction(new cc.MoveTo(moveTime, cc.p(-this.botPipes[pipe].getContentSize().width, this.botPipes[pipe].getPositionY())));
            this.topPipes[pipe].runAction(new cc.MoveTo(moveTime, cc.p(-this.topPipes[pipe].getContentSize().width, this.topPipes[pipe].getPositionY())));
        }

        for (var obstacle = 0; obstacle < this.humanObstacle.length; obstacle++) {
            var moveTime = Math.abs(this.humanObstacle[obstacle].getPositionX() - -(winsize.width * 0.1)) / this.obstacleSpeed;
            this.humanObstacle[obstacle].runAction(new cc.MoveTo(moveTime, cc.p(-(winsize.width * 0.1), this.humanObstacle[obstacle].getPositionY())));
        }

        for (var tip = 0; tip < this.tips.length; tip++) {
            var moveTime = Math.abs(this.tips[tip].getPositionX() - -(winsize.width * 0.1)) / this.moveTimeForTip;
            this.tips[tip].runAction(new cc.MoveTo(moveTime, cc.p(-(winsize.width * 0.1), this.tips[tip].getPositionY())));
        }
    },

    addDataInResponseArray: function addDataInResponseArray(answer) {
        this.userAnswerArray.push(new FBAnswerResponse(this.questionArray[this.questionCounter].questionId, JSON.parse(answer)));
    },

    decrementTime: function decrementTime() {
        var time = parseInt(this.resumeLabel.getString());
        time--;
        if (time > 0) {
            this.resumeLabel.setString(time);
        } else {

            this.resumeLabel.removeFromParent(true);
            this.touchPreventButton.removeFromParent(true);
            this.unschedule(this.decrementTime);
            this.resumeAllActions();
        }
    }

});

var FBGamePlayScene = FBBaseScene.extend({
    ctor: function ctor(birdID) {
        this._super();
        var layer = new FBGamePlayLayer(birdID);
        this.addChild(layer);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    }
});