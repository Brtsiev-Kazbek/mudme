import EventManager from './EventManager'; // FIXME: implement EventManager

/**
 * BehaviorManager keeps a map of BehaviorName:EventManager which is used
 * during Item and NPC hydrate() methods to attach events
 */
class BehaviorManager {
    behaviors: Map<any, any>;

    constructor() {
        this.behaviors = new Map();
    }

    /**
     * Get EventManager for a given behavior
     * @param {string} name
     * @return {EventManager}
     */
    get(name: string): EventManager {
        return this.behaviors.get(name);
    }

    /**
     * Check to see if a behavior exists
     * @param {string} name
     * @return {boolean}
     */
    has(name: string): boolean {
        return this.behaviors.has(name);
    }

    /**
     * @param {string}   behaviorName
     * @param {Function} listener
     */
    addListener(behaviorName: string, event, listener) {
        if (!this.behaviors.has(behaviorName)) {
            this.behaviors.set(behaviorName, new EventManager());
        }

        this.behaviors.get(behaviorName).add(event, listener);
    }
}
