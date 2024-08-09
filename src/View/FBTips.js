"use strict";

var TYPE_TIP = "tip";

var FBTips = cc.Sprite.extend({
    body: null,
    ctor: function ctor(imageName, position, worldRef) {
        this._super(imageName);
        this.setPosition(position);
        this.body = FBPhysicsBody.addBody(this.getPosition().x, this.getPosition().y, false, this, TYPE_TIP, worldRef);

        FBPhysicsBody.addRectangularShape(this.body, this.getContentSize().width * 0.33, this.getContentSize().height * 0.45);
        FBPhysicsBody.setCategoryBits(this.body, 0x0016);
        FBPhysicsBody.setMaskBits(this.body, 0x0002);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    },

    /// stop actions of tips
    stopTipAction: function stopTipAction() {
        this.stopAllActions();
    }

});