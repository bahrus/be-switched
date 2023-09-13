//import { BeValueAdded } from 'be-value-added/be-value-added.js';
import {AP, ProPAP, OnSwitch, PAP} from './types';
import('be-value-added/be-value-added.js');
import {BVAAllProps} from 'be-value-added/types';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function configSwitch(self: AP){
    const {enhancedElement, onSwitches} = self;
    const scope = enhancedElement.closest('[itemscope]') as Element;
    for(const onSwitch of onSwitches!){
        const {prop} = onSwitch;
        let itempropEl = scope.querySelector(`[itemprop="${prop}"]`) as HTMLLinkElement;//TODO check in donut
        if(itempropEl === null){
            itempropEl = document.createElement('link');
            itempropEl.setAttribute('itemprop', prop!);
            scope.appendChild(itempropEl);
        }
        const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps;
        onSwitch.signal = new WeakRef<BVAAllProps>(beValueAdded);
        beValueAdded.addEventListener('value-changed', e => {
            checkSwitches(self);
        })
    }
    checkSwitches(self);

}

function checkSwitches(self: AP){
    const {onSwitches} = self;
    let foundOne = false;
    for(const onSwitch of onSwitches!){
        const {req} = onSwitch;
        if(foundOne && !req) continue;
        const ref = onSwitch.signal?.deref();
        if(ref === undefined) {
            console.warn({onSwitch, msg: "Out of scope");
            continue;
        }
        if(req){
            if(!ref.value){
                self.switchesSatisfied = false;
                return;
            }
        }else{
            if(ref.value) foundOne = true;
        }
    }
    self.switchesSatisfied = foundOne;
}