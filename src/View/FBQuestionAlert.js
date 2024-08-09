"use strict";

/**
 *  Implement delegate methods on delegate :)
 *
 *
 *
 * **/

var FBQuestionAlertBoxDelegate = cc.Class.extend({

    optionOneButtonCallback: function optionOneButtonCallback(pSender) {},
    optionTwoButtonCallback: function optionTwoButtonCallback(pSender) {},
    continueButtonCallback: function continueButtonCallback(pSender) {},
    timeOverCallback: function timeOverCallback() {}

});

var FBQuestionAlertConst = {

    ALERT_PNG_TAG: 200001,
    TIMER_TAG: 200002,
    MESSAGE_TAG: 200003,
    CONTINUE_BUTTON_TAG: 200006,
    DISLIKE_PNG: 200007,
    LIKE_PNG: 200008,
    TIME_FILL_BG_PNG: 200009,
    TIME_FIL_PNG: 200010,
    CONTINUE_LABEL_TAG: 200011,
    TIME_BAR_TAG: 200012,
    OPTION1_BUTTON_TAG: "answer_1",
    OPTION2_BUTTON_TAG: "answer_2",
    OVERLAY_TAG: 200013

};

var FBQuetionAlertLayer = FBBaseLayer.extend({
    tipBgSprite: null,
    _timerLabel: 0,
    _message: "",
    _time: 0,
    delegate: null,
    _isTimerStopped: false,
    verticalSpace: 0, //cc.winSize.width * 0.1,
    optionButtons: 2,
    ctor: function ctor(timer, questionareData, delegate, tag) {
        this._super();
        this._time = timer;
        this._message = questionareData.question;
        this.delegate = delegate;
        this.verticalSpace = this.getContentSize().width * 0.1;

        this.setContentSize(cc.winSize);
        this.setTag(tag);
        var overlayLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), FBQuestionAlertConst.OVERLAY_TAG);
        overlayLayer.setOpacity(120);
        var touchPreventButton = this.createButton(this, res.TouchPreventButton_Png, res.TouchPreventButton_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), 100);
        touchPreventButton.setScale(this.width / touchPreventButton.width);
        touchPreventButton.setOpacity(0);
        this.showQuestionLayer(timer, questionareData);
    },

    showQuestionLayer: function showQuestionLayer(timer, questionareData) {

        this.tipBgSprite = this.createSprite(this, res.QuestionAlertBg, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), cc.p(0.5, 0.5), FBQuestionAlertConst.ALERT_PNG_TAG);

        var timeFillBgPng = this.createSprite(this.tipBgSprite, res.ProgressbarBg_Png, cc.p(this.tipBgSprite.getContentSize().width * 0.5, this.tipBgSprite.height * 0.87), cc.p(0.5, 1), FBQuestionAlertConst.TIME_FILL_BG_PNG);

        // add a lebel which increment by 1 in 1 sec.
        this._timerLabel = this.createLabel(timeFillBgPng, timer, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 50, cc.p(timeFillBgPng.getContentSize().width * 0.5, timeFillBgPng.getContentSize().height * 0.44), FBQuestionAlertConst.TIMER_TAG, cc.color.WHITE);

        //------------------- Progress bar

        var fillAction = cc.progressFromTo(11, 100, 0);
        var timeBar = new cc.ProgressTimer(new cc.Sprite(res.Progressbar_Png));
        timeBar.type = cc.ProgressTimer.TYPE_RADIAL;
        timeBar.setReverseProgress(true);
        this.addChild(timeBar, 100);
        timeBar.setTag(FBQuestionAlertConst.TIME_BAR_TAG);
        timeBar.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.66));
        timeBar.runAction(fillAction);

        var questionLabel = this.createLabel(this.tipBgSprite, questionareData.question, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 35, cc.p(this.tipBgSprite.getContentSize().width * 0.5, this.tipBgSprite.height * 0.45), FBQuestionAlertConst.MESSAGE_TAG, cc.color.WHITE);
        // questionLabel.setDimensions( this.tipBgSprite.getContentSize().width * 0.8 ,  0);
        questionLabel.setAnchorPoint(0.5, 0.5);

        var option1 = this.createButtonWithTitle(this.tipBgSprite, res.Option1_png, null, cc.p(this.tipBgSprite.getContentSize().width * 0.125, this.tipBgSprite.getContentSize().height * 0.2), cc.p(0, 0.5), FBQuestionAlertConst.OPTION1_BUTTON_TAG, this.buttonCallback, this, questionareData.options[0], PINK_COLOR, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 15);
        option1._titleRenderer.setDimensions(option1.getContentSize().width * 0.78, 0);
        option1.setTitleFontSize(option1._titleRenderer.getContentSize().height > option1.getContentSize().height ? option1.getTitleFontSize() * 0.75 : 15);
        option1._titleRenderer.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var option2 = this.createButtonWithTitle(this.tipBgSprite, res.Option2_png, null, cc.p(this.tipBgSprite.getContentSize().width * 0.537, this.tipBgSprite.getContentSize().height * 0.2), cc.p(0, 0.5), FBQuestionAlertConst.OPTION2_BUTTON_TAG, this.buttonCallback, this, questionareData.options[1], BLUE_COLOR, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 15);
        option2._titleRenderer.setDimensions(option2.getContentSize().width * 0.8, 0);
        option2.setTitleFontSize(option2._titleRenderer.getContentSize().height > option2.getContentSize().height ? option1.getTitleFontSize() * 0.75 : 15);
        option2._titleRenderer.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        this.startTimer(timer);
    },

    showAnswerAlert: function showAnswerAlert(userAnswer) {

        this.stopTimer();
        this._timerLabel.removeFromParent(true);
        this.tipBgSprite.removeChildByTag(FBQuestionAlertConst.OPTION1_BUTTON_TAG);
        this.tipBgSprite.removeChildByTag(FBQuestionAlertConst.OPTION2_BUTTON_TAG);
        this.tipBgSprite.removeChildByTag(FBQuestionAlertConst.TIME_FILL_BG_PNG);
        this.removeChildByTag(FBQuestionAlertConst.TIME_BAR_TAG);

        var file = userAnswer ? res.ThumbsUp_Png : res.ThumbsDown_Png;

        var thumbImage = this.createSprite(this.tipBgSprite, file, cc.p(this.tipBgSprite.getContentSize().width * 0.5, this.tipBgSprite.getContentSize().height * 0.75), cc.p(0.5, 0.5), FBQuestionAlertConst.gotItButtonTag);

        var wellPlayedLabel = this.tipBgSprite.getChildByTag(FBQuestionAlertConst.MESSAGE_TAG);
        wellPlayedLabel.setString(userAnswer ? StringConstants.WELL_PLAYED_TEXT : StringConstants.NEXT_TIME_TEXT);
        wellPlayedLabel.setFontSize(30);
        wellPlayedLabel.setFontName(FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE);
        wellPlayedLabel.setPositionY(this.tipBgSprite.height * 0.5);

        var continueMsg = this.createLabel(this.tipBgSprite, StringConstants.CONTINUE_MESSAGE, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(wellPlayedLabel.getPositionX(), wellPlayedLabel.getPositionY() - wellPlayedLabel.height * 1.2), FBQuestionAlertConst.CONTINUE_LABEL_TAG, cc.color.WHITE);

        var continueButton = this.createButton(this.tipBgSprite, res.ContinueButton_Png, null, cc.p(this.tipBgSprite.getContentSize().width * 0.5, this.tipBgSprite.height * 0.2), cc.p(0.5, 0.5), FBQuestionAlertConst.CONTINUE_BUTTON_TAG);
        continueButton.addTouchEventListener(this.buttonCallback, this);

        if (userAnswer) {
            this.addCorrectAnswerSound();
        }
    },

    addCorrectAnswerSound: function addCorrectAnswerSound() {
        SoundManager.playSound(res.CorrectAnswerSound);
    },

    buttonCallback: function buttonCallback(pSender, type) {

        if (type == ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();

            switch (pSender.getTag()) {
                case FBQuestionAlertConst.OPTION2_BUTTON_TAG:

                    this._isTimerStopped = true;
                    this.delegate.optionTwoButtonCallback(pSender);
                    break;

                case FBQuestionAlertConst.OPTION1_BUTTON_TAG:

                    this._isTimerStopped = true;
                    this.delegate.optionOneButtonCallback(pSender);

                    break;

                case FBQuestionAlertConst.CONTINUE_BUTTON_TAG:

                    this.delegate.continueButtonCallback(pSender);
                    break;
            }
        }
    },

    startTimer: function startTimer(time) {
        this._time = time;
        this.schedule(this._decrementTime, 1, cc.repeatForever(), 0);
    },

    stopTimer: function stopTimer() {
        this._unscheduleTimer();
    },

    _unscheduleTimer: function _unscheduleTimer() {
        this.unschedule(this._decrementTime);
        this._time = 0;
        if (!this._isTimerStopped) {
            this._isTimerStopped = true;
            this.delegate.timeOverCallback();
        }
    },

    _decrementTime: function _decrementTime() {

        if (this._time >= 0) {
            this._timerLabel.setString(this._time);
            --this._time;
        } else {
            this._unscheduleTimer();
        }
    },

    removeAlertBox: function removeAlertBox() {
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParent(true);
    }
});