export default class PluginManager {
    public static _path: string;
    public static _scripts: any[];
    public static _errorUrls: any[];
    public static _parameters: {};
    public static setup: (plugins: any) => void;
    public static checkErrors: () => void;
    public static parameters: (name: any) => any;
    public static setParameters: (name: any, parameters: any) => void;
    public static loadScript: (name: any) => void;
    public static onError: (e: any) => void;
}
PluginManager._path = "js/plugins/";
PluginManager._scripts = [];
PluginManager._errorUrls = [];
PluginManager._parameters = {};

PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
        if (plugin.status && !(this._scripts.indexOf(plugin.name) > -1)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + ".js");
            this._scripts.push(plugin.name);
        }
    }, this);
};

PluginManager.checkErrors = function() {
    const url = this._errorUrls.shift();
    if (url) {
        throw new Error("Failed to load: " + url);
    }
};

PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

PluginManager.loadScript = function(name) {
    const url = this._path + name;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script.src = url;
    document.body.appendChild(script);
};

PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};
