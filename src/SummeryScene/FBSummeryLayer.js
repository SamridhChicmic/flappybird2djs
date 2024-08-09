"use strict";

var FBSummeryLayerConst = {

    PREVENTION_BUTTON_TAG: 700000,
    BG_POPUP_TAG: 700001,
    WHITE_POPUP_TAG: 700002,
    SCORE_STATUS_TAG: 700003,
    SCORE_TAG: 700004,
    SCROLLBAR_TAG: 700005,
    TIP_LAYER_TAG: 700006

};

var FBSummeryLayer = FBBaseLayer.extend({
    tipResultLayer: null,
    bird_id: 0,
    score: 0,
    ctor: function ctor(currentScore, correctAnswerArray, birdId) {
        this._super();
        this.setContentSize(winsize);
        this.bird_id = birdId;
        this.score = currentScore;

        this.createButton(this, res.TouchPreventButton_Png, res.TouchPreventButton_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBSummeryLayerConst.PREVENTION_BUTTON_TAG);

        var overlayLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(0, 0), CharacterInfoLayerConsts.OVERLAY_TAG);
        overlayLayer.setOpacity(120);

        var questionmodel = cc.loader.getRes(res.questionAnswerJson);

        // var userAnswer = []
        // for(var i = 0; i < questionmodel.length ; i++){
        //
        //     var question = new FBUserCorrectAnswer(questionmodel[i].question, questionmodel[i].correctAnswer, questionmodel[i].userAnswer);
        //     userAnswer.push(question);
        //
        // }
        // this.setUpUI(userAnswer,currentScore);


        this.setUpUI(correctAnswerArray, currentScore);
    },
    setUpUI: function setUpUI(correctAnswerArray, currentScore) {

        var backgroundPopUp = this.createSprite(this, res.SummeryPopUpBg_Png, cc.p(this.width * 0.5, this.height * 0.5), cc.p(0.5, 0.5), FBSummeryLayerConst.BG_POPUP_TAG);

        var previousHighScore = FBGameState.getHigScore(); //parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.HIGH_SCORE_KEY));

        var text = parseInt(currentScore) < previousHighScore ? StringConstants.SCORE_TEXT : StringConstants.NEW_HIGH_SCORE_TEXT;

        var scoreStatusLabel = this.createLabel(backgroundPopUp, text, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 30, cc.p(backgroundPopUp.width * 0.5, backgroundPopUp.height * 0.92), FBSummeryLayerConst.SCORE_STATUS_TAG, cc.color.WHITE);

        var scoreLabel = this.createLabel(backgroundPopUp, currentScore, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 40, cc.p(backgroundPopUp.width * 0.5, backgroundPopUp.height * 0.85), FBSummeryLayerConst.SCORE_TAG, cc.color.WHITE);

        var whiteBg = this.createSprite(backgroundPopUp, res.WhiteBg_Png, cc.p(backgroundPopUp.width * 0.48, backgroundPopUp.height * 0.5), cc.p(0.5, 0.5), FBSummeryLayerConst.WHITE_POPUP_TAG);

        this.tipResultLayer = new FBTipResultLayer(cc.size(whiteBg.getContentSize().width * 0.9, whiteBg.getContentSize().height * 0.98), cc.p(whiteBg.width * 0.05, whiteBg.height * 0.01), correctAnswerArray, FBSummeryLayerConst.TIP_LAYER_TAG);
        whiteBg.addChild(this.tipResultLayer);

        var scrollerLengthScale = this.tipResultLayer.getScalePercenatge();
        var scroller = new FBScroller(this, whiteBg, whiteBg.height * 0.9, res.ScrollerBg_Png, res.Scroller_Png, scrollerLengthScale, FBSummeryLayerConst.SCROLLBAR_TAG);
        scroller.setPosition(backgroundPopUp.width * 0.96, backgroundPopUp.height * 0.5);
        backgroundPopUp.addChild(scroller);

        var height = whiteBg.getPositionY() - whiteBg.height * 0.5;
        var continueButton = this.createButton(backgroundPopUp, res.ContinueButton_Png, null, cc.p(backgroundPopUp.width * 0.5, height * 0.5), cc.p(0.5, 0.5), FBQuestionAlertConst.CONTINUE_BUTTON_TAG);
        continueButton.addTouchEventListener(this.buttonCallback, this);
    },

    buttonCallback: function buttonCallback(pSender, type) {

        if (type == ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            var parent = this.getParent();
            this.removeAllChildren(true);
            this.removeFromParent(true);
            // registrationLayer.js
            parent.addChild(new FBScoreSubmissionLayer(cc.winSize, this.bird_id, this.score), 1000);
        }
    },
    onScrollerMoved: function onScrollerMoved(movePercentage) {

        var scrollView = this.tipResultLayer.scrollViewRef;
        var minOffset = scrollView.minContainerOffset();
        var offsetToMove = movePercentage / 100 * minOffset.y;
        offsetToMove = offsetToMove >= 0 ? 0 : offsetToMove <= minOffset.y ? minOffset.y : offsetToMove;
        scrollView.setContentOffset(cc.p(0, offsetToMove));
    }

});