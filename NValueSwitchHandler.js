// @ts-check
/** @import {AP, NValueSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class NValueSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {{element: Element, valueProp: string, key: string}[]} */
    #deps = [];
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
        const { inferValueProperty, inferEventType, needsPropagator, Infer } = await import('inferencer/inferencer.js');
        const { get } = await import('./registry.js');
        // @ts-ignore
        const { nValueSwitches, enhancedElement } = self;
        if (!nValueSwitches || nValueSwitches.length === 0) return;

        // For now, handle the first nValueSwitch
        const nValueSwitch = nValueSwitches[0];
        const { dependencies, registeredHandler } = nValueSwitch;

        // Resolve registered handler if specified
        if (registeredHandler !== undefined) {
            const handlerObj = get(registeredHandler);
            if (handlerObj === undefined) {
                console.error(`[be-switched] No registered handler found for: "${registeredHandler}"`);
                return;
            }
            this.#handlerObj = typeof handlerObj === 'function' && handlerObj.toString().substring(0, 5) === 'class'
                ? new handlerObj()
                : handlerObj;
        }

        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        const ac = this.#ac = new AbortController();

        for (const dep of dependencies) {
            const { id, evtName, prop, path } = dep;
            const remoteEl = id !== undefined
                ? rn.getElementById(id)
                : rn.host || rn;
            if (!(remoteEl instanceof Element)) throw 404;

            const valueProp = prop || inferValueProperty(remoteEl);
            const key = remoteEl.getAttribute('data-id') || id || prop || 'value';

            this.#deps.push({ element: remoteEl, valueProp, key });

            // Wire up observation
            if (evtName) {
                remoteEl.addEventListener(evtName, () => this.handleEvent(), { signal: ac.signal });
            } else if (needsPropagator(remoteEl)) {
                const infer = new Infer(remoteEl);
                const propagator = await infer.getPropagator();
                propagator.addEventListener(valueProp, () => this.handleEvent(), { signal: ac.signal });
            } else {
                const eventName = inferEventType(remoteEl);
                remoteEl.addEventListener(eventName, () => this.handleEvent(), { signal: ac.signal });
            }
        }

        // Initial evaluation
        this.handleEvent();
    }

    handleEvent() {
        const self = this.self;
        const { enhancedElement } = self;
        /** @type {{[key: string]: any}} */
        const obj = {};
        /** @type {any[]} */
        const args = [];

        for (const { element, valueProp, key } of this.#deps) {
            const val = /** @type {any} */ (element)[valueProp];
            args.push(val);
            obj[key] = val;
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
    }
}
