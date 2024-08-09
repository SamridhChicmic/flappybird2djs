"use strict";

var CharacterInfoText = {
    Bun_Bun_Text: "Bun Bun is clearly the ‘it’ girl. But being at the top has its price. She dashes ahead to be the first to share and comment on everything. But because of that, she also got one leg into the rabbit hole of sharing fake news. Will she stay afoot in the good web? ",
    Foxy_Text: "Foxter is the street-smart dude that knows his way around online. While he isn’t coming from a mean place, he sees it as his duty to call out someone online. But is his version always the truth or is he heading down into his own fox trap?",
    Elle_Text: "Elle has a heart that is big as she is, and she trusts everyone way too easily. This makes her the target board for cyber bullies and scammers online. Will Elle be able to turn things around and become the strong hold for a better internet?",
    Salmy_Text: "Salmy is always online surfing for the best deals. While he knows all the go-to sources for the cheapest buys, he has gotten hooked on one too many online scams, big and small. Will he float or will he sink in this fake news imaginarium?",
    Parrie_Text: "Parrie is that one friend we all have that knows anything and everything, or so it seems. He’s always parroting everything his friends say, online and offline. But is he fanning his feathers in all the wrong places and ways?"
};

var CharacterInfoTitle = {
    Bun_Bun_Text: "Bun Bun the bunny!",
    Foxy_Text: "Foxter the fox!",
    Elle_Text: "Elle the elephant!",
    Salmy_Text: "Salmy the fish!",
    Parrie_Text: "Parrie the parrot!"
};

var FBCharacterInfoLayer = FBBaseLayer.extend({
    verticalMargin: 0, //cc.winSize.height * 0.25,
    infoBgImage: null,
    ctor: function ctor(CharacterID) {
        this._super();
        this.setUpUI(CharacterID);
        this.verticalMargin = this.getContentSize().width * 0.25;
        this.setContentSize(cc.winSize);

        this.createButton(this, res.TouchPreventButton_Png, null, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), CharacterInfoLayerConsts.touchPreventButton, this.buttonCallback, this);

        var overlayLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), CharacterInfoLayerConsts.OVERLAY_TAG);
        overlayLayer.setOpacity(120);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    },

    setUpUI: function setUpUI(characterID) {
        this.infoBgImage = this.createSprite(this, res.CharacterInfoPopUp_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * -0.25), cc.p(0.5, 0.5), CharacterInfoLayerConsts.INFO_BG_IMAGE_TAG);
        this.infoBgImage.setLocalZOrder(100);
        this.infoBgImage.runAction(new cc.EaseBounce(new cc.MoveTo(0.2, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5))));

        var characterDetail = Utility.getCharacterDetail(characterID);
        var characterName = characterDetail.characterName;
        var image = FBCharacterSelectionLayerConst.PATH + characterDetail.characterName + FBCharacterSelectionLayerConst.EXTENSION_PNG;
        var aboutCharacterLabel = this.createLabel(this.infoBgImage, this.getInfoTitle(characterID), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 35, cc.p(this.infoBgImage.getContentSize().width * 0.5, this.infoBgImage.getContentSize().height * 0.90), CharacterInfoLayerConsts.ABOUT_CHARACTER_LABEL_TAG, cc.color.WHITE);

        var characterPng = this.createSprite(this.infoBgImage, image, cc.p(this.infoBgImage.getContentSize().width * 0.5, this.infoBgImage.height * 0.67), cc.p(0.5, 0.5), CharacterInfoLayerConsts.CHARACTER_PNG_TAG);
        characterPng.setScale(0.8);

        var animation = Utility.startAnimation(characterDetail.characterPlist, characterDetail.characterSpriteSheetPng, characterDetail.frameLength, characterDetail.characterName, this.infoBgImage, 10000);
        //   this.characterImage.runAnimation(animation);
        characterPng.runAction(new cc.repeatForever(animation));

        var characterShadow = this.createSprite(this.infoBgImage, res.SuccessDoneCharacterShadow_Png, cc.p(this.infoBgImage.getContentSize().width * 0.5, characterPng.getPositionY() - this.infoBgImage.height * 0.22), cc.p(0.5, 0.5), CharacterInfoLayerConsts.CHARACTER_SHADOW_TAG);

        var infoLabel = this.createLabel(this.infoBgImage, this.getInfoMessage(characterID), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 25, cc.p(this.infoBgImage.getContentSize().width * 0.5, this.infoBgImage.height * 0.3), CharacterInfoLayerConsts.INFO_LABEL_TAG, cc.color.WHITE);
        infoLabel.setDimensions(this.infoBgImage.getContentSize().width * 0.8, 0);
        infoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        infoLabel.setLineHeight(infoLabel.getLineHeight() + 3);

        var DoneButton = this.createButton(this.infoBgImage, res.DoneButton_Png, null, cc.p(this.infoBgImage.getContentSize().width * 0.5, this.infoBgImage.getContentSize().height * 0.1), cc.p(0.5, 0.5), CharacterInfoLayerConsts.DONE_BUTTON_TAG, this.buttonCallback, this);
    },

    getInfoMessage: function getInfoMessage(characterID) {
        var info = "";
        switch (characterID) {
            case 1:
                info = CharacterInfoText.Bun_Bun_Text;
                break;
            case 2:
                info = CharacterInfoText.Elle_Text;
                break;
            case 3:
                info = CharacterInfoText.Foxy_Text;
                break;
            case 4:
                info = CharacterInfoText.Parrie_Text;
                break;
            case 5:
                info = CharacterInfoText.Salmy_Text;
                break;
        }
        return info;
    },

    getInfoTitle: function getInfoTitle(characterID) {
        var info = "";
        switch (characterID) {
            case 1:
                info = CharacterInfoTitle.Bun_Bun_Text;
                break;
            case 2:
                info = CharacterInfoTitle.Elle_Text;
                break;
            case 3:
                info = CharacterInfoTitle.Foxy_Text;
                break;
            case 4:
                info = CharacterInfoTitle.Parrie_Text;
                break;
            case 5:
                info = CharacterInfoTitle.Salmy_Text;
                break;
        }
        return info;
    },

    buttonCallback: function buttonCallback(pSender, type) {

        if (type == ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            switch (pSender.getTag()) {
                case CharacterInfoLayerConsts.DONE_BUTTON_TAG:
                    this.infoBgImage.runAction(new cc.EaseBounce(new cc.MoveTo(0.2, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 1.25))));
                    this.runAction(new cc.Sequence(new cc.DelayTime(0.2), new cc.callFunc(function () {
                        this.removeAllChildrenWithCleanup(true);
                        this.removeFromParent(true);
                    }, this)));
                    break;
            }
        }
    }

});