

export default class DrawHandler {
    #scheduled = false;
    #objects = new Set();

    requestDraw(obj) {
        this.#objects.add(obj);
        if (!this.#scheduled) {
            this.#scheduled = true;
            requestAnimationFrame(() => {
                this.#scheduled = false;
                for (const o of this.#objects) {
                    if (!o.redrawEnabled) continue
                    o.needsRedraw = false;
                    o.draw();
                }
                this.#objects.clear();
            });
        }
    }
}