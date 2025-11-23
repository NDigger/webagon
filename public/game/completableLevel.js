import Level from "./level";

const progressElement = document.getElementById('completable-level-progress')
export default class CompletableLevel extends Level {
    #completionTime = 60;
    #updateId = undefined;
    #completed = false;
    
    constructor(app, levelData, props) {
        super(app, levelData, props);
        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    #update() {
        const progress = 1-(this.#completionTime - this.getTime())/this.#completionTime;
        progressElement.style.width = `${progress*100}%`
        if (progress > 1 && !this.#completed) {
            this.#completed = true;
            this.kill();
        }
        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    setCompletionTime(v) {
        this.#completionTime = v;
    }

    getCompletionTime() { return this.#completionTime }
}