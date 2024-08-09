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

/**
 * PGSoundManager: This will handle all the sound functionality of the gme.
 * @type {{getInstance, playSound, playMusic, stopMusic, stopAllSound, isMusicRunning, preloadMusic}}
 */

var SoundManager = function () {
    return {

        playSound: function playSound(soundName, isLoopRequired) {
            if (!parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
                cc.audioEngine.playEffect(soundName, isLoopRequired);
            }
        },

        playMusic: function playMusic(musicName, isLoopRequired) {
            if (!parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
                cc.audioEngine.playMusic(musicName, isLoopRequired);
            }
        },

        stopMusic: function stopMusic() {
            cc.audioEngine.stopMusic(true);
        },

        stopAllSound: function stopAllSound() {
            cc.audioEngine.stopAllEffects();
        },

        isMusicRunning: function isMusicRunning() {
            return cc.audioEngine.isMusicPlaying();
        },

        preloadMusic: function preloadMusic(soundName) {
            // cc.audioEngine.preload(soundName);
        },

        addButtonSound: function addButtonSound() {
            if (!parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
                cc.audioEngine.playEffect(res.ButtonSound);
            }
        },

        pauseSound: function pauseSound() {
            if (!parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
                cc.audioEngine.pauseMusic();
            }
        },

        resumeSound: function resumeSound() {
            if (!parseInt(Utility.getValueForKeyFromLocalStorage(StringConstants.SOUND_KEY))) {
                cc.audioEngine.resumeMusic();
            }
        }
    };
}();