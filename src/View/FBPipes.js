"use strict";

var FBPipe = cc.Sprite.extend({
    body: null,
    isCrossed: false,

    ctor: function ctor(imageName, position, type, worldRef) {
        this._super(imageName);
        this.setPosition(position);
        this.body = FBPhysicsBody.addBody(this.getPosition().x, this.getPosition().y, false, this, type, worldRef);
        FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.5, this.getContentSize().height * 0.5);
        FBPhysicsBody.setCategoryBits(this.body, 0x0008);
        FBPhysicsBody.setMaskBits(this.body, 0x0002);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    },

    /// stop running actions on pipes;
    stopPipeAction: function stopPipeAction() {
        this.stopAllActions();
    },

    getPipeCrossed: function getPipeCrossed() {
        return this.isCrossed;
    },

    setPipeCrossed: function setPipeCrossed(flag) {
        this.isCrossed = flag;
    }

});