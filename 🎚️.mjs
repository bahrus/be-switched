import myJSON from './emc.json' with {type: 'json'};

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps} from './types/be-switched/types' */

/**
 * @type {EMC<any, AllProps>}
 */
const emc = {
    ...myJSON,
    enhConfig: {
        ...myJSON.enhConfig,
        enhKey: '🎚️',
        withAttrs: {
            ...myJSON.enhConfig.withAttrs,
            base: '🎚️'
        }
    }
};

export function render() {
    return JSON.stringify(emc, null, 4);
}

console.log(render());
