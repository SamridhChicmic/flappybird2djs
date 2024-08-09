"use strict";

var GameState = {
    initial: 100,
    notInitial: 200
};

var FBGameState = new function () {
    this.gameState = GameState.initial;
    this.utmToken = null;
    this.highScore = 0;
    this.previousHighScore = 0;
    this.callInitialAPI = true;

    this.getGameState = function () {
        return this.gameState;
    };

    this.setGameState = function (state) {
        this.gameState = state;
    };

    this.getNumberOfPlayButtonClicked = function () {
        var value = Utility.getValueForKeyFromLocalStorage(StringConstants.RATE_US_KEY);
        return value;
    };

    this.setNumberOfPlayButtonClicked = function (clickNo) {
        Utility.setValueForKeyToLocalStorage(StringConstants.RATE_US_KEY, clickNo);
    };
    this.setUTMToken = function (token) {
        cc.sys.localStorage.setItem(StringConstants.UTM_TOkEN_KEY, JSON.stringify(token));
        this.utmToken = token;
    };

    this.getUTMToken = function () {
        var tokenValue = cc.sys.localStorage.getItem(StringConstants.UTM_TOkEN_KEY);
        this.utmToken = JSON.parse(tokenValue);
        return this.utmToken;
    };

    this.setPageNumber = function (pageNo) {
        Utility.setValueForKeyToLocalStorage(StringConstants.PAGE_NO_KEY, pageNo);
    };

    this.getPageNumber = function () {
        return Utility.getValueForKeyFromLocalStorage(StringConstants.PAGE_NO_KEY);
    };

    this.setHighScore = function (score) {
        this.highScore = score;
    };

    this.getHigScore = function () {
        return this.highScore;
    };

    this.setPreviousHighScore = function (score) {
        this.previousHighScore = score;
    };

    this.getPreviousHighScore = function () {
        return this.previousHighScore;
    };

    this.getInitialGameAPIState = function () {
        return this.callInitialAPI;
    };

    this.setInitialGameAPIState = function (status) {
        this.callInitialAPI = status;
    };
}();