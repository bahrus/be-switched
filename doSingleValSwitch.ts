import { BinSeeker } from './BinSeeker.js';
import {AP, ProPAP, OneValueSwitch, PAP} from './types.js';
import {BVAAllProps} from 'be-value-added/types';

export async function doSingleValSwitch(self: AP){
    const {singleValSwitches, enhancedElement} = self;
    for(const svs of singleValSwitches!){
        const {specifier} = svs;
        const seeker = new BinSeeker(specifier, true);
        const obj = await seeker.do(self, null,  enhancedElement);
        svs.signal = obj?.signal;
    }
    await checkSwitches(self);
}

export async function checkSwitches(self: AP){
    const {singleValSwitches} = self;
    let foundOne = false;
    if(onNValueSwitches !== undefined){
        for(const nvalSwitch of onNValueSwitches){
            if(nvalSwitch.switchedOn){
                foundOne = true;
            }
        }
    }
    if(binarySwitches?.length === 0){
        self.switchesSatisfied = foundOne;
        return;
    }
    for(const onSwitch of binarySwitches!){
        const {req, specifier} = onSwitch;
        if(foundOne && !req) continue;
        const ref = onSwitch.signal?.deref();
        if(ref === undefined) {
            console.warn({onSwitch, msg: "Out of scope"});
            continue;
        }
        const {prop, host} = specifier;
        let value = false;
        if(host && prop){
            value = (<any>ref)[prop];
        }else{
            const {getSignalVal} = await import('be-linked/getSignalVal.js');
            value = getSignalVal(ref);
        }
        if(req){
            if(!value){
                //console.log({value, foundOne, req});
                self.switchesSatisfied = false;
                return;
            }else{
                foundOne = true;
            }
        }else{
            if(value) foundOne = true;
        }
        //console.log({value, foundOne, req});
    }
    //console.log({foundOne, onBinarySwitches});
    self.switchesSatisfied = foundOne;
}