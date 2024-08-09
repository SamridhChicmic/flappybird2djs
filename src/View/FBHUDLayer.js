"use strict";

var FBHUDConst = {

    SCORE_BG_TAG: 14000,
    SOUND_BG_TAG: 14001

};

var FBHUDLayerRef = null;
var FBHUDLayer = FBBaseLayer.extend({
    score: 0,
    scoreBgPng: null,
    soundButton: null,

    ctor: function ctor() {
        this._super();
        this.setContentSize(winsize.width, winsize.height * 0.35);
        this.setPosition(0, winsize.height * 0.65);
        this.addScore();
        this.addSoundButton();
    },

    addSoundButton: function addSoundButton() {
        var soundBg = this.createSprite(this, res.SoundBg_Png, cc.p(this.getContentSize().width * 0.035, this.getContentSize().height * 0.7), cc.p(0.2, 0.5), FBHUDConst.SOUND_BG_TAG);
        var soundImage = parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY)) ? res.SoundOff_png : res.SoundOn_png;
        var soundButton = this.createButton(soundBg, soundImage, soundImage, cc.p(soundBg.getContentSize().width * 0.5, soundBg.getContentSize().height * 0.5), cc.p(0.5, 0.5), SOUNDBUTTON_TAG, this.buttonCallback, this);
        soundButton.setScale(0.6);
    },

    onEnter: function onEnter() {
        this._super();
        FBHUDLayerRef = this;
    },

    onExit: function onExit() {
        this._super();
        FBHUDLayerRef = null;
    },

    /// add score in game play
    addScore: function addScore() {
        this.scoreBgPng = this.createSprite(this, res.DisplayScoreBg_Png, cc.p(this.getContentSize().width * 0.875, this.getContentSize().height * 0.7), cc.p(0.5, 0.5), FBHUDConst.SCORE_BG_TAG);
        var scoreLabel = this.createLabel(this.scoreBgPng, "0", FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 45, cc.p(this.scoreBgPng.getContentSize().width * 0.45, this.scoreBgPng.getContentSize().height * 0.6), TAG_SCORELABEL, cc.color.WHITE);
        scoreLabel.setAnchorPoint(0, 1);
        scoreLabel.setLocalZOrder(10);

        var highScoreLabel = this.createLabel(this.scoreBgPng, StringConstants.HIGH_SCORE_TEXT + FBGameState.getHigScore(), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(this.scoreBgPng.getContentSize().width * 0.5, this.scoreBgPng.getContentSize().height * 0.87), TAG_HIGHSCORELABEL, cc.color.WHITE);
        highScoreLabel.setAnchorPoint(0.5, 1);
        highScoreLabel.setLocalZOrder(10);
    },

    /// update score in game play
    updateScore: function updateScore() {
        this.score++;
        var scoreLabel = this.scoreBgPng.getChildByTag(TAG_SCORELABEL);
        scoreLabel.setString(this.score);
        if (FBGameState.getHigScore() < this.score) FBGameState.setHighScore(this.score);

        var highScoreLabel = this.scoreBgPng.getChildByTag(TAG_HIGHSCORELABEL);
        highScoreLabel.setString(StringConstants.HIGH_SCORE_TEXT + FBGameState.getHigScore());
    },

    buttonCallback: function buttonCallback(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            switch (sender.getTag()) {

                case SOUNDBUTTON_TAG:
                    this.loadTextureOfSoundPlayButton(sender);
                    break;
            }
        }
    },

    loadTextureOfSoundPlayButton: function loadTextureOfSoundPlayButton(soundButton) {

        if (parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
            soundButton.loadTextureNormal(res.SoundOn_png);
            Utility.setValueForKeyToLocalStorage(StringConstants.SOUND_KEY, 0);
            SoundManager.addButtonSound();
            this.addSound();
        } else {
            soundButton.loadTextureNormal(res.SoundOff_png);
            Utility.setValueForKeyToLocalStorage(StringConstants.SOUND_KEY, 1);
            SoundManager.addButtonSound();
            cc.audioEngine.pauseMusic();
        }
    },

    addSound: function addSound() {
        SoundManager.playMusic(res.GamePlaySound, true);
    }

    // updateHighScore : function () {
    //     // Utility.setValueForKeyToLocalStorage(StringConstants.HIGH_SCORE_KEY, this.highScore);
    //     console.log("setting High Score value: "+FBGameState.getHigScore());
    //     FBGameState.setHighScore();
    // }
});