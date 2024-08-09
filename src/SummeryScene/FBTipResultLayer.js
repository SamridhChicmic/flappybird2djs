'use strict';

var FBTipResultLayerConst = {
    ROW_NO: 6,
    COLUMN_NO: 2,
    SCROLL_VIEW_TAG: 50000,
    TIP_QUESTION_TAG: 50001,
    TIP_RESPONSE_TAG: 50002,
    THUMPS_UP_TAG: 50003,
    ANSWER_LABEL: 50004
};

var FBTipResultLayer = FBBaseLayer.extend({
    tipResultBgLayer: null,
    userCorrectAnswer: [],
    _scalePercentage: 0,
    container: null,
    _colPosX: 0,
    _colPosY: 0,
    scrollViewRef: null,
    ctor: function ctor(size, position, userCorrectAnswer, tag) {

        this._super();
        this.userCorrectAnswer = userCorrectAnswer;
        this.setTag(tag);
        this.setContentSize(size);
        this.setPosition(position);
        this.setUpUI();
        this.addMouseEventListner();
    },
    setUpUI: function setUpUI() {
        // this.tipResultBgLayer = this.createLayerColor(this, cc.color.BLACK, this.width, this.height, cc.p(this.width * 0, this.height * 0 ), 1223);
        this.setUpScrollContainer();
    },

    setUpScrollContainer: function setUpScrollContainer() {

        var verticalSpacing = this.height * 0.02;
        var rowNo = Math.round(this.userCorrectAnswer.length / 2) + 1;
        var innerContentHeight = Math.max((rowNo - 1) * this.height * 0.33 + rowNo * verticalSpacing + this.height * 0.4, this.height);
        this.container = new cc.Layer();
        this.container.setContentSize(this.getContentSize().width, innerContentHeight);
        this._scalePercentage = this.height / this.container.height;
        this.populateDataInContainer();
        this.setUpScrollView();
    },

    setUpScrollView: function setUpScrollView() {

        var scrollView = new cc.ScrollView(cc.size(this.width, this.height), this.container);

        var contentOffset = scrollView.getViewSize().height - this.container.height;
        scrollView.setContentOffset(cc.p(0, contentOffset));
        scrollView.setTouchEnabled(true);
        scrollView.setBounceable(false);
        scrollView.setDelegate(this);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.setTag(FBTipResultLayerConst.SCROLL_VIEW_TAG);
        this.addChild(scrollView);
        this.scrollViewRef = scrollView;
    },

    populateDataInContainer: function populateDataInContainer() {

        var verticalSpacing = this.height * 0.02;
        var horizontalSpacing = this.width * 0.05;
        var layer = null;
        var areOdd = false;
        var bannerLayerHeight;

        var bannerLayer = this.createBanner();
        this.container.addChild(bannerLayer);
        bannerLayerHeight = bannerLayer.getContentSize().height;

        for (var i = 0; i < this.userCorrectAnswer.length; i++) {

            if (i == this.userCorrectAnswer.length - 1 && this.userCorrectAnswer.length % 2 != 0) {
                areOdd = true;
                break;
            } else {

                layer = this.tipResultDetails(i);
                var position = cc.p(this.width * 0.05 + (i + 2) % 2 * (horizontalSpacing + layer.width), this.container.height - bannerLayerHeight - Math.floor((i + 2) / 2) * (layer.height + verticalSpacing));
                layer.setPosition(position);
            }
            this.container.addChild(layer);
        }

        if (areOdd) {
            layer = this.tipResultDetails(this.userCorrectAnswer.length - 1);
            var position = cc.p(this.width * 0.5 - layer.width * 0.5, this.container.height - bannerLayerHeight - Math.floor((this.userCorrectAnswer.length + 1) / 2) * (layer.height + verticalSpacing));
            layer.setPosition(position);
            this.container.addChild(layer);
        }
    },

    createBanner: function createBanner() {

        var wrongAnswer = 0;
        var rightAnswer = 0;
        var headingLayer = new cc.LayerColor(cc.color.WHITE, this.width, this.height * 0.4);
        headingLayer.setPosition(this.container.width * 0.0, this.container.height - headingLayer.height);

        var thumpsUpSprite = this.createSprite(headingLayer, res.ThumbsUp_Png, cc.p(headingLayer.width * 0.5, headingLayer.height * 0.6), cc.p(0.5, 0.5), FBTipResultLayerConst.THUMPS_UP_TAG);
        thumpsUpSprite.setScale(0.65);

        for (var i = 0; i < this.userCorrectAnswer.length; i++) {
            var isequal = this.userCorrectAnswer[i].correctAnswer.localeCompare(this.userCorrectAnswer[i].userAnswer);
            isequal == 0 ? rightAnswer++ : wrongAnswer++;
        }

        var tipString = rightAnswer > 1 ? StringConstants.CORRECT_TIPS : StringConstants.CORRECT_TIP;
        this.createLabel(headingLayer, tipString + rightAnswer, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 25, cc.p(headingLayer.width * 0.5, thumpsUpSprite.getPositionY() - thumpsUpSprite.height * thumpsUpSprite.getScale() * 0.8), FBTipResultLayerConst.ANSWER_LABEL, new cc.color(56, 93, 172));

        return headingLayer;
    },

    tipResultDetails: function tipResultDetails(idx) {

        //  cc.log("index", idx);

        var vPadding = 20;
        var responseData = this.userCorrectAnswer[idx].userAnswer.toUpperCase();
        var columnWidth = this.width * 0.45;
        var dataLayerHeight = this.height * 0.33;
        var layer = new cc.LayerColor(cc.color.WHITE, columnWidth, dataLayerHeight);
        var dataLabel = this.createLabel(layer, this.userCorrectAnswer[idx].question, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 13, cc.p(layer.width * 0.5, layer.height * 0.7), FBTipResultLayerConst.TIP_QUESTION_TAG, new cc.color(56, 93, 172));
        dataLabel.setAnchorPoint(0.5, 0.5);
        dataLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        if (dataLabel.width > columnWidth * 0.85) {
            dataLabel.setDimensions(layer.width * 0.9, 0);
        }

        var resultLabelHeight = dataLabel.getPositionY() - dataLabel.height * 0.5 - vPadding;

        var resultLabel = this.createLabel(layer, responseData, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 20, cc.p(layer.width * 0.5, resultLabelHeight), FBTipResultLayerConst.TIP_RESPONSE_TAG, new cc.color(56, 93, 172));
        resultLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        resultLabel.setAnchorPoint(0.5, 1);
        if (resultLabel.width > this.container.width * 0.85) {
            resultLabel.setDimensions(this.container.width * 0.95, 0);
        }
        return layer;
    },

    getScalePercenatge: function getScalePercenatge() {

        return this._scalePercentage;
    },

    scrollViewDidScroll: function scrollViewDidScroll(view) {

        var scroller = this.getParent().getParent().getChildByTag(FBSummeryLayerConst.SCROLLBAR_TAG);
        var offset = view.getContentOffset();
        var minOffset = view.minContainerOffset();

        var percentageMoved = Math.abs(offset.y) / Math.abs(minOffset.y) * 100;
        percentageMoved = Math.min(percentageMoved, 100);
        percentageMoved = Math.max(percentageMoved, 0);

        if (scroller && minOffset.y != 0) {
            scroller.moveScroller(percentageMoved);
        }
    },

    addMouseEventListner: function addMouseEventListner() {
        if ('mouse' in cc.sys.capabilities) {

            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseScroll: function onMouseScroll(event) {
                    var target = event.getCurrentTarget();
                    var distance = event.getScrollY();
                    target.moveLeaderboardOnMouseScroller(distance * -0.1);
                }

            }, this);
        }
    },
    moveLeaderboardOnMouseScroller: function moveLeaderboardOnMouseScroller(distance) {

        var container = this.scrollViewRef.getContainer();
        var maxInset, minInset;
        var oldPosition = container.getPosition();
        var locScrollDistance = distance;
        container.setPosition(oldPosition.x, oldPosition.y + locScrollDistance);
        maxInset = this.scrollViewRef.maxContainerOffset();
        minInset = this.scrollViewRef.minContainerOffset();

        //check to see if offset lies within the inset bounds
        var newX = container.getPositionX();
        var newY = container.getPositionY();

        locScrollDistance = locScrollDistance * SCROLL_DEACCEL_RATE;

        this.scrollViewRef.setContentOffset(cc.p(newX, newY));

        if (Math.abs(locScrollDistance) <= SCROLL_DEACCEL_DIST || newY > maxInset.y || newY < minInset.y || newX > maxInset.x || newX < minInset.x || newX === maxInset.x || newX === minInset.x || newY === maxInset.y || newY === minInset.y) {
            this.scrollViewRef.unschedule(this.moveLeaderboardOnMouseScroller);
            this.scrollViewRef._relocateContainer(true);
        }
    }

});