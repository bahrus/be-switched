import {AP, ProPAP, OnSwitch, PAP} from './types';
import('be-value-added/be-value-added.js');
import {BVAAllProps} from 'be-value-added/types';
//almost identical to be-itmized/#addMicrodataEleemnt -- share?
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
        if(beValueAdded.value){
            self.anySwitchIsOn = true;
            return;
        }
        beValueAdded.addEventListener('value-changed', e => {
            console.log(e);
        })
        // for(const itempropEl of itempropEls){
        //     (<any>itempropEl).beEnhanced.by.beValueAdded.value = itemVal;
        // }
    }

}