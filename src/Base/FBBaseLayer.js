"use strict";

var FBBaseLayerRef = null;
var FBBaseLayer = cc.Layer.extend({
    ctor: function ctor() {
        this._super();
    },
    onEnter: function onEnter() {
        this._super();
        FBBaseLayerRef = this;
    },

    onExit: function onExit() {
        this._super();
    },

    createLabel: function createLabel(layerReference, text, fontName, fontSize, position, tag, color) {
        var ttfLabel = new cc.LabelTTF(text, fontName, fontSize);
        ttfLabel.setPosition(position);
        ttfLabel.setColor(color);
        ttfLabel.setTag(tag);
        layerReference.addChild(ttfLabel);
        return ttfLabel;
    },

    createLayerColor: function createLayerColor(layerReference) {
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cc.color.BLACK;
        var width = arguments[2];
        var height = arguments[3];
        var position = arguments[4];
        var tag = arguments[5];

        var layerColor = new cc.LayerColor(color, width, height);
        layerColor.setPosition(position);
        layerColor.setTag(tag);
        layerReference.addChild(layerColor);
        return layerColor;
    },

    createSprite: function createSprite(layerReference, fileName, position, anchorPoint, tag) {
        var sprite = new cc.Sprite(fileName);
        sprite.setPosition(position);
        sprite.setAnchorPoint(anchorPoint);
        sprite.setTag(tag);
        layerReference.addChild(sprite);
        return sprite;
    },

    createButton: function createButton(layerReference, Normal_png, resSelected_png, position, anchor, tag, callBack, target) {
        var button = new ccui.Button(Normal_png, resSelected_png);
        button.setPosition(position);
        button.setAnchorPoint(anchor);
        button.setTag(tag);
        button.addTouchEventListener(callBack, target);
        layerReference.addChild(button);
        return button;
    },

    createButtonWithTitle: function createButtonWithTitle(layerReference, Normal_png, resSelected_png, position, anchor, tag, callBack, target, title, titleColor, titleFontName, titleFontSize) {
        var button = this.createButton(layerReference, Normal_png, resSelected_png, position, anchor, tag, callBack, target);
        button.setTitleText(title);
        button.setTitleColor(titleColor);
        button.setTitleFontSize(titleFontSize);
        button.setTitleFontName(titleFontName);
        return button;
    },

    createEditBox: function createEditBox(layerReference, spriteBg, tag, position, inputMode, delegate, placeholderText, placeholderFontSize, placeholderFontColor, placeholderFontName, fontSize, fontColor) {
        var tempSprite = new cc.Sprite(spriteBg);
        var editBox = new cc.EditBox(tempSprite.getContentSize(), tempSprite);
        editBox.setTag(tag);
        editBox.setPosition(position);
        editBox.setDelegate(delegate);
        editBox.setInputMode(inputMode);
        editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        editBox.setPlaceHolder(placeholderText);
        editBox.setPlaceholderFontName(placeholderFontName);
        editBox.setPlaceholderFontSize(placeholderFontSize);
        editBox.setPlaceholderFontColor(placeholderFontColor);
        editBox.setFontSize(fontSize);
        editBox.setFontColor(fontColor);
        layerReference.addChild(editBox);
        return editBox;
    }
});