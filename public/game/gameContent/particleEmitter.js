import GameObject from "./gameObject";
import CustomWall from "./customWall";
import { Vector2, Color, Size } from "../../utils/structures";
import Lerp from "../../utils/interpolation";

const rndFloat = (from, to) => Math.random() * (to - from) + from
class Particle extends CustomWall {
    position = new Vector2(0, 0);
    size = new Size(0, 0);

    speed = 0;
    angle = 0;
    sizeStart = 0;
    sizeEnd = 0;

    time = 0;
    lifetime = 1;

    draw() {
        const pos = this.position;
        const cap01 = 1-(Math.abs(this.time - this.lifetime) / this.lifetime);
        const size = Lerp.interpolate(this.sizeStart, this.sizeEnd, cap01)
        this.setVertexPos4(
            pos,
            new Vector2(pos.x, pos.y + size),
            new Vector2(pos.x + size, pos.y + size),
            new Vector2(pos.x + size, pos.y),
        )
        super.draw();
    }
}

export default class ParticleEmitter extends GameObject {
    #particles = [];

    speed = 100;
    speedVariation = 0;
    angle = 0;
    angleVariation = 0;
    sizeStart = 10;
    sizeEnd = 0;
    lifetime = 1;
    lifetimeVariation = 0;

    onFinished = () => {}

    #updateId;
    #lastUpdateTime = performance.now();

    destroy() {
        if (this.isDestroyed()) return;
        super.destroy();
        this.#particles.forEach(p => p.destroy);
        cancelAnimationFrame(this.#updateId);
    }

    emit() {
        for (let i = 0; i < 10; i++) {
            const p = new Particle(this.app);
            p.setColor(new Color(255, 0, 0));

            p.angle = this.angle + rndFloat(-this.angleVariation, this.angleVariation);
            p.lifetime = this.lifetime + rndFloat(-this.lifetimeVariation, this.lifetimeVariation);
            p.sizeStart = this.sizeStart;
            p.sizeEnd = this.sizeEnd
            p.speed = this.speed + rndFloat(-this.speedVariation, this.speedVariation);

            p.setLayer(9999)
            this.#particles.push(p)
            this.#updateId = requestAnimationFrame(time => this.#update(time));
        }
    }

    #update(time) {
        const frameTime = (time - this.#lastUpdateTime) / 1000;
        this.#lastUpdateTime = time;
        this.#particles = this.#particles.filter(p => {
            const speed = p.speed * frameTime;
            p.position = p.position.add(new Vector2(speed, speed).rotate(p.angle + p.getRotation()/180*Math.PI));

            p.time += frameTime;
            if (p.time > p.lifetime) {
                p.destroy();
                return false;
            }

            p.draw();

            return true
        })
        if (this.#particles.length === 0) this.onFinished();

        this.#updateId = requestAnimationFrame(time => this.#update(time))
    }

    draw() {
        this.#particles.forEach(particle => particle.draw());
    }

    getParticles() {
        return this.#particles
    }
}