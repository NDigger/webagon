export default class GameObject {
    appContext;
    needsRedraw = false;
    redrawEnabled = true;

    constructor(appContext) {
        this.appContext = appContext;
    }

    scheduleDraw() {
        // -- This shit causes delays I can't fix without crutches
        // if (this.#needsRedraw) return;
        // this.#needsRedraw = true;
        // requestAnimationFrame(() => {
        //     this.#needsRedraw = false;
        //     this.draw();
        // });
        
        // if (this.needsRedraw) return;
        // this.needsRedraw = true;
        this.appContext.drawHandler.requestDraw(this); // 👍 nice 👍

        // -- This shit causes lag
        // setTimeout(() => {
            // this.needsRedraw = false;
            // this.draw();
        // }, 0);
    }

    draw() {}
}