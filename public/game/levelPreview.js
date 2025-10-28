import { setLevel } from "../script";

class LevelPreviewContent {
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};

    #updateId;
    #lastTime;
    #initTime;

    #style = {

    }

    init() {
        this.onInit();
        this.#initTime = performance.now();
        this.#lastTime = performance.now();
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #update(time) {
        const frameTime = time - this.#lastTime;
        this.#lastTime = time;
        this.onRender(frameTime/1000);
        this.onUpdate(frameTime/1000);
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    setMainColor({r, g, b, a}) {
        console.log(r, g, b, a)
    }

    setSides(v) {
        // console.log(v)
    }

    destroy() {
        cancelAnimationFrame(this.#updateId);
    }
}

export default class LevelPreview {
    #levelPreview = null;

    load(path) {
        this.drop();
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${path}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);

        const levelPreview = new Proxy(new LevelPreviewContent(), {
            get(target, prop) {
                if (prop in target) {
                    const value = target[prop];
                    if (typeof value === "function") return (...args) => value.apply(target, args);
                    return value;
                }
                return () => {};
            },
            set(target, prop, value) {
                if (prop in target) target[prop] = value;
                return true;
            }
        });
        setLevel(levelPreview)
        this.#levelPreview = levelPreview

        script.onload = () => {
            levelPreview.init()
        }
    }

    drop() {
        if (this.#levelPreview != null) {
            this.#levelPreview.destroy()
            this.#levelPreview = null
        }
    }
}