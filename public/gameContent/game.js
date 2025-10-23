import Wall from "./wall";
import Polygon from "./polygon";
import { Vector2, Color } from "./structures";
import Background from "./background";
import GameObject from "./gameObject";

export default class Game extends GameObject {
    #background;
    #backgroundSwapTime = 1000;
    #backgroundSwapTimer = 1000;
    #backgroundSwapped = false;
    #backgroundRotationOffset = 0;

    #layer = 0;

    #polygon;

    #walls = [];

    #lasttime = performance.now();

    #rotationSpeed = 0;
    #rotation = 0;
    #sides = 6;

    #mainColor = new Color(0, 0, 0);
    #wallSpawnDistance = 1000;
    #wallSpeedMult = 2;

    onUpdate = () => {}

    constructor(app) {
        super(app)
        this.#background = new Background(app);
        this.#polygon = new Polygon(app);
        this.#polygon.setLayer(this.#layer + 0.002);

        this.setMainColor(new Color(100, 0, 0))
        this.setBackgroundTileColors([
            new Color(245, 245, 245),
            new Color(235, 235, 235),
        ])

        this.setRotationSpeed(0.5);
        this.setSkew(0.5);

        requestAnimationFrame(time => this.#update(time));
    }

    #updateBackgroundRotation() {
        this.#background.setRotation(this.#rotation + this.#backgroundRotationOffset + this.#backgroundSwapped * (360 / this.#sides));
        this.#polygon.setColor(this.#background.getTileColors()[this.#backgroundSwapped ? 0 : 1]);
    }

    #swapBackground() {
        this.#backgroundSwapped = !this.#backgroundSwapped;
        this.#updateBackgroundRotation()
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        this.#rotation += this.#rotationSpeed * frameTime;

        this.#polygon.setRotation(this.#rotation)

        this.#walls = this.#walls.filter(wall => {
            wall.setRotation(this.#rotation)
            console.log(wall.getRotation(), this.#background.getRotation())
            if (wall.getDistance() > 0) {
                wall.setDistance(wall.getDistance() - frameTime * this.#wallSpeedMult / 5)
            } else if (wall.getThickness() > 0) {
                wall.setThickness(wall.getThickness() - frameTime * this.#wallSpeedMult / 5)
            } else //(wall.getThickness() < 0 && wall.getDistance() < 0) 
            {
                wall.destroy()
                return false
            }
            return true
        })
        
        this.#updateBackgroundRotation()
        this.onUpdate(frameTime);

        this.#backgroundSwapTimer -= frameTime;
        if (this.#backgroundSwapTimer < 0) {
            this.#backgroundSwapTimer = this.#backgroundSwapTime;
            this.#swapBackground();
        }
        
        requestAnimationFrame(time => this.#update(time));
    }

    createWall(side, thickness) {
        const wall = new Wall(this.app);
        wall.setSides(this.#sides)
        wall.setSide(side)
        wall.setThickness(thickness);
        wall.setColor(this.#mainColor);
        wall.setDistance(this.#wallSpawnDistance);
        wall.setLayer(this.#layer + 0.001);
        wall.draw();
        this.#walls.push(wall);
    }
    setRotationSpeed(v) { if (typeof(v) === 'number') this.#rotationSpeed = v; }
    setRadius(v) { if (typeof(v) === 'number') this.#polygon.setThickness(v); }
    setSkew(v) {
        if (typeof(v) !== 'number') return
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
    setBackgroundTileColors(arr) {
        this.#background.setTileColors(arr);
        this.#polygon.setColor(arr[this.#backgroundSwapped ? 0 : 1]);
    }
    setBackgroundRotationOffset() {
        this.#background.setRotation
    }
    setMainColor({r, g, b, a}) {
        const color = new Color(r, g, b, a)
        this.#mainColor = color;
        this.#polygon.setBorderColor(color);
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
}