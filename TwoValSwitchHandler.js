// @ts-check
/** @import {AP, TwoValueSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class TwoValSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {Map<TwoValueSwitch, [any, any]>} */
    #twoValSwitchToAO = new Map();
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
        const { ASMR } = await import('be-hive/ASMR.js');
        // @ts-ignore
        const { twoValueSwitches, enhancedElement } = self;
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        const allAOs = [];

        for (const tvs of twoValueSwitches) {
            const { lhsSpecifier, rhsSpecifier } = tvs;

            const lhsAO = await this.#resolveAO(lhsSpecifier, enhancedElement, rn, ASMR);
            const rhsAO = await this.#resolveAO(rhsSpecifier, enhancedElement, rn, ASMR);

            this.#twoValSwitchToAO.set(tvs, [lhsAO, rhsAO]);
            allAOs.push([lhsAO, rhsAO]);
        }

        const ac = this.#ac = new AbortController();
        for (const [lhsAO, rhsAO] of allAOs) {
            lhsAO?.addEventListener('.', this, { signal: ac.signal });
            rhsAO?.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }

    /**
     * @param {ValueSpecifier} specifier
     * @param {Element} enhancedElement
     * @param {DocumentFragment & {host: any}} rn
     * @param {any} ASMR
     * @returns {Promise<any>}
     */
    async #resolveAO(specifier, enhancedElement, rn, ASMR) {
        const { id, constVal, evtName, prop, path, as, attr } = specifier;
        if (constVal !== undefined) return undefined;

        const remoteEl = id !== undefined
            ? rn.getElementById(id)
            : rn.host || rn;
        if (!(remoteEl instanceof EventTarget)) throw 500;

        let propToAbsorb = undefined;
        if (attr) {
            // Source of truth attribute observation
            propToAbsorb = `[${attr}]`;
        } else if (path) {
            propToAbsorb = `?.${prop}?.${path}`;
        } else if (prop) {
            propToAbsorb = prop;
        }

        return await ASMR.getAO(remoteEl, {
            evt: evtName,
            propToAbsorb,
            as,
        });
    }

    async handleEvent() {
        const twoValSwitches = Array.from(this.#twoValSwitchToAO.keys());
        let foundOne = false;

        for (const tvs of twoValSwitches) {
            const { req, op, onOrOff, lhsSpecifier, rhsSpecifier } = tvs;
            if (foundOne && !req) continue;

            const aos = this.#twoValSwitchToAO.get(tvs);
            if (!aos) throw 500;
            const [lhsAO, rhsAO] = aos;

            const lhsVal = lhsAO ? await lhsAO.getValue() : getConstVal(lhsSpecifier);
            const rhsVal = rhsAO ? await rhsAO.getValue() : getConstVal(rhsSpecifier);

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
    switch (as) {
        case 'number':
            return Number(constVal);
        case 'boolean':
            return constVal === 'true';
        default:
            return constVal;
    }
}
