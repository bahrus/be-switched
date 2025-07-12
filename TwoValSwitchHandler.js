// @ts-check
/** @import {BAP, TwoValueSwitch} from './ts-refs/be-switched/types' */;
/** @import {AbsorbingObject} from './ts-refs/trans-render/asmr/types' */;

export class TwoValSwitchHandler {
    /**
     * @type {BAP}
     */
    self;
    /**
     * @type {Map<TwoValueSwitch, [AbsorbingObject | undefined, AbsorbingObject | undefined]>}
     */
    #twoValSwitchToAO = new Map();
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
        const { twoValueSwitches, enhancedElement } = self;
        let aos = [];
        for (const tvs of twoValueSwitches) {
            const { lhsSpecifier, rhsSpecifier, withinSpecifier } = tvs;
            let within = undefined;
            if(withinSpecifier !== undefined){
                const {cmtWrap, scopeS} = withinSpecifier;
                if(cmtWrap ===  true){
                    const {getBreadth} = await import('mount-observer/slotkin/getBreadth.js');
                    within = getBreadth(enhancedElement, scopeS).filter(x => x instanceof Element);
                }
            };
            const lhsIsConstant = lhsSpecifier.constVal !== undefined;
            const rhsIsConstant = rhsSpecifier.constVal !== undefined;
            const remoteLHS = lhsIsConstant ? undefined : await find(enhancedElement, lhsSpecifier, within);
            if (!lhsIsConstant && !(remoteLHS instanceof EventTarget))
                continue;
            const remoteRHS = rhsIsConstant ? undefined : await find(enhancedElement, rhsSpecifier, within);
            if (!rhsIsConstant && !(remoteRHS instanceof EventTarget))
                continue;
            const lhsAO = !remoteLHS ? undefined : await ASMR.getAO(remoteLHS, {
                evt: lhsSpecifier.evt || 'input',
                selfIsVal: lhsSpecifier.prop === '$0' && lhsSpecifier.path === undefined,
                propToAbsorb: lhsSpecifier.path
            });
            const rhsAO = !remoteRHS ? undefined : await ASMR.getAO(remoteRHS, {
                evt: rhsSpecifier.evt || 'input',
                selfIsVal: rhsSpecifier.prop === '$0' && rhsSpecifier.path === undefined,
                propToAbsorb: rhsSpecifier.path,
                as: rhsSpecifier.as,
                
                //propToAbsorb: rhsProp
            });
            this.#twoValSwitchToAO.set(tvs, [lhsAO, rhsAO]);
            aos.push([lhsAO, rhsAO]);
        }
        const ac = this.#ac = new AbortController();
        for (const ao of aos) {
            const [lhsAO, rhsAO] = ao;
            lhsAO?.addEventListener('.', this, { signal: ac.signal });
            rhsAO?.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }
    async handleEvent() {
        const twoValSwitches = Array.from(this.#twoValSwitchToAO.keys());
        let foundOne = false;
        const tvsToAOs = this.#twoValSwitchToAO;
        for (const tvs of twoValSwitches) {
            const { req, op, onOrOff, lhsSpecifier, rhsSpecifier } = tvs;
            if (foundOne && !req)
                continue;
            const aos = tvsToAOs.get(tvs);
            if(aos === undefined) throw 500;
            const [lhsAO, rhsAO] = aos;
            const lhsVal = lhsAO ? await lhsAO.getValue() : lhsSpecifier.constVal;
            const rhsVal = rhsAO ? await rhsAO.getValue() : rhsSpecifier.constVal;
            //TODO:  deal with lt, gt, boolish, etc
            let value = false;
            switch (op) {
                case 'eq':
                case 'equals':
                    value = lhsVal === rhsVal;
                    break;
                case 'gt':
                    throw 'NI';
                case 'lt':
                    throw 'NI';
            }
            if (onOrOff.endsWith('ff'))
                value = !value;
            if (value)
                foundOne = true;
        }
        const self = this.self;
        self.twoValSwitchNoGo = false;
        self.twoValSwitchesSatisfied = foundOne;
    }
}
