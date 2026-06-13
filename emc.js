// @ts-check
import { MountObserver, seed, BeHive } from 'be-hive/be-hive.js';
import { Registry } from 'be-hive/Registry.js';
import { aggs } from 'be-hive/aggEvt.js';
import myJSON from './emc.json' with { type: 'json' };

const mose = seed(myJSON);
MountObserver.synthesize(document, BeHive, mose);

for (const key in aggs) {
    Registry.register(myJSON, key, aggs[key]);
}

/**
 * Register a named handler for use with "on if handlerName, per ..." syntax
 * @param {string} handlerName
 * @param {EventListenerOrEventListenerObject | Function} handler
 */
export function register(handlerName, handler) {
    Registry.register(myJSON, handlerName, handler);
}
