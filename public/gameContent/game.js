import Wall from "./wall";
import Polygon from "./polygon";
import { Vector2, Color } from "./structures";
import Background from "./background";
import GameObject from "./gameObject";

export default class Game extends GameObject {
    #background;
    #polygon;

    #walls = [];

    #lasttime = performance.now();

    #rotationSpeed = 0;
    #rotation = 0;
    #sides = 6;

    #mainColor = new Color(0, 0, 0);
    #wallSpawnDistance = 1000;
    #wallSpeedMult = 1;

    onUpdate = () => {}

    constructor(app) {
        super(app)
            this.#background = new Background(app);
            this.#polygon = new Polygon(app);
    
            this.#background.setTileColors([
                new Color(235, 235, 235),
                new Color(245, 245, 245),
            ])
    
            this.setRotationSpeed(0.1);
            this.setSkew(0.5);
    
            requestAnimationFrame(time => this.#update(time));
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        this.#rotation += this.#rotationSpeed * frameTime;
        this.#background.setRotation(this.#rotation)
        this.#polygon.setRotation(this.#rotation)
        this.onUpdate(frameTime);

        this.#walls = this.#walls.filter(wall => {
            wall.setRotation(this.#rotation)
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
        requestAnimationFrame(time => this.#update(time));
    }

    createWall(side, thickness) {
        const wall = new Wall(this.app);
        wall.setSides(this.#sides)
        wall.setSide(side)
        wall.setThickness(thickness);
        wall.setColor(this.#mainColor);
        wall.setDistance(this.#wallSpawnDistance);
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
        this.#background.tileColors(arr);
    }
    setMainColor({r, g, b, a}) {
        const color = new Color(r, g, b, a)
        this.#mainColor = color;
        this.#polygon.setColor(color);
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