"use strict";

// FBScroller Delegate method

var FBScrollerDelegate = cc.Class.extend({

    onScrollerMoved: function onScrollerMoved(movePercentage) {}
});

var FBScroller = cc.Sprite.extend({
    _scroller: null,
    delegate: null,
    ctor: function ctor(delegate, parent, height, scrollerBg, scroller, scalePercenatge, tag) {
        this._super(scrollerBg);
        this.delegate = delegate;
        this.setScaleY(height / this.height);
        this.setTag(tag);
        this._scroller = new ccui.Button(scroller, scroller);
        this._scroller.setAnchorPoint(cc.p(0.5, 0));
        this._scroller.setScaleY(scalePercenatge);
        this._scroller.setPosition(this.width * 0.5, this.height - this._scroller.height * this._scroller.getScaleY());
        this.addChild(this._scroller);
        this._scroller.addTouchEventListener(this.buttonCallback, this);
    },

    moveScroller: function moveScroller(moveDistance) {
        var initialPos = this.height - this._scroller.height * this._scroller.getScaleY();
        var finalPos = moveDistance / 100 * initialPos;
        this._scroller.setPositionY(finalPos);
    },

    buttonCallback: function buttonCallback(pSender, type) {

        switch (type) {

            case ccui.Widget.TOUCH_ENDED:
                break;

            case ccui.Widget.TOUCH_MOVED:
                var distance = pSender.getParent().convertToNodeSpace(pSender.getTouchMovePosition());
                var percentageMoved = distance.y / pSender.getParent().getContentSize().height * 100;
                // if(distance.x >= 0 && distance.x <= pSender.getParent().width)
                this.delegate.onScrollerMoved(percentageMoved);
        }
    }
});