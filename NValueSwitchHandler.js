// @ts-check
/** @import {AP, NValueSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class NValueSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {{[key: string]: any} | undefined} */
    #propToAO;
    /** @type {any} */
    #handlerObj;
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
        const { nValueSwitches, enhancedElement } = self;
        if (!nValueSwitches || nValueSwitches.length === 0) return;

        // For now, handle the first nValueSwitch
        const nValueSwitch = nValueSwitches[0];
        const { dependencies, registeredHandler } = nValueSwitch;

        // Resolve registered handler if specified
        if (registeredHandler !== undefined) {
            const { Registry } = await import('be-hive/Registry.js');
            const handlerObj = Registry.get(registeredHandler);
            if (handlerObj === undefined) throw 404;
            this.#handlerObj = typeof handlerObj === 'function' && handlerObj.toString().substring(0, 5) === 'class'
                ? new handlerObj()
                : handlerObj;
        }

        /** @type {{[key: string]: any}} */
        const propToAO = {};
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());

        for (const dep of dependencies) {
            const { id, evtName, path, as, prop } = dep;
            const remoteEl = id !== undefined
                ? rn.getElementById(id)
                : rn.host || rn;
            if (!(remoteEl instanceof Element)) throw 404;

            const propKey = id || prop || 'value';
            const propToAbsorb = path ? `?.${prop}?.${path}` : prop;

            const ao = await ASMR.getAO(remoteEl, {
                evt: evtName || 'input',
                propToAbsorb,
                as,
            });
            propToAO[propKey] = ao;
        }

        this.#propToAO = propToAO;
        const ac = this.#ac = new AbortController();
        const aos = Object.values(propToAO);
        for (const ao of aos) {
            ao.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }

    async handleEvent() {
        const self = this.self;
        const { enhancedElement } = self;
        const obj = {};
        const args = [];

        for (const prop in this.#propToAO) {
            const ao = this.#propToAO[prop];
            const val = await ao.getValue();
            args.push(val);
            obj[prop] = val;
        }

        // Create a change event with the factors
        const event = new ChangeEvent(args, obj, enhancedElement);

        const handlerObj = this.#handlerObj;
        if (handlerObj !== undefined) {
            if ('handleEvent' in handlerObj) {
                handlerObj.handleEvent(event);
            } else {
                handlerObj(event);
            }
        }

        // Also dispatch on the enhanced element for onchange handlers
        enhancedElement.dispatchEvent(event);

        if (event.r !== undefined) {
            self.switchesSatisfied = !!event.r;
        }
    }

    disconnect() {
        if (this.#ac) {
            this.#ac.abort();
        }
    }
}

/**
 * Custom change event carrying the factors and args
 */
class ChangeEvent extends Event {
    /** @type {Array<any>} */
    args;
    /** @type {{[key: string]: any}} */
    f;
    /** @type {any} */
    r;
    /** @type {Element} */
    target;

    /**
     * @param {Array<any>} args
     * @param {{[key: string]: any}} f
     * @param {Element} target
     */
    constructor(args, f, target) {
        super('change', { bubbles: false });
        this.args = args;
        this.f = f;
        this.r = undefined;
        // @ts-ignore
        this.target = target;
    }
}
