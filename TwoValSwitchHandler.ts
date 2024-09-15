import {AP, TwoValueSwitch} from './types.js';
import { AbsorbingObject } from './ts-refs/trans-render/asmr/types.js';
import { BEAllProps } from '../be-enhanced/ts-refs/be-enhanced/types.js';


export class TwoValSwitchHandler{
    #twoValSwitchToAO = new Map<TwoValueSwitch, [AbsorbingObject, AbsorbingObject]>();
    #ac: AbortController | undefined;
    constructor(public self: AP & BEAllProps){
        this.do(self);
    }

    async do(self: AP & BEAllProps){
        const {find} = await import('trans-render/dss/find.js');
        const {ASMR} = await import('trans-render/asmr/asmr.js');
        const {twoValueSwitches, enhancedElement} = self;
        let aos: Array<[AbsorbingObject, AbsorbingObject]> = [];
        for(const tvs of twoValueSwitches!){
            const {lhsSpecifier, rhsSpecifier} = tvs;
            const remoteLHS = await find(enhancedElement, lhsSpecifier!);
            if(!(remoteLHS instanceof EventTarget)) continue;
            const remoteRHS = await find(enhancedElement, rhsSpecifier!);
            if(!(remoteRHS instanceof EventTarget)) continue;
            const lhsProp = lhsSpecifier?.prop;
            const rhsProp = rhsSpecifier?.prop;
            if(lhsProp === undefined || rhsProp === undefined) throw 'NI';
            const lhsAO = await ASMR.getAO(remoteLHS, {
                evt: lhsSpecifier!.evt || 'input',
                selfIsVal: lhsSpecifier!.path === '$0',
                //propToAbsorb: lhsProp
            });
            const rhsAO = await ASMR.getAO(remoteRHS, {
                evt: rhsSpecifier!.evt || 'input',
                selfIsVal: rhsSpecifier!.path === '$0',
                //propToAbsorb: rhsProp
            });
            this.#twoValSwitchToAO.set(tvs, [lhsAO, rhsAO]);
            aos.push([lhsAO, rhsAO]);
        }
        const ac = this.#ac = new AbortController();
        for(const ao of aos){
            const [lhsAO, rhsAO] = ao;
            lhsAO.addEventListener('.', this, {signal: ac.signal});
            rhsAO.addEventListener('.', this, {signal: ac.signal});
        }
        this.handleEvent();
    }

    async handleEvent(){
        const twoValSwitches = Array.from(this.#twoValSwitchToAO!.keys());
        let foundOne = false;
        const tvsToAOs = this.#twoValSwitchToAO;
        for(const tvs of twoValSwitches){
            const {req, op} = tvs;
            if(foundOne && !req) continue;
            const [lhsAO, rhsAO] = tvsToAOs.get(tvs)!;
            const lhsVal = await lhsAO.getValue();
            const rhsVal = await rhsAO.getValue();
            //TODO:  deal with lt, gt, boolish, etc
            switch(op){
                case 'eq':
                case 'equals':
                    if(lhsVal === rhsVal){
                        foundOne=true;
                    }
                    break;
                case 'gt':
                    throw 'NI';
                case 'lt':
                    throw 'NI';
            }
        }
        const self = this.self;
        self.twoValSwitchNoGo = false;
        self.twoValSwitchesSatisfied = foundOne;
    }
}
// export async function doTwoValSwitch(self: BeSwitched){
//     const {enhancedElement, twoValueSwitches} = self;
//     for(const onSwitch of twoValueSwitches!){
//         const {
//             lhsSpecifier,
//             rhsSpecifier,
//             negate,
//             withinSpecifier
//         } = onSwitch;
//         let within: Array<Element> | undefined;
//         if(withinSpecifier !== undefined){
//             const {find} = await import('trans-render/dss/find.js');
//             within = await find(enhancedElement, withinSpecifier);
//         }
//         const lhs = onSwitch.lhs = new SideSeeker(
//             lhsSpecifier!,
//             true, 
//         );
//         const rhs = onSwitch.rhs = new SideSeeker(
//             rhsSpecifier!,
//             true,
//         );
//         const lhsReturnObj = await lhs.do(self, negate, enhancedElement, within);
//         onSwitch.lhsSignal = lhsReturnObj?.signal;
//         const rhsReturnObj = await rhs.do(self, negate, enhancedElement, within);
//         onSwitch.rhsSignal = rhsReturnObj?.signal;
//     }
//     await checkSwitches(self);
// }

// export async function checkSwitches(self: BeSwitched){
//     const {twoValueSwitches} = self;
//     let foundOne = false;
//     if(twoValueSwitches?.length === 0) {
//         self.switchesSatisfied = foundOne;
//         return;
//     }
    

//     for(const onSwitch of twoValueSwitches!){
//         const {req, lhsSignal, rhsSignal, op, negate, lhsSpecifier, rhsSpecifier} = onSwitch;
//         if(foundOne && !req) continue;
//         let value = false; 
//         {
//             const {path: lhsSubProp} = lhsSpecifier!;
//             const {path: rhsSubProp, as: rhsType} = rhsSpecifier!;
//             const lhsRef = lhsSignal?.deref();
//             if(lhsRef === undefined) {
//                 console.warn({onSwitch, msg: "Out of scope"});
//                 continue;
//             } 
//             const rhsRef = rhsSignal?.deref();
//             if(rhsRef === undefined) {
//                 console.warn({onSwitch, msg: "Out of scope"});
//                 continue;
//             } 
//             const lhs = lhsSubProp !== undefined ? await getVal({host: lhsRef}, lhsSubProp) :  getSignalVal(lhsRef);
//             let rhs = rhsSubProp !== undefined ? await getVal({host:rhsRef}, rhsSubProp) : getSignalVal(rhsRef);
//             if(rhsType !== undefined){
//                 switch(rhsType.toLowerCase()){
//                     case 'number':
//                         rhs = Number(rhs);
//                         break;
//                     default:
//                         throw 'NI'
//                 }
//             }
//             switch(op){
//                 case 'eq':
//                 case 'equals':
//                     value = lhs === rhs;
//                     break;
//                 case 'lt':
//                     value = lhs < rhs;
//                     break;
//                 case 'gt':
//                     value = lhs > rhs;
//                     break;
//             }
//             if(negate) value = !value;
//         }
//         if(req){
//             if(!value){
//                 self.twoValSwitchNoGo = true;
//                 return;
//             }
//         }else{
//             if(value) foundOne = true;
//         }
//     }
//     self.twoValSwitchNoGo = false;
//     self.twoValSwitchesSatisfied = foundOne;
// }



