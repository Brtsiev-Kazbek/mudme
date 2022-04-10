import { Attribute, AttributeFormula } from './Attribute';

/**
 * @property {Map} attributes
 */
export default class AttributeFactory {
    attributes: Map<any, any>;

    constructor() {
        this.attributes = new Map();
    }

    /**
     * @param {string} name
     * @param {number} base
     * @param {AttributeFormula} formula
     */
    add(
        name: string,
        base: number,
        formula: AttributeFormula | null = null,
        metadata = {}
    ) {
        if (formula && !(formula instanceof AttributeFormula)) {
            throw new TypeError(
                'Formula not instance of AttributeFormula'
            );
        }
        this.attributes.set(name, {
            name,
            base,
            formula,
            metadata,
        });
    }

    /**
     * @see Map#has
     */
    has(name: string) {
        return this.attributes.has(name);
    }

    /**
     * Get a attribute definition. Use `create` if you want an instance of a attribute
     * @param {string} name
     * @return {object}
     */
    get(name: string) {
        this.attributes.get(name);
    }

    /**
     * @param {string} name
     * @param {number} delta
     * @return {Attribute}
     */
    create(name: string, base = null, delta = 0) {
        if (!this.attributes.has(name)) {
            throw new RangeError(
                `No attribute definition found for [${name}]`
            );
        }

        const def = this.attributes.get(name);
        return new Attribute(
            name,
            base || def.base,
            delta,
            def.formula,
            def.metadata
        );
    }

    /**
     * Make sure there are no circular dependencies between attributes
     * @throws Error
     */
    validateAttributes() {
        const references = [...this.attributes].reduce(
            (acc, [attrName, { formula }]) => {
                if (!formula) {
                    return acc;
                }

                acc[attrName] = formula.requires;

                return acc;
            },
            {}
        );

        for (const attrName in references) {
            const check = this._checkReferences(attrName, references);
            if (Array.isArray(check)) {
                const path = check.concat(attrName).join(' -> ');
                throw new Error(
                    `Attribute formula for [${attrName}] has circular dependency [${path}]`
                );
            }
        }
    }

    /**
     * @private
     * @param {string} attr attribute name to check for circular ref
     * @param {Object.<string, Array<string>>} references
     * @param {Array<string>} stack
     * @return bool
     */
    private _checkReferences(attr, references, stack = []) {
        if (stack.includes(attr)) {
            return stack;
        }

        const requires = references[attr];

        if (!requires || !requires.length) {
            return true;
        }

        for (const reqAttr of requires) {
            const check = this._checkReferences(
                reqAttr,
                references,
                stack.concat(attr)
            );
            if (Array.isArray(check)) {
                return check;
            }
        }

        return true;
    }
}
