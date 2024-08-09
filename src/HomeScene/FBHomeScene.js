"use strict";

var FBHomeLayerRef = null;
var FBHomeScene = cc.Scene.extend({
    onEnter: function onEnter() {
        this._super();
        this.addChild(new FBHomeLayer());
    }
});

var FBHomeLayer = FBBaseLayer.extend({
    // _isPlaying : false,
    fbHomeLayerRef: null,
    ctor: function ctor() {
        this._super();

        this.setupUI();
    },

    onEnter: function onEnter() {
        this._super();
        FBHomeLayerRef = this;
    },

    onExit: function onExit() {
        this._super();
    },

    setupUI: function setupUI() {
        this.addBackGround();
        this.addSoundButton();
        this.addGameTitle();
        this.addLeaderBoard();
        this.addHowToPlayButton();
        this.addCharacterName();
        this.addGamePlay();
        this.addTableView();
    },

    addBackGround: function addBackGround() {
        this.createSprite(this, res.HomeSceneBg_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), cc.p(0.5, 0.5), HOMESCENEBGTAG);
    },

    addSoundButton: function addSoundButton() {

        var soundImage = parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY)) ? res.SoundOff_png : res.SoundOn_png;
        this.createButton(this, soundImage, soundImage, cc.p(this.getContentSize().width * 0.05, this.getContentSize().height * 0.89), cc.p(0, 1), SOUNDBUTTON_TAG, this.buttonCallback, this);
    },

    addGameTitle: function addGameTitle() {
        this.createSprite(this, res.GameTitle_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.85), cc.p(0.5, 0.5), GAMETITLE_TAG);
    },

    addLeaderBoard: function addLeaderBoard() {
        this.createButton(this, res.LeaderboardButton_png, null, cc.p(this.getContentSize().width * 0.9, this.height * 0.8), cc.p(0.5, 0.5), LEADERBOARD_TAG, this.buttonCallback, this);
    },

    addHowToPlayButton: function addHowToPlayButton() {
        this.createButton(this, res.HowToPlay_png, null, cc.p(this.getContentSize().width * 0.9, this.getContentSize().height * 0.88), cc.p(0.5, 0.5), HOWTOPLAY_TAG, this.buttonCallback, this);
    },

    addCharacterName: function addCharacterName() {
        var characterNameLabel = this.createLabel(this, "", FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 35, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.28), CHARACTER_NAME_TAG, cc.color.WHITE);
    },

    addGamePlay: function addGamePlay() {
        this.createButtonWithTitle(this, res.GamePlayButton_png, null, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.15), cc.p(0.5, 0.5), GAMEPLAYBUTTON_TAG, this.buttonCallback, this, StringConstants.PLAY_BUTTON_TITLE_TEXT, cc.color(137, 32, 73), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 40);
    },

    addTableView: function addTableView() {
        // this.addChild(new FBCharacterSelectionLayer(null,cc.size(this.getContentSize().width,this.getContentSize().height * 0.5),cc.p(this.getContentSize().width,this.getChildByTag(SKINS_TAG).getPositionY() + this.getChildByTag(SKINS_TAG).getContentSize().height),FBCHARACTER_SELECTION_LAYER_TAG,this));

        var characterNameLabel = this.getChildByTag(CHARACTER_NAME_TAG);
        this.addChild(new FBCharacterSelectionLayer(cc.color.BLACK, cc.size(this.getContentSize().width, this.getContentSize().height * 0.5), cc.p(this.getContentSize().width, this.getChildByTag(GAMEPLAYBUTTON_TAG).getPositionY() + this.getChildByTag(GAMEPLAYBUTTON_TAG).getContentSize().height), FBCHARACTER_SELECTION_LAYER_TAG, this, characterNameLabel));
    },

    addSkins: function addSkins() {
        this.createButton(this, res.SkinButton_png, null, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.25), cc.p(0.5, 0.5), SKINS_TAG, this.buttonCallback, this);
    },

    addBackButton: function addBackButton() {
        this.createButton(this, res.BackButton_Png, null, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.25), cc.p(0.5, 0.5), BACKBUTTON_TAG, this.buttonCallback, this);
    },

    buttonCallback: function buttonCallback(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            switch (sender.getTag()) {

                case LEADERBOARD_TAG:

                    this.addChild(new FBLeaderBoardLayer());
                    break;

                case HOWTOPLAY_TAG:
                    SoundManager.pauseSound();
                    this.addChild(new FBHowToPlayLayer());
                    break;

                case GAMEPLAYBUTTON_TAG:

                    var cellNo = this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).findCellNo(this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getChildByTag(TABLEVIEW_TAG));
                    if (cellNo) {
                        var birdId = this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getBirdId(cellNo);
                        Utility.updatePlayButtonClickCount();
                        // cc.director.runScene( new cc.TransitionFadeTR(0.8, new FBGamePlayScene(birdId, this)));
                        cc.director.runScene(new FBGamePlayScene(birdId, this));
                    } else {
                        var errorAlertBox = new AlertBoxLayer(false, StringConstants.ERROR_MSG, FBCharacterSelectionLayerRef, FBCharacterSelectionLayerConst.ALERT_BOX_TAG, StringConstants.OK_BUTTON_TITLE_TEXT);
                        FBCharacterSelectionLayerRef.getParent().addChild(errorAlertBox, 10000);
                    }

                    break;

                case SKINS_TAG:
                    // cc.log("skin button ");
                    // var  unlockLayer = new FBUnlockLayer(this);
                    // this.addChild(unlockLayer);
                    // SHOW_SKIN_STATUS = true;
                    // var cellNo = Math.abs(Math.round(this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getChildByTag(TABLEVIEW_TAG).getContentOffset().x / (this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getChildByTag(TABLEVIEW_TAG).getViewSize().width / VISIBLE_CELL ))) + 2;
                    // this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).showShades(cellNo,this);
                    // this.addBackButton();
                    // this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getChildByTag(TABLEVIEW_TAG).reloadData();

                    break;

                case SOUNDBUTTON_TAG:
                    this.loadTextureOfSoundPlayButton(sender);
                    break;

                case BACKBUTTON_TAG:
                    SHOW_SKIN_STATUS = false;
                    sender.removeFromParent();
                    this.getChildByTag(FBUnlockLayerConsts.FBUNLOCK_LAYER_TAG).setVisible(false);
                    this.addSkins();
                    this.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).getChildByTag(TABLEVIEW_TAG).reloadData();
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
        SoundManager.playMusic(res.CharacterSelectionSound);
    }

});