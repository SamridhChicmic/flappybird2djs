"use strict";

/**
 *  Implement delegate methods on delegate :)
 *
 *
 *
 * **/

var AlertBoxDelegate = cc.Class.extend({

    okButtonCallBack: function okButtonCallBack(pSender) {},

    cancelButtonCallBack: function cancelButtonCallBack(pSender) {}

});

var AlertBoxLayerConsts = {
    TOUCH_PREVENT_BUTTON_TAG: 401,
    ALERT_BG_IMAGE_TAG: 402,
    MESSAGE_LABEL_TAG: 403,
    OK_BUTTON_TAG: 404,
    CANCEL_BUTTON_TAG: 405,
    COLOR_LAYER_TAG: 406
};

var AlertBoxLayer = FBBaseLayer.extend({
    delegate: null,
    alertBgImage: null,

    ctor: function ctor(isDual, message, delegate, tag, buttonTitle) {
        this._super();
        this.delegate = delegate;
        this.setTag(tag);
        this.setUpUI(isDual, message, buttonTitle);
    },

    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    },

    setUpUI: function setUpUI(isDual, message, buttonTitle) {
        var colorLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), AlertBoxLayerConsts.COLOR_LAYER_TAG);
        colorLayer.setOpacity(100);

        var touchPreventButton = this.createButton(this, res.TouchPreventButton_Png, res.TouchPreventButton_Png, cc.p(winsize.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), AlertBoxLayerConsts.TOUCH_PREVENT_BUTTON_TAG);

        this.alertBgImage = this.createSprite(this, res.AlertPopUpBg_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * -0.25), cc.p(0.5, 0.5), AlertBoxLayerConsts.ALERT_BG_IMAGE_TAG);
        this.alertBgImage.runAction(new cc.EaseBounce(new cc.MoveTo(0.2, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5))));

        var message = this.createLabel(this.alertBgImage, message, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 30, cc.p(this.alertBgImage.getContentSize().width * 0.5, this.alertBgImage.getContentSize().height * 0.7), AlertBoxLayerConsts.MESSAGE_LABEL_TAG, cc.color.WHITE);
        message.setDimensions(this.alertBgImage.getContentSize().width * 0.7, 0);
        message.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var okButton = this.createButton(this.alertBgImage, res.Option2_png, null, cc.p(this.alertBgImage.getContentSize().width * 0.5, this.alertBgImage.getContentSize().height * 0.3), cc.p(0.5, 0.5), AlertBoxLayerConsts.OK_BUTTON_TAG, this.buttonCallback, this);
        okButton.setTitleText(StringConstants.OK_BUTTON_TITLE_TEXT);
        okButton.setTitleFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);
        okButton.setTitleFontSize(30);
        okButton.setTitleColor(cc.color(9, 28, 76));

        if (buttonTitle) {
            okButton.setTitleText(buttonTitle);
        }

        if (isDual) {
            okButton.setPositionX(this.alertBgImage.getContentSize().width * 0.7);
            var cancelButton = this.createButton(this.alertBgImage, res.Option1_png, null, cc.p(this.alertBgImage.getContentSize().width * 0.3, this.alertBgImage.getContentSize().height * 0.3), cc.p(0.5, 0.5), AlertBoxLayerConsts.CANCEL_BUTTON_TAG, this.buttonCallback, this);
            cancelButton.setTitleText(StringConstants.CANCEL_BUTTON_TITLE_TEXT);
            cancelButton.setTitleFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);
            cancelButton.setTitleFontSize(30);
            cancelButton.setTitleColor(cc.color(116, 17, 57));
        }
    },

    buttonCallback: function buttonCallback(pSender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            switch (pSender.getTag()) {
                case AlertBoxLayerConsts.OK_BUTTON_TAG:
                    this.alertBgImage.runAction(new cc.EaseBounceIn(new cc.MoveTo(0.1, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 1.25))));
                    this.runAction(new cc.Sequence(new cc.DelayTime(0.1), new cc.callFunc(function () {
                        this.delegate.okButtonCallBack(pSender);
                    }, this)));
                    break;

                case AlertBoxLayerConsts.CANCEL_BUTTON_TAG:
                    this.alertBgImage.runAction(new cc.EaseBounce(new cc.MoveTo(0.1, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * -0.25))));
                    this.runAction(new cc.Sequence(new cc.DelayTime(0.1), new cc.callFunc(function () {
                        this.delegate.cancelButtonCallBack(pSender);
                    }, this)));
                    break;
            }
        }
    },

    removeCustomeAlertBox: function removeCustomeAlertBox() {
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParent(true);
    }
});