export default class GameObject {
    app;
    #needsRedraw = false;

    constructor(app) {
        this.app = app;
    }

    scheduleDraw() {
        if (this.#needsRedraw) return;
        this.#needsRedraw = true;
        // requestAnimationFrame(() => {
            // this.#needsRedraw = false;
            // this.draw();
        // });
        setTimeout(() => {
            this.#needsRedraw = false;
            this.draw();
        }, 0);
    }

    draw() {}
}