import GameObject from "./gameObject";
import CustomWall from "./customWall";
import { Vector2, Color } from "../../utils/structures";

export default class ParticleEmitter extends GameObject {
    #particles = [];
    #speed = 0;
    #speedVariation = 0;
    #angle = 0;
    #angleVariation = 0;
    #updateId;
    #lastUpdateTime = performance.now();

    constructor(app) {
        super(app);
        for (let i = 0; i < 10; i++) {
            const cw = new CustomWall(app);
            cw.setColor(new Color(255, 0, 0));

            const rndPos = () => Math.random() * 100-50;
            const pos = new Vector2(rndPos(), rndPos());
            const size = 5;
            cw.setLayer(9999)
            cw.setVertexPos4(
                pos,
                new Vector2(pos.x, pos.y + size),
                new Vector2(pos.x + size, pos.y + size),
                new Vector2(pos.x + size, pos.y),
            )
            this.#particles.push(cw)
            requestAnimationFrame(time => this.#update(time));
        }
    }

    #update(time) {
        const frameTime = (time - this.#lastUpdateTime) / 1000;
        this.#lastUpdateTime = time;
        this.#particles.forEach(p => {
            let pos = p.getVertexPos4();
            const speed = this.#speed * frameTime;
            console.log(pos)
            pos.forEach(pos => pos.add(new Vector2(speed, speed)));
            // p.setVertexPos4(pos[0], pos[1], pos[2], pos[3])
        })
        requestAnimationFrame(time => this.#update(time))
    }

    draw() {
        this.#particles.forEach(particle => particle.draw());
    }

    getParticles() {
        return this.#particles
    }
}