"use strict";

var FBCharacterSelectionLayerRef = null;
var FBCharacterSelectionLayer = cc.LayerColor.extend({
    parentLayerRef: null,
    cellNo: -1,
    birdCharacterData: [],
    appModeServer: true,
    characterLabel: null,

    ctor: function ctor(color, contentSize, position, tag, layerRef, characterLabel) {
        this._super(color);
        this.characterLabel = characterLabel;
        this.setContentSize(contentSize);
        this.setPosition(position);
        this.setTag(tag);
        this.setOpacity(0);
        this.parentLayerRef = layerRef;
        FBCharacterSelectionLayerRef = this;
        if (FBCharacterSelectionLayerRef.birdCharacterData.length == 0) this.getDataFromServer();else FBCharacterSelectionLayerRef.setupUIofCharacterSelectionLayer();
    },

    onEnter: function onEnter() {
        this._super();
    },

    onEnterTransitionDidFinish: function onEnterTransitionDidFinish() {
        this._super();
        this.addSound();
    },

    onExit: function onExit() {
        this._super();
    },

    setupUIofCharacterSelectionLayer: function setupUIofCharacterSelectionLayer() {
        this.addEditBox();
        this.addUnLockButton();
        this.addTableView();
        this.addArrow();
        this.addAnimation();
    },

    addAnimation: function addAnimation() {
        var moveToAction = new cc.MoveTo(0.8, cc.p(0, this.height * 0.5));
        this.runAction(moveToAction);
    },

    addSound: function addSound() {
        SoundManager.playMusic(res.CharacterSelectionSound);
    },

    loadJSONData: function loadJSONData() {
        // birdCharacterDataArray.push(cc.loader.getRes(res.BirdCharacterData));
        // JSON_Data_OF_BIRD_SKIN = cc.loader.getRes(res.BirdSkinData);
    },

    getDataFromServer: function getDataFromServer() {
        var serverURL = URLConstants.BaseURL + URLConstants.API_CHARACTER_DATA;
        FBNetworkManager.getCall(serverURL, null, function (error, response) {
            // if (response && response.data) {

                const character = [
                    {
                       id:1,
                       name: 'BunBun'

                    },
                    {
                        id:2,
                        name:'Ellie'
                    },
                    {
                        id:3 , 
                        name:'Foxy'
                    },
                    {
                        id:4,
                        name:'Parrie'
                    }

                    
                ]
                FBCharacterSelectionLayerRef.populateDataInCharacterArray(character);
                FBCharacterSelectionLayerRef.setupUIofCharacterSelectionLayer();
                FBGameState.setUTMToken("randomtakenfromchandan");
                FBGameState.setInitialGameAPIState(false);
                Utility.createGoogleTrackingEvent("randomtakenfromchandan");
                if (response.data.score) FBGameState.setHighScore(response.data.score);else FBGameState.setHighScore(0);
            // }
            // if (error) {
            //     var errorAlertBox = new AlertBoxLayer(false, StringConstants.ERROR_MSG, FBCharacterSelectionLayerRef, FBCharacterSelectionLayerConst.ALERT_BOX_TAG, StringConstants.RETRY_BUTTON_TITLE_TEXT);
            //     FBCharacterSelectionLayerRef.getParent().addChild(errorAlertBox, 10000);
            // }
        });
    },

    populateDataInCharacterArray: function populateDataInCharacterArray(responseData) {
        FBCharacterSelectionLayerRef.birdCharacterData.splice(0, 0, 0, 0); // adding 0 at index 0 and 1;
        for (var i = 0; i < responseData.length; i++) {
            var characterData = new FBCharacterDataModel(responseData[i]);
            FBCharacterSelectionLayerRef.birdCharacterData.push(characterData);
        }
        // console.log("this.birdCharacterData: "+JSON.stringify(FBCharacterSelectionLayerRef.birdCharacterData));
        Utility.setValueForKeyToLocalStorage(StringConstants.CHARACTER_LOADED_KEY, FBCharacterSelectionLayerRef.birdCharacterData);
    },

    addTableView: function addTableView() {
        var tableView = new cc.TableView(this, cc.size(this.getContentSize().width * 0.6, this.getContentSize().height * 0.7));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.addChild(tableView);
        tableView.setDelegate(this);
        tableView.setTag(TABLEVIEW_TAG);
        tableView.setBounceable(true);
        tableView.setPosition(cc.p(this.getContentSize().width * 0.5 - tableView.getViewSize().width * 0.5, this.getContentSize().height * 0.5 - tableView.getViewSize().height * 0.5));
        tableView.reloadData();
        this.moveTableViewToCenter();
    },

    tableCellSizeForIndex: function tableCellSizeForIndex(table, idx) {
        return cc.size(table.viewSize.width * 1.001 / VISIBLE_CELL, table.viewSize.height);
    },

    scrollViewDidScroll: function scrollViewDidScroll(view) {

        // var cell = this.tableCellAtIndex(view, 5);
        // console.log("cell: "+cell);

        var prevCellNo = this.cellNo;
        var rightButton = this.getChildByTag(RIGHTARROW_TAG);
        var leftButton = this.getChildByTag(LEFTARRROW_TAG);
        var minOffset = view.minContainerOffset.x;
        var maxOffset = view.minContainerOffset.x;
        this.cellNo = this.findCellNo(view);
        this.scaleAdjacentCells();
        view.updateCellAtIndex(this.cellNo);
        view.updateCellAtIndex(prevCellNo);
        view.updateCellAtIndex(this.cellNo + 1);
        if (this.cellNo == EMPTY_CELL) {
            if (leftButton) {
                leftButton.setTouchEnabled(false);
                leftButton.setOpacity(100);
                rightButton.setTouchEnabled(true);
            }
        } else if (this.cellNo == NUMBER_OF_CELLS - (EMPTY_CELL + 1)) {

            leftButton.setTouchEnabled(true);
            rightButton.setTouchEnabled(false);
            rightButton.setOpacity(100);
        } else {
            leftButton.setTouchEnabled(true);
            leftButton.setOpacity(255);
            rightButton.setTouchEnabled(true);
            rightButton.setOpacity(255);
        }
    },

    numberOfCellsInTableView: function numberOfCellsInTableView(table) {
        return NUMBER_OF_CELLS;
    },

    tableCellAtIndex: function tableCellAtIndex(table, idx) {
        var cell = table.dequeueCell();
        var cellSize = this.tableCellSizeForIndex(table, idx);
        !cell ? cell = new cc.TableViewCell() : cell.removeAllChildren(true);
        this.createBirdLockLayer(cellSize, idx, table, cell);
        return cell;
    },

    showShades: function showShades(cellNo) {
        var birdSkinData = JSON_Data_OF_BIRD_SKIN[StringConstants.BIRD_TEXT + cellNo];
        birdSkinDataArray.splice(0, birdSkinData.length);
        birdSkinDataArray.push(birdSkinData);
        this.getChildByTag(TABLEVIEW_TAG).reloadData();
    },

    addUnLockButton: function addUnLockButton() {
        // var unLockButton  =  this.parentLayerRef.createButton(this.parentLayerRef,res.unLockPng,null,cc.p(this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).getPositionX() + this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).getContentSize().width ,this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).getPositionY()),cc.p(0.5,0.5),UNLOCKBUTTON_TAG,this.UnlockButtonCallBack,this);
        // unLockButton.setTitleText("UNLOCK");

    },
    addEditBox: function addEditBox() {
        //  var EditBoxOfUnLockCode = this.parentLayerRef.createEditBox(this.parentLayerRef,res.EditBoxBackGround, EDITBOX_TAG, cc.p(this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).getPositionX(),this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).getPositionY() ),null,this ,"     Enter Code",30,cc.color.BLACK,"Arial",30);
    },

    addArrow: function addArrow() {
        var tableView = this.getChildByTag(TABLEVIEW_TAG);
        var distanceBtwTableViewAndArrow = tableView.getBoundingBox().width * 0.07;
        var leftScrollButton = this.parentLayerRef.createButton(this, res.LeftArrow_Png, null, cc.p(tableView.getPositionX() - distanceBtwTableViewAndArrow, tableView.getPositionY() + tableView.height * 0.5), cc.p(0.5, 0.5), LEFTARRROW_TAG, this.buttonCallback, this);

        var rightScrollButton = this.parentLayerRef.createButton(this, res.RightArrow_Png, null, cc.p(tableView.getPositionX() + tableView.getBoundingBox().width + distanceBtwTableViewAndArrow, tableView.getPositionY() + tableView.height * 0.5), cc.p(0.5, 0.5), RIGHTARROW_TAG, this.buttonCallback, this);

        if (this.findCellNo(tableView) == EMPTY_CELL) {

            leftScrollButton.setOpacity(100);
            leftScrollButton.setTouchEnabled(false);
        }
    },

    UnlockButtonCallBack: function UnlockButtonCallBack(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            switch (sender.getTag()) {
                case UNLOCKBUTTON_TAG:

                    var cellNo = Math.round(Math.abs(this.getChildByTag(TABLEVIEW_TAG).getContentOffset().x / (this.getChildByTag(TABLEVIEW_TAG).getViewSize().width / VISIBLE_CELL))) + 2;
                    if (SHOW_SKIN_STATUS) {
                        this.getChildByTag(TABLEVIEW_TAG).cellAtIndex(cellNo).getChildByTag(BIRDCHARACTER_TAG).removeChild(this.getChildByTag(TABLEVIEW_TAG).cellAtIndex(cellNo).getChildByTag(BIRDCHARACTER_TAG).getChildByTag(LOCK_CHARACTER_SPRITE_TAG));
                        birdSkinDataArray[0][cellNo].status = true;
                        this.parentLayerRef.getChildByTag(FBUnlockLayerConsts.FBUNLOCK_LAYER_TAG).setVisible(false);
                        this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).setVisible(true);
                    } else {

                        this.getChildByTag(TABLEVIEW_TAG).cellAtIndex(cellNo).getChildByTag(BIRDSKINS_TAG).removeChild(this.getChildByTag(TABLEVIEW_TAG).cellAtIndex(cellNo).getChildByTag(BIRDSKINS_TAG).getChildByTag(LOCK_SKINS_SPRITE_TAG));
                        birdCharacterDataArray[0][StringConstants.BIRD_TEXT + this.cellNo].status = true;
                    }
            }
        }
    },

    createBirdLockLayer: function createBirdLockLayer(cellSize, idx, tableView, cell) {


        console.log("Bird lock layer " ,cellSize , idx , tableView , cell )
        console.log("bird data at idx" , this.birdCharacterData[idx]);
        //if(FBCharacterSelectionLayerRef.birdCharacterData.length !== 0) {
        if (SHOW_SKIN_STATUS === true) {

            if (idx > EMPTY_CELL - 1 && idx < NUMBER_OF_CELLS - 2) {
                var skins = this.parentLayerRef.createLayerColor(cell, cc.color(parseInt(birdSkinDataArray[0][idx].red), parseInt(birdSkinDataArray[0][idx].green), parseInt(birdSkinDataArray[0][idx].blue)), cellSize.width * 0.7, cellSize.height, cc.p(0, 0), BIRDCHARACTER_TAG);
                JSON.parse(birdSkinDataArray[0][idx].status) === true ? "" : this.parentLayerRef.createSprite(skins, res.LockedSprite, cc.p(skins.getContentSize().width, skins.getContentSize().height * 0.9), cc.p(1, 1), LOCK_CHARACTER_SPRITE_TAG);
            }
            if (this.cellNo === idx) {
                skins.setScale(1.2);
            }
            if (JSON.parse(birdSkinDataArray[0][this.cellNo].status) === true) {
                this.parentLayerRef.getChildByTag(FBUnlockLayerConsts.FBUNLOCK_LAYER_TAG).setVisible(false);
                this.parentLayerRef.getChildByTag(GAMEPLAYBUTTON_TAG).setVisible(true);
            } else {
                this.parentLayerRef.getChildByTag(FBUnlockLayerConsts.FBUNLOCK_LAYER_TAG).setVisible(true);
            }
        } else {

            if (idx > EMPTY_CELL - 1 && idx < NUMBER_OF_CELLS - 2 && this.birdCharacterData[idx]) {

                var characterLayer = this.parentLayerRef.createLayerColor(cell, cc.color.BLACK, cellSize.width * 0.99, cellSize.height, cc.p(0, 0), BIRDSKINS_TAG);
                characterLayer.setOpacity(0);
                // console.log("this.birdCharacterData[idx].characterName: "+JSON.stringify(this.birdCharacterData));
                //  console.log("Shadow: "+FBCharacterSelectionLayerConst.PATH + this.birdCharacterData[idx].characterName + FBCharacterSelectionLayerConst.SHADOW + FBCharacterSelectionLayerConst.EXTENSION_PNG);
                var character = this.parentLayerRef.createSprite(characterLayer, FBCharacterSelectionLayerConst.PATH + this.birdCharacterData[idx].characterName + FBCharacterSelectionLayerConst.SHADOW + FBCharacterSelectionLayerConst.EXTENSION_PNG, cc.p(cellSize.width * 0.5, cellSize.height * 0.515), cc.p(0.5, 0.5), CHARACTERTAG);

                var characterInfo = this.parentLayerRef.createButton(characterLayer, res.CharacterInfo_Png, null, cc.p(cellSize.width, cellSize.height), cc.p(1, 1), CHARACTER_INFO_TAG, this.buttonCallback, this);
                var characterShadow = this.parentLayerRef.createSprite(characterLayer, res.CharacterShadow_Png, cc.p(cellSize.width * 0.5, cellSize.height * 0.13), cc.p(0.5, 0.5), CHARACTER_SHADOW_TAG);

                characterShadow.setScale(0.55);
                characterInfo.setScale(0);
                character.setScale(0.55);

                if (this.cellNo == idx) {
                    characterInfo.setScale(1);
                    character.setScale(1.15);
                    character.setTexture(FBCharacterSelectionLayerConst.PATH + this.birdCharacterData[idx].characterName + FBCharacterSelectionLayerConst.EXTENSION_PNG);
                    characterShadow.setScale(1.35);
                    this.characterLabel.setString(this.birdCharacterData[idx].characterName);
                }
                if (this.cellNo - 1 == idx || this.cellNo + 1 == idx) {

                    character.setScale(0.75);
                    characterShadow.setScale(0.75);
                }
            }
        }
    },

    findCellNo: function findCellNo(tableView) {
        if (tableView.getContentOffset().x <= tableView.minContainerOffset().x) {
            return NUMBER_OF_CELLS - (EMPTY_CELL + 1);
        } else if (tableView.getContentOffset().x >= tableView.maxContainerOffset().x) {
            return EMPTY_CELL;
        } else {
            return Math.round(Math.abs(tableView.getContentOffset().x / (tableView.getViewSize().width / VISIBLE_CELL))) + 2;
        }
    },

    getBirdId: function getBirdId(cellNo) {
        return this.birdCharacterData[cellNo].characterID;
    },

    buttonCallback: function buttonCallback(pSender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            SoundManager.addButtonSound();
            switch (pSender.getTag()) {

                case RIGHTARROW_TAG:
                    this.scrollTableViewContent(pSender);
                    break;
                case LEFTARRROW_TAG:
                    this.scrollTableViewContent(pSender);
                    break;
                case CHARACTER_INFO_TAG:
                    var cellNo = this.findCellNo(this.getChildByTag(TABLEVIEW_TAG));
                    this.showCharacterInfo(this.getBirdId(cellNo));
                    break;
            }
        }
    },

    scrollTableViewContent: function scrollTableViewContent(pSender) {
        var tableView = this.getChildByTag(TABLEVIEW_TAG);
        var cellWidth = tableView.getViewSize().width / VISIBLE_CELL;
        var currentOffset = parseInt(tableView.getContentOffset().x);
        var cellNo = this.findCellNo(tableView);
        if (pSender.getTag() == RIGHTARROW_TAG) {
            tableView.setContentOffsetInDuration(cc.p(Math.max(tableView.getContentOffset().x - cellWidth, tableView.minContainerOffset().x), 0), 0.1);
        } else if (pSender.getTag() == LEFTARRROW_TAG) {
            this.getChildByTag(RIGHTARROW_TAG).enabled = true;
            tableView.setContentOffsetInDuration(cc.p(Math.min(tableView.getContentOffset().x + cellWidth, 0), 0), 0.1);
        }
    },

    /// function used to show information about character.
    showCharacterInfo: function showCharacterInfo(CharacterID) {
        this.parentLayerRef.addChild(new FBCharacterInfoLayer(CharacterID));
    },

    okButtonCallBack: function okButtonCallBack(pSender) {
        pSender.getParent().getParent().removeFromParent(true);
        this.getDataFromServer();
    },
    scaleAdjacentCells: function scaleAdjacentCells() {

        var tableView = this.getChildByTag(TABLEVIEW_TAG);
        for (var i = 2; i < VISIBLE_CELL + EMPTY_CELL; i++) {

            tableView.updateCellAtIndex(i);
        }
    },

    moveTableViewToCenter: function moveTableViewToCenter() {
        var tableView = this.getChildByTag(TABLEVIEW_TAG);
        if (!tableView) return;
        var cellWidth = tableView.getViewSize().width / VISIBLE_CELL;
        var initialMovement = cellWidth * -2.0;
        tableView.setContentOffsetInDuration(cc.p(initialMovement, 0), 0.1);
    }
});