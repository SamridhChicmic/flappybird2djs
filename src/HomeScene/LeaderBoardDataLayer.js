"use strict";

var FBLeaderBoardDataLayer = FBBaseLayer.extend({

    colorLayer: null,
    ctor: function ctor(color, size) {
        this._super();

        this.setContentSize(size.width, size.height);

        this.colorLayer = this.createLayerColor(this, color, this.width, this.height, cc.p(0, 0), LeaderBoardDataConst.LAYER_COLOR_TAG);
        this.colorLayer.setOpacity(0);
    },

    onEnter: function onEnter() {},

    addLayer: function addLayer(idx, userData, bgFile) {
        var name = userData.name;
        var points = userData.score.toString();
        var rank = userData.rank;
        var birdDetails = Utility.getCharacterDetail(userData.character);

        cc.spriteFrameCache.addSpriteFrames(birdDetails.characterPlist);
        var image = "#" + StringConstants.LARGE_TEXT + birdDetails.characterName + "1" + ExtentionPng;
        var cellBg = this.createSprite(this.colorLayer, bgFile, cc.p(this.colorLayer.width * 0.5, this.colorLayer.height * 0.5), cc.p(0.5, 0.5), LeaderBoardDataConst.BG_TAG);
        var rankLabel = this.createLabel(cellBg, rank, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(cellBg.width * 0.08, cellBg.height * 0.5), LeaderBoardDataConst.RANK_TAG, new cc.color(78, 106, 168));
        rankLabel.setAnchorPoint(0, 0.5);

        var playerName = this.createLabel(cellBg, name, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(cellBg.width * 0.27, cellBg.height * 0.5), LeaderBoardDataConst.NAME_TAG, new cc.color(78, 106, 168));
        playerName.setAnchorPoint(0, 0.5);

        var characterUsed = this.createSprite(cellBg, image, cc.p(cellBg.width * 0.58, cellBg.height * 0.5), cc.p(0.5, 0.5), LeaderBoardDataConst.NAME_TAG);
        characterUsed.setScale(cellBg.getContentSize().height * 0.8 / characterUsed.getContentSize().height);

        var playerPoint = this.createLabel(cellBg, points, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(cellBg.width * 0.87, cellBg.height * 0.5), LeaderBoardDataConst.CHARACTER_TAG, new cc.color(78, 106, 168));
        playerPoint.setAnchorPoint(0, 0.5);
    }
});