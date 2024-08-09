"use strict";

var _FBBaseLayer$extend;

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

var FBScoreSubmissionLayerRef = null;

var FBScoreSubmissionLayer = FBBaseLayer.extend((_FBBaseLayer$extend = {
    ispopupOpen: false,
    birdID: null,
    emailEditbox: null,
    helpButtonParent: null,
    replayButton: null,
    submitButton: null,
    verticalMargin: null,
    horizontalMargin: null,
    bgImage: null,
    randomString: null,
    userEditbox: null,
    score: 0,
    characterID: null,
    userEmail: null,
    userName: null,
    isValidEmail: false,
    characterImage: null
}, _defineProperty(_FBBaseLayer$extend, "characterImage", null), _defineProperty(_FBBaseLayer$extend, "isGuestUser", true), _defineProperty(_FBBaseLayer$extend, "characterShadow", null), _defineProperty(_FBBaseLayer$extend, "isHighScore", false), _defineProperty(_FBBaseLayer$extend, "ctor", function ctor(winsize, birdID, score) {
    this._super();
    this.setContentSize(winsize);
    this.score = score;
    this.characterID = birdID;
    FBScoreSubmissionLayerRef = this;
    var touchPreventButton = this.createButton(this, res.TouchPreventButton_Png, res.TouchPreventButton_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBGameOverLayerConst.TOUCH_PREVENT_TAG);
    touchPreventButton.setOpacity(0);
    this.birdID = birdID;
    this.randomString = Math.random().toString(36).slice(2, 10);
    this.setUpUI(score);
}), _defineProperty(_FBBaseLayer$extend, "onEnter", function onEnter() {
    this._super();
}), _defineProperty(_FBBaseLayer$extend, "onExit", function onExit() {
    this._super();
    FBScoreSubmissionLayerRef = null;
}), _defineProperty(_FBBaseLayer$extend, "setUpUI", function setUpUI(score) {

    // cc.log(" in score submission layer initial ui with registration");

    this.verticalMargin = winsize.height * 0.1;
    this.horizontalMargin = winsize.width * 0.1;
    var overlayLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), CharacterInfoLayerConsts.OVERLAY_TAG);
    overlayLayer.setOpacity(120);

    this.isGuestUser = Utility.getValueForKeyFromLocalStorage(StringConstants.IS_GUEST_KEY);

    this.bgImage = this.createSprite(this, res.LogInBg_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * -0.25), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.POPUP_IMAGE_TAG);

    this.bgImage.runAction(new cc.EaseBounce(new cc.MoveTo(0.2, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5))));

    var highScore = FBGameState.getHigScore();
    var text = parseInt(score) < highScore ? StringConstants.SCORE_TEXT : StringConstants.NEW_HIGH_SCORE_TEXT;
    this.isHighScore = parseInt(score) < highScore ? false : true;

    if (text == StringConstants.NEW_HIGH_SCORE_TEXT) {
        this.addHighScoreSound();
    }

    var scoreLabel = this.createLabel(this.bgImage, text + score, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 38, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.9), FBScoreSubmissionLayerConst.SCORE_LABEL_TAG, cc.color.WHITE);
    scoreLabel.setAnchorPoint(0.5, 0.5);

    this.replayButton = this.createButtonWithTitle(this.bgImage, res.ReplayButton_Png, null, cc.p(this.bgImage.width * 0.875, this.bgImage.height * 0.91), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.REPLAY_BUTTON_TAG, this.buttonCallback, this, StringConstants.REPLAY_BUTTON_TITLE_TEXT, cc.color(216, 58, 8), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20);

    var birdDetails = Utility.getCharacterDetail(this.birdID);

    //plist, png , length ,string, parent, loop


    var birdPng = FBCharacterSelectionLayerConst.PATH + birdDetails.characterName + FBCharacterSelectionLayerConst.EXTENSION_PNG;
    // cc.log("birdName", birdPng);

    this.characterImage = this.createSprite(this.bgImage, birdPng, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.75), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.CHARACTER_SPRITE_TAG);
    this.characterImage.setScale(0.5);

    var animation = Utility.startAnimation(birdDetails.characterPlist, birdDetails.characterSpriteSheetPng, birdDetails.frameLength, birdDetails.characterName, this.bgImage, 10000);
    //   this.characterImage.runAnimation(animation);
    this.characterImage.runAction(new cc.repeatForever(new cc.Sequence(animation, animation.reverse())));

    this.characterShadow = this.createSprite(this.bgImage, res.SuccessDoneCharacterShadow_Png, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.61), cc.p(0.5, 0.5), FBGameOverLayerConst.CHARACTER_SHADOW_TAG);

    var emailLabel = this.createLabel(this.bgImage, StringConstants.EMAIL_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(this.bgImage.getContentSize().width * 0.08, this.characterShadow.getPositionY() - this.verticalMargin * 0.5), FBScoreSubmissionLayerConst.EMAIL_LABEL_TAG, cc.color.WHITE);
    emailLabel.setAnchorPoint(0, 0.5);

    /**
     *  -----to do------
     * change position of editbox according to sprite so no need for using anchor points
     * **/

    var emailEditBoxBg = this.createSprite(this.bgImage, res.ScoreSubmissionEditBoxBg_Png, cc.p(this.bgImage.width * 0.05, emailLabel.getPositionY() - this.verticalMargin * 0.2), cc.p(0, 1), FBScoreSubmissionLayerConst.EMAIL_EDITBOX_BG_TAG);

    this.emailEditbox = this.createEditBox(emailEditBoxBg, res.ScoreSubmissionEditBox_Png, FBScoreSubmissionLayerConst.EMAIL_EDITBOX_TAG, cc.p(emailEditBoxBg.width * 0.05, emailEditBoxBg.height * 0.45), cc.EDITBOX_INPUT_MODE_SINGLELINE, this, StringConstants.EMAIL_PLACEHOLDER_TEXT, 15, cc.color.GRAY, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 15, cc.color(46, 55, 118));
    this.emailEditbox.setAnchorPoint(0, 0.5);
    this.emailEditbox.setFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);

    var emailHelpButton = this.createButton(emailEditBoxBg, res.HelpButton_Png, null, cc.p(emailEditBoxBg.getContentSize().width * 0.985, emailEditBoxBg.getContentSize().height * 0.5), cc.p(1, 0.5), FBScoreSubmissionLayerConst.HELP_EMAIL_TAG, this.buttonCallback, this);
    emailHelpButton.setLocalZOrder(5);

    var usernameLabel = this.createLabel(this.bgImage, StringConstants.USERNAME_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(emailLabel.getPositionX(), emailEditBoxBg.getPositionY() - this.emailEditbox.getContentSize().height * 1.5), FBScoreSubmissionLayerConst.USERNAME_LABEL_TAG, cc.color.WHITE);
    usernameLabel.setAnchorPoint(0, 0.5);

    var userEditBoxBg = this.createSprite(this.bgImage, res.ScoreSubmissionEditBoxBg_Png, cc.p(this.bgImage.width * 0.05, usernameLabel.getPositionY() - usernameLabel.height * 0.7), cc.p(0, 1), FBScoreSubmissionLayerConst.USERNAME_EDITBOX_BG_TAG);

    this.userEditbox = this.createEditBox(userEditBoxBg, res.ScoreSubmissionEditBox_Png, FBScoreSubmissionLayerConst.USERNAME_EDITBOX_TAG, cc.p(userEditBoxBg.width * 0.05, userEditBoxBg.height * 0.45), cc.EDITBOX_INPUT_MODE_SINGLELINE, this, StringConstants.USERNAME_PLACEHOLDER_TEXT, 15, cc.color.GRAY, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 15, cc.color(46, 55, 118));
    this.userEditbox.setAnchorPoint(0, 0.5);
    this.userEditbox.setMaxLength(15);
    this.userEditbox.setPlaceholderFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);
    this.userEditbox.setFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);

    var userNameHelpButton = this.createButton(userEditBoxBg, res.HelpButton_Png, null, cc.p(userEditBoxBg.getContentSize().width * 0.985, userEditBoxBg.getContentSize().height * 0.5), cc.p(1, 0.5), FBScoreSubmissionLayerConst.HELP_USERNAME_TAG, this.buttonCallback, this);
    userNameHelpButton.setLocalZOrder(5);

    this.submitButton = this.createButtonWithTitle(this.bgImage, res.SubmitButton_Png, null, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.28), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.SUBMIT_BUTTON_TAG, this.buttonCallback, this, StringConstants.SUBMIT_BUTTON_TITLE_TEXT, cc.color(218, 98, 13), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20);

    var leaderBordButton = this.createButtonWithTitle(this.bgImage, res.LeaderboardButtonScoreSubmission_Png, null, cc.p(this.bgImage.width * 0.34, this.submitButton.getPositionY() - this.submitButton.getContentSize().height / 2 - this.verticalMargin / 2), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.LEADERBOARD_BUTTON_TAG, this.buttonCallback, this, StringConstants.LEADERBOARD_BUTTON_TITLE_TEXT, cc.color(23, 56, 107), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20);

    var homeButton = this.createButtonWithTitle(this.bgImage, res.ScoreSubmissionHomeButtonPng, null, cc.p(leaderBordButton.getPositionX() + leaderBordButton.getContentSize().width / 2 + this.horizontalMargin * 0.05, leaderBordButton.getPositionY()), cc.p(0, 0.5), FBScoreSubmissionLayerConst.HOME_BUTTON_TAG, this.buttonCallback, this, StringConstants.HOME_BUTTON_TITLE_TEXT, cc.color(151, 17, 64), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20);

    if (this.isGuestUser == false) {
        this.submitScoreUI();
    }

    this.addSocialMediaButtons(this.bgImage);
}), _defineProperty(_FBBaseLayer$extend, "addHighScoreSound", function addHighScoreSound() {
    SoundManager.playSound(res.HighScoreSound);
}), _defineProperty(_FBBaseLayer$extend, "submitScoreUI", function submitScoreUI() {

    if (!this.isHighScore) {
        var leaderboard = this.bgImage.getChildByTag(FBScoreSubmissionLayerConst.LEADERBOARD_BUTTON_TAG);
        var homeButton = this.bgImage.getChildByTag(FBScoreSubmissionLayerConst.HOME_BUTTON_TAG);
        this.bgImage.removeChildByTag(FBScoreSubmissionLayerConst.EMAIL_LABEL_TAG);
        this.emailEditbox.removeFromParent(true);
        this.bgImage.removeChildByTag(FBScoreSubmissionLayerConst.EMAIL_EDITBOX_BG_TAG);

        this.bgImage.removeChildByTag(FBScoreSubmissionLayerConst.USERNAME_LABEL_TAG);
        this.userEditbox.removeFromParent(true);
        this.bgImage.removeChildByTag(FBScoreSubmissionLayerConst.USERNAME_EDITBOX_BG_TAG);

        this.characterImage.setPositionY(this.bgImage.getContentSize().height * 0.65);
        this.characterImage.setScale(0.8);
        this.characterShadow.setPositionY(this.characterImage.getPositionY() - this.bgImage.height * 0.2);

        var previousHighScore = this.createLabel(this.bgImage, StringConstants.PREVIOUS_HIGH_SCORE_TEXT + FBGameState.getPreviousHighScore(), FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 26, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.85), FBScoreSubmissionLayerConst.PREVIOUS_HIGH_SCORE_LABEL_TAG, cc.color.WHITE);

        this.bgImage.removeChildByTag(FBScoreSubmissionLayerConst.SUBMIT_BUTTON_TAG);
        leaderboard.setPositionY(this.bgImage.height * 0.2);
        homeButton.setPositionY(this.bgImage.height * 0.2);
        this.replayButton.setPosition(this.bgImage.getContentSize().width * 0.5, this.bgImage.getContentSize().height * 0.32);
        this.replayButton.loadTextureNormal(res.SubmitButton_Png);
        this.showRateUsPop();
    } else {
        var userName = Utility.getValueForKeyFromLocalStorage(StringConstants.USER_NAME);
        var emailID = Utility.getValueForKeyFromLocalStorage(StringConstants.EMAIL_ID);
        // cc.log(" userName =", userName , "email =", emailID);
        // if(userName == "" && emailID == "" ){
        //     cc.log(" user Name and email null");
        // }
        this.userEditbox.setString(userName);
        this.emailEditbox.setString(emailID);
        this.isValidEmail = true;
    }
}), _defineProperty(_FBBaseLayer$extend, "showRateUsPop", function showRateUsPop() {
    if (!Utility.getValueForKeyFromLocalStorage(StringConstants.HAS_RATED_KEY)) {
        if (FBGameState.getNumberOfPlayButtonClicked() % 5 == 0) {
            this.addChild(new FBRateUsPopUpLayer(winsize));
            this.bgImage.setVisible(false);
        }
    }
}), _defineProperty(_FBBaseLayer$extend, "checkData", function checkData() {
    // console.log("Imnside2");
    try {
        if (this.emailEditbox.getString() == "" || this.userEditbox.getString() == "") {
            throw "Input fields should not be empty";
        } else if (!this.isValidEmail) {
            cc.log(" valid email =", this.isValidEmail);
            throw "Enter valid email";
        } else {
            this.userEmail = this.emailEditbox.getString();
            this.userName = this.userEditbox.getString();
            this.getTimeFromServer(this.userEmail, this.userName, this.characterID);
            // this.sendUserDataToServer(this.userEmail, this.userName, this.characterID);
        }
    } catch (error) {
        FBScoreSubmissionLayerRef.showAlertBox(false, error);
    }
}), _defineProperty(_FBBaseLayer$extend, "validateEmailData", function validateEmailData(emailString) {
    var emailID = Utility.removeAllWhiteSpaces(emailString);
    if (!Utility.validateEmailIdText(emailID)) {
        this.emailEditbox.setFontColor(cc.color.RED);
        this.isValidEmail = false;
    } else {
        this.emailEditbox.setFontColor(new cc.color(46, 55, 118));
        this.isValidEmail = true;
    }
}), _defineProperty(_FBBaseLayer$extend, "addSocialMediaButtons", function addSocialMediaButtons(parent) {
    var instagramButton = this.createButton(parent, res.Instagram_Png, null, cc.p(parent.width * 0.5, parent.height * 0.08), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.INSTAGRAM_BUTTON_TAG, this.buttonCallback, this);
    this.createButton(parent, res.Twitter_Png, null, cc.p(instagramButton.getPositionX() - instagramButton.width * 1.5, parent.height * 0.08), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.TWITTER_BUTTON_TAG, this.buttonCallback, this);
    this.createButton(parent, res.Facebook_Png, null, cc.p(instagramButton.getPositionX() + instagramButton.width * 1.5, parent.height * 0.08), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.FACEBOOK_BUTTON_TAG, this.buttonCallback, this);
}), _defineProperty(_FBBaseLayer$extend, "buttonCallback", function buttonCallback(pSender, type) {
    if (type == ccui.Widget.TOUCH_ENDED) {
        SoundManager.addButtonSound();
        switch (pSender.getTag()) {
            case FBScoreSubmissionLayerConst.REPLAY_BUTTON_TAG:

                cc.director.runScene(new FBGamePlayScene(this.birdID));
                break;

            case FBScoreSubmissionLayerConst.HELP_EMAIL_TAG:

                if (this.ispopupOpen) {
                    this.removeHelpPopUp(pSender);
                }
                this.showHelpPopUp(pSender);
                break;

            case FBScoreSubmissionLayerConst.HELP_USERNAME_TAG:

                if (this.ispopupOpen) {
                    this.removeHelpPopUp(pSender);
                }
                this.showHelpPopUp(pSender);
                break;
            case FBScoreSubmissionLayerConst.SUBMIT_BUTTON_TAG:
                this.checkData();
                // if(this.isGuestUser == null){
                //     this.checkData();
                // }else {
                //
                //     this.userEmail = this.emailEditbox.getString();
                //     this.userName  = this.userEditbox.getString();
                //     this.sendUserDataToServer(this.userEmail, this.userName, this.characterID);
                // }
                break;

            case FBScoreSubmissionLayerConst.LEADERBOARD_BUTTON_TAG:
                this.addChild(new FBLeaderBoardLayer());
                break;
            case FBScoreSubmissionLayerConst.HOME_BUTTON_TAG:
                cc.director.runScene(new FBHomeScene());
                break;
            case FBScoreSubmissionLayerConst.TWITTER_BUTTON_TAG:
                this.twitterShare();
                break;

            case FBScoreSubmissionLayerConst.INSTAGRAM_BUTTON_TAG:
                break;

            case FBScoreSubmissionLayerConst.FACEBOOK_BUTTON_TAG:
                this.facebookShare();
                break;

            case FBScoreSubmissionLayerConst.CANCEL_BUTTON_TAG:
                this.removeHelpPopUp(pSender);

        }
    }
}), _defineProperty(_FBBaseLayer$extend, "showHelpPopUp", function showHelpPopUp(pSender) {

    this.ispopupOpen = true;
    var message = "";

    message = pSender.getTag() == FBScoreSubmissionLayerConst.HELP_EMAIL_TAG ? FBScoreSubmissionLayerConst.EMAIL_HELP_MESSAGE : FBScoreSubmissionLayerConst.USERNAME_HELP_MESSAGE;
    this.helpButtonParent = pSender.getParent();

    var bgImagePopUp = this.getChildByTag(FBScoreSubmissionLayerConst.POPUP_IMAGE_TAG);

    var helpPopUpImage = this.createSprite(this.helpButtonParent, res.HelpPopUp_Png, cc.p(this.helpButtonParent.width, this.helpButtonParent.height * 1.4), cc.p(1, 0.5), FBScoreSubmissionLayerConst.HELP_POPUP_IMAGE_TAG);
    helpPopUpImage.setLocalZOrder(2);

    this.createButton(helpPopUpImage, res.ClosePopUpButton, null, cc.p(helpPopUpImage.getContentSize().width * 0.9, helpPopUpImage.getContentSize().height * 0.85), cc.p(1, 0.5), FBScoreSubmissionLayerConst.CANCEL_BUTTON_TAG, this.buttonCallback, this);

    var messageLabel = this.createLabel(helpPopUpImage, message, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 25, cc.p(helpPopUpImage.getContentSize().width * 0.5, helpPopUpImage.getContentSize().height * 0.7), FBScoreSubmissionLayerConst.messageLabel, ALERT_TEXT_COLOR);
    messageLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
}), _defineProperty(_FBBaseLayer$extend, "removeHelpPopUp", function removeHelpPopUp() {
    var helpPopUp = this.helpButtonParent.getChildByTag(FBScoreSubmissionLayerConst.HELP_POPUP_IMAGE_TAG);
    helpPopUp.removeAllChildren(true);
    helpPopUp.removeFromParent(true);
    this.ispopupOpen = false;
}), _defineProperty(_FBBaseLayer$extend, "facebookShare", function facebookShare() {

    //cc.log("facebook button");

    FB.ui({
        method: 'share',
        href: SocialShareConstants.baseUrl,
        quote: SocialShareConstants.SHARE_MESSAGE
    }, function (response) {
        //console.log("response", response);
    });
}), _defineProperty(_FBBaseLayer$extend, "twitterShare", function twitterShare() {
    var shareURL = SocialShareConstants.TWITTER_SHARE_BASE_URL; //url base
    //params
    var webSiteUrl = "https://server2.chicmic.in/WebFlappyBird/";
    var caption = SocialShareConstants.SHARE_MESSAGE;
    window.open(shareURL + "url=" + webSiteUrl + "&text=" + caption, '', 'left=200,top=200,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
}), _defineProperty(_FBBaseLayer$extend, "editBoxEditingDidBegin", function editBoxEditingDidBegin(sender) {
    //  cc.log(" editing begin");

}), _defineProperty(_FBBaseLayer$extend, "editBoxEditingDidEnd", function editBoxEditingDidEnd(sender) {
    // cc.log(" editing end");
    switch (sender.getTag()) {
        case FBScoreSubmissionLayerConst.EMAIL_EDITBOX_TAG:
            this.validateEmailData(sender.getString());
            break;

        case FBScoreSubmissionLayerConst.USERNAME_EDITBOX_TAG:
            //  cc.log("username =", sender.getString());
            break;
    }
}), _defineProperty(_FBBaseLayer$extend, "editBoxTextChanged", function editBoxTextChanged(sender, text) {
    // cc.log("text changed");
    //   switch (sender.getTag()) {
    //       case FBScoreSubmissionLayerConst.EMAIL_EDITBOX_TAG :
    //           break;
    //       case FBScoreSubmissionLayerConst.USERNAME_EDITBOX_TAG :
    //           break;
    //   }
}), _defineProperty(_FBBaseLayer$extend, "showAlertBox", function showAlertBox(isDual, message) {
    var alertBox = new AlertBoxLayer(isDual, message, this, GamePlayConstants.ALERT_BOX_TAG);
    this.addChild(alertBox, 25);
}), _defineProperty(_FBBaseLayer$extend, "getTimeFromServer", function getTimeFromServer(email, userName, characterID) {
    FBProcessIndicator.addLoadingIndicator(FBScoreSubmissionLayerRef);
    var serverURL = URLConstants.BaseURL + URLConstants.API_GET_TIME;
    // var serverURL = "http://192.168.2.8/flappybird/public/api/torex";
    FBNetworkManager.getCall(serverURL, null, function (error, response) {
        if (response && response.data) {
            FBScoreSubmissionLayerRef.sendUserDataToServer(email, userName, characterID, response.data.time);
        } else if (error) {
            FBProcessIndicator.removeLoadingIndicator(FBScoreSubmissionLayerRef);
            var alertBox = new AlertBoxLayer(false, "Something went wrong", FBScoreSubmissionLayerRef, GamePlayConstants.ALERT_BOX_TAG, StringConstants.OK_BUTTON_TITLE_TEXT);
            FBScoreSubmissionLayerRef.addChild(alertBox, 10000);
        }
    });
}), _defineProperty(_FBBaseLayer$extend, "sendUserDataToServer", function sendUserDataToServer(email, userName, characterID, timeStamp) {
    var score = FBGameState.getHigScore();
    var data = {
        "username": userName,
        "email": email,
        "groupId": Utility.getTimeStampInSeconds(),
        "score": score,
        "characterId": parseInt(characterID),
        "tipdata": FBGamePlayLayerRef.userAnswerArray
    };
    // var serverURL =  "http://192.168.2.8/flappybird/public/api/users/add-user";
    var serverURL = URLConstants.BaseURL + URLConstants.API_ADD_USER;
    FBNetworkManager.postCall(serverURL, JSON.stringify(data), timeStamp, function (error, response) {
        if (response && response.status == 200) {
            FBGameState.setUTMToken(response.utmToken);
            Utility.setValueForKeyToLocalStorage(StringConstants.IS_GUEST_KEY, false);
            Utility.setValueForKeyToLocalStorage(StringConstants.USER_NAME, userName);
            Utility.setValueForKeyToLocalStorage(StringConstants.EMAIL_ID, email);
            if (response.data) {
                FBGameState.setHighScore(response.data.score);
            }
            FBScoreSubmissionLayerRef.successDone(StringConstants.SUCCESS_DONE_MSG);
        } else if (error) {
            var alertBox = new AlertBoxLayer(false, "Something went wrong", FBScoreSubmissionLayerRef, GamePlayConstants.ALERT_BOX_TAG, StringConstants.OK_BUTTON_TITLE_TEXT);
            FBScoreSubmissionLayerRef.addChild(alertBox, 10000);
        }
        FBProcessIndicator.removeLoadingIndicator(FBScoreSubmissionLayerRef);
    });
}), _defineProperty(_FBBaseLayer$extend, "successDone", function successDone(message) {
    this.bgImage.removeAllChildrenWithCleanup(true);

    var successMessage = this.createLabel(this.bgImage, message, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 30, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.9), FBScoreSubmissionLayerConst.SUCCESS_MESSAGE, cc.color.WHITE);
    var birdPng = Utility.getCharacterPng(this.birdID);
    var birdDetails = Utility.getCharacterDetail(this.birdID);

    //plist, png , length ,string, parent, loop

    var birdPng = FBCharacterSelectionLayerConst.PATH + birdDetails.characterName + FBCharacterSelectionLayerConst.EXTENSION_PNG;
    // cc.log("birdName", birdPng);

    var characterImage = this.createSprite(this.bgImage, birdPng, cc.p(this.bgImage.getContentSize().width * 0.5, this.bgImage.getContentSize().height * 0.65), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.CHARACTER_SPRITE_TAG);
    characterImage.setScale(0.8);

    var animation = Utility.startAnimation(birdDetails.characterPlist, birdDetails.characterSpriteSheetPng, birdDetails.frameLength, birdDetails.characterName, this.bgImage, 10000);
    //   this.characterImage.runAnimation(animation);
    characterImage.runAction(new cc.repeatForever(new cc.Sequence(animation, animation.reverse())));

    this.characterShadow = this.createSprite(this.bgImage, res.SuccessDoneCharacterShadow_Png, cc.p(this.bgImage.width * 0.5, this.bgImage.getContentSize().height * 0.48), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.CHARACTER_SHADOW_TAG);

    var replayButton = this.createButton(this.bgImage, res.ReplayGameOver_Png, null, cc.p(this.bgImage.width * 0.5, this.bgImage.height * 0.35), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.REPLAY_BUTTON_TAG, this.buttonCallback, this);

    var homeButton = this.createButton(this.bgImage, res.SuccessDoneHomeButton_Png, null, cc.p(this.bgImage.width * 0.5, replayButton.getPositionY() - replayButton.getContentSize().height - this.verticalMargin * 0.2), cc.p(0.5, 0.5), FBScoreSubmissionLayerConst.HOME_BUTTON_TAG, this.buttonCallback, this);
    this.addSocialMediaButtons(this.bgImage);
}), _defineProperty(_FBBaseLayer$extend, "okButtonCallBack", function okButtonCallBack(pSender) {
    this.getChildByTag(GamePlayConstants.ALERT_BOX_TAG).removeCustomeAlertBox();
}), _defineProperty(_FBBaseLayer$extend, "cancelButtonCallBack", function cancelButtonCallBack(pSender) {
    this.getChildByTag(GamePlayConstants.ALERT_BOX_TAG).removeCustomeAlertBox();
}), _FBBaseLayer$extend));