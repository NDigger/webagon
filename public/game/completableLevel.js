import Level from "./level";

export default class CompletableLevel extends Level {
    #completionTime = 60;

    constructor(app, levelData, props) {
        super(app, levelData, props)
    }

    setCompetionTime(v) {
        this.#completionTime = v;
    }

    getCompletionTime() { return this.#completionTime }
}