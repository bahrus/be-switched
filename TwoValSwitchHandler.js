// @ts-check
/** @import {AP, TwoValueSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class TwoValSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {Map<TwoValueSwitch, [{element: Element, valueProp: string} | null, {element: Element, valueProp: string} | null]>} */
    #twoValSwitchToInfo = new Map();
    /** @type {AbortController | undefined} */
    #ac;

    /**
     * @param {AP} self
     */
    constructor(self) {
        this.self = self;
        this.do(self);
    }

    /**
     * @param {AP} self
     */
    async do(self) {
        const { inferValueProperty, inferEventType, needsPropagator, Infer } = await import('inferencer/inferencer.js');
        // @ts-ignore
        const { twoValueSwitches, enhancedElement } = self;
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        const ac = this.#ac = new AbortController();

        for (const tvs of twoValueSwitches) {
            const { lhsSpecifier, rhsSpecifier } = tvs;

            const lhsInfo = this.#resolveInfo(lhsSpecifier, rn, inferValueProperty);
            const rhsInfo = this.#resolveInfo(rhsSpecifier, rn, inferValueProperty);

            this.#twoValSwitchToInfo.set(tvs, [lhsInfo, rhsInfo]);

            // Wire up observation for each side
            if (lhsInfo) {
                await this.#wireObservation(lhsInfo, lhsSpecifier, ac, inferEventType, needsPropagator, Infer);
            }
            if (rhsInfo) {
                await this.#wireObservation(rhsInfo, rhsSpecifier, ac, inferEventType, needsPropagator, Infer);
            }
        }

        // Initial evaluation
        this.handleEvent();
    }

    /**
     * Resolve element and value property for a specifier
     * @param {ValueSpecifier} specifier
     * @param {DocumentFragment & {host: any}} rn
     * @param {(el: Element) => string} inferValueProperty
     * @returns {{element: Element, valueProp: string} | null}
     */
    #resolveInfo(specifier, rn, inferValueProperty) {
        const { id, constVal, prop, attr } = specifier;
        if (constVal !== undefined) return null;

        const remoteEl = id !== undefined
            ? rn.getElementById(id)
            : rn.host || rn;
        if (!(remoteEl instanceof Element)) throw 500;

        // Determine what property to read
        let valueProp;
        if (attr) {
            // Will read via getAttribute in handleEvent
            valueProp = `[${attr}]`;
        } else if (prop) {
            valueProp = prop;
        } else {
            valueProp = inferValueProperty(remoteEl);
        }

        return { element: remoteEl, valueProp };
    }

    /**
     * Wire up change observation for an element/specifier pair
     * @param {{element: Element, valueProp: string}} info
     * @param {ValueSpecifier} specifier
     * @param {AbortController} ac
     * @param {(el: Element) => string} inferEventType
     * @param {(el: Element) => boolean} needsPropagator
     * @param {any} Infer
     */
    async #wireObservation(info, specifier, ac, inferEventType, needsPropagator, Infer) {
        const { element, valueProp } = info;
        const { evtName, attr } = specifier;

        if (attr) {
            // Source of truth attribute: use MutationObserver directly
            const observer = new MutationObserver(() => this.handleEvent());
            observer.observe(element, {
                attributes: true,
                attributeFilter: [attr],
            });
            // Clean up on abort
            ac.signal.addEventListener('abort', () => observer.disconnect());
        } else if (evtName) {
            // Explicit event name provided — use it directly
            element.addEventListener(evtName, () => this.handleEvent(), { signal: ac.signal });
        } else if (needsPropagator(element)) {
            // Non-interactive element — use InferencedPropagator
            const infer = new Infer(element);
            const propagator = await infer.getPropagator();
            propagator.addEventListener(valueProp, () => this.handleEvent(), { signal: ac.signal });
        } else {
            // Interactive element — listen for inferred event
            const eventName = inferEventType(element);
            element.addEventListener(eventName, () => this.handleEvent(), { signal: ac.signal });
        }
    }

    handleEvent() {
        const twoValSwitches = Array.from(this.#twoValSwitchToInfo.keys());
        let foundOne = false;

        for (const tvs of twoValSwitches) {
            const { req, op, onOrOff, lhsSpecifier, rhsSpecifier } = tvs;
            if (foundOne && !req) continue;

            const infos = this.#twoValSwitchToInfo.get(tvs);
            if (!infos) throw 500;
            const [lhsInfo, rhsInfo] = infos;

            const lhsVal = lhsInfo ? this.#readValue(lhsInfo, lhsSpecifier) : getConstVal(lhsSpecifier);
            const rhsVal = rhsInfo ? this.#readValue(rhsInfo, rhsSpecifier) : getConstVal(rhsSpecifier);

            let value = false;
            switch (op) {
                case 'eq':
                case 'equals':
                case '=':
                    value = lhsVal === rhsVal;
                    break;
                case 'gt':
                case '>':
                    value = lhsVal > rhsVal;
                    break;
                case 'lt':
                case '<':
                    value = lhsVal < rhsVal;
                    break;
                case 'lte':
                case '<=':
                    value = lhsVal <= rhsVal;
                    break;
                case 'gte':
                case '>=':
                    value = lhsVal >= rhsVal;
                    break;
            }

            // "off" inverts the result
            if (onOrOff === 'off') value = !value;

            if (value) foundOne = true;
        }

        const self = this.self;
        self.twoValSwitchNoGo = false;
        self.twoValSwitchesSatisfied = foundOne;
    }

    /**
     * Read the current value from an element based on the resolved info and specifier
     * @param {{element: Element, valueProp: string}} info
     * @param {ValueSpecifier} specifier
     * @returns {any}
     */
    #readValue(info, specifier) {
        const { element, valueProp } = info;
        const { path, as, attr } = specifier;

        let value;
        if (attr) {
            // Source of truth attribute — read from attribute directly
            value = element.getAttribute(attr);
        } else {
            value = /** @type {any} */ (element)[valueProp];
        }

        // Navigate nested path
        if (path) {
            const parts = path.split('?.');
            for (const part of parts) {
                if (value == null) break;
                value = value[part];
            }
        }

        // Apply type casting
        return castValue(value, as);
    }

    disconnect() {
        if (this.#ac) {
            this.#ac.abort();
        }
    }
}

/**
 * Get constant value with type casting
 * @param {ValueSpecifier} specifier
 * @returns {any}
 */
function getConstVal(specifier) {
    const { constVal, as } = specifier;
    if (constVal === undefined) return undefined;
    return castValue(constVal, as);
}

/**
 * Cast a value to the specified type
 * @param {any} value
 * @param {string | undefined} as
 * @returns {any}
 */
function castValue(value, as) {
    if (as === undefined) return value;
    switch (as) {
        case 'number':
            return Number(value);
        case 'boolean':
            return value === 'true' || value === true;
        default:
            return value;
    }
}
