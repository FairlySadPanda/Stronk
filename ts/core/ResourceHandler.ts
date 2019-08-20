import SceneManager from "../managers/SceneManager";
import Graphics from "./Graphics";

export default abstract class ResourceHandler {
    private static _reloaders = [];
    private static _defaultRetryInterval = [500, 1000, 3000];

    public static createLoader(
        url: string,
        retryMethod: (any?: any) => any,
        resignMethod?: (any?: any) => any,
        retryInterval?: number[]
    ): () => void {
        retryInterval = retryInterval || this._defaultRetryInterval;
        const reloaders = this._reloaders;
        let retryCount = 0;
        return function() {
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
                    reloaders.push(function() {
                        retryCount = 0;
                        retryMethod();
                    });
                }
            }
        };
    }

    public static exists() {
        return this._reloaders.length > 0;
    }

    public static retry() {
        if (this._reloaders.length > 0) {
            Graphics.eraseLoadingError();
            SceneManager.resume();
            this._reloaders.forEach(function(reloader) {
                reloader();
            });
            this._reloaders.length = 0;
        }
    }
}
