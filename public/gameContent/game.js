import Wall from "./wall";
import Polygon from "./polygon";
import { Vector2, Color, Size } from "../utils/structures";
import Background from "./background";
import GameObject from "./gameObject";
import Death from "./death";
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
    #wallSpawnDistance = 1000;
    #wallSpeedMult = 2;

    #updateId;
    #lastUpdateTime = performance.now();
    #lastRenderStageTime = performance.now();

    #distanceSignal;
    #distanceDelay = -1;

    #incrementTime = 15;
    #incrementTimer = 0;
    #isIncrementing = false;

    #rotationSpeedIncrement = 0;
    #wallSpeedIncrement = 0;

    onDeath = () => {}
    onStep = async () => {}
    onIncrement = () => {}
    onPreIncrement = () => {}

    constructor(appContext) {
        super(appContext)
        this.#background = new Background(appContext);
        this.#background.setLayer(this.#getBackgroundLayer());
        this.#polygon = new Polygon(appContext);
        this.#polygon.setLayer(this.#getPolygonLayer());
        this.#polygon.set3dLayer(this.#get3dLayer());

        this.setMainColor(new Color(40, 40, 0))
        this.setBackgroundTileColors([
            new Color(245, 245, 245),
            new Color(235, 235, 235),
        ])

        this.step();

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

    async step() {
        if (typeof this.onStep !== 'function' || this.onStep.toString() === 'async () => {}') return;

        while (true && !this.died && !this.#isIncrementing) {
            await this.onStep();
        }
    }

    kill() {
        this.#polygon.player.positionRedrawEnabled = false;

        new Lerp(v => {
            this.setShakePower(v)
            this.#background.scheduleDraw()
            this.#polygon.scheduleDraw()
        }).apply(30).run(0, 0.35);

        this.setShakePower(10);
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
        
        this.onDeath()
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
        this.#updateBackground()
    }

    #preIncrement() {
        this.#rotationDir = this.#rotationDir * -1;
        this.#incrementTimer = 0;
        this.onPreIncrement();
        this.#isIncrementing = true;
        this.#rotationSpeed += this.#rotationSpeedIncrement;
    }

    #increment() {
        this.#isIncrementing = false;
        this.#wallSpeedMult += this.#wallSpeedIncrement;
        console.log(this.#wallSpeedMult)
        this.step();
        this.onIncrement();
    }

    #update(time) {
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;

        this.#walls.forEach(wall => {
            // Wall absolute position
            const pos = wall.getVertexAbsolutePos4();
            if (pointInQuad(this.#polygon.player.getPointAbsolutePosition(), pos[0], pos[1], pos[2], pos[3])
            && !this.#died) this.kill();
            wall.setRotation(this.#rotation)
        })

        if (!this.#died && this.#distanceDelay > 0) {
            this.#distanceDelay -= frameTime * this.#wallSpeedMult / 5;
            if (this.#distanceDelay <= 0 && typeof(this.#distanceSignal) === 'function') this.#distanceSignal()
        }
        this.#walls = this.#walls.filter(wall => {
            if (this.#died) {
                return true
            };
            
            if (wall.getDistance() > this.#polygon.getDistance() + this.#polygon.getThickness()) {
                wall.setDistance(wall.getDistance() - frameTime * this.#wallSpeedMult / 5)
            } else if (wall.getThickness() > 0) {
                wall.setThickness(wall.getThickness() - frameTime * this.#wallSpeedMult / 5)
            }

            if (wall.getThickness() <= 0 || wall.getDistance() <= 0) {
                wall.destroy()
                return false;
            }
            return true
        })

        if (!this.#died) {
            this.#incrementTimer += frameTime/1000;

            if (this.#incrementTimer > this.#incrementTime) {
                this.#preIncrement();
            }
            
            this.#rotation += this.#rotationSpeed * this.#rotationDir * frameTime;
            this.#polygon.setRotation(this.#rotation)
            this.#updateBackground()

            this.#backgroundSwapTimer -= frameTime;
            if (this.#backgroundSwapTimer < 0) {
                this.#backgroundSwapTimer = this.#backgroundSwapTime;
                this.#swapBackground();
            }

            if (this.#isIncrementing && this.#walls.length === 0) this.#increment();
        }

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

        if (this.#falloffColor3d) wall.set3dFalloffColor(this.#falloffColor3d);
        wall.set3dDepth(this.#depth3d);
        wall.set3dDistance(this.#distance3d);
        wall.set3dLayer(this.#get3dLayer());
        wall.set3dColor(this.#get3dColor());

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
    setRotation(v) { if (typeof(v) === 'number') this.#rotation = v; }
    getRotation() { return this.#rotation }
    setRotationSpeed(v) { if (typeof(v) === 'number') this.#rotationSpeed = v; }
    getRotationSpeed() { return this.#rotationSpeed }
    setRadius(v) { if (typeof(v) === 'number') this.#polygon.setThickness(v); }
    getRadius() { return this.#polygon.getThickness() }
    setIncrementTime(v) {
        if (typeof(v) !== 'number') return
        this.#incrementTime = v;
    }
    getIncrementTime() { return this.#incrementTime }
    setWallSpeedIncrement(v) {
        if (typeof(v) !== 'number') return
        this.#wallSpeedIncrement = v;
    } 
    getWallSpeedIncrement() { return this.#wallSpeedIncrement }
    setRotationSpeedIncrement(v) {
        if (typeof(v) !== 'number') return
        this.#rotationSpeedIncrement = v;
    }
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
    setShakePower(v) {
        if (typeof(v) !== 'number') return
        globalThis.shakePower = v;
    }
    getShakePower() { return globalThis.shakePower }
    setSwapEnabled(v) {
        if (typeof(v) !== 'boolean') return
        this.#polygon.player.setSwapEnabled(v)
        document.getElementById('swap-enabled-msg').style.display = v ? 'block' : 'none'
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
    getPlayerSize() { return this.#polygon.player.getPlayerSize() }
    setPlayerDistanceMult(v) {
        this.#polygon.setPlayerDistanceMult(v);
    }
    getPlayerDistanceMult() { return this.#polygon.getPlayerDistanceMult() }

    clearWalls() {
        this.#walls.forEach(wall => wall.destroy());
        this.#walls = [];
    }
    destroy() {
        this.#died = true;
        cancelAnimationFrame(this.#updateId);
        requestAnimationFrame(() => {
            this.clearWalls();
            this.#polygon.destroy();
            this.#background.destroy();
            if (this.#deathEffect != undefined) this.#deathEffect.destroy();
        })
    }
    async distanceDelay(distance) {
        this.#distanceDelay = Math.max(distance, 1)
        return new Promise(resolve => {
            this.#distanceSignal = resolve;
        });
    }
}