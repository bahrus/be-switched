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
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        let aos = [];
        for (const tvs of twoValueSwitches) {
            const { lhsIPE, rhsIPE } = tvs;
            const {id: lid, constVal: lConstVal, evtName: lEvtName, path: lPath, as: lAs} = lhsIPE;
            const {id: rid, constVal: rConstVal, evtName: rEvtName, path: rPath, as: rAs} = rhsIPE;
            
            const lhsIsConstant = lConstVal !== undefined;
            const rhsIsConstant = rConstVal !== undefined;
            // const remoteLHS = lhsIsConstant ? undefined : await find(enhancedElement, lhsSpecifier, within);
            if(!lhsIsConstant){

            }
            const remoteLHS = lhsIsConstant ? undefined : lid !== undefined ? rn.getElementById(lid) : rn.host;
            if (!lhsIsConstant && !(remoteLHS instanceof EventTarget)) throw 500;
            //const remoteRHS = rhsIsConstant ? undefined : await find(enhancedElement, rhsSpecifier, within);
            const remoteRHS = rhsIsConstant ? undefined : rid !== undefined ? rn.getElementById(rid) : rn.host;
            if (!rhsIsConstant && !(remoteRHS instanceof EventTarget)) throw 500;
            const lhsAO = !remoteLHS ? undefined : await ASMR.getAO(remoteLHS, {
                evt: lEvtName,
                //selfIsVal: lhsSpecifier.prop === '$0' && lhsSpecifier.path === undefined,
                propToAbsorb: lPath,
                as: lAs,
            });
            const rhsAO = !remoteRHS ? undefined : await ASMR.getAO(remoteRHS, {
                evt: rEvtName,
                //selfIsVal: rhsSpecifier.prop === '$0' && rhsSpecifier.path === undefined,
                propToAbsorb: rPath,
                as: rAs,
                
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
    /**
     * 
     * @param {import('./ts-refs/trans-render/dss/types').IPE} ipe 
     */
    getConstVal(ipe){
        const { constVal, as } = ipe;
        switch(as){
            case 'number':
            case 'boolean':
            case 'boolean|number':
                return JSON.parse(constVal);
            case 'string':
                return constVal;
            default:
                throw 'NI';
        }
    }
    async handleEvent() {
        const twoValSwitches = Array.from(this.#twoValSwitchToAO.keys());
        let foundOne = false;
        const tvsToAOs = this.#twoValSwitchToAO;
        for (const tvs of twoValSwitches) {
            const { req, op, onOrOff, lhsIPE, rhsIPE } = tvs;
            if (foundOne && !req)
                continue;
            const aos = tvsToAOs.get(tvs);
            if(aos === undefined) throw 500;
            const [lhsAO, rhsAO] = aos;
            const lhsVal = lhsAO ? await lhsAO.getValue() : this.getConstVal(lhsIPE);
            const rhsVal = rhsAO ? await rhsAO.getValue() : this.getConstVal(rhsIPE);
            //TODO:  deal with lt, gt, boolish, etc
            let value = false;
            switch (op) {
                case 'eq':
                case 'equals':
                    value = lhsVal === rhsVal;
                    break;
                case 'gt':
                    value =  lhsVal > rhsVal;
                    break;
                case 'lt':
                    value = lhsVal < rhsVal;
                    break;
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
