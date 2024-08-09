"use strict";

//tags

var TABLEVIEW_TAG = 2001;
var SOUNDBUTTON_TAG = 2002;
var GAMETITLE_TAG = 2003;
var LEADERBOARD_TAG = 2004;
var HOWTOPLAY_TAG = 2005;
var SKINS_TAG = 2006;
var GAMEPLAYBUTTON_TAG = 2007;
var BACKBUTTON_TAG = 2008;
var BIRDCHARACTER_TAG = 2009;
var FBCHARACTER_SELECTION_LAYER_TAG = 2010;
var LOCK_SKINS_SPRITE_TAG = 2011;
var LOCK_CHARACTER_SPRITE_TAG = 2012;
var BIRDSKINS_TAG = 2013;
var UNLOCKBUTTON_TAG = 2014;
var EDITBOX_TAG = 2015;
var LEFTARRROW_TAG = 2016;
var RIGHTARROW_TAG = 2017;
var HOMESCENEBGTAG = 2018;
var HOWTOPLAYTAG = 2020;
var CHARACTERTAG = 2021;
var CHARACTER_INFO_TAG = 2022;
var CHARACTER_SHADOW_TAG = 2023;
var CHARACTER_NAME_TAG = 2024;

/// Body Type
var TYPE_GROUND = "ground";
var PublicKey = "Europe";
/// common
var BLUE_COLOR = new cc.color(4, 35, 93, 255);
var YELLOW_COLOR = new cc.color(219, 112, 6, 255);
var PINK_COLOR = new cc.color(160, 24, 72, 255);
var LIGHT_PINK_COLOR = new cc.color(210, 53, 109, 255);
var ALERT_TEXT_COLOR = new cc.color(9, 28, 76);

//data
var VISIBLE_CELL = 5;
var NUMBER_OF_CELLS = 9;
var EMPTY_CELL = 2;
var birdCharacterDataArray = [];
var birdSkinDataArray = [];
var SHOW_SKIN_STATUS = false;
var JSON_Data_OF_BIRD_SKIN = null;

/// Game Play Screen tags
var TAG_COUNDOWNLABEL = 21;
var TAG_SCORELABEL = 25;
var TAG_HIGHSCORELABEL = 26;
var TAG_RESUMEGAMECOUNTER = 27;

// Game Play Screen constant

var SCROLL_SPEED = 2;
// var START_GAME_COUNTER              =   0;
// var OBSTACLE_GENERATE_COUNTER       =   0;
var OBSTACLE_GENERATE_TIMER = 3;
// var TIP_GENERATE_COUNTER            =   0;
var PIPE_GENERATE_TIMER = 2.5;
// var TIMER_COUNT                     =   0;
// var PIPE_GENERATOR_COUNTER          =   -1;
var SCORE_INCREMENT_TIMER = 1;
var TAG_UPSKYLINE = 28;
var TAG_DOWNSKYLINE = 29;

///Game Over Screen tags

var GAME_OVER_LAYER_TAG = 22;
var GAME_OVER_LABEL_TAG = 23;
var RESTART_BUTTON_TAG = 24;

var LeaderBoardConst = {
    VISIBLE_CELL_NO: 6,
    TABLE_TAG: 110,
    USER_NAME: "mehak", // take id
    TROPHY_SPRITE_TAG: 1000004,
    LEADERBOARD_LABEL_TAG: 1000005,
    CANCEL_BUTTON_TAG: 1000006,
    RANK_LABEL_TAG: 1000006,
    NAME_LABEL_TAG: 1000006,
    POINTS_LABEL_TAG: 1000006,
    CHARACTER_TAG: 1000007,
    TABLE_VIEW_BG_TAG: 1000008,
    SCROLLBAR_TAG: 1000009,
    BANNER_TAG: 1000010,
    TROPHY_TAG: 1000011

};

var GamePlayConstants = {
    QUESTION_ALERT_BOX_TAG: 200000,
    ALERT_BOX_TAG: 200001
};

var FontNameConstants = {

    COMFORTAA_BOLD: "Comfortaa-Bold",
    COMFORTAA_REGULAR: "Comfortaa-Regular",
    COMFORTAA_LIGHT: "Comfortaa-Light",
    CLOUDY_WITH_A_CHANCE_OF_LOVE: "cloudy_with_a_chance_of_lovRg"
};

var FBCharacterSelectionLayerConst = {
    EXTENSION_PNG: ".png",
    PATH: "res/Characters/",
    SHADOW: "Shadow",
    ALERT_BOX_TAG: 500

    //// contants of game over layer

};var FBGameOverLayerConst = {

    SCORE_LABLE_TAG: 400000,
    SCORE_VALUE_LABEL_TAG: 400001,
    CONTINUE_BUTTON_TAG: 400002,
    MESSAGE_LABEL_TAG: 400003,
    TOUCH_PREVENT_TAG: 400004,
    SCORE_POPUP_TAG: 400005,
    REPLAY_BUTTON_TAG: 400006,
    SUBMIT_BUTTON_TAG: 400007,
    CHARACTER_PNG_TAG: 400008,
    SUCCESS_LABEL_TAG: 400009,
    HOME_SCENE_LABEL_TAG: 4000010,
    CHARACTER_SHADOW_TAG: 4000011

    //// FBCharacter layer constants
};var FBCharacterLayerConst = {

    CHARACTER_TAG: 90000,
    MORE_INFO_TAG: 90001,
    PATH: "res/Characters/display",
    EXTENSION_PNG: ".png"
};

var URLConstants = {
    BaseURL: "https://server2.chicmic.in/flappy_bird/public/api/",
    // BaseURL                     :   "http://192.168.2.8/flappybird/public/api/",
    API_CHARACTER_DATA: "characters/get-game-initial-data",
    API_LEADERBOARD_DATA: "leaderboard/get-leaderboard",
    APITipQuestion: "tips/get-tips/",
    APIAnswerResponse: "save_user_tips",
    API_ADD_USER: "users/add-user",
    API_GET_TIME: "torex",
    HowToPlayVideoLink: "http://benchmark.cocos2d-x.org/cocosvideo.mp4"
};

var SocialShareConstants = {

    baseUrl: 'https://server2.chicmic.in/WebFlappyBird/',
    SHARE_MESSAGE: "play this awesome game ",
    TWITTER_SHARE_BASE_URL: "http://www.twitter.com/intent/tweet?"
};

var FBRateUsPopUpLayerConst = {
    BASE_TAG: 100,
    STAR_BUTTON_1_TAG: 101,
    STAR_BUTTON_2_TAG: 102,
    STAR_BUTTON_3_TAG: 103,
    STAR_BUTTON_4_TAG: 104,
    STAR_BUTTON_5_TAG: 105,
    SUBMIT_BUTTON_TAG: 106,
    CANCEL_BUTTON_TAG: 107,
    DESCRIPTION_LABEL_TAG: 108,
    TOUCH_PREVENTION_BUTTON_TAG: 109,
    BG_SPRITE_TAG: 110,
    TOP_BANNER_TAG: 111,
    RATE_US_LABEL_TAG: 112,
    THANKS_LABEL_TAG: 113,
    COLOR_LAYER_TAG: 114
};

var FBUnlockLayerConsts = {
    FBUNLOCK_LAYER_TAG: 201,
    LAYER_COLOR_TAG: 202,
    ENTER_CODE_BG_SPRITE_TAG: 203
};

var LeaderBoardDataConst = {
    LAYER_COLOR_TAG: 1001,
    RANK_TAG: 1002,
    NAME_TAG: 1003,
    CHARACTER_TAG: 1004,
    BG_TAG: 1005
};

var FBLeaderBoardDataModelConst = {
    RANK_KEY: "rank",
    USER_ID_KEY: "user_id",
    NAME_KEY: "username",
    CHARACTER_ID_KEY: "character_id",
    SCORE_KEY: "score"

};

var FBScoreSubmissionLayerConst = {
    SCORE_LABEL_TAG: 60000,
    REPLAY_BUTTON_TAG: 60001,
    CHARACTER_SPRITE_TAG: 60002,
    TWITTER_BUTTON_TAG: 60003,
    INSTAGRAM_BUTTON_TAG: 60004,
    FACEBOOK_BUTTON_TAG: 60005,
    SUBMIT_BUTTON_TAG: 60006,
    LEADERBOARD_BUTTON_TAG: 60007,
    HOME_BUTTON_TAG: 60008,
    EMAIL_LABEL_TAG: 60009,
    USERNAME_LABEL_TAG: 600010,
    HELP_EMAIL_TAG: 600011,
    HELP_USERNAME_TAG: 600012,
    EMAIL_EDITBOX_TAG: 600013,
    USERNAME_EDITBOX_TAG: 600014,
    CANCEL_BUTTON_TAG: 600015,
    EMAIL_HELP_MESSAGE: "Enter Your email Id.",
    USERNAME_HELP_MESSAGE: "You can choose your Username.",
    POPUP_IMAGE_TAG: 600016,
    SUBMIT_LAYER_TAG: 600017,
    EMAIL_EDITBOX_BG_TAG: 600018,
    USERNAME_EDITBOX_BG_TAG: 600019,
    HELP_POPUP_IMAGE_TAG: 600020,
    SUCCESS_MESSAGE: 600021,
    CHARACTER_SHADOW_TAG: 600022,
    PREVIOUS_HIGH_SCORE_LABEL_TAG: 600023
};
var CharacterInfoLayerConsts = {
    INFO_BG_IMAGE_TAG: 600,
    CHARACTER_PNG_TAG: 601,
    ABOUT_CHARACTER_LABEL_TAG: 602,
    CHARACTER_SHADOW_TAG: 603,
    DONE_BUTTON_TAG: 604,
    INFO_LABEL_TAG: 605,
    TOUCH_PREVENT_BUTTON_TAG: 606,
    OVERLAY_TAG: 607
};