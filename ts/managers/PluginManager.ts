import { IPlugin } from "../IPlugin";

export class PluginManager {
    private static _path = "../plugins/";
    private static _scripts = [];
    private static _errorUrls = [];
    private static _parameters = {};

    public static setup(plugins: IPlugin[]) {
        plugins.forEach(function(plugin) {
            if (plugin.status && !(this._scripts.indexOf(plugin.name) > -1)) {
                this.setParameters(plugin.name, plugin.parameters);
                require(PluginManager._path + plugin.name);
                this._scripts.push(plugin.name);
            }
        }, this);
    }

    public static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            throw new Error("Failed to load: " + url);
        }
    }

    public static parameters(name) {
        return this._parameters[name.toLowerCase()] || {};
    }

    public static setParameters(name, parameters) {
        this._parameters[name.toLowerCase()] = parameters;
    }

    public static loadScript(name) {
        const url = this._path + name;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script.src = url;
        document.body.appendChild(script);
    }

    public static onError(e) {
        this._errorUrls.push(e.target._url);
    }
}
