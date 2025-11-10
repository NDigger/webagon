// Every game object can be destroyed and drawn with app methods.
export default class GameObject {
    app;
    destroyed = false;

    constructor(app) {
        this.app = app;
    }

    draw() {}

    // -- This shit doesn't work
    // scheduleDraw() {
    //     // -- This shit causes delays I can't fix without crutches
    //     // if (this.#needsRedraw) return;
    //     // this.#needsRedraw = true;
    //     // requestAnimationFrame(() => {
    //     //     this.#needsRedraw = false;
    //     //     this.draw();
    //     // });
        
    //     // if (this.needsRedraw) return;
    //     // this.needsRedraw = true;
    //     this.appContext.drawHandler.requestDraw(this); // 👍 nice 👍

    //     // -- This shit causes lag
    //     // setTimeout(() => {
    //         // this.needsRedraw = false;
    //         // this.draw();
    //     // }, 0);
    // }
}