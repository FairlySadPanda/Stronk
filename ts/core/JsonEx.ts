export abstract class JsonEx {
    /**
     * The maximum depth of objects.
     *
     * @static
     * @property maxDepth
     * @type Number
     * @default 100
     */
    public static maxDepth: number = 100;

    /**
     * Converts an object to a JSON string with object information.
     *
     * @static
     * @method stringify
     * @param {Object} object The object to be converted
     * @return {String} The JSON string
     */
    public static stringify(object) {
        const circular = [];
        JsonEx._id = 1;
        const json = JSON.stringify(JsonEx._encode(object, circular, 0));
        JsonEx._cleanMetadata(object);
        JsonEx._restoreCircularReference(circular);

        return json;
    }

    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @static
     * @method parse
     * @param {String} json The JSON string
     * @return {Object} The reconstructed object
     */
    public static parse(json) {
        const circular = [];
        const registry = {};
        const contents = this._decode(JSON.parse(json), circular, registry);
        this._cleanMetadata(contents);
        this._linkCircularReference(contents, circular, registry);

        return contents;
    }

    /**
     * Makes a deep copy of the specified object.
     *
     * @static
     * @method makeDeepCopy
     * @param {Object} object The object to be copied
     * @return {Object} The copied object
     */
    public static makeDeepCopy(object): object {
        return this.parse(this.stringify(object));
    }
    private static _id: number = 1;

    private static _generateId() {
        return JsonEx._id++;
    }

    private static _restoreCircularReference(circulars) {
        circulars.forEach(function(circular) {
            const key = circular[0];
            const value = circular[1];
            const content = circular[2];

            value[key] = content;
        });
    }

    private static _linkCircularReference(contents, circulars, registry) {
        circulars.forEach(function(circular) {
            const key = circular[0];
            const value = circular[1];
            const id = circular[2];

            value[key] = registry[id];
        });
    }

    private static _cleanMetadata(object) {
        if (!object) {
            return;
        }

        delete object["@"];
        delete object["@c"];

        if (typeof object === "object") {
            Object.keys(object).forEach(function(key) {
                const value = object[key];
                if (typeof value === "object") {
                    JsonEx._cleanMetadata(value);
                }
            });
        }
    }

    /**
     * @static
     * @method _encode
     * @param {Object} value
     * @param {Array} circular
     * @param {Number} depth
     * @return {Object}
     * @private
     */
    private static _encode(value: object, circular: any[], depth: number) {
        depth = depth || 0;
        if (++depth >= this.maxDepth) {
            throw new Error("Object too deep");
        }
        const type = value ? value.toString() : "";
        if (type === "[object Object]" || type === "[object Array]") {
            value["@c"] = JsonEx._generateId();

            const constructorName = this._getConstructorName(value);
            if (constructorName !== "Object" && constructorName !== "Array") {
                value["@"] = constructorName;
            }
            for (const key in value) {
                if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                    if (value[key] && typeof value[key] === "object") {
                        if (value[key]["@c"]) {
                            circular.push([key, value, value[key]]);
                            value[key] = { "@r": value[key]["@c"] };
                        } else {
                            value[key] = this._encode(
                                value[key],
                                circular,
                                depth + 1
                            );

                            if (value[key] instanceof Array) {
                                // wrap array
                                circular.push([key, value, value[key]]);

                                value[key] = {
                                    "@c": value[key]["@c"],
                                    "@a": value[key]
                                };
                            }
                        }
                    } else {
                        value[key] = this._encode(
                            value[key],
                            circular,
                            depth + 1
                        );
                    }
                }
            }
        }
        depth--;
        return value;
    }

    /**
     * @static
     * @method _decode
     * @param {Object} value
     * @param {Array} circular
     * @param {Object} registry
     * @return {Object}
     * @private
     */

    private static _decode(
        value: object,
        circular: object[],
        registry: object
    ) {
        const type = value ? value.toString() : "";
        if (type === "[object Object]" || type === "[object Array]") {
            registry[value["@c"]] = value;

            if (value["@"]) {
                const constructor: any = window[value["@"]];
                if (constructor) {
                    value = this._resetPrototype(value, constructor.prototype);
                }
            }
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key] && value[key]["@a"]) {
                        // object is array wrapper
                        const body = value[key]["@a"];
                        body["@c"] = value[key]["@c"];
                        value[key] = body;
                    }
                    if (value[key] && value[key]["@r"]) {
                        // object is reference
                        circular.push([key, value, value[key]["@r"]]);
                    }
                    value[key] = this._decode(value[key], circular, registry);
                }
            }
        }
        return value;
    }

    /**
     * @static
     * @method _getConstructorName
     * @param {Object} value
     * @return {String}
     * @private
     */
    private static _getConstructorName(value) {
        let name = value.constructor.name;
        if (name === undefined) {
            const func = /^\s*function\s*([A-Za-z0-9_$]*)/;
            name = func.exec(value.constructor)[1];
        }
        return name;
    }

    /**
     * @static
     * @method _resetPrototype
     * @param {Object} value
     * @param {Object} prototype
     * @return {Object}
     * @private
     */
    private static _resetPrototype(value, prototype) {
        Object.setPrototypeOf(value, prototype);
        return value;
        // if (Object.setPrototypeOf !== undefined) {

        // } else if ("__proto__" in value) {
        //     value.__proto__ = prototype;
        // } else {
        //     const newValue = Object.create(prototype);
        //     for (const key in value) {
        //         if (value.hasOwnProperty(key)) {
        //             newValue[key] = value[key];
        //         }
        //     }
        //     value = newValue;
        // }
    }
}
