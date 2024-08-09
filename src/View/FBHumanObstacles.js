"use strict";

var HUMAN_OBSTACLES = "humanObstacles";

var FBHumanObstacles = cc.Sprite.extend({
    body: null,
    worldRef: null,
    humanBodyCount: 0,

    ctor: function ctor(imageName, position, worldRef, humanBodyCount) {
        this._super(imageName);
        this.setPosition(position);
        this.worldRef = worldRef;
        this.humanBodyCount = humanBodyCount;
        this.setFlippedY(true);
    },

    onEnter: function onEnter() {
        this._super();
        this.body = FBPhysicsBody.addBody(this.getPositionX(), this.getPositionY(), false, this, HUMAN_OBSTACLES, this.worldRef);

        var plist = StringConstants.HUMAN_OBSTACLE_PLIST_PATH + this.humanBodyCount + StringConstants.BODY_TEXT + StringConstants.EXTENTION_PLIST;
        cc.GB2ShapeCache.getInstance().addShapesWithFile(plist);
        var shapeName = StringConstants.HUMAN_OBSTACLE_TEXT + this.humanBodyCount;
        cc.GB2ShapeCache.getInstance().addFixturesToBody(this.body, shapeName);
        // var angle = -(90 * 57.3);
        // cc.log(" before  body pos ", this.body.GetPosition(), " angle =", this.body.GetAngle());
        // this.body.SetAngle(angle);
        //  cc.log(" after  body pos ", this.body.GetPosition(), " angle =", this.body.GetAngle());
    },

    onExit: function onExit() {
        this._super();
    },

    stopObstacleAction: function stopObstacleAction() {
        this.stopAllActions();
    }
});