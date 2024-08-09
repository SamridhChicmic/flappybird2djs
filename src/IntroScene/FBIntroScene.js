"use strict";

var FBIntroLayer = FBBaseLayer.extend({
    ctor: function ctor() {
        this._super();
        var introImage = this.createSprite(this, res.IntroStory_Png, cc.p(winsize.width * 0.5, winsize.height * 0.5), cc.p(0.5, 0.5));
        introImage.setScale(this.getContentSize().width / introImage.getContentSize().width);
        var letsPlayButton = this.createButtonWithTitle(introImage, res.GamePlayButton_png, null, cc.p(introImage.getContentSize().width * 0.37, introImage.getContentSize().height * 0.18), cc.p(0, 1), null, this.buttonCallback, this, StringConstants.LETS_PLAY_TEXT, LIGHT_PINK_COLOR, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 28);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    },

    buttonCallback: function buttonCallback(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                SoundManager.addButtonSound();
                cc.director.runScene(new FBHomeScene());
            // cc.director.runScene(new cc.TransitionFadeTR(0.8,new FBHomeScene()));
        }
    }

});

var FBIntroScene = FBBaseScene.extend({
    ctor: function ctor() {
        this._super();
        this.addChild(new FBIntroLayer());
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    }
});