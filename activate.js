// @ts-check

/**
 * Creates an event handler function from a JS expression string.
 * Used for the 🎚️-js attribute (CSP-safe expressions).
 * @param {string} expr
 * @returns {EventListener}
 */
export function activate(expr) {
    const fn = new Function('e', expr);
    return /** @type {EventListener} */ (fn);
}
