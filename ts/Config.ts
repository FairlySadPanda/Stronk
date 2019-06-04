interface Config {
    width: number;
    height: number;
    rendererType: RendererType;
}

export type RendererType = "canvas" | "webgl" | "auto";

export const Config: Config = {
    width: 1920,
    height: 1080,
    rendererType: "auto"
};
