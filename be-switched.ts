import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import { Positractions, PropInfo } from 'trans-render/froop/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

export class BeSwitched extends BE implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propInfo:{
            // on: {},
            // On: {},
            // off: {},
            // Off: {}
            twoValueSwitches: {},
        },
        actions:{
            onOn: {
                //ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['On', 'on'],
            },
            onOff:{
                //ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['Off', 'off'],
            },
        }
    }

    async onOn(self: this): ProPAP {
        const {on, On} = self;
        console.log({on, On});
        // const {parsedFrom} = self;
        // let parsed = prsOnCache.get(parsedFrom);
        // if(parsed === undefined){
        //     const {prsOn} = await import('../prsOn.js');
        //     parsed = await prsOn(self);
        //     prsOnCache.set(parsedFrom, parsed); 
        // }
        // return structuredClone(parsed);
        return {}
    }

    async onOff(self: this): ProPAP {
        // const {parsedFrom} = self;
        // let parsed = prsOffCache.get(parsedFrom);
        // if(parsed === undefined){
        //     const {prsOn} = await import('../prsOn.js');
        //     parsed = await prsOn(self, true);
        //     prsOffCache.set(parsedFrom, parsed); 
        // }
        // return structuredClone(parsed);
        return {}
    }
    
}

export interface BeSwitched extends AllProps{}