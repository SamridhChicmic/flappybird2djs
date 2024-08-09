"use strict";

var FBBaseColorLayer = cc.LayerColor.extend({
    ctor: function ctor(layerReference, color, contentSize, position, tag) {
        this._super(color);
        this.setContentSize(contentSize);
        this.setPosition(position);
        this.setTag(tag);
        layerReference.addChild(this);
    },
    onEnter: function onEnter() {
        this._super();
    },

    onExit: function onExit() {
        this._super();
    }

});