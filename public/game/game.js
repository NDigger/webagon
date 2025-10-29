import Wall from "./gameContent/wall";
import Polygon from "./gameContent/polygon";
import { Vector2, Color, Size } from "../utils/structures";
import Background from "./gameContent/background";
import GameObject from "./gameContent/gameObject";
import Death from "./gameContent/death";
import Lerp from "../utils/interpolation";

const area = (a, b, c) => {
  return Math.abs(
    (a.x * (b.y - c.y) +
     b.x * (c.y - a.y) +
     c.x * (a.y - b.y)) / 2
  );
}

const pointInTriangle = (p, a, b, c) => {
  const A = area(a, b, c);
  const A1 = area(p, b, c);
  const A2 = area(a, p, c);
  const A3 = area(a, b, p);
  return Math.abs(A - (A1 + A2 + A3)) < 1e-9;
}

const pointInQuad = (p, a, b, c, d) => pointInTriangle(p, a, b, c) || pointInTriangle(p, a, c, d);


function distPointToLine(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let t = dot / len_sq;
  t = Math.max(0, Math.min(1, t));
  const x = x1 + t * C;
  const y = y1 + t * D;
  return Math.hypot(px - x, py - y);
}

function closestSide(pos, points) {
  let minDist = Infinity;
  let sideIndex = -1;
  for (let i = 0; i < 4; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % 4];
    const d = distPointToLine(pos.x, pos.y, p1.x, p1.y, p2.x, p2.y);
    if (d < minDist) {
      minDist = d;
      sideIndex = i;
    }
  }
  return sideIndex;
}

const degToRad = deg => deg * Math.PI / 180;

export default class Game extends GameObject {
    #background;
    #backgroundSwapTime = 1000;
    #backgroundSwapTimer = 1000;
    #backgroundSwapped = false;
    #backgroundRotationOffset = 0;

    #died = false;
    #layer = 0;

    #polygon;
    #deathEffect;

    #walls = [];

    #rotationSpeed = 0;
    #rotationDir = 1;
    #rotation = 0;
    #sides = 6;
    #skew = 0;
    #scale = new Vector2(1, 1);
    #offset = new Vector2(0, 0);
    #centerOffset = new Vector2(0, 0);
    #backgroundTileColors = [];

    #depth3d = 0;
    #distance3d = 0;
    #color3d = null;
    #falloffColor3d = null;

    #mainColor = new Color(0, 0, 0);
    #wallSpawnDistance = 2000;
    #wallSpeedMult = 2;

    #updateId;
    #lastUpdateTime = performance.now();

    #distanceSignal;
    #distanceDelay = -1;

    onDeath = () => {}
    onIncrement = () => {}
    onPreIncrement = () => {}

    constructor(appContext) {
        super(appContext)
        this.#background = new Background(appContext);
        this.#background.setLayer(this.#getBackgroundLayer());
        this.#polygon = new Polygon(appContext);
        this.#polygon.setLayer(this.#getPolygonLayer());
        this.#polygon.set3dLayer(this.#get3dLayer());

        // replacing schedule draw with normal draw
        this.#polygon.redrawEnabled = false;
        this.#background.redrawEnabled = false;

        this.setMainColor(new Color(40, 40, 0))
        this.setBackgroundTileColors([
            new Color(245, 245, 245),
            new Color(235, 235, 235),
        ])

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    #getPolygonLayer() { return this.#layer + 0.004}
    #getWallsLayer() { return this.#layer + 0.003}
    #get3dLayer() { return this.#layer + 0.002}
    #getBackgroundLayer() { return this.#layer + 0.001}

    #getDefault3dColor() { 
        const brightness = .5
        return new Color(this.#mainColor.r * brightness, this.#mainColor.g * brightness, this.#mainColor.b * brightness, this.#mainColor.a) 
    }
    #get3dColor() { return this.#color3d ?? this.#getDefault3dColor() }

    kill() {
        if (this.destroyed) return
        // this.#polygon.player.positionRedrawEnabled = false;
        // this.#polygon.redrawEnabled = true;
        // this.#background.redrawEnabled = true;
        // this.#walls.forEach(w => w.redrawEnabled = true);

        const d = new Death(this.appContext);
        d.setSkew(this.#skew);
        d.setOffset(this.#polygon.player.getPointPosition());
        d.setRotation(this.#rotation)
        d.setCenterOffset(this.#centerOffset);
        d.set3dLayer(this.#get3dLayer());
        d.setScale(this.#scale);

        d.set3dColor(this.#get3dColor());
        d.set3dDepth(this.#depth3d);
        d.set3dDistance(this.#distance3d);
        d.setSides(this.#sides)
        if (this.#falloffColor3d != null) d.set3dFalloffColor(this.#falloffColor3d)

        this.#polygon.player.setSwapEnabled(false);
        this.#polygon.player.setMovementEnabled(false);

        this.#deathEffect = d;
        this.#died = true;
        
        this.draw();
        this.onDeath()
    }

    draw() {
        this.#background.draw();
        this.#polygon.draw();
        if (this.#deathEffect) this.#deathEffect.draw();
        this.#walls.forEach(w => w.draw());
    }

    scheduleDraw() {
        this.#background.scheduleDraw();
        this.#polygon.scheduleDraw();
        if (this.#deathEffect != undefined) this.#deathEffect.scheduleDraw();
    }

    #updateBackground() {
        this.#background.setRotation(this.#rotation + this.#backgroundRotationOffset);
        const bgTileColors = this.#backgroundTileColors;
        const newArr = this.#backgroundSwapped
                        ? bgTileColors
                        : [bgTileColors[bgTileColors.length - 1], ...bgTileColors.slice(0, bgTileColors.length - 1)];
        this.#background.setTileColors(newArr);
        this.#polygon.setColor(bgTileColors[this.#backgroundSwapped || bgTileColors.length === 1 ? 0 : 1]);
    }

    #swapBackground() {
        this.#backgroundSwapped = !this.#backgroundSwapped;
    }

    #update(time) {
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;

        if (!this.#died) {            
            this.#rotation += this.#rotationSpeed * this.#rotationDir * frameTime;
            this.#polygon.setRotation(this.#rotation)

            this.#backgroundSwapTimer -= frameTime;
            if (this.#backgroundSwapTimer < 0) {
                this.#backgroundSwapTimer = this.#backgroundSwapTime;
                this.#swapBackground();
            }
        }
        
        this.#updateBackground();
        this.#background.draw();
        this.#polygon.draw();

        if (!this.#died && this.#distanceDelay > 0) {
            this.#distanceDelay -= frameTime * this.#wallSpeedMult / 5;
            if (this.#distanceDelay <= 0 && typeof(this.#distanceSignal) === 'function') this.#distanceSignal()
        }
        let hasDiedNextFrame = this.#died;
        this.#walls = this.#walls.filter(wall => {
            if (hasDiedNextFrame) return true
            
            if (wall.getDistance() > this.#polygon.getDistance() + this.#polygon.getThickness()) {
                wall.setDistance(wall.getDistance() - frameTime * this.#wallSpeedMult / 5)
            } else if (wall.getThickness() > 0) {
                wall.setThickness(wall.getThickness() - frameTime * this.#wallSpeedMult / 5)
            }

            if (wall.getThickness() <= 0 || wall.getDistance() <= 0) {
                wall.destroy()
                return false;
            }

            wall.setRotation(this.#rotation)
            wall.draw()

            const pos = wall.getVertexAbsolutePos4();
            if (pointInQuad(this.#polygon.player.getPointAbsolutePosition(), pos[0], pos[1], pos[2], pos[3])
            && !this.#died) {
                const side = closestSide(this.#polygon.player.getPointAbsolutePosition(), pos)
                if (side === 3) this.kill()
                else {
                    this.#polygon.player.setRotationOffset(this.#polygon.player.previousFrameRotationOffset)
                    this.#polygon.draw()
                }
            };

            return true
        })
        if (this.#died) this.#walls.forEach(w => w.draw());

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    createWall(side, thickness) {
        if (this.#died) return; 
        const wall = new Wall(this.appContext);
        wall.setSides(this.#sides)
        wall.setSide(Math.floor(side))
        wall.setThickness(thickness);
        wall.setRotation(this.#rotation)
        wall.setColor(this.#mainColor);
        wall.setDistance(this.#wallSpawnDistance);
        wall.setLayer(this.#getWallsLayer());
        wall.setSkew(this.#skew);
        wall.setScale(this.#scale)
        wall.setCenterOffset(this.#centerOffset);
        wall.setOffset(this.#offset)
        wall.redrawEnabled = false;

        if (this.#falloffColor3d) wall.set3dFalloffColor(this.#falloffColor3d);
        wall.set3dDepth(this.#depth3d);
        wall.set3dDistance(this.#distance3d);
        wall.set3dLayer(this.#get3dLayer());
        wall.set3dColor(this.#get3dColor());

        wall.draw();

        this.#walls.push(wall);
    }
    setLayer(v) {
        this.#layer = v;
        this.#background.setLayer(this.#getBackgroundLayer());
        this.#background.set3dLayer(this.#get3dLayer());
        this.#polygon.setLayer(this.#getPolygonLayer());
        this.#polygon.set3dLayer(this.#get3dLayer());
        this.#walls.forEach(wall => {
            wall.setLayer(this.#getWallsLayer());
            wall.set3dLayer(this.#get3dLayer());
        })
    }
    getLayer() { return this.#layer }
    setRotation(v) { if (typeof(v) === 'number') this.#rotation = v; }
    getRotation() { return this.#rotation }
    setRotationSpeed(v) { if (typeof(v) === 'number') this.#rotationSpeed = v; }
    getRotationSpeed() { return this.#rotationSpeed }
    setRadius(v) { if (typeof(v) === 'number') this.#polygon.setThickness(v); }
    getRadius() { return this.#polygon.getThickness() }
    setSkew(v) {
        if (typeof(v) !== 'number') return
        this.#skew = v
        this.#background.setSkew(v);
        this.#polygon.setSkew(v);
        if (this.#deathEffect !== undefined) this.#deathEffect.setSkew(v);
        this.#walls.forEach(wall => wall.setSkew(v));        
    }
    getSkew() { return this.#skew; }
    setSides(v) {
        if (typeof(v) !== 'number') return
        this.#background.setSides(v);
        this.#polygon.setSides(v);
        if (this.#deathEffect !== undefined) this.#deathEffect.setSides(v);
        this.#sides = v;
    }
    getSides() { return this.#sides; }
    setBackgroundTileColors(arr) {
        this.#backgroundTileColors = arr;
        this.#updateBackground();
    }
    getBackgroundTileColors() { return this.#backgroundTileColors; }
    setBackgroundRotationOffset(v) {
        if (typeof(v) === 'number') this.#backgroundRotationOffset = v;
    }
    getBackgroundRotationOffset() { return this.#backgroundRotationOffset; }
    setBackgroundRadius(v) {
        if (typeof(v) !== 'number') return
        this.#background.setThickness(v);
    }
    getBackgroundRadius() { return this.#background.getThickness() }
    setMainColor({r, g, b, a}) {
        const color = new Color(r, g, b, a)
        this.#mainColor = color;
        this.#polygon.setBorderColor(color);
        this.#polygon.setPlayerColor(color);

        this.#walls.forEach(w => {
            w.setColor(color)
            if (this.#color3d === null) w.set3dColor(this.#getDefault3dColor());
        });
        if (this.#color3d === null) this.#polygon.set3dColor(this.#getDefault3dColor());
    }
    getMainColor() { return this.#mainColor }
    setPolygonColor({r, g, b, a}) {
        this.#polygon.setColor(new Color(r, g, b, a))
    }
    getPolygonColor() { return this.#polygon.getColor() }
    setWallSpawnDistance(v) {
        if (typeof(v) !== 'number') return;
        this.#wallSpawnDistance = v;
    }
    getWallSpawnDistance() { return this.#wallSpawnDistance }
    setWallSpeedMult(v) {
        if (typeof(v) !== 'number') return;
        this.#wallSpeedMult = v;
    }
    getWallSpeedMult() { return this.#wallSpeedMult }
    set3dDepth(v) {
        if (typeof(v) !== 'number') return;
        const depth = Math.floor(v);
        this.#depth3d = depth;
        this.#walls.forEach(wall => wall.set3dDepth(depth));
        this.#polygon.set3dDepth(depth)
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dDepth(v);
    }
    get3dDepth() { return this.#depth3d }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.#walls.forEach(wall => wall.set3dDistance(v));
        this.#polygon.set3dDistance(v)
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dDistance(v);
    }
    get3dDistance() { return this.#distance3d }
    set3dColor({r, g, b, a}) {
        if (r != null && g != null && b != null) {
            const color = new Color(r, g, b, a);
            this.#color3d = color;
            this.#polygon.set3dColor(color)
            if (this.#deathEffect !== undefined) this.#deathEffect.set3dColor(color);
            this.#walls.forEach(wall => wall.set3dColor(color));
        } else {
            if (this.#deathEffect !== undefined) this.#deathEffect.set3dColor(this.#getDefault3dColor);
            this.#walls.forEach(wall => wall.set3dColor(this.#getDefault3dColor()));
        }
    }
    get3dColor() { return this.#color3d; }
    clear3dColor() {
        this.#color3d = null;
    }
    set3dFalloffColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        this.#falloffColor3d = color;
        this.#polygon.set3dFalloffColor(color);
        if (this.#deathEffect !== undefined) this.#deathEffect.set3dFalloffColor(color);
        this.#walls.forEach(wall => wall.set3dFalloffColor(color));
    }
    get3dFalloffColor() { return this.#falloffColor3d; }
    clear3dFalloffColor() {
        this.#falloffColor3d = null;
        this.#polygon.clear3dFalloffColor();
        this.#walls.forEach(w => w.clear3dFalloffColor());
    }
    setSwapEnabled(v) {
        if (typeof(v) !== 'boolean') return
        this.#polygon.player.setSwapEnabled(v)
    }
    getSwapEnabled() { return this.#polygon.player.getSwapEnabled(); }
    setScale({x, y}) {
        const scale = new Vector2(x, y);
        this.#scale = scale;
        this.#polygon.setScale(scale);
        this.#background.setScale(scale);
        if (this.#deathEffect !== undefined) this.#deathEffect.setScale(scale);
        this.#walls.forEach(wall => wall.setScale(scale));
    }
    getScale() { return this.#scale; }
    setOffset({x, y}) {
        const offset = new Vector2(x, y);
        this.#offset = offset;
        this.#polygon.setOffset(offset);
        this.#background.setOffset(offset);
        this.#walls.forEach(wall => wall.setOffset(offset));
    }
    getOffset() { return this.#offset; }
    setCenterOffset({x, y}) {
        const offset = new Vector2(x, y);
        this.#centerOffset = offset;
        this.#polygon.setCenterOffset(offset);
        this.#background.setCenterOffset(offset);
        this.#walls.forEach(wall => wall.setCenterOffset(offset));
    }
    getCenterOffset() { return this.#centerOffset; }
    setBackgroundSwapTime(v) {
        if (typeof(v) !== 'number') return
        this.#backgroundSwapTime = v*1000;
        this.#backgroundSwapTimer = v*1000;
    }
    getBackgroundSwapTime() { return this.#backgroundSwapTime }
    setPlayerRotationOffset(v) {
        this.#polygon.player.setRotationOffset(v);
    }
    getPlayerRotationOffset() { return this.#polygon.player.getRotationOffset() }
    setPlayerSize({width, height}) {
        this.#polygon.player.setSize(new Size(width, height));
    }
    getPlayerSize() { return this.#polygon.player.getSize() }
    setPlayerDistanceMult(v) {
        this.#polygon.setPlayerDistanceMult(v);
    }
    getPlayerDistanceMult() { return this.#polygon.getPlayerDistanceMult() }

    clearWalls() {
        this.#walls.forEach(wall => wall.destroy());
        this.#walls = [];
    }
    destroy() {
        if (this.destroyed) return
        this.destroyed = true;
        this.#died = true;
        cancelAnimationFrame(this.#updateId);
        requestAnimationFrame(() => {
            this.clearWalls();
            this.#polygon.destroy();
            this.#background.destroy();
            if (this.#deathEffect != undefined) this.#deathEffect.destroy();
        })
    }
    getWallCount() { return this.#walls.length }
    async distanceDelay(distance) {
        this.#distanceDelay = Math.max(distance, 1)
        return new Promise(resolve => {
            this.#distanceSignal = resolve;
        });
    }
}