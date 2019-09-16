import { Decrypter } from "./Decrypter";

export abstract class Html5Audio {
    private static _initialized = false;
    private static _unlocked = false;
    private static _audioElement: HTMLAudioElement = null;
    private static _gainTweenInterval = null;
    private static _tweenGain = 0;
    private static _tweenTargetGain = 0;
    private static _tweenGainStep = 0;
    private static _staticSePath = null;
    private static _url: string;
    private static _isLoading: any;
    private static _buffered: boolean;
    private static _hasError: boolean;
    private static _volume: number;
    private static _loadListeners: any[];
    private static _autoPlay: boolean;
    private static _tweenInterval: any;

    /**
     * Sets up the Html5 Audio.
     *
     * @static
     * @method setup
     * @param {String} url The url of the audio file
     */
    public static setup(url: string) {
        if (!this._initialized) {
            this.initialize();
        }
        this.clear();

        if (Decrypter.hasEncryptedAudio && this._audioElement.src) {
            window.URL.revokeObjectURL(this._audioElement.src);
        }
        this._url = url;
    }

    /**
     * Initializes the audio system.
     *
     * @static
     * @method initialize
     * @return {Boolean} True if the audio system is available
     */
    public static initialize(): boolean {
        if (!this._initialized) {
            if (!this._audioElement) {
                try {
                    this._audioElement = new Audio();
                } catch (e) {
                    this._audioElement = null;
                }
            }
            if (this._audioElement) {
                this._setupEventHandlers();
            }
            this._initialized = true;
        }
        return !!this._audioElement;
    }

    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    public static _setupEventHandlers() {
        document.addEventListener("touchstart", this._onTouchStart.bind(this));
        document.addEventListener(
            "visibilitychange",
            this._onVisibilityChange.bind(this)
        );
        this._audioElement.addEventListener(
            "loadeddata",
            this._onLoadedData.bind(this)
        );
        this._audioElement.addEventListener("error", this._onError.bind(this));
        this._audioElement.addEventListener("ended", this._onEnded.bind(this));
    }

    /**
     * @static
     * @method _onTouchStart
     * @private
     */
    public static _onTouchStart() {
        if (this._audioElement && !this._unlocked) {
            if (this._isLoading) {
                this._load(this._url);
                this._unlocked = true;
            } else {
                if (this._staticSePath) {
                    this._audioElement.src = this._staticSePath;
                    this._audioElement.volume = 0;
                    this._audioElement.loop = false;
                    this._audioElement.play();
                    this._unlocked = true;
                }
            }
        }
    }

    /**
     * @static
     * @method _onVisibilityChange
     * @private
     */
    public static _onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            this._onHide();
        } else {
            this._onShow();
        }
    }

    /**
     * @static
     * @method _onLoadedData
     * @private
     */
    public static _onLoadedData() {
        this._buffered = true;
        if (this._unlocked) {
            this._onLoad();
        }
    }
    /**
     * @static
     * @method _onError
     * @private
     */
    public static _onError() {
        this._hasError = true;
    }

    /**
     * @static
     * @method _onEnded
     * @private
     */
    public static _onEnded() {
        if (!this._audioElement.loop) {
            this.stop();
        }
    }
    /**
     * @static
     * @method _onHide
     * @private
     */
    public static _onHide() {
        this._audioElement.volume = 0;
        this._tweenGain = 0;
    }

    /**
     * @static
     * @method _onShow
     * @private
     */
    public static _onShow() {
        this.fadeIn(0.5);
    }
    /**
     * Clears the audio data.
     *
     * @static
     * @method clear
     */
    public static clear() {
        this.stop();
        this._volume = 1;
        this._loadListeners = [];
        this._hasError = false;
        this._autoPlay = false;
        this._isLoading = false;
        this._buffered = false;
    }

    /**
     * Set the URL of static se.
     *
     * @static
     * @param {String} url
     */
    public static setStaticSe(url: string) {
        if (!this._initialized) {
            this.initialize();
            this.clear();
        }
        this._staticSePath = url;
    }

    /**
     * [read-only] The url of the audio file.
     *
     * @property url
     * @type String
     */
    public static get url() {
        return Html5Audio._url;
    }

    /**
     * The volume of the audio.
     *
     * @property volume
     * @type Number
     */
    public static get volume(): number {
        return Html5Audio._volume;
    }

    public static set volume(value: number) {
        Html5Audio._volume = value;
        if (Html5Audio._audioElement) {
            Html5Audio._audioElement.volume = this._volume;
        }
    }

    /**
     * Checks whether the audio data is ready to play.
     *
     * @static
     * @method isReady
     * @return {Boolean} True if the audio data is ready to play
     */
    public static isReady() {
        return this._buffered;
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @static
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    public static isError() {
        return this._hasError;
    }

    /**
     * Checks whether the audio is playing.
     *
     * @static
     * @method isPlaying
     * @return {Boolean} True if the audio is playing
     */
    public static isPlaying() {
        return !this._audioElement.paused;
    }

    /**
     * Plays the audio.
     *
     * @static
     * @method play
     * @param {Boolean} loop Whether the audio data play in a loop
     * @param {Number} offset The start position to play in seconds
     */
    public static play(loop: boolean, offset: number) {
        if (this.isReady()) {
            offset = offset || 0;
            this._startPlaying(loop, offset);
        } else if (Html5Audio._audioElement) {
            this._autoPlay = true;
            this.addLoadListener(
                function() {
                    if (this._autoPlay) {
                        this.play(loop, offset);
                        if (this._gainTweenInterval) {
                            clearInterval(this._gainTweenInterval);
                            this._gainTweenInterval = null;
                        }
                    }
                }.bind(this)
            );
            if (!this._isLoading) {
                this._load(this._url);
            }
        }
    }

    /**
     * Stops the audio.
     *
     * @static
     * @method stop
     */
    public static stop() {
        if (this._audioElement) {
            this._audioElement.pause();
        }
        this._autoPlay = false;
        if (this._tweenInterval) {
            clearInterval(this._tweenInterval);
            this._tweenInterval = null;
            this._audioElement.volume = 0;
        }
    }

    /**
     * Performs the audio fade-in.
     *
     * @static
     * @method fadeIn
     * @param {Number} duration Fade-in time in seconds
     */
    public static fadeIn(duration: number) {
        if (this.isReady()) {
            if (this._audioElement) {
                this._tweenTargetGain = this._volume;
                this._tweenGain = 0;
                this._startGainTween(duration);
            }
        } else if (this._autoPlay) {
            this.addLoadListener(
                function() {
                    this.fadeIn(duration);
                }.bind(this)
            );
        }
    }

    /**
     * Performs the audio fade-out.
     *
     * @static
     * @method fadeOut
     * @param {Number} duration Fade-out time in seconds
     */
    public static fadeOut(duration: any) {
        if (this._audioElement) {
            this._tweenTargetGain = 0;
            this._tweenGain = this._volume;
            this._startGainTween(duration);
        }
    }

    /**
     * Gets the seek position of the audio.
     *
     * @static
     * @method seek
     */
    public static seek() {
        if (this._audioElement) {
            return this._audioElement.currentTime;
        } else {
            return 0;
        }
    }

    /**
     * Add a callback function that will be called when the audio data is loaded.
     *
     * @static
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    public static addLoadListener(listner: any) {
        this._loadListeners.push(listner);
    }

    /**
     * @static
     * @method _load
     * @param {String} url
     * @private
     */
    public static _load(url: string) {
        if (this._audioElement) {
            this._isLoading = true;
            this._audioElement.src = url;
            this._audioElement.load();
        }
    }

    /**
     * @static
     * @method _startPlaying
     * @param {Boolean} loop
     * @param {Number} offset
     * @private
     */
    public static _startPlaying(loop: boolean, offset: number) {
        this._audioElement.loop = loop;
        if (this._gainTweenInterval) {
            clearInterval(this._gainTweenInterval);
            this._gainTweenInterval = null;
        }
        if (this._audioElement) {
            this._audioElement.volume = this._volume;
            this._audioElement.currentTime = offset;
            this._audioElement.play();
        }
    }

    /**
     * @static
     * @method _onLoad
     * @private
     */
    public static _onLoad() {
        this._isLoading = false;
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener();
        }
    }

    /**
     * @static
     * @method _startGainTween
     * @params {Number} duration
     * @private
     */
    public static _startGainTween(duration: number) {
        this._audioElement.volume = this._tweenGain;
        if (this._gainTweenInterval) {
            clearInterval(this._gainTweenInterval);
            this._gainTweenInterval = null;
        }
        this._tweenGainStep =
            (this._tweenTargetGain - this._tweenGain) / (60 * duration);
        this._gainTweenInterval = setInterval(function() {
            Html5Audio._applyTweenValue(Html5Audio._tweenTargetGain);
        }, 1000 / 60);
    }

    /**
     * @static
     * @method _applyTweenValue
     * @param {Number} volume
     * @private
     */
    public static _applyTweenValue(volume: number) {
        Html5Audio._tweenGain += Html5Audio._tweenGainStep;
        if (Html5Audio._tweenGain < 0 && Html5Audio._tweenGainStep < 0) {
            Html5Audio._tweenGain = 0;
        } else if (
            Html5Audio._tweenGain > volume &&
            Html5Audio._tweenGainStep > 0
        ) {
            Html5Audio._tweenGain = volume;
        }

        if (
            Math.abs(Html5Audio._tweenTargetGain - Html5Audio._tweenGain) < 0.01
        ) {
            Html5Audio._tweenGain = Html5Audio._tweenTargetGain;
            clearInterval(Html5Audio._gainTweenInterval);
            Html5Audio._gainTweenInterval = null;
        }

        Html5Audio._audioElement.volume = Html5Audio._tweenGain;
    }
}
