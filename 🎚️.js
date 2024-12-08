import { MountObserver, seed, BeHive } from 'be-hive/be-hive.js';
import { emc as baseEMC } from './emc.js';
import {Registry} from 'be-hive/Registry.js';
import {aggs} from 'be-hive/aggEvt.js';

export const emc = {
    ...baseEMC,
    base: '🎚️',
    enhPropKey: '🎚️',
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

for(const key in aggs){
    Registry.register(emc, key, aggs[key]);
}

/**
 * 
 * @param {string} handlerName 
 * @param {EventListenerOrFn} handler 
 */
export function register(handlerName, handler){
    Registry.register(emc, handlerName, handler);
}

/**
 * 
 * @param {CSSQuery} q 
 * @param {string} handlerName 
 * @param {EventListenerOrFn} handler 
 */
export function within(q, handlerName, handler){
    Registry.within(emc, q, handlerName, handler);
}
