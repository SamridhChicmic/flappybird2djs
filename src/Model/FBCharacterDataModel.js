"use strict";

var FBCharacterConst = {
    BASE_PATH: "res/Characters/CharacterAnimationPlist/Large_",
    ANIMATION_TEXT: "AnimationSpritesheet",
    EXTENSION_PLIST: ".plist",
    EXTENSION_PNG: ".png",
    CHARACTER_TEXT: "character",
    GAME_PLAY_CHARACTER_ANIMATION_BASE_PATH: "res/Characters/GamePlayCharacterAnimationPlist/Small_",
    LARGE_TEXT: "Large_",
    SMALL_TEXT: "Small_"

};
var FBCharacterPlistLength = {

    "character1": 5,
    "character2": 5,
    "character3": 5,
    "character4": 3,
    "character5": 5,
    "character6": 5,
    "character7": 5
};

var FBCharacterMultiplier = {

    "character1": 1.8,
    "character2": 1.8,
    "character3": 1.8,
    "character4": 2.2,
    "character5": 1.8,
    "character6": 2,
    "character7": 2

};
var FBCharacterDataModel = cc.Class.extend({
    ctor: function ctor(_ref) {
        var id = _ref.id,
            name = _ref.name,
            character_skins = _ref.character_skins;

        this.characterID = id;
        this.characterName = name;
        this.skinArray = character_skins;
        this.characterPlist = FBCharacterConst.BASE_PATH + name + FBCharacterConst.ANIMATION_TEXT + FBCharacterConst.EXTENSION_PLIST;
        this.characterPng = FBCharacterConst.BASE_PATH + name + FBCharacterConst.ANIMATION_TEXT + FBCharacterConst.EXTENSION_PNG;
        this.charaterPlistLength = FBCharacterPlistLength[FBCharacterConst.CHARACTER_TEXT + id];
        this.multiplier = FBCharacterMultiplier[FBCharacterConst.CHARACTER_TEXT + id];
        this.gamePlayCharacterPlist = FBCharacterConst.GAME_PLAY_CHARACTER_ANIMATION_BASE_PATH + name + FBCharacterConst.ANIMATION_TEXT + FBCharacterConst.EXTENSION_PLIST;
        this.gamePlayCharacterPng = FBCharacterConst.GAME_PLAY_CHARACTER_ANIMATION_BASE_PATH + name + FBCharacterConst.ANIMATION_TEXT + FBCharacterConst.EXTENSION_PNG;
    },

    getCharacterId: function getCharacterId() {
        return this.characterID;
    },

    getcharacterName: function getcharacterName() {
        return this.characterName;
    },

    getCharacterStatus: function getCharacterStatus() {
        return this.character_is_unlock;
    }

});