//import { BeValueAdded } from 'be-value-added/be-value-added.js';
import {AP, ProPAP, OnBinaryValueSwitch, PAP} from './types';
import('be-value-added/be-value-added.js');
import {BVAAllProps} from 'be-value-added/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
import { Scope } from './trans-render/lib/types';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function configSwitch(self: AP){
    const {enhancedElement, onSwitches} = self;
    //TODO:  replace with trans-render/lib/findRealm.js.
    //const scope = enhancedElement.closest('[itemscope]') as Element;
    for(const onSwitch of onSwitches!){
        const {prop, type} = onSwitch;
        let scope: Scope;
        switch(type){
            case '$':
                let itempropEl= await findRealm(enhancedElement, ['wis', prop!])  as HTMLLinkElement;
                if(itempropEl === null){
                    itempropEl = document.createElement('link');
                    itempropEl.setAttribute('itemprop', prop!);
                    const scope = enhancedElement.closest('[itemscope]')!;
                    scope.appendChild(itempropEl);
                }
                const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                onSwitch.signal = new WeakRef<BVAAllProps>(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                })
                break;
        }
        
        

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