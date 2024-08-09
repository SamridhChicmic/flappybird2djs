"use strict";

/**
 *  Copyright (c) 2018 ChicMic
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

var NetworkResponse = {
    RequestNotInitialised: 0,
    ServerConnectionEstablished: 1,
    RequestReceived: 2,
    ProcessingRequest: 3,
    ResponseReady: 4,
    Success: 200
};

var ServerCallTypeGET = "GET";
var ServerCallTypePOST = "POST";
var HeaderType = "Content-Type";
var ResponseType = "application/json";
var StatusCode = "status";
var FBNetworkManager = function () {

    function getCall(serverURL, data, callback) {
        var data = null;
        var token = FBGameState.getUTMToken() == null ? '' : FBGameState.getUTMToken();
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open(ServerCallTypeGET, serverURL);
        xhr.setRequestHeader(HeaderType, ResponseType);
        xhr.setRequestHeader("utmToken", token);
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.responseText != null && xhr.status == NetworkResponse.Success) {
                // responseLength > 0 && 
                if (xhr.readyState == NetworkResponse.ResponseReady) {
                    var responseText = JSON.parse(xhr.responseText);
                    if (responseText.status == NetworkResponse.Success) {
                        callback(null, JSON.parse(xhr.responseText));
                    } else {
                        callback("error", null);
                    }
                }
            } else if (xhr.status === 0) {
                callback("error", null);
            }
        };
    }

    function postCall(serverURL, data, time, callback) {
        var token = FBGameState.getUTMToken() == null ? '' : FBGameState.getUTMToken();
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open(ServerCallTypePOST, serverURL);
        var securityCode = Utility.getSecurityCode(time);
        xhr.setRequestHeader(HeaderType, ResponseType);
        xhr.setRequestHeader("utmToken", token);
        xhr.setRequestHeader("s-k", securityCode.securityKey);
        xhr.setRequestHeader("c-k", securityCode.serverKey);
        xhr.setRequestHeader("p-f", securityCode.placement);
        xhr.setRequestHeader("t-s", time);

        xhr.send(data);
        xhr.onreadystatechange = function () {
            // var responseLength = Object.keys(xhr.responseText).length;
            if (xhr.responseText != null && xhr.status == NetworkResponse.Success) {
                // responseLength > 0 && 
                if (xhr.readyState == NetworkResponse.ResponseReady) {
                    var responseText = JSON.parse(xhr.responseText);
                    if (responseText.status == NetworkResponse.Success) {
                        callback(null, JSON.parse(xhr.responseText));
                    } else {
                        callback("error", null);
                    }
                }
            } else if (xhr.status === 0) {
                callback("error", null);
            }
        };
    }

    return {
        getCall: getCall,
        postCall: postCall
    };
}();