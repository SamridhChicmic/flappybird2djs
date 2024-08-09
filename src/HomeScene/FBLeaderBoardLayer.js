'use strict';

var FBLeaderBoardLayerRef = null;

var FBLeaderBoardLayer = FBBaseLayer.extend({
    // update in constant file
    PlayerDataArray: [],
    yourData: {},
    rankData: [],
    isPushed: false,
    scrollBar: null,
    tableViewRef: null,
    ctor: function ctor() {
        this._super();
        this.setContentSize(cc.winSize);
        var touchPreventButton = this.createButton(this, res.TouchPreventButton_Png, null, cc.p(this.width * 0.55, this.height * 0.5), cc.p(0.5, 0.5), 1000);
        touchPreventButton.setScale(this.height / touchPreventButton.height);
        touchPreventButton.setOpacity(0);
        FBLeaderBoardLayerRef = this;
        this.getLeaderBoardDataFromServer();
    },

    onEnter: function onEnter() {
        this._super();
    },

    addAnimation: function addAnimation() {
        this.setPosition(cc.p(0, this.height));
        var moveToAction = new cc.MoveTo(0.5, cc.p(0, 0));
        this.runAction(moveToAction);
    },

    setUpUI: function setUpUI() {

        var bg = this.createLayerColor(this, new cc.color(0, 0, 0, 120), this.getContentSize().width, this.getContentSize().height, cc.p(0, 0), 1);

        var tableViewBG = this.createSprite(this, res.LeaderboardBg_Png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), cc.p(0.5, 0.5), LeaderBoardConst.TABLE_VIEW_BG_TAG);

        var banner = this.createSprite(tableViewBG, res.Leaderboard_Banner_Png, cc.p(tableViewBG.width * 0.5, tableViewBG.height * 0.93), cc.p(0.5, 0.5), LeaderBoardConst.BANNER_TAG);

        this.createLabel(banner, StringConstants.LEADERBOARD_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 40, cc.p(banner.width * 0.5, banner.height * 0.7), LeaderBoardConst.LEADERBOARD_LABEL_TAG, cc.color.WHITE);

        this.createSprite(tableViewBG, res.Trophy_Left_Png, cc.p(banner.getPositionX() - banner.width * 0.6, tableViewBG.height * 0.9), cc.p(0.5, 0.5), LeaderBoardConst.TROPHY_TAG);

        this.createSprite(tableViewBG, res.Trophy_Right_Png, cc.p(banner.getPositionX() + banner.width * 0.6, tableViewBG.height * 0.9), cc.p(0.5, 0.5), LeaderBoardConst.TROPHY_TAG);

        var closeButton = this.createButton(tableViewBG, res.CloseButton_Png, null, cc.p(tableViewBG.width * 0.05, tableViewBG.height * 0.895), cc.p(0.5, 0.5), LeaderBoardConst.CANCEL_BUTTON_TAG, this.buttonCallback, this);
        closeButton.setScale(0.8);

        this.createLabel(tableViewBG, StringConstants.RANK_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(tableViewBG.width * 0.1, tableViewBG.height * 0.75), LeaderBoardConst.RANK_LABEL_TAG, cc.color.WHITE);
        this.createLabel(tableViewBG, StringConstants.NAME_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(tableViewBG.width * 0.3, tableViewBG.height * 0.75), LeaderBoardConst.NAME_LABEL_TAG, cc.color.WHITE);
        this.createLabel(tableViewBG, StringConstants.CHARACTER_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(tableViewBG.width * 0.55, tableViewBG.height * 0.75), LeaderBoardConst.CHARACTER_TAG, cc.color.WHITE);
        this.createLabel(tableViewBG, StringConstants.POINT_LABEL_TEXT, FontNameConstants.CLOUDY_WITH_A_CHANCE_OF_LOVE, 18, cc.p(tableViewBG.width * 0.83, tableViewBG.height * 0.75), LeaderBoardConst.POINTS_LABEL_TAG, cc.color.WHITE);

        var tableViewLayer = this.createLayerColor(tableViewBG, cc.color(240, 240, 240), tableViewBG.width * 0.95, tableViewBG.height * 0.66, cc.p(tableViewBG.width * 0.0001, tableViewBG.height * 0.06));
        tableViewLayer.setOpacity(0);
        var tableView = new cc.TableView(this, cc.size(tableViewLayer.width, tableViewLayer.height));
        tableView.setPosition(cc.p(this.getContentSize().width * 0.01, 0));
        tableView.setDelegate(this);
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        tableView.setBounceable(false);
        tableView.setTag(LeaderBoardConst.TABLE_TAG);
        tableViewLayer.addChild(tableView);

        this.tableViewRef = tableView;
        var scalePercentage = tableView.getViewSize().height < tableView.getContentSize().height ? tableView.getViewSize().height / tableView.getContentSize().height : 1;
        this.scrollBar = new FBScroller(this, tableViewBG, tableViewLayer.height, res.ScrollerBg_Png, res.Scroller_Png, scalePercentage, LeaderBoardConst.SCROLLBAR_TAG);
        this.scrollBar.setPosition(tableViewBG.width * 0.98, tableViewBG.height * 0.06 + tableViewLayer.height * 0.5);
        tableViewBG.addChild(this.scrollBar);
    },

    tableCellSizeForIndex: function tableCellSizeForIndex(table, idx) {
        var cellHeight = table.getViewSize().height / LeaderBoardConst.VISIBLE_CELL_NO;
        var cellBGImage = idx <= 2 ? res.LeaderboardCellBgLarge_Png : res.LeaderboardCellBgSmall_Png;
        var dummySprite = new cc.Sprite(cellBGImage);
        cellHeight = idx <= 2 ? dummySprite.getContentSize().height : dummySprite.getContentSize().height;
        cellHeight = cellHeight + this.getContentSize().height * 0.005;
        return cc.size(table.getViewSize().width, cellHeight);
    },

    tableCellAtIndex: function tableCellAtIndex(table, idx) {
        var cell = table.dequeueCell();
        if (cell == null) {
            cell = new cc.TableViewCell();
        } else {
            cell.removeAllChildren(true);
        }
        var cellSize = this.tableCellSizeForIndex(table, idx);
        this.addDataInTableview(cellSize, idx, cell);
        return cell;
    },

    numberOfCellsInTableView: function numberOfCellsInTableView(table) {
        return this.PlayerDataArray.length;
    },

    addDataInTableview: function addDataInTableview(size, idx, cell) {
        var userProfile = this.PlayerDataArray[idx];
        var cellBGImage = idx <= 2 ? res.LeaderboardCellBgLarge_Png : res.LeaderboardCellBgSmall_Png;
        var colorLayer = new FBLeaderBoardDataLayer(cc.color.RED, size);
        colorLayer.addLayer(idx, userProfile, cellBGImage);
        cell.addChild(colorLayer);
    },

    scrollViewDidScroll: function scrollViewDidScroll(tableView) {

        var offset = tableView.getContentOffset();
        var minOffset = tableView.minContainerOffset();
        var maxOffset = tableView.maxContainerOffset();

        var percentageMoved = Math.abs(offset.y) / Math.abs(minOffset.y) * 100;
        percentageMoved = Math.min(percentageMoved, 100);
        percentageMoved = Math.max(percentageMoved, 0);

        if (this.scrollBar) {
            this.scrollBar.moveScroller(percentageMoved);
        }
    },
    buttonCallback: function buttonCallback(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                SoundManager.addButtonSound();
                this.removeAllChildren(true);
                this.removeFromParent(true);
        }
    },

    onScrollerMoved: function onScrollerMoved(percentageMoved) {
        var minOffset = this.tableViewRef.minContainerOffset();
        var offsetToMove = percentageMoved / 100 * minOffset.y;
        offsetToMove = offsetToMove >= 0 ? 0 : offsetToMove <= minOffset.y ? minOffset.y : offsetToMove;
        this.tableViewRef.setContentOffset(cc.p(0, offsetToMove));
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

        var container = this.tableViewRef.getContainer();

        var maxInset, minInset;
        var oldPosition = container.getPosition();

        var locScrollDistance = distance;
        container.setPosition(oldPosition.x, oldPosition.y + locScrollDistance);

        maxInset = this.tableViewRef.maxContainerOffset();
        minInset = this.tableViewRef.minContainerOffset();

        //check to see if offset lies within the inset bounds
        var newX = container.getPositionX();
        var newY = container.getPositionY();

        locScrollDistance = locScrollDistance * SCROLL_DEACCEL_RATE;

        this.tableViewRef.setContentOffset(cc.p(newX, newY));

        if (Math.abs(locScrollDistance) <= SCROLL_DEACCEL_DIST || newY > maxInset.y || newY < minInset.y || newX > maxInset.x || newX < minInset.x || newX === maxInset.x || newX === minInset.x || newY === maxInset.y || newY === minInset.y) {
            this.tableViewRef.unschedule(this.moveLeaderboardOnMouseScroller);
            this.tableViewRef._relocateContainer(true);
        }
    },

    getLeaderBoardDataFromServer: function getLeaderBoardDataFromServer() {
        FBProcessIndicator.addLoadingIndicator(FBLeaderBoardLayerRef);
        var serverURL = URLConstants.BaseURL + URLConstants.API_LEADERBOARD_DATA;
        FBNetworkManager.getCall(serverURL, null, function (error, response) {
            if (response && response.data) {
                if (response && response.data.leaderboard.length > 0) FBLeaderBoardLayerRef.addDataInLeaderBoardModel(response.data.leaderboard);else {
                    var alertBox = new AlertBoxLayer(false, StringConstants.ERROR_MSG, FBLeaderBoardLayerRef, FBCharacterSelectionLayerConst.ALERT_BOX_TAG, StringConstants.OK_BUTTON_TITLE_TEXT);
                    FBLeaderBoardLayerRef.getParent().addChild(alertBox);
                }
            }
            FBProcessIndicator.removeLoadingIndicator(FBLeaderBoardLayerRef);
        });
    },

    addDataInLeaderBoardModel: function addDataInLeaderBoardModel(leaderboardData) {
        for (var i = 0; i < leaderboardData.length; i++) {
            var leaderBoardDataModel = new FBLeaderBoardDataModel(leaderboardData[i]);
            FBLeaderBoardLayerRef.PlayerDataArray.push(leaderBoardDataModel);
        }
        FBLeaderBoardLayerRef.setUpUI();
        FBLeaderBoardLayerRef.addMouseEventListner();
        FBLeaderBoardLayerRef.addAnimation();
    },

    onExit: function onExit() {
        this.PlayerDataArray.splice(0, this.PlayerDataArray.length);
        this._super();
    },

    // ********** alert box delegate *************//
    okButtonCallBack: function okButtonCallBack(pSender) {
        this.getParent().getChildByTag(FBCharacterSelectionLayerConst.ALERT_BOX_TAG).removeCustomeAlertBox();
        this.removeFromParent(true);
    }

});