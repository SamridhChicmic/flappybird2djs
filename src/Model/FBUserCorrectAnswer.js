"use strict";

var FBUserCorrectAnswer = cc.Class.extend({
    question: "",
    correctAnswer: "",
    userAnswer: "",

    ctor: function ctor(question, correctAnswer, userAnswer) {

        this.question = question;
        this.correctAnswer = correctAnswer;
        this.userAnswer = userAnswer;
    }
});