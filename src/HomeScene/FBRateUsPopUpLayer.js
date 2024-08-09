"use strict";

var FBRateUsPopUpLayer = FBBaseLayer.extend({
    showRate_id: 0,
    ctor: function ctor(size) {
        this._super();
        this.setContentSize(size.width, size.height);
        this.setUpUI(size);
        this.setLocalZOrder(20);
    },

    onEnter: function onEnter() {
        this._super();
    },
    onExit: function onExit() {
        this._super();
    },

    setUpUI: function setUpUI(size) {

        var touchPreventionButton = this.createButton(this, res.TouchPreventButton_Png, null, cc.p(size.width * 0.55, size.height * 0.5), cc.p(0.5, 0.5), FBRateUsPopUpLayerConst.TOUCH_PREVENT_BUTTON_TAG);
        touchPreventionButton.setOpacity(0);

        var colorLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), FBRateUsPopUpLayerConst.COLOR_LAYER_TAG);
        colorLayer.setOpacity(120);

        var bgSprite = this.createSprite(this, res.RateUsPopUpBg_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), cc.p(0.5, 0.5), FBRateUsPopUpLayerConst.BG_SPRITE_TAG);

        var topBanner = this.createSprite(bgSprite, res.BannerRateUsPopUp_Png, cc.p(bgSprite.getContentSize().width * 0.5, bgSprite.getContentSize().height * 0.9), cc.p(0.5, 0.5), FBRateUsPopUpLayerConst.TOP_BANNER_TAG);

        this.createLabel(topBanner, StringConstants.RATE_US_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 35, cc.p(topBanner.getContentSize().width * 0.5, topBanner.getContentSize().height * 0.7), FBRateUsPopUpLayerConst.RATE_US_LABEL_TAG, cc.color.WHITE);

        var descriptionLabel = this.createLabel(bgSprite, StringConstants.DISCRIPTION_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(bgSprite.getContentSize().width * 0.5, bgSprite.getContentSize().height * 0.63), FBRateUsPopUpLayerConst.DESCRIPTION_LABEL_TAG, cc.color.WHITE);
        descriptionLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        descriptionLabel.setLineHeight(descriptionLabel.getLineHeight() + 10);
        descriptionLabel.setDimensions(cc.size(this.getContentSize().width * 0.30, 0));

        this.createLabel(bgSprite, StringConstants.THANKS_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 34, cc.p(bgSprite.getContentSize().width * 0.5, bgSprite.getContentSize().height * 0.50), FBRateUsPopUpLayerConst.THANKS_LABEL_TAG, cc.color.WHITE);

        this.addButton(bgSprite);
    },

    addButton: function addButton(bgSpriteRef) {

        var initialPositonX = bgSpriteRef.getContentSize().width * 0.25;
        var initialPositionY = bgSpriteRef.getContentSize().height * 0.33;
        var baseTag = FBRateUsPopUpLayerConst.BASE_TAG;

        var starButtonWidth = 0;

        for (var i = 0; i < 5; i++) {
            var starButton = this.createButton(bgSpriteRef, res.UnselectedStar_Png, null, cc.p(initialPositonX + i * (starButtonWidth + starButtonWidth * 0.4), initialPositionY), cc.p(0, 0), baseTag + i + 1, this.buttonCallback, this);
            starButton.setZoomScale(0);
            starButtonWidth = starButton.width;
        }

        var submitButton = this.createButton(bgSpriteRef, res.Submit__Rate_Us_Png, null, cc.p(bgSpriteRef.getContentSize().width * 0.1, bgSpriteRef.getContentSize().height * 0.1), cc.p(0, 0), FBRateUsPopUpLayerConst.SUBMIT_BUTTON_TAG, this.buttonCallback, this);
        submitButton.setTouchEnabled(false);
        submitButton.setOpacity(150);

        var cancelButton = this.createButton(bgSpriteRef, res.Cancel_Rate_Us_Png, null, cc.p(bgSpriteRef.getContentSize().width * 0.90, bgSpriteRef.getContentSize().height * 0.1), cc.p(1, 0), FBRateUsPopUpLayerConst.CANCEL_BUTTON_TAG, this.buttonCallback, this);
    },
    buttonCallback: function buttonCallback(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            switch (sender.getTag()) {

                case FBRateUsPopUpLayerConst.STAR_BUTTON_1_TAG:
                    this.changeButtonTexture(sender);
                    this.showRate_id = 1;
                    this.enableRateButton();
                    break;

                case FBRateUsPopUpLayerConst.STAR_BUTTON_2_TAG:
                    this.changeButtonTexture(sender);
                    this.showRate_id = 2;
                    this.enableRateButton();

                    break;

                case FBRateUsPopUpLayerConst.STAR_BUTTON_3_TAG:
                    this.changeButtonTexture(sender);
                    this.showRate_id = 3;
                    this.enableRateButton();
                    break;

                case FBRateUsPopUpLayerConst.STAR_BUTTON_4_TAG:
                    this.changeButtonTexture(sender);
                    this.enableRateButton();
                    this.showRate_id = 4;
                    break;

                case FBRateUsPopUpLayerConst.STAR_BUTTON_5_TAG:

                    this.changeButtonTexture(sender);
                    this.enableRateButton();
                    this.showRate_id = 5;
                    break;

                case FBRateUsPopUpLayerConst.CANCEL_BUTTON_TAG:
                    this.removePopUp();
                    break;

                case FBRateUsPopUpLayerConst.SUBMIT_BUTTON_TAG:
                    Utility.setValueForKeyToLocalStorage(StringConstants.HAS_RATED_KEY, 1);
                    this.removePopUp();
                    break;

            }
        }
    },

    changeButtonTexture: function changeButtonTexture(button) {

        var upperLimit = button.getTag();
        var lowerBound = FBRateUsPopUpLayerConst.STAR_BUTTON_1_TAG;
        for (var index = lowerBound; index <= FBRateUsPopUpLayerConst.STAR_BUTTON_5_TAG; index++) {
            if (index <= upperLimit) {
                this.getChildByTag(FBRateUsPopUpLayerConst.BG_SPRITE_TAG).getChildByTag(index).loadTextureNormal(res.SelectedStar_Png);
            }
            if (index > upperLimit) {
                this.getChildByTag(FBRateUsPopUpLayerConst.BG_SPRITE_TAG).getChildByTag(index).loadTextureNormal(res.UnselectedStar_Png);
            }
        }
    },
    enableRateButton: function enableRateButton() {

        var submitButton = this.getChildByTag(FBRateUsPopUpLayerConst.BG_SPRITE_TAG).getChildByTag(FBRateUsPopUpLayerConst.SUBMIT_BUTTON_TAG);
        submitButton.setOpacity(255);
        submitButton.setTouchEnabled(true);
    },

    removePopUp: function removePopUp() {
        var parent = this.getParent();
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParent(true);
        parent.getChildByTag(FBScoreSubmissionLayerConst.POPUP_IMAGE_TAG).setVisible(true);
    }

});