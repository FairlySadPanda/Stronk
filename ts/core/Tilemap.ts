import * as PIXI from "pixi.js";
import PluginManager from "../managers/PluginManager";
import Bitmap from "./Bitmap";
import Graphics from "./Graphics";
import Point from "./Point";
import ConfigManager from "../managers/ConfigManager";

PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;

export default class Tilemap extends PIXI.Container {
    /**
     * The width of the screen in pixels.
     *
     * @property width
     * @type Number
     */
    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        if (this._width !== value) {
            this._width = value;
            this._createLayers();
        }
    }

    /**
     * The height of the screen in pixels.
     *
     * @property height
     * @type Number
     */
    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        if (this._height !== value) {
            this._height = value;
            this._createLayers();
        }
    }

    /**
     * The width of a tile in pixels.
     *
     * @property tileWidth
     * @type Number
     */

    public get tileWidth(): number {
        return this._tileWidth;
    }

    public set tileWidth(value: number) {
        if (this._tileWidth !== value) {
            this._tileWidth = value;
            this._createLayers();
        }
    }

    /**
     * The height of a tile in pixels.
     *
     * @property tileHeight
     * @type Number
     */
    public get tileHeight() {
        return this._tileHeight;
    }

    public set tileHeight(value) {
        if (this._tileHeight !== value) {
            this._tileHeight = value;
            this._createLayers();
        }
    }

    // Tile type checkers

    public static TILE_ID_B = 0;
    public static TILE_ID_C = 256;
    public static TILE_ID_D = 512;
    public static TILE_ID_E = 768;
    public static TILE_ID_A5 = 1536;
    public static TILE_ID_A1 = 2048;
    public static TILE_ID_A2 = 2816;
    public static TILE_ID_A3 = 4352;
    public static TILE_ID_A4 = 5888;
    public static TILE_ID_MAX = 8192;

    // Autotile shape number to coordinates of tileset images

    public static FLOOR_AUTOTILE_TABLE = [
        [[2, 4], [1, 4], [2, 3], [1, 3]],
        [[2, 0], [1, 4], [2, 3], [1, 3]],
        [[2, 4], [3, 0], [2, 3], [1, 3]],
        [[2, 0], [3, 0], [2, 3], [1, 3]],
        [[2, 4], [1, 4], [2, 3], [3, 1]],
        [[2, 0], [1, 4], [2, 3], [3, 1]],
        [[2, 4], [3, 0], [2, 3], [3, 1]],
        [[2, 0], [3, 0], [2, 3], [3, 1]],
        [[2, 4], [1, 4], [2, 1], [1, 3]],
        [[2, 0], [1, 4], [2, 1], [1, 3]],
        [[2, 4], [3, 0], [2, 1], [1, 3]],
        [[2, 0], [3, 0], [2, 1], [1, 3]],
        [[2, 4], [1, 4], [2, 1], [3, 1]],
        [[2, 0], [1, 4], [2, 1], [3, 1]],
        [[2, 4], [3, 0], [2, 1], [3, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 4], [1, 4], [0, 3], [1, 3]],
        [[0, 4], [3, 0], [0, 3], [1, 3]],
        [[0, 4], [1, 4], [0, 3], [3, 1]],
        [[0, 4], [3, 0], [0, 3], [3, 1]],
        [[2, 2], [1, 2], [2, 3], [1, 3]],
        [[2, 2], [1, 2], [2, 3], [3, 1]],
        [[2, 2], [1, 2], [2, 1], [1, 3]],
        [[2, 2], [1, 2], [2, 1], [3, 1]],
        [[2, 4], [3, 4], [2, 3], [3, 3]],
        [[2, 4], [3, 4], [2, 1], [3, 3]],
        [[2, 0], [3, 4], [2, 3], [3, 3]],
        [[2, 0], [3, 4], [2, 1], [3, 3]],
        [[2, 4], [1, 4], [2, 5], [1, 5]],
        [[2, 0], [1, 4], [2, 5], [1, 5]],
        [[2, 4], [3, 0], [2, 5], [1, 5]],
        [[2, 0], [3, 0], [2, 5], [1, 5]],
        [[0, 4], [3, 4], [0, 3], [3, 3]],
        [[2, 2], [1, 2], [2, 5], [1, 5]],
        [[0, 2], [1, 2], [0, 3], [1, 3]],
        [[0, 2], [1, 2], [0, 3], [3, 1]],
        [[2, 2], [3, 2], [2, 3], [3, 3]],
        [[2, 2], [3, 2], [2, 1], [3, 3]],
        [[2, 4], [3, 4], [2, 5], [3, 5]],
        [[2, 0], [3, 4], [2, 5], [3, 5]],
        [[0, 4], [1, 4], [0, 5], [1, 5]],
        [[0, 4], [3, 0], [0, 5], [1, 5]],
        [[0, 2], [3, 2], [0, 3], [3, 3]],
        [[0, 2], [1, 2], [0, 5], [1, 5]],
        [[0, 4], [3, 4], [0, 5], [3, 5]],
        [[2, 2], [3, 2], [2, 5], [3, 5]],
        [[0, 2], [3, 2], [0, 5], [3, 5]],
        [[0, 0], [1, 0], [0, 1], [1, 1]]
    ];

    public static WALL_AUTOTILE_TABLE = [
        [[2, 2], [1, 2], [2, 1], [1, 1]],
        [[0, 2], [1, 2], [0, 1], [1, 1]],
        [[2, 0], [1, 0], [2, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[2, 2], [3, 2], [2, 1], [3, 1]],
        [[0, 2], [3, 2], [0, 1], [3, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 0], [3, 0], [0, 1], [3, 1]],
        [[2, 2], [1, 2], [2, 3], [1, 3]],
        [[0, 2], [1, 2], [0, 3], [1, 3]],
        [[2, 0], [1, 0], [2, 3], [1, 3]],
        [[0, 0], [1, 0], [0, 3], [1, 3]],
        [[2, 2], [3, 2], [2, 3], [3, 3]],
        [[0, 2], [3, 2], [0, 3], [3, 3]],
        [[2, 0], [3, 0], [2, 3], [3, 3]],
        [[0, 0], [3, 0], [0, 3], [3, 3]]
    ];

    public static WATERFALL_AUTOTILE_TABLE = [
        [[2, 0], [1, 0], [2, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 0], [3, 0], [0, 1], [3, 1]]
    ];

    public static isVisibleTile(tileId: number) {
        return tileId > 0 && tileId < this.TILE_ID_MAX;
    }

    public static isAutotile(tileId: number) {
        return tileId >= this.TILE_ID_A1;
    }

    public static getAutotileKind(tileId: number) {
        return Math.floor((tileId - this.TILE_ID_A1) / 48);
    }

    public static getAutotileShape(tileId: number) {
        return (tileId - this.TILE_ID_A1) % 48;
    }

    public static makeAutotileId(kind: number, shape: number) {
        return this.TILE_ID_A1 + kind * 48 + shape;
    }

    public static isSameKindTile(tileID1: any, tileID2: any) {
        if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
            return (
                this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2)
            );
        } else {
            return tileID1 === tileID2;
        }
    }

    public static isTileA1(tileId: number | string) {
        return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    }

    public static isTileA2(tileId: number | string) {
        return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    }

    public static isTileA3(tileId: number | string) {
        return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    }

    public static isTileA4(tileId: number | string) {
        return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    }

    public static isTileA5(tileId: number | string) {
        return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    }

    public static isWaterTile(tileId: number) {
        if (this.isTileA1(tileId)) {
            return !(
                tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192
            );
        } else {
            return false;
        }
    }

    public static isWaterfallTile(tileId: number) {
        if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
            return this.getAutotileKind(tileId) % 2 === 1;
        } else {
            return false;
        }
    }

    public static isGroundTile(tileId: any) {
        return (
            this.isTileA1(tileId) ||
            this.isTileA2(tileId) ||
            this.isTileA5(tileId)
        );
    }

    public static isShadowingTile(tileId: any) {
        return this.isTileA3(tileId) || this.isTileA4(tileId);
    }

    public static isRoofTile(tileId: any) {
        return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    public static isWallTopTile(tileId: any) {
        return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    public static isWallSideTile(tileId: any) {
        return (
            (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8
        );
    }

    public static isWallTile(tileId: any) {
        return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    }

    public static isFloorTypeAutotile(tileId: any) {
        return (
            (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) ||
            this.isWallTopTile(tileId)
        );
    }

    public static isWallTypeAutotile(tileId: any) {
        return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    }

    public static isWaterfallTypeAutotile(tileId: any) {
        return this.isWaterfallTile(tileId);
    }

    public _lastBitmapLength: number;
    public lowerLayer: any;
    public upperLayer: any;
    public roundPixels: any;
    public lowerZLayer: PIXI.tilemap.ZLayer;
    public upperZLayer: PIXI.tilemap.ZLayer;
    public animationFrame: number;
    public _needsRepaint: boolean;
    public _lastAnimationFrame: any;
    public _lastStartX: number;
    public _lastStartY: number;
    public _frameUpdated: boolean;
    public _lowerBitmap: Bitmap;
    public _upperBitmap: Bitmap;
    public _lowerLayer: any;
    public _upperLayer: any;
    public _margin: number;
    public _width: number;
    public _height: number;
    public _tileWidth: number;
    public _tileHeight: number;
    public _mapWidth: number;
    public _mapHeight: number;
    public _mapData: any;
    public _layerWidth: number;
    public _layerHeight: number;
    public _lastTiles: any[];
    public bitmaps: Bitmap[];
    public origin: any;
    public flags: any[];
    public animationCount: number;
    public horizontalWrap: boolean;
    public verticalWrap: boolean;

    public constructor() {
        super();
        this._margin = 20;
        // this._width = Graphics.width + this._margin * 2;
        // this._height = Graphics.height + this._margin * 2;
        this._width = ConfigManager.fieldResolution.widthPx + this._margin * 2;
        this._height =
            ConfigManager.fieldResolution.heightPx + this._margin * 2;
        this._tileWidth = 48;
        this._tileHeight = 48;
        this._mapWidth = 0;
        this._mapHeight = 0;
        this._mapData = null;
        this._layerWidth = 0;
        this._layerHeight = 0;
        this._lastTiles = [];

        /**
         * The bitmaps used as a tileset.
         *
         * @property bitmaps
         * @type Array
         */
        this.bitmaps = [];

        /**
         * The origin point of the tilemap for scrolling.
         *
         * @property origin
         * @type Point
         */
        this.origin = new Point();

        /**
         * The tileset flags.
         *
         * @property flags
         * @type Array
         */
        this.flags = [];

        /**
         * The animation count for autotiles.
         *
         * @property animationCount
         * @type Number
         */
        this.animationCount = 0;

        /**
         * Whether the tilemap loops horizontal.
         *
         * @property horizontalWrap
         * @type Boolean
         */
        this.horizontalWrap = false;

        /**
         * Whether the tilemap loops vertical.
         *
         * @property verticalWrap
         * @type Boolean
         */
        this.verticalWrap = false;

        this._createLayers();
        this.refresh();
    }

    /**
     * Sets the tilemap data.
     *
     * @method setData
     * @param {Number} width The width of the map in number of tiles
     * @param {Number} height The height of the map in number of tiles
     * @param {Array} data The one dimensional array for the map data
     */
    public setData(width: number, height: number, data: any) {
        this._mapWidth = width;
        this._mapHeight = height;
        this._mapData = data;
    }

    /**
     * Checks whether the tileset is ready to render.
     *
     * @method isReady
     * @type Boolean
     * @return {Boolean} True if the tilemap is ready
     */
    public isReady() {
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Updates the tilemap for each frame.
     *
     * @method update
     */
    public update = function() {
        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);
        this.children.forEach(function(child: { update: () => void }) {
            if (child.update) {
                child.update();
            }
        });
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i]) {
                this.bitmaps[i].touch();
            }
        }
    };

    /**
     * PIXI render method
     *
     * @method renderCanvas
     * @param {Object} pixi renderer
     */
    public renderCanvas(renderer: PIXI.CanvasRenderer) {
        this._hackRenderer(renderer);
        super.renderCanvas(renderer);
    }

    /**
     * PIXI render method
     *
     * @method renderWebGL
     * @param {Object} pixi renderer
     */
    public renderWebGL(renderer: PIXI.WebGLRenderer) {
        this._hackRenderer(renderer);
        super.renderWebGL(renderer);
    }

    /**
     * Forces to repaint the entire tilemap AND update bitmaps list if needed
     *
     * @method refresh
     */
    public refresh() {
        if (this._lastBitmapLength !== this.bitmaps.length) {
            this._lastBitmapLength = this.bitmaps.length;
            this.refreshTileset();
        }
        this._needsRepaint = true;
    }

    /**
     * Call after you update tileset
     *
     * @method updateBitmaps
     */
    public refreshTileset() {
        const bitmaps = this.bitmaps.map(function(x) {
            return x.baseTexture ? new PIXI.Texture(x.baseTexture) : x;
        });
        this.lowerLayer.setBitmaps(bitmaps);
        this.upperLayer.setBitmaps(bitmaps);
    }

    /**
     * @method updateTransform
     * @private
     */
    public updateTransform() {
        let ox = 0;
        let oy = 0;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        const startX = Math.floor((ox - this._margin) / this._tileWidth);
        const startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (
            this._needsRepaint ||
            this._lastStartX !== startX ||
            this._lastStartY !== startY
        ) {
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
        super.updateTransform();
    }

    /**
     * @method _isHigherTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    private _isHigherTile(tileId: string | number) {
        return this.flags[tileId] & 0x10;
    }

    /**
     * @method _isTableTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    private _isTableTile(tileId: string | number): boolean {
        return Tilemap.isTileA2(tileId) && Boolean(this.flags[tileId] & 0x80);
    }

    /**
     * @method _isOverpassPosition
     * @param {Number} mx
     * @param {Number} my
     * @return {Boolean}
     * @private
     */
    private _isOverpassPosition(mx: any, my: any) {
        return false;
    }

    /**
     * @method _sortChildren
     * @private
     */
    private _sortChildren() {
        this.children.sort(this._compareChildOrder.bind(this));
    }

    /**
     * @method _compareChildOrder
     * @param {Object} a
     * @param {Object} b
     * @private
     */
    private _compareChildOrder(
        a: { z: number; y: number; spriteId: number },
        b: { z: number; y: number; spriteId: number }
    ) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    }

    /**
     * Uploads animation state in renderer
     *
     * @method _hackRenderer
     * @private
     */
    private _hackRenderer(renderer: {
        plugins: { tilemap: { tileAnim: number[] } };
    }) {
        let af = this.animationFrame % 4;
        if (af === 3) {
            af = 1;
        }
        renderer.plugins.tilemap.tileAnim[0] = af * this._tileWidth;
        renderer.plugins.tilemap.tileAnim[1] =
            (this.animationFrame % 3) * this._tileHeight;
        return renderer;
    }

    /**
     * @method _createLayers
     * @private
     */
    private _createLayers() {
        this._needsRepaint = true;

        if (!this.lowerZLayer) {
            this.addChild(
                (this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0))
            );
            this.addChild(
                (this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4))
            );

            const parameters = PluginManager.parameters("ShaderTilemap");
            const useSquareShader = Number(
                parameters.hasOwnProperty("squareShader")
                    ? parameters["squareShader"]
                    : 0
            );

            this.lowerZLayer.addChild(
                (this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(
                    0,
                    [],
                    useSquareShader
                ))
            );
            this.lowerLayer.shadowColor = new Float32Array([
                0.0,
                0.0,
                0.0,
                0.5
            ]);
            this.upperZLayer.addChild(
                (this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(
                    4,
                    [],
                    useSquareShader
                ))
            );
        }
    }

    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    private _updateLayerPositions(startX: number, startY: number) {
        let ox = 0;
        let oy = 0;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        this.lowerZLayer.position.x = startX * this._tileWidth - ox;
        this.lowerZLayer.position.y = startY * this._tileHeight - oy;
        this.upperZLayer.position.x = startX * this._tileWidth - ox;
        this.upperZLayer.position.y = startY * this._tileHeight - oy;
    }

    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    private _paintAllTiles(startX: number, startY: number) {
        this.lowerZLayer.clear();
        this.upperZLayer.clear();
        const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (let y = 0; y < tileRows; y++) {
            for (let x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    }

    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    private _paintTiles(startX: number, startY: number, x: number, y: number) {
        const mx = startX + x;
        const my = startY + y;
        const dx = x * this._tileWidth;
        const dy = y * this._tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);
        const lowerLayer = this.lowerLayer.children[0];
        const upperLayer = this.upperLayer.children[0];

        if (this._isHigherTile(tileId0)) {
            this._drawTile(upperLayer, tileId0, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId0, dx, dy);
        }
        if (this._isHigherTile(tileId1)) {
            this._drawTile(upperLayer, tileId1, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId1, dx, dy);
        }

        this._drawShadow(lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
            }
        }

        if (this._isOverpassPosition(mx, my)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            if (this._isHigherTile(tileId2)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId2, dx, dy);
            }
            if (this._isHigherTile(tileId3)) {
                this._drawTile(upperLayer, tileId3, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId3, dx, dy);
            }
        }
    }

    /**
     * @method _drawTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    private _drawTile(layer: any, tileId: any, dx: number, dy: number) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(layer, tileId, dx, dy);
            } else {
                this._drawNormalTile(layer, tileId, dx, dy);
            }
        }
    }

    /**
     * @method _drawNormalTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    private _drawNormalTile(
        layer: {
            addRect: (
                arg0: number,
                arg1: number,
                arg2: number,
                arg3: any,
                arg4: any,
                arg5: number,
                arg6: number
            ) => void;
        },
        tileId: number,
        dx: any,
        dy: any
    ) {
        let setNumber = 0;

        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }

        const w = this._tileWidth;
        const h = this._tileHeight;
        const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
        const sy = (Math.floor((tileId % 256) / 8) % 16) * h;

        layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    }

    /**
     * @method _drawAutotile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    private _drawAutotile(
        layer: {
            addRect: {
                (
                    arg0: number,
                    arg1: number,
                    arg2: number,
                    arg3: any,
                    arg4: any,
                    arg5: number,
                    arg6: number,
                    arg7: number,
                    arg8: number
                ): void;
                (
                    arg0: number,
                    arg1: number,
                    arg2: number,
                    arg3: any,
                    arg4: any,
                    arg5: number,
                    arg6: number,
                    arg7: number,
                    arg8: number
                ): void;
                (
                    arg0: number,
                    arg1: number,
                    arg2: number,
                    arg3: any,
                    arg4: any,
                    arg5: number,
                    arg6: number,
                    arg7: number,
                    arg8: number
                ): void;
            };
        },
        tileId: any,
        dx: number,
        dy: number
    ) {
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let bx = 0;
        let by = 0;
        let setNumber = 0;
        let isTable = false;
        let animX = 0;
        let animY = 0;

        if (Tilemap.isTileA1(tileId)) {
            setNumber = 0;
            if (kind === 0) {
                animX = 2;
                by = 0;
            } else if (kind === 1) {
                animX = 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
                if (kind % 2 === 0) {
                    animX = 2;
                } else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    animY = 1;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        const table = autotileTable[shape];
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 4; i++) {
            const qsx = table[i][0];
            const qsy = table[i][1];
            const sx1 = (bx * 2 + qsx) * w1;
            const sy1 = (by * 2 + qsy) * h1;
            const dx1 = dx + (i % 2) * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                let qsx2 = qsx;
                const qsy2 = 3;
                if (qsy === 1) {
                    // qsx2 = [0, 3, 2, 1][qsx];
                    qsx2 = (4 - qsx) % 4;
                }
                const sx2 = (bx * 2 + qsx2) * w1;
                const sy2 = (by * 2 + qsy2) * h1;
                layer.addRect(
                    setNumber,
                    sx2,
                    sy2,
                    dx1,
                    dy1,
                    w1,
                    h1,
                    animX,
                    animY
                );
                layer.addRect(
                    setNumber,
                    sx1,
                    sy1,
                    dx1,
                    dy1 + h1 / 2,
                    w1,
                    h1 / 2,
                    animX,
                    animY
                );
            } else {
                layer.addRect(
                    setNumber,
                    sx1,
                    sy1,
                    dx1,
                    dy1,
                    w1,
                    h1,
                    animX,
                    animY
                );
            }
        }
    }

    /**
     * @method _drawTableEdge
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    private _drawTableEdge(
        layer: {
            addRect: (
                arg0: number,
                arg1: number,
                arg2: number,
                arg3: any,
                arg4: any,
                arg5: number,
                arg6: number
            ) => void;
        },
        tileId: any,
        dx: number,
        dy: number
    ) {
        if (Tilemap.isTileA2(tileId)) {
            const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            const kind = Tilemap.getAutotileKind(tileId);
            const shape = Tilemap.getAutotileShape(tileId);
            const tx = kind % 8;
            const ty = Math.floor(kind / 8);
            const setNumber = 1;
            const bx = tx * 2;
            const by = (ty - 2) * 3;
            const table = autotileTable[shape];
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 2; i++) {
                const qsx = table[2 + i][0];
                const qsy = table[2 + i][1];
                const sx1 = (bx * 2 + qsx) * w1;
                const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                const dx1 = dx + (i % 2) * w1;
                const dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
            }
        }
    }

    /**
     * @method _drawShadow
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    private _drawShadow(
        layer: {
            addRect: (
                arg0: number,
                arg1: number,
                arg2: number,
                arg3: any,
                arg4: any,
                arg5: number,
                arg6: number
            ) => void;
        },
        shadowBits: number,
        dx: number,
        dy: number
    ) {
        if (shadowBits & 0x0f) {
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
                }
            }
        }
    }

    /**
     * @method _readMapData
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {Number}
     * @private
     */
    private _readMapData(x: number, y: number, z: number) {
        if (this._mapData) {
            const width = this._mapWidth;
            const height = this._mapHeight;
            if (this.horizontalWrap) {
                x = x % width;
            }
            if (this.verticalWrap) {
                y = y % height;
            }
            if (x >= 0 && x < width && y >= 0 && y < height) {
                return this._mapData[(z * height + y) * width + x] || 0;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
}
