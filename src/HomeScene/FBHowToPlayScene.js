"use strict";

var FBHowToPlayLayerRef = null;

var FBHowToPlayLayerConst = {
    TOUCH_PREVENT_BUTTON_TAG: 301,
    BG_LAYER_TAG: 302,
    BG_SPRITE_TAG: 303,
    CLOSE_BUTTON_TAG: 304,
    VIDEO_PLAYER_TAG: 305

};

var FBHowToPlayLayer = FBBaseLayer.extend({

    isPlaying: false,
    ctor: function ctor() {
        this._super();
        FBHowToPlayLayerRef = this;
        this.setContentSize(cc.winSize);
        this.setupUI();
    },

    onEnter: function onEnter() {
        this._super();
        this.addVideoWithURL();
    },

    onExit: function onExit() {
        this._super();
    },

    setupUI: function setupUI() {
        this.addPreventButton();
        this.addBackGroundLayer();
        this.addBackButton();
        this.addAnimation();
    },

    addAnimation: function addAnimation() {
        this.setPosition(0, this.height);
        var moveToAction = new cc.MoveTo(0.5, cc.p(0, 0));
        this.runAction(moveToAction);
    },

    addPreventButton: function addPreventButton() {
        var touchPreventionButton = this.createButton(this, res.TouchPreventButton_Png, null, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBHowToPlayLayerConst.TOUCH_PREVENT_BUTTON_TAG);
    },

    addBackGroundLayer: function addBackGroundLayer() {
        var bgSprite = this.createSprite(this, res.HomeSceneBg_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBHowToPlayLayerConst.BG_SPRITE_TAG);
        var howToPlayLabel = this.createLabel(bgSprite, StringConstants.HOW_TO_PLAY_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 60, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.85), HOWTOPLAYTAG, cc.color.BLACK);
        howToPlayLabel.setColor(cc.color.WHITE);
    },

    addBackButton: function addBackButton() {
        this.createButton(this, res.CloseButton_Png, null, cc.p(this.getContentSize().width * 0.97, this.getContentSize().height * 0.94), cc.p(1, 1), FBHowToPlayLayerConst.CLOSE_BUTTON_TAG, this.backButtonCallBack, this);
    },

    backButtonCallBack: function backButtonCallBack(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                SoundManager.addButtonSound();
                var videoPlayerLayer = this.getChildByTag(FBHowToPlayLayerConst.BG_LAYER_TAG);
                var videoPlayer = videoPlayerLayer.getChildByTag(FBHowToPlayLayerConst.VIDEO_PLAYER_TAG);
                videoPlayer.stop();
                // videoPlayer.cleanup();
                this.removeFromParent(true);
                SoundManager.resumeSound();

        }
    },

    addVideoWithURL: function addVideoWithURL() {

        var videoPlayerLayer = this.createLayerColor(this, cc.color.BLACK, this.width * 0.5, this.height * 0.5, cc.p(this.width * 0.25, this.height * 0.25), FBHowToPlayLayerConst.BG_LAYER_TAG);
        var video = new ccui.VideoPlayer(res.Video_Mp4);
        video.setContentSize(videoPlayerLayer.getContentSize().width, videoPlayerLayer.getContentSize().height);
        video.setTag(FBHowToPlayLayerConst.VIDEO_PLAYER_TAG);
        video.setPosition(videoPlayerLayer.width * 0.5, videoPlayerLayer.height * 0.5);
        video.setScale(1);
        video.play();
        videoPlayerLayer.addChild(video);

        video.setEventListener(ccui.VideoPlayer.EventType.COMPLETED, function (sender) {});
        video.setEventListener(ccui.VideoPlayer.EventType.STOPPED, function (sender) {});
        video.setEventListener(ccui.VideoPlayer.EventType.PLAYING, function (sender) {});
        video.setEventListener(ccui.VideoPlayer.EventType.PAUSED, function (sender) {});
    }

});