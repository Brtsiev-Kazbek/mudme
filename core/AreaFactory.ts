import Area from './Area';
import EntityFactory from './EntityFactory'; // FIXME: implement EntityFactory

/**
 * Stores definitions of iyems to allow for easy creation/cloning of objects
 */
export default class AreaFactory extends EntityFactory {
    /**
     * Create a new instance of an area by name. Resulting area will not have
     * any of it's contained entities (items, npcs, rooms) hydrated. You will
     * need to call `area.hydrate(state)`
     *
     * @param {GameState} state
     * @param {string} bundle Name of this bundle this area is defined in
     * @param {string} entityRef Area name
     * @return {Area}
     */
    create(entityRef): Area {
        const definition = this.getDefinition(entityRef);
        if (!definition) {
            throw new Error(
                'No Entity definition found for ' + entityRef
            );
        }

        const area = new Area(
            definition.bundle,
            entityRef,
            definition.manifest
        );

        if (this.scripts.has(entityRef)) {
            this.scipts.get(entityRef).attach(area);
        }

        return area;
    }

    /**
     * @see AreaFactory#create
     */
    clone(area: Area) {
        return this.create(area.name);
    }
}
