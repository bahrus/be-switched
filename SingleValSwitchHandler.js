// @ts-check
/** @import {AP, SingleValSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class SingleValSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {Map<SingleValSwitch, {element: Element, valueProp: string}>} */
    #switchToInfo = new Map();
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
        const { singleValSwitches, enhancedElement } = self;
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        const ac = this.#ac = new AbortController();

        for (const svs of singleValSwitches) {
            const { specifier } = svs;
            const { id, evtName, prop, path } = specifier;

            const remoteEl = id !== undefined
                ? rn.getElementById(id)
                : rn.host || rn;
            if (!(remoteEl instanceof Element)) throw 404;

            // Determine property to read and event to listen for
            const valueProp = prop || inferValueProperty(remoteEl);
            const eventName = evtName || inferEventType(remoteEl);

            this.#switchToInfo.set(svs, { element: remoteEl, valueProp });

            // For elements without meaningful user-driven events (e.g. <data>),
            // use InferencedPropagator which observes attribute/property changes
            if (!evtName && needsPropagator(remoteEl)) {
                const infer = new Infer(remoteEl);
                const propagator = await infer.getPropagator();
                propagator.addEventListener(valueProp, () => this.handleEvent(), { signal: ac.signal });
            } else {
                // Listen for the appropriate event
                remoteEl.addEventListener(eventName, () => this.handleEvent(), { signal: ac.signal });
            }
        }

        // Initial evaluation
        this.handleEvent();
    }

    handleEvent() {
        const self = this.self;
        let foundOne = false;

        for (const [svs, { element, valueProp }] of this.#switchToInfo) {
            const { req, specifier } = svs;
            if (foundOne && !req) continue;

            // Get the value
            let value = element[valueProp];
            if (specifier.path) {
                const parts = specifier.path.split('?.');
                for (const part of parts) {
                    if (value == null) break;
                    value = value[part];
                }
            }

            if (req) {
                if (!value) {
                    self.singleValSwitchNoGo = true;
                    return;
                } else {
                    foundOne = true;
                }
            } else {
                if (value) foundOne = true;
            }
        }

        self.singleValSwitchNoGo = false;
        self.singleValSwitchesSatisfied = foundOne;
    }

    disconnect() {
        if (this.#ac) {
            this.#ac.abort();
        }
    }
}
