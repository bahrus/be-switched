// @ts-check
/** @import {AggEvent, AggHandler} from './types/be-switched/types' */;

/** @type {Map<string, AggHandler>} */
const handlers = new Map();

/**
 * Register a named handler for use with "on if handlerName, per ..." syntax
 * @param {string} name
 * @param {AggHandler} handler
 */
export function register(name, handler) {
    handlers.set(name, handler);
}

/**
 * Get a registered handler by name
 * @param {string} name
 * @returns {AggHandler | undefined}
 */
export function get(name) {
    return handlers.get(name);
}

// Built-in handlers
register('+', e => { e.r = e.args.reduce((acc, arg) => acc + arg); });
register('*', e => { e.r = e.args.reduce((acc, arg) => acc * arg); });
register('max', e => { e.r = Math.max(...e.args); });
register('min', e => { e.r = Math.min(...e.args); });
register('nearlyEq', e => {
    e.r = Math.max(...e.args) - Math.min(...e.args) < Number(/** @type {HTMLElement} */ (e.target).dataset.maxDiff);
});
register('eq', e => {
    e.r = e.args?.length === 0 ? true : e.args.find(x => e.args[0] !== x) === undefined;
});
register('||', e => { e.r = e.args.reduce((acc, arg) => acc || arg); });
register('||!', e => { e.r = e.args.reduce((acc, arg) => acc || !arg); });
register('&&', e => { e.r = e.args.reduce((acc, arg) => acc && arg); });
register('&&!', e => { e.r = e.args.reduce((acc, arg) => acc && !arg); });
register('{}', e => { e.r = e.f; });
