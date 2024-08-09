"use strict";

var Utility = {

    getNumberFromString: function getNumberFromString(str) {
        var string = str.replace(/\D/g, '');
        return string;
    },

    /**
     * will return character data.
     * @param birdId
     */
    getCharacterDetail: function getCharacterDetail(birdId) {
        var birdCharacterData = Utility.getValueForKeyFromLocalStorage(StringConstants.CHARACTER_LOADED_KEY);
        var characterObj = this.findObjectforValueByKey(birdCharacterData, StringConstants.CHARACTER_ID, birdId);
        var characterName = characterObj.characterName;
        var plist = characterObj.characterPlist;
        var png = characterObj.characterPng;
        var fameLength = characterObj.charaterPlistLength;
        var multiplier = characterObj.multiplier;
        var gamePlayCharacterPlist = characterObj.gamePlayCharacterPlist;
        var gamePlayCharacterPng = characterObj.gamePlayCharacterPng;
        return {
            characterPlist: plist,
            characterSpriteSheetPng: png,
            frameLength: fameLength,
            multiplier: multiplier,
            characterName: characterName,
            gamePlayCharacterPlist: gamePlayCharacterPlist,
            gamePlayCharacterPng: gamePlayCharacterPng

        };
    },

    /**
     * will return character png.
     * @param birdID
     */
    getCharacterPng: function getCharacterPng(birdID) {
        var characterDetail = this.getCharacterDetail(birdID);
        // cc.log("characterDetail.characterName = ", characterDetail.characterName);
        var characterPng = "#" + characterDetail.characterName + "1" + ExtentionPng;
        return characterPng;
    },

    /**
     * will remove all white spaces from given string/text
     * @param string
     */
    removeAllWhiteSpaces: function removeAllWhiteSpaces(string) {
        return string.replace(/\s/g, '');
    },

    /**
     * following function will validate email ID text
     *
     * @param emailField
     * @returns {boolean}
     */
    validateEmailIdText: function validateEmailIdText(emailText) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(emailText).toLowerCase());
    },

    getValueForKeyFromLocalStorage: function getValueForKeyFromLocalStorage(key) {
        var value = JSON.parse(cc.sys.localStorage.getItem(key));
        return value;
    },

    setValueForKeyToLocalStorage: function setValueForKeyToLocalStorage(key, value) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    },
    updatePlayButtonClickCount: function updatePlayButtonClickCount() {
        var playCountValue = FBGameState.getNumberOfPlayButtonClicked();
        FBGameState.setNumberOfPlayButtonClicked(++playCountValue);
    },

    findObjectforValueByKey: function findObjectforValueByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return array[i];
            }
        }
        return null;
    },

    startAnimation: function startAnimation(plist, png, length, string, parent, loop) {
        cc.spriteFrameCache.addSpriteFrames(plist);
        var texture = cc.textureCache.addImage(png);
        var image = cc.SpriteBatchNode.create(texture);
        parent.addChild(image);
        var animFrames = [];
        for (var i = 1; i <= length; i++) {
            var str = StringConstants.LARGE_TEXT + string + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame(spriteFrame, 1, null);
            animFrames.push(animFrame);
        }
        var animation2 = cc.Animation.create(animFrames, 0.14, loop);
        var animate = new cc.animate(animation2);
        return animate;
    },

    getTimeStampInSeconds: function getTimeStampInSeconds() {
        return Math.floor(Date.now() / 1000);
    },

    getNumericString: function getNumericString() {
        var numericString = Math.random().toString(10).slice(2, 15);
        return numericString;
    },

    getSecurityCode: function getSecurityCode(timeStamp) {
        var positionGenerator = Math.floor(Math.random() * 100) % 3;
        var placement = "";
        var securityKey = "";
        var serverKey = Utility.getNumericString();
        switch (positionGenerator) {
            case 0:
                securityKey = timeStamp + "@" + serverKey + "#" + PublicKey;
                placement = "m_l_r";
                break;
            case 1:
                securityKey = PublicKey + "@" + timeStamp + "#" + serverKey;
                placement = "r_m_l";
                break;
            case 2:
                securityKey = serverKey + "@" + PublicKey + "#" + timeStamp;
                placement = "l_r_m";
                break;
        }

        var encryptedKey = CryptoJS.MD5(securityKey).toString();
        return { securityKey: encryptedKey, placement: placement, serverKey: serverKey };
    },
    createGoogleTrackingEvent: function createGoogleTrackkingEvent(utmToken) {
        ga('create', 'UA-147955676-1', 'auto', 'Flappy', {
            userId: utmToken
        });
    },

    sendGoogleEvent: function sendGoogleEvent(eventCategory, eventAction, eventLabel) {
        ga('Flappy.send', 'event', eventCategory, eventAction, eventLabel);
    }

};