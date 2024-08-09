"use strict";

var WorldScale = 32;
// var size ;
// size = cc.director.getWinSize();
// cc.log("FBPhysics size =", size);

var FBPhysicsBody = {
    /**
     * addBody in Physics world
     * @function
     * @param  body position in x and y
     * @param  body is isDynamic or not
     * @param  imageName use as userData
     * @param  type of body
     * @param  world reference
     * @return body
     */
    addBody: function addBody(posX, posY, isDynamic, imageName, type, world) {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        if (isDynamic) {
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        } else {
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        }
        bodyDef.position.Set(posX / WorldScale, posY / WorldScale);
        bodyDef.userData = {
            bodyType: type,
            asset: imageName
        };
        var body = world.CreateBody(bodyDef);
        return body;
    },

    /**
     * add fixture on body
     * @function
     * @return fixture
     */
    addFixture: function addFixture() {
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1;
        fixtureDef.friction = 0.1;
        fixtureDef.restitution = 0.0;
        return fixtureDef;
    },

    /**
     * add circularShape on body
     * @function
     * @param body (on which shape added)
     * @param radius for giving circular shape.
     * @return body after added shape fixture
     */
    addCircularShape: function addCircularShape(body, radius) {
        var fixtureDef = this.addFixture();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
        fixtureDef.shape.SetRadius(radius / WorldScale);
        body.CreateFixture(fixtureDef);
    },

    /**
     * add rectangularShape on body
     * @function
     * @param body (on which shape added)
     * @param width and height  for giving rectangular shape.
     * @return body after added shape fixture
     */
    addRectangularShape: function addRectangularShape(body, width, height) {
        var fixtureDef = this.addFixture();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        fixtureDef.shape.SetAsBox(width / WorldScale, height / WorldScale);
        body.CreateFixture(fixtureDef);
    },

    /**
     * get Body shape
     * @function
     * @param body (which shape we want)
     * @return bodyShape
     */
    getBodyShape: function getBodyShape(body) {
        var bodyShape = body.GetFixtureList().GetShape();
        return bodyShape;
    },

    /**
     * set Category bits of body
     * @function
     * @param body (on which category bits set)
     */
    setCategoryBits: function setCategoryBits(body, categoryBits) {
        var bodyFilter = body.GetFixtureList().GetFilterData();
        bodyFilter.categoryBits = categoryBits;
    },

    /**
     * set Mask bits of body
     * @function
     * @param body (on which category bits set)
     */

    setMaskBits: function setMaskBits(body, maskBits) {
        var bodyFilter = body.GetFixtureList().GetFilterData();
        bodyFilter.maskBits = maskBits;
    }
};