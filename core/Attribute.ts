/**
 * Representation of "Attribute" which is any value that has a base amount and depleted/restored
 * safely. Where safely means without being destructive to base value.
 *
 * An attribute on its own cannot be raised above its base value.
 *
 * @property {string} name
 * @property {number} base
 * @property {number} delta Current diferece from the base
 * @property {AttributeFormula} formula
 * @property {object} metadata any custom info for this attribute
 */
export class Attribute {
    name: string;
    base: number;
    delta: number;
    formula: AttributeFormula | null;
    metadata: {};
    /**
     * @param {string} name
     * @param {number} base
     * @param {number} delta=0
     * @param {AttributeFormula} formula=null
     * @param {object} metadata={}
     */
    constructor(
        name: string,
        base: number,
        delta: number,
        formula = null,
        metadata: object = {}
    ) {
        if (isNaN(base)) {
            throw new TypeError(
                `Base attribute must be a number, got ${base}.`
            );
        }

        if (isNaN(delta)) {
            throw new TypeError(
                `Attribute delta must be a number, got ${delta}.`
            );
        }

        if (formula && !(formula instanceof AttributeFormula)) {
            throw new TypeError(
                `Attribute formula must be instanceof AttributeFormula`
            );
        }

        this.name = name;
        this.base = base;
        this.delta = delta;
        this.formula = formula;
        this.metadata = metadata;
    }

    /**
     * Lower current value
     * @param {number} amount
     */
    lower(amount: number) {
        return this.raise(-amount);
    }

    /**
     * Raise current value
     * @param {number} amount
     */
    raise(amount: number) {
        const newDelta = Math.min(this.delta + amount, 0);
        this.delta = newDelta;
    }

    /**
     * Change the base value
     * @param {number} amount
     */
    setBase(amount: number) {
        this.base = Math.max(amount, 0);
    }

    /**
     * Bypass raise/lower, directly setting the delta
     * @param {number} amount
     */
    setDelta(amount: number) {
        this.delta = Math.min(amount, 0);
    }

    serialize() {
        const { delta, base } = this;
        return { delta, base };
    }
}

/**
 * @property {Array<string>} requires Array of attributes required for this formula to run
 * @property {function(...number): number} formula
 */
export class AttributeFormula {
    requires: string[];
    formula: any;

    constructor(requires: Array<string>, fn) {
        if (!Array.isArray(requires)) {
            throw new TypeError('requires not an array');
        }

        if (typeof fn !== 'function') {
            throw new TypeError('Formula function is not a function');
        }

        this.requires = requires;
        this.formula = fn;
    }

    evaluate(attribute, ...args) {
        if (typeof this.formula !== 'function') {
            throw new Error(
                `Formula is not callable ${this.formula}`
            );
            return;
        }

        return this.formula.bind(attribute)(...args);
    }
}
