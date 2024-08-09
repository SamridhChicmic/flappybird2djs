"use strict";

var FBLeaderBoardDataModel = cc.Class.extend({

    ctor: function ctor(data) {
        this.rank = data[FBLeaderBoardDataModelConst.RANK_KEY];
        this.userId = data[FBLeaderBoardDataModelConst.USER_ID_KEY];
        this.name = data[FBLeaderBoardDataModelConst.NAME_KEY];
        this.character = data[FBLeaderBoardDataModelConst.CHARACTER_ID_KEY];
        this.score = data[FBLeaderBoardDataModelConst.SCORE_KEY];
    }

});