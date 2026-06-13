// @ts-check
/** @import {AP, SingleValSwitch, ValueSpecifier} from './types/be-switched/types' */;

export class SingleValSwitchHandler {
    /** @type {AP} */
    self;
    /** @type {Map<SingleValSwitch, any>} */
    #switchToAO = new Map();
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
        const { singleValSwitches, enhancedElement } = self;
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        const aos = [];

        for (const svs of singleValSwitches) {
            const { specifier } = svs;
            const { id, evtName, prop, path, as } = specifier;

            const remoteEl = id !== undefined
                ? rn.getElementById(id)
                : rn.host || rn;
            if (!(remoteEl instanceof Element)) throw 404;

            const propToAbsorb = path ? `?.${prop}?.${path}` : prop;
            const ao = await ASMR.getAO(remoteEl, {
                evt: evtName,
                propToAbsorb,
                as,
            });
            this.#switchToAO.set(svs, ao);
            aos.push(ao);
        }

        const ac = this.#ac = new AbortController();
        for (const ao of aos) {
            ao.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }

    async handleEvent() {
        // @ts-ignore
        const singleValSwitches = Array.from(this.#switchToAO.keys());
        const self = this.self;
        let foundOne = false;

        for (const svs of singleValSwitches) {
            const { req } = svs;
            if (foundOne && !req) continue;

            const ao = this.#switchToAO.get(svs);
            const value = await ao?.getValue();

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
