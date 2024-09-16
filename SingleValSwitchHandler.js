// @ts-check
/** @import {BAP} from './ts-refs/be-switched/types' */;

export class SingleValSwitchHandler {
    /**
     * @type {BAP}
     */
    self;
    #singleValSwitchToAO = new Map();
    /** @type {AbortController | undefined} */
    #ac;
    /**
     * 
     * @param {BAP} self 
     */
    constructor(self) {
        this.self = self;
        this.do(self);
    }
    /**
     * 
     * @param {BAP} self 
     */
    async do(self) {
        const { find } = await import('trans-render/dss/find.js');
        const { ASMR } = await import('trans-render/asmr/asmr.js');
        const { singleValSwitches, enhancedElement } = self;
        let aos = [];
        for (const svs of singleValSwitches) {
            const { specifier } = svs;
            const remoteEl = await find(enhancedElement, specifier);
            if (!(remoteEl instanceof EventTarget))
                continue;
            const { prop, host } = specifier;
            console.log({ host });
            let propToAbsorb = undefined;
            /** @type {string | undefined} */
            let evt = specifier.evt || 'input';
            if (host) {
                if (prop === undefined)
                    throw 'NI';
                propToAbsorb = prop;
                evt = undefined;
            }
            const ao = await ASMR.getAO(remoteEl, {
                evt,
                selfIsVal: specifier.path === '$0',
                propToAbsorb
            });
            this.#singleValSwitchToAO.set(svs, ao);
            aos.push(ao);
        }
        const ac = this.#ac = new AbortController();
        for (const ao of aos) {
            ao.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }
    async handleEvent() {
        const singleValSwitches = Array.from(this.#singleValSwitchToAO.keys());
        const self = this.self;
        let foundOne = false;
        const svsToAO = this.#singleValSwitchToAO;
        for (const onSwitch of singleValSwitches) {
            const { req } = onSwitch;
            if (foundOne && !req)
                continue;
            const ao = svsToAO.get(onSwitch);
            const value = await ao?.getValue();
            if (req) {
                if (!value) {
                    self.singleValSwitchNoGo = true;
                    return;
                }
                else {
                    foundOne = true;
                }
            }
            else {
                if (value)
                    foundOne = true;
            }
        }
        self.singleValSwitchNoGo = false;
        self.singleValSwitchesSatisfied = foundOne;
    }
}
