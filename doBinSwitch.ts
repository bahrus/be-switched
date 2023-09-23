//import { BeValueAdded } from 'be-value-added/be-value-added.js';
import {AP, ProPAP, OnBinaryValueSwitch, PAP} from './types';
import('be-value-added/be-value-added.js');
import {BVAAllProps} from 'be-value-added/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function doBinSwitch(self: AP){
    const {enhancedElement, onBinarySwitches} = self;
    for(const onSwitch of onBinarySwitches!){
        const {prop, type} = onSwitch;
        switch(type){
            case '$':
                const {getItemPropEl} = await import('./getItempropEl.js');
                const itempropEl = getItemPropEl(enhancedElement, prop!);
                const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                onSwitch.signal = new WeakRef<BVAAllProps>(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                })
                break;
            case '@':{
                const inputEl = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
                if(!inputEl) throw 404;
                onSwitch.signal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
            case '#':{
                const inputEl = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
                if(!inputEl) throw 404;
                onSwitch.signal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
        }
        
        

    }
    checkSwitches(self);

}

function checkSwitches(self: AP){
    const {onBinarySwitches} = self;
    let foundOne = false;
    for(const onSwitch of onBinarySwitches!){
        const {req} = onSwitch;
        if(foundOne && !req) continue;
        const ref = onSwitch.signal?.deref();
        if(ref === undefined) {
            console.warn({onSwitch, msg: "Out of scope"});
            continue;
        }
        let value = false;
        if((<HTMLInputElement>ref).checked !== undefined){
            value = (<HTMLInputElement>ref).checked;
        }else if(ref instanceof Element && ref.hasAttribute('aria-checked')){
            value = ref.getAttribute('aria-checked') === 'true';
        }else{
            value = (ref as BVAAllProps).value as boolean;
        }
        if(req){
            if(!value){
                self.switchesSatisfied = false;
                return;
            }
        }else{
            if(value) foundOne = true;
        }
    }
    self.switchesSatisfied = foundOne;
}