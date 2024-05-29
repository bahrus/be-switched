import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import { Positractions, PropInfo } from 'trans-render/froop/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

export class BeSwitched extends BE<HTMLTemplateElement> implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propInfo:{
            // on: {},
            // On: {},
            // off: {},
            // Off: {}
            twoValueSwitches: {},
        },
        actions:{
            onTwoValSwitches: {
                ifAllOf: ['twoValueSwitches']
            }
        }
    }

    async onTwoValSwitches(self: this){
        const {twoValueSwitches} = self;
        console.log({twoValueSwitches});
    }
    
}

export interface BeSwitched extends AllProps{}