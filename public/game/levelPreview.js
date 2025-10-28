export default class LevelPreview {
    onInit = () => {};
    onUpdate = () => {};

    init() {
        this.onInit();
        requestAnimationFrame(t => this.update(t));
    }

    update(time) {
        this.onUpdate();
        requestAnimationFrame(t => this.update(t));
    }

    setMainColor({r, g, b, a}) {
        console.log(r, g, b, a)
    }

    setSides(v) {
        console.log(v)
    }

    clo() {console.log(1)}
}