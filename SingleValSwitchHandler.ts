//import { BinSeeker } from './BinSeeker.js';
import { AbsorbingObject } from './ts-refs/trans-render/asmr/types.js';
import { BEAllProps } from './ts-refs/trans-render/be/types.js';
import {AP, OneValueSwitch} from './types.js';

export class SingleValSwitchHandler implements EventListenerObject{
    #specifierToAO = new Map<OneValueSwitch, AbsorbingObject>();
    #ac: AbortController | undefined;
    constructor(public self: AP & BEAllProps){
        this.do(self);
       
    }

    async do(self: AP & BEAllProps){
        const {find} = await import('trans-render/dss/find.js');
        const {ASMR} = await import('trans-render/asmr/asmr.js');
        const {singleValSwitches, enhancedElement} = self;
        let aos: Array<AbsorbingObject> = [];
        for(const svs of singleValSwitches!){
            const {specifier} = svs;
            const remoteEl = await find(enhancedElement, specifier);
            if(!(remoteEl instanceof Element)) continue;
            const {prop} = specifier;
            if(prop === undefined) throw 'NI';
            const ao = await ASMR.getAO(remoteEl, {
                evt: specifier.evt || 'input',
                selfIsVal: specifier.path === '$0',
            });
            this.#specifierToAO.set(svs, ao);
            aos.push(ao);
        }
        const ac = this.#ac = new AbortController();
        for(const ao of aos){
            ao.addEventListener('.', this, {signal: ac.signal});
        }
        this.handleEvent();
    }

    async handleEvent() {
        const singleValSwitches = Array.from(this.#specifierToAO.keys());
        const self = this.self;
        let foundOne = false;
        const specifierToAO = this.#specifierToAO;
        for(const onSwitch of singleValSwitches){
            const {req, specifier} = onSwitch;
            if(foundOne && !req) continue;
            const ao = specifierToAO.get(onSwitch);
            const value = await ao?.getValue();
            if(req){
                if(!value){
                    self.singleValSwitchNoGo = true;
                    return;
                }else{
                    foundOne = true;
                }
            }else{
                if(value) foundOne = true;
            }
        }
        self.singleValSwitchNoGo = false;
        self.singleValSwitchesSatisfied = foundOne;
    }
}

