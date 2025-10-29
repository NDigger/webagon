import PolygonObject from "./polygonObject";
import { Color, Vector2 } from "../../utils/structures";
import Player from "./player";

class PolygonBorder extends PolygonObject {
    constructor(appContext) {
        super(appContext);
        this.setThickness(5);
        this.draw();
    }
}

export default class Polygon extends PolygonObject {
    player = new Player(this.appContext);
    #border = new PolygonBorder(this.appContext);
    #playerDistanceMult = 1.25;

    constructor(appContext) {
        super(appContext);
        this.setThickness(60);
        this.draw();
    }

    draw() {
        super.draw();
        this.player.draw();
        this.#border.draw();
    }

    scheduleDraw() {
        super.scheduleDraw();
        this.player.scheduleDraw();
        this.#border.scheduleDraw();
    }

    setSides(v) {
        super.setSides(v);
        this.#border.setSides(v);
    }

    setSkew(v) {
        super.setSkew(v)
        this.player.setSkew(v);
        this.#border.setSkew(v);
    }

    setPlayerDistanceMult(v) {
        if (typeof(v) !== 'number') return
        this.#playerDistanceMult = v;
        this.scheduleDraw();
    }
    getPlayerDistanceMult() { return this.#playerDistanceMult }

    setThickness(v) {
        const borderThickness = this.#border.getThickness();
        super.setThickness(v - borderThickness)
        this.player.setDistance(v * this.#playerDistanceMult)
        this.#border.setDistance(v - borderThickness);
    }

    setLayer(v) {
        super.setLayer(v)
        this.player.setLayer(v - 0.0001);
        this.#border.setLayer(v);
    }

    setRotation(v) {
        super.setRotation(v)
        this.player.setRotation(v);
        this.#border.setRotation(v);
    }

    setScale({x, y}) {
        const scale = new Vector2(x, y);
        super.setScale(scale)
        this.player.setScale(scale)
        this.#border.setScale(scale);
    }

    setBorderColor({r, g, b, a}) {
        this.#border.setColor(new Color(r, g, b, a))
    }
    getBorderColor() {
        return this.#border.getColor();
    }

    setPlayerColor({r, g, b, a}) {
        this.player.setColor(new Color(r, g, b, a))
    }

    getPlayerColor() {
        return this.player.getColor();
    }

    set3dDepth(v) {
        // super.set3dDepth(v);
        this.player.set3dDepth(v);
        this.#border.set3dDepth(v);
    }

    set3dDistance(v) {
        // super.set3dDistance(v);
        this.player.set3dDistance(v);
        this.#border.set3dDistance(v);
    }

    set3dLayer(v) {
        super.set3dLayer(v);
        this.player.set3dLayer(v);
        this.#border.set3dLayer(v);
    }

    set3dColor(v) {
        this.player.set3dColor(v);
        this.#border.set3dColor(v);
    }

    set3dFalloffColor(v) {
        this.player.set3dFalloffColor(v);
        this.#border.set3dFalloffColor(v);
    }

    clear3dFalloffColor() {
        this.player.clear3dFalloffColor();
        this.#border.clear3dFalloffColor();
    }

    setOffset({x, y}) {
        const offset = new Vector2(x, y);
        super.setOffset(offset);
        this.#border.setOffset(offset);
        this.player.setOffset(offset);
    }

    setCenterOffset({x, y}) {
        const offset = new Vector2(x, y);
        super.setCenterOffset(offset);
        this.#border.setCenterOffset(offset);
        this.player.setCenterOffset(offset);
    }

    destroy() {
        super.destroy();
        this.player.destroy();
        this.#border.destroy();
    }
}