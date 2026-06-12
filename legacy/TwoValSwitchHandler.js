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
        const { ASMR } = await import('trans-render/asmr/asmr.js');
        const { twoValueSwitches, enhancedElement } = self;
        const rn = /** @type {DocumentFragment & {host: any}} */ (enhancedElement.getRootNode());
        let aos = [];
        for (const tvs of twoValueSwitches) {
            const { lhsSpecifier, rhsSpecifier } = tvs;
            const {
                id: lid, 
                constVal: lConstVal, 
                evtName: lEvtName, 
                path: lPath, 
                as: lAs,
                prop: lProp,
            } = lhsSpecifier;
            const {
                id: rid, 
                constVal: rConstVal, 
                evtName: rEvtName, 
                path: rPath, 
                as: rAs,
                prop: rProp,
            } = rhsSpecifier;
            
            const lhsIsConstant = lConstVal !== undefined;
            const rhsIsConstant = rConstVal !== undefined;
            // const remoteLHS = lhsIsConstant ? undefined : await find(enhancedElement, lhsSpecifier, within);

            const remoteLHS = lhsIsConstant ? undefined : lid !== undefined ? rn.getElementById(lid) : await enhancedElement.hostish();
            if (!lhsIsConstant && !(remoteLHS instanceof EventTarget)) throw 500;
            /** @type {AbsorbingObject<any> | undefined} */
            let lhsAO = undefined;
            if(remoteLHS !== undefined){
                const propToAbsorb = lPath ? `?.${lProp}?.${lPath}` : lProp;
                lhsAO = await ASMR.getAO(remoteLHS, {
                    evt: lEvtName,
                    propToAbsorb,
                    as: lAs,
                });
            }
            //const remoteRHS = rhsIsConstant ? undefined : await find(enhancedElement, rhsSpecifier, within);
            const remoteRHS = rhsIsConstant ? undefined : rid !== undefined ? rn.getElementById(rid) : await enhancedElement.hostish();
            if (!rhsIsConstant && !(remoteRHS instanceof EventTarget)) throw 500;
            /** @type {AbsorbingObject<any> | undefined} */
            let rhsAO = undefined;
            if(remoteRHS !== undefined){
                const propToAbsorb = rPath ? `?.${rProp}?.${rPath}` : rProp;
                rhsAO = !remoteRHS ? undefined : await ASMR.getAO(remoteRHS, {
                    evt: rEvtName,
                    propToAbsorb,
                    as: rAs,
                    
                });
            }

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
    // /**
    //  * 
    //  * @param {import('./ts-refs/trans-render/dss/types').Specifier} specifier 
    //  */
    // getConstVal(specifier){
    //     const { constVal, as } = specifier;
    //     switch(as){
    //         case 'number':
    //         case 'boolean':
    //         case 'boolean|number':
    //             return JSON.parse(constVal);
    //         case 'string':
    //             return constVal;
    //         default:
    //             throw 'NI';
    //     }
    // }
    async handleEvent() {
        const twoValSwitches = Array.from(this.#twoValSwitchToAO.keys());
        let foundOne = false;
        const tvsToAOs = this.#twoValSwitchToAO;
        const {getConstVal} = await import('trans-render/asmr/getConstVal.js');
        for (const tvs of twoValSwitches) {
            const { req, op, onOrOff, lhsSpecifier, rhsSpecifier } = tvs;
            if (foundOne && !req)
                continue;
            const aos = tvsToAOs.get(tvs);
            if(aos === undefined) throw 500;
            const [lhsAO, rhsAO] = aos;
            const lhsVal = lhsAO ? await lhsAO.getValue() : getConstVal(lhsSpecifier);
            const rhsVal = rhsAO ? await rhsAO.getValue() : getConstVal(rhsSpecifier);
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
