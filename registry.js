// @ts-check

/** @type {Map<string, Function>} */
const handlers = new Map();

/**
 * Register a named handler for use with "on if handlerName, per ..." syntax
 * @param {string} name
 * @param {Function} handler
 */
export function register(name, handler) {
    handlers.set(name, handler);
}

/**
 * Get a registered handler by name
 * @param {string} name
 * @returns {Function | undefined}
 */
export function get(name) {
    return handlers.get(name);
}

// Built-in handlers
register('eq', e => { e.r = e.args[0] === e.args[1]; });
register('nearlyEq', e => {
    e.r = Math.abs(e.args[0] - e.args[1]) < Number(e.target.dataset.maxDiff || 10);
});
