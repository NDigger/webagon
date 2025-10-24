import Wall from "./wall";
import Polygon from "./polygon";
import { Vector2, Color } from "./structures";
import Background from "./background";
import GameObject from "./gameObject";
import Death from "./death";

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

export default class Game extends GameObject {
    #background;
    #backgroundSwapTime = 1000;
    #backgroundSwapTimer = 1000;
    #backgroundSwapped = false;
    #backgroundRotationOffset = 0;

    #died = false;
    #layer = 0;

    #polygon;

    #walls = [];

    #lasttime = performance.now();

    #rotationSpeed = 0;
    #rotation = 0;
    #sides = 6;

    #depth3d = 0;
    #distance3d = 0;
    #color3d = null;

    #mainColor = new Color(0, 0, 0);
    #wallSpawnDistance = 1000;
    #wallSpeedMult = 2;

    #skew = 0;

    onUpdate = () => {}

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

        document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            this.kill()
        }
        });


        requestAnimationFrame(time => this.#update(time));
    }

    #getPolygonLayer() { return this.#layer + 0.004}
    #getWallsLayer() { return this.#layer + 0.003}
    #get3dLayer() { return this.#layer + 0.002}
    #getBackgroundLayer() { return this.#layer + 0.001}

    #getDefault3dColor() { 
        const brightness = .5
        return new Color(this.#mainColor.r * brightness, this.#mainColor.g * brightness, this.#mainColor.b * brightness) 
    }
    #get3dColor() { return this.#color3d ?? this.#getDefault3dColor() }

    kill() {
        const d = new Death(this.appContext);
        d.setSkew(this.#skew);
        d.setOffset(this.#polygon.getPlayerPosition())
        d.setRotation(this.#polygon.getPlayerRotation());
        d.set3dLayer(this.#get3dLayer());

        d.set3dColor(this.#get3dColor());
        d.set3dDepth(this.#depth3d);
        d.set3dDistance(this.#distance3d);
        d.setSides(this.#sides)
        this.#died = true;
        
    }

    #updateBackgroundRotation() {
        this.#background.setRotation(this.#rotation + this.#backgroundRotationOffset + this.#backgroundSwapped * (360 / this.#sides));
        const bgTileColors = this.#background.getTileColors();
        this.#polygon.setColor(bgTileColors[this.#backgroundSwapped || bgTileColors.length === 1 ? 0 : 1]);
    }

    #swapBackground() {
        this.#backgroundSwapped = !this.#backgroundSwapped;
        this.#updateBackgroundRotation()
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;

        if (!this.#died) {
            this.#rotation += this.#rotationSpeed * frameTime;
            this.#polygon.setRotation(this.#rotation)
            this.#updateBackgroundRotation()
            this.onUpdate(frameTime);
        }
        
        this.#walls.forEach(wall => {
            const pos = wall.getVector2VertexPos4();
            if (pointInQuad(this.#polygon.getPlayerAbsolutePosition(), pos[0], pos[1], pos[2], pos[3])
            && !this.#died) {
                this.kill();
                this.#polygon.draw();
            }
        })

        this.#walls = this.#walls.filter(wall => {
            if (this.#died) {
                return true
            };
            
            if (wall.getDistance() > this.#polygon.getDistance() + this.#polygon.getThickness()) {
                wall.setDistance(wall.getDistance() - frameTime * this.#wallSpeedMult / 5)
            } else if (wall.getThickness() > 0) {
                wall.setThickness(wall.getThickness() - frameTime * this.#wallSpeedMult / 5)
            }
            wall.setRotation(this.#rotation)

            if (wall.getThickness() < 0 || wall.getDistance() < 0) {
                wall.destroy()
                return false;
            }
            return true
        })

        this.#backgroundSwapTimer -= frameTime;
        if (this.#backgroundSwapTimer < 0 && !this.#died) {
            this.#backgroundSwapTimer = this.#backgroundSwapTime;
            this.#swapBackground();
        }

        requestAnimationFrame(time => this.#update(time));
    }

    createWall(side, thickness) {
        if (this.#died) return; 
        const wall = new Wall(this.appContext);
        wall.setSides(this.#sides)
        wall.setSide(side)
        wall.setThickness(thickness);
        wall.setColor(this.#mainColor);
        wall.setDistance(this.#wallSpawnDistance);
        wall.setLayer(this.#getWallsLayer());
        wall.setSkew(this.#skew);

        wall.set3dDepth(this.#depth3d);
        wall.set3dDistance(this.#distance3d);
        wall.set3dLayer(this.#get3dLayer());

        wall.set3dColor(this.#get3dColor());

        this.#walls.push(wall);
    }
    
    setRotation(v) { if (typeof(v) === 'number') this.#rotation = v; }
    getRotation() { return this.#rotation }
    setRotationSpeed(v) { if (typeof(v) === 'number') this.#rotationSpeed = v; }
    setRadius(v) { if (typeof(v) === 'number') this.#polygon.setThickness(v); }
    setSkew(v) {
        if (typeof(v) !== 'number') return
        this.#skew = v
        this.#background.setSkew(v);
        this.#polygon.setSkew(v);
        this.#walls.forEach(wall => wall.setSkew(v));        
    }
    setSides(v) {
        if (typeof(v) !== 'number') return
        this.#background.setSides(v);
        this.#polygon.setSides(v);
        this.#sides = v;
    }
    getSides() {
        return this.#sides;
    }
    setBackgroundTileColors(arr) {
        this.#background.setTileColors(arr);
        const bgTileColors = this.#background.getTileColors();
        this.#polygon.setColor(arr[this.#backgroundSwapped || bgTileColors.length === 1 ? 0 : 1]);
    }
    setBackgroundRotationOffset(v) {
        if (typeof(v) === 'number') this.#backgroundRotationOffset = v
    }
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
    setPolygonColor({r, g, b, a}) {
        this.#polygon.setColor(new Color(r, g, b, a))
    }
    setWallSpawnDistance(v) {
        if (typeof(v) === 'number') this.#wallSpawnDistance = v;
    }
    setWallSpeedMult(v) {
        if (typeof(v) === 'number') this.#wallSpeedMult = v;
    }
    set3dDepth(v) {
        if (typeof(v) !== 'number') return
        const depth = Math.floor(v);
        this.#depth3d = depth;
        this.#walls.forEach(wall => wall.set3dDepth(depth));
        this.#polygon.set3dDepth(depth)
    }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.#walls.forEach(wall => wall.set3dDistance(v));
        this.#polygon.set3dDistance(v)
    }
    set3dColor({r, g, b, a}) {
        if (r && g && b) {
            const color = new Color(r, g, b, a);
            this.#color3d = color;
            this.#walls.forEach(wall => wall.set3dColor(color));
        } else {
            this.#walls.forEach(wall => wall.set3dColor(this.#getDefault3dColor()));
        }
    }
}