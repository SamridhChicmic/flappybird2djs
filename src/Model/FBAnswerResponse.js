"use strict";

var FBAnswerResponse = cc.Class.extend({
    tipid: "",
    answerid: "",

    ctor: function ctor(questionID, answerID) {
        this.tipid = questionID;
        this.answerid = answerID;
    }
});