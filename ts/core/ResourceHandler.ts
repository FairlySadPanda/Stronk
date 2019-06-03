import SceneManager from "../managers/SceneManager";
import Graphics from "./Graphics";

export default abstract class ResourceHandler {
    public static _reloaders: any[];
    public static _defaultRetryInterval: number[];
    public static createLoader: (url: any, retryMethod: any, resignMethod?: any, retryInterval?: any) => () => void;
    public static exists: () => boolean;
    public static retry: () => void;
}

ResourceHandler._reloaders = [];
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];

ResourceHandler.createLoader = function (url, retryMethod, resignMethod?, retryInterval?): () => void {
    retryInterval = retryInterval || this._defaultRetryInterval;
    const reloaders = this._reloaders;
    let retryCount = 0;
    return function () {
        if (retryCount < retryInterval.length) {
            setTimeout(retryMethod, retryInterval[retryCount]);
            retryCount++;
        } else {
            if (resignMethod) {
                resignMethod();
            }
            if (url) {
                if (reloaders.length === 0) {
                    Graphics.printLoadingError(url);
                    SceneManager.stop();
                }
                reloaders.push(function () {
                    retryCount = 0;
                    retryMethod();
                });
            }
        }
    };
};

ResourceHandler.exists = function () {
    return this._reloaders.length > 0;
};

ResourceHandler.retry = function () {
    if (this._reloaders.length > 0) {
        Graphics.eraseLoadingError();
        SceneManager.resume();
        this._reloaders.forEach(function (reloader) {
            reloader();
        });
        this._reloaders.length = 0;
    }
};
