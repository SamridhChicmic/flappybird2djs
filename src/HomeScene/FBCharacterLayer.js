"use strict";

var FBCharacterLayer = FBBaseLayer.extend({
    //characterID : 0,
    ctor: function ctor(size, _ref) {
        var characterID = _ref.characterId,
            characterName = _ref.characterName,
            characterPlist = _ref.characterPlist,
            characterPng = _ref.characterPng,
            character_is_unlock = _ref.character_is_unlock,
            charaterPlistLength = _ref.charaterPlistLength;

        this._super();
        // this.characterID =  characterID ;
        this.setContentSize(size.width * 0.7, size.height);
        this.setUpUI(characterID, characterName);
    },

    setUpUI: function setUpUI(characterID, characterName) {

        this.createSprite(this, FBCharacterLayerConst.PATH + characterName + FBCharacterLayerConst.EXTENSION_PNG, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBCharacterLayerConst.CHARACTER_TAG);
        var moreInfoButton = this.createButton(this, res.helpPng, null, cc.p(this.width * 0.8, this.height * 0.2), cc.p(1, 0), FBCharacterLayerConst.MORE_INFO_TAG, this.buttonCallback, this);
        moreInfoButton.setVisible(false);
    }

});