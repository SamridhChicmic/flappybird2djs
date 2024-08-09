"use strict";

var FBQuestionnaireModel = cc.Class.extend({
    question: "",
    answer: "",
    questionId: "",
    options: [],

    ctor: function ctor(_ref) {
        var tip = _ref.tip,
            id = _ref.id,
            answer_1 = _ref.answer_1,
            answer_2 = _ref.answer_2,
            correct_answer = _ref.correct_answer;

        this.question = tip; //questionnaireData[FBQuestionnaireConst.questionKey];
        this.answer = correct_answer; //questionnaireData[FBQuestionnaireConst.answerKey];
        this.questionId = id; // questionnaireData[FBQuestionnaireConst.questionIdKey];
        this.options = [answer_1, answer_2];
    },

    getAnswer: function getAnswer() {
        return this.answer;
    },

    getQuestion: function getQuestion() {
        return this.question;
    },

    getQuestionById: function getQuestionById(id) {
        if (id == this.questionId) {
            return this.question;
        }
    },

    getOption: function getOption(option) {
        return this.options[option - 1];
    }

});