//import {BVAAllProps} from 'be-value-added/types';
export class SingleValSwitchHandler {
    self;
    #specifierToAO = new Map();
    #ac;
    constructor(self) {
        this.self = self;
        this.do(self);
    }
    async do(self) {
        const { find } = await import('trans-render/dss/find.js');
        const { ASMR } = await import('trans-render/asmr/asmr.js');
        const { singleValSwitches, enhancedElement } = self;
        for (const svs of singleValSwitches) {
            const { specifier } = svs;
            const remoteEl = await find(enhancedElement, specifier);
            if (!(remoteEl instanceof Element))
                continue;
            const { prop } = specifier;
            if (prop === undefined)
                throw 'NI';
            const ao = await ASMR.getAO(remoteEl, {
                evt: specifier.evt || 'input',
                selfIsVal: specifier.path === '$0',
            });
            this.#specifierToAO.set(svs, ao);
            // const seeker = new BinSeeker(specifier, true);
            // const obj = await seeker.do(self, null,  enhancedElement);
            // svs.signal = obj?.signal;
        }
        const ac = this.#ac = new AbortController();
        const aos = Object.values(this.#specifierToAO);
        for (const ao of aos) {
            ao.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }
    async handleEvent() {
        const singleValSwitches = Array.from(this.#specifierToAO.keys());
        const self = this.self;
        let foundOne = false;
        const specifierToAO = this.#specifierToAO;
        for (const onSwitch of singleValSwitches) {
            const { req, specifier } = onSwitch;
            if (foundOne && !req)
                continue;
            const ao = specifierToAO.get(onSwitch);
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
// export async function doSingleValSwitch(self: AP){
//     const {singleValSwitches, enhancedElement} = self;
//     for(const svs of singleValSwitches!){
//         const {specifier} = svs;
//         const seeker = new BinSeeker(specifier, true);
//         const obj = await seeker.do(self, null,  enhancedElement);
//         svs.signal = obj?.signal;
//     }
//     await checkSwitches(self);
// }
// export async function checkSwitches(self: AP){
//     const {singleValSwitches} = self;
//     let foundOne = false;
//     for(const onSwitch of singleValSwitches!){
//         const {req, specifier} = onSwitch;
//         if(foundOne && !req) continue;
//         const ref = onSwitch.signal?.deref();
//         if(ref === undefined) {
//             console.warn({onSwitch, msg: "Out of scope"});
//             continue;
//         }
//         const {prop, host} = specifier;
//         let value = false;
//         if(host && prop){
//             value = (<any>ref)[prop];
//         }else{
//             const {getSignalVal} = await import('be-linked/getSignalVal.js');
//             value = getSignalVal(ref);
//         }
//         if(req){
//             if(!value){
//                 //console.log({value, foundOne, req});
//                 self.singleValSwitchNoGo = true;
//                 return;
//             }else{
//                 foundOne = true;
//             }
//         }else{
//             if(value) foundOne = true;
//         }
//         //console.log({value, foundOne, req});
//     }
//     //console.log({foundOne, onBinarySwitches});
//     self.singleValSwitchNoGo = false;
//     self.singleValSwitchesSatisfied = foundOne;
// }
