"use strict";

var FBBird = cc.Sprite.extend({
    fallingSpeed: 0.4, // bird falling speed
    rot: 0.6, // rectangle rotation
    jumpDistance: 7, // jump velocity
    velocityInY: 0, // actual velocity
    flyDistance: 0, // distance of fly
    flySpeed: 1.5, // speed of fly
    body: null,
    frameCount: null,
    birdName: null,
    world: null,
    ctor: function ctor(birdID, position, worldRef) {
        this._super();
        // cc.log("inside bird");
        this.setPosition(position);
        var birdDetail = Utility.getCharacterDetail(birdID);
        this.birdName = birdDetail.characterName;
        var birdPng = StringConstants.SMALL_TEXT + this.birdName + "1" + ExtentionPng;
        this.initWithSpriteFrameName(birdPng);
        this.frameCount = birdDetail.frameLength;
        this.world = worldRef;
    },

    onEnter: function onEnter() {
        this._super();
        this.body = FBPhysicsBody.addBody(this.getPosition().x, this.getPosition().y, true, this, TYPE_BIRD, this.world);
        var plist = StringConstants.CHARACTER_BODY_BASE_PATH + this.birdName + StringConstants.CHARACTER_BODY_TEXT + StringConstants.EXTENTION_PLIST;
        cc.GB2ShapeCache.getInstance().addShapesWithFile(plist);
        var shapeName = this.birdName + "1";
        cc.GB2ShapeCache.getInstance().addFixturesToBody(this.body, shapeName);
        // switch (this.birdName) {
        //     case "BunBun" :
        //         //FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.435, this.getContentSize().height * 0.475);
        //         var plist = res.BunBunBody;
        //         cc.GB2ShapeCache.getInstance().addShapesWithFile(plist);
        //         cc.log("plist =", plist);
        //         var shapeName = "BunBun1";
        //         cc.GB2ShapeCache.getInstance().addFixturesToBody(this.body, shapeName);
        //
        //         break;
        //     case "Ellie" :
        //         FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.26, this.getContentSize().height * 0.4);
        //         break;
        //     case "Foxy" :
        //         FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.26, this.getContentSize().height * 0.38);
        //         break;
        //     case "Parrie" :
        //         FBPhysicsBody.addCircularShape(this.body, this.getContentSize().width * 0.37);
        //         break;
        //     case "Salmie" :
        //         FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.3, this.getContentSize().height * 0.38);
        //         break;
        // }

        FBPhysicsBody.setCategoryBits(this.body, 0x0002);
        FBPhysicsBody.setMaskBits(this.body, 0x0016 | 0x0032 | 0x0008 | 0x0004);
    },

    onExit: function onExit() {
        this._super();
    },

    /// run Animation on bird;
    runAnimation: function runAnimation() {

        var animFrames = [];
        for (var imageCount = 1; imageCount <= this.frameCount; imageCount++) {
            var frame = StringConstants.SMALL_TEXT + this.birdName + imageCount + ExtentionPng;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frame);
            var animFrame = new cc.AnimationFrame(spriteFrame, 1, null);
            animFrames.push(animFrame);
        }
        var animation = cc.Animation.create(animFrames, 0.05, true);
        var animate = new cc.animate(animation);
        this.runAction(new cc.repeatForever(new cc.Sequence(animate, animate.reverse())));
    },

    /// update bird
    birdUpdate: function birdUpdate() {
        var p = this.getPosition(); // position
        var newP = cc.p(p.x, p.y + this.velocityInY); // new position
        // check rectangle min/max Y position
        newP.y = newP.y <= 0 ? 0 : newP.y;
        newP.y = newP.y >= winsize.height ? winsize.height : newP.y;
        // rotation of the rectangle / bird
        var rot = this.getRotation() + this.rot;
        rot = rot >= 90 ? 90 : rot;
        // reset rotation & position of the rectangle
        //this.setRotation((this.birdName == BIRD_TEXT_BUNBUN)? 0 : rot);
        this.setPosition(newP);
    }

});