declare const nw: any;

export default abstract class Utils {

    public static get RPGMAKER_NAME() {
        return "MV";
    }

    public static get RPGMAKER_VERSION() {
        return "1.6.2";
    }

    public static isOptionValid(name: string): boolean {
        return (location.search.slice(1).split("&").indexOf(name) > -1)
            || (typeof nw !== "undefined" && nw.App.argv.length > 0 && nw.App.argv[0].split("&").indexOf(name) > -1);
    }

    public static isNwjs(): boolean {
        return true;
    }

    public static isMobileDevice(): boolean {
        return false;
    }

    public static isMobileSafari(): boolean {
        return false;
    }

    public static isAndroidChrome(): boolean {
        return false;
    }

    public static clamp(number: number, min: number, max: number) {
        return Math.min(Math.max(number, min), max);
    }

    public static format(baseString: string, ...strings: any[]) {
        return baseString.replace(/%([0-9]+)/g, function (s, n) {
            return strings[Number(n) - 1];
        });
    }

    public static arrayEquals(array1: any[], array2: any[]) {
        if (!array2 || array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                if (!this.arrayEquals(array1[i], array2[i])) {
                    return false;
                }
            } else if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    public static arrayClone(array: any[]): any[] {
        return array.slice(0);
    }

    public static padZero(input: string | number, length: number): string {
        let returnString = typeof input === "number"? input.toString() : input;

        while (returnString.length < length) {
            returnString = "0" + returnString;
        }
        return returnString;
    }

    public static randomInt(max: number) {
        return Math.floor(max * Math.random());
    }

    public static canReadGameFiles(): boolean {
        const scripts = document.getElementsByTagName("script");
        const lastScript = scripts[scripts.length - 1];
        const xhr = new XMLHttpRequest();
        try {
            xhr.open("GET", lastScript.src);
            xhr.overrideMimeType("text/javascript");
            xhr.send();
            return true;
        } catch (e) {
            return false;
        }
    }

    public static rgbToCssColor(r: number, g: number, b: number): string {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    public static generateRuntimeId(): number {
        return this.id++;
    }

    public static isSupportPassiveEvent(): boolean {
        if (typeof this.supportPassiveEvent === "boolean") {
            return this.supportPassiveEvent;
        }
        let passive = false;
        const options = Object.defineProperty({}, "passive", {
            "get"() { passive = true; }
        });
        window.addEventListener("test", null, options);
        this.supportPassiveEvent = passive;
        return passive;
    }

    private static id = 1;
    private static supportPassiveEvent = null;
}
