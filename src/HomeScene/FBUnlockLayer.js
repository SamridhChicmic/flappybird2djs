"use strict";

var FBUnlockLayer = FBBaseLayer.extend({
    reference: null,
    ctor: function ctor(parent) {
        this._super();
        this.setContentSize(cc.winSize);
        this.reference = parent;
        this.setupUI();
        this.setTag(FBUnlockLayerConsts.FBUNLOCK_LAYER_TAG);
        this.setVisible(false);
    },
    onEnter: function onEnter() {
        this._super();
    },
    onExit: function onExit() {
        this._super();
    },

    setupUI: function setupUI() {
        var layerColor = this.createLayerColor(this, cc.color(30, 144, 255), this.getContentSize().width * 0.4, this.getContentSize().height * 0.15, cc.p(this.getContentSize().width * 0.39, this.getContentSize().height * 0.04), FBUnlockLayerConsts.LAYER_COLOR_TAG);
        layerColor.setOpacity(200);

        var enterCodeBgSprite = this.createSprite(layerColor, res.enterCodeBg, cc.p(layerColor.getContentSize().width * 0.5, layerColor.getContentSize().height * 0.5), cc.p(0.5, 0.5), FBUnlockLayerConsts.ENTER_CODE_BG_SPRITE_TAG);
        this.createEditBox(enterCodeBgSprite, res.enterCodePng, EDITBOX_TAG, cc.p(enterCodeBgSprite.getContentSize().width * 0.3, enterCodeBgSprite.getContentSize().height * 0.55), null, this, StringConstants.enterCodePlaceHolderText, 30, cc.color.BLACK, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 30);
        this.createButton(enterCodeBgSprite, res.unLockPng, null, cc.p(enterCodeBgSprite.getContentSize().width * 0.8, enterCodeBgSprite.getContentSize().height * 0.55), cc.p(0.5, 0.5), UNLOCKBUTTON_TAG, this.reference.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG).UnlockButtonCallBack, this.reference.getChildByTag(FBCHARACTER_SELECTION_LAYER_TAG));
    }
});