"use strict";

var LOADING_INDICATOR_TAG = 9000;

var FBProcessIndicator = new function () {

    this.addLoadingIndicator = function (parent) {

        var colourLayer = new cc.LayerColor(cc.color(255, 255, 255, 100), cc.winSize.width, cc.winSize.height);
        colourLayer.setPosition(cc.p(0.0, 0.0));
        colourLayer.setTag(LOADING_INDICATOR_TAG);
        colourLayer.setOpacity(0);
        parent.addChild(colourLayer, 100);

        var button = new ccui.Button(res.TouchPreventButton_Png);
        button.setPosition(cc.p(colourLayer.getContentSize().width * 0.5, colourLayer.getContentSize().height * 0.5));
        button.setOpacity(0.0);
        colourLayer.addChild(button);
        var indicator = new cc.Sprite(res.Loading_Png);
        indicator.setPosition(cc.p(colourLayer.getContentSize().width * 0.5, colourLayer.getContentSize().height * 0.5));
        colourLayer.addChild(indicator, 200);
        indicator.runAction(new cc.RepeatForever(new cc.RotateBy(1, 360)));
    };

    this.removeLoadingIndicator = function (parent) {
        if (parent.getChildByTag(LOADING_INDICATOR_TAG)) {
            parent.removeChildByTag(LOADING_INDICATOR_TAG);
        }
    };
}();