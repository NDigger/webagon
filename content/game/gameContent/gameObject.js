// Every game object can be destroyed and drawn with app methods.
export default class GameObject {
    app;
    #destroyed = false;

    constructor(app) {
        this.app = app;
    }

    destroy() {
        if (this.#destroyed) return
        this.#destroyed = true
    }

    isDestroyed() { return this.#destroyed }

    draw() {}
}