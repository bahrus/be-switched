//import { BeValueAdded } from 'be-value-added/be-value-added.js';
import {AP, ProPAP, OneValueSwitch, PAP} from './types';
import {BVAAllProps} from 'be-value-added/types';
import {Actions as BPActions} from 'be-propagating/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function doBinSwitch(self: AP, onOrOff: 'on' | 'off'){
    const {enhancedElement, onBinarySwitches, offBinarySwitches} = self;
    const binarySwitches = onOrOff === 'on' ? onBinarySwitches : offBinarySwitches;
    for(const onSwitch of binarySwitches!){
        const {prop, type} = onSwitch;
        switch(type){
            case '|':
                const {getItemPropEl} = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, prop!);
                import('be-value-added/be-value-added.js');
                const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                onSwitch.signal = new WeakRef<BVAAllProps>(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self, onOrOff);
                })
                break;
            case '/':{
                    const host = await findRealm(enhancedElement, 'hostish');
                    if(!host) throw 404;
                    import('be-propagating/be-propagating.js');
                    const bePropagating = await (<any>host).beEnhanced.whenResolved('be-propagating') as BPActions;
                    const signal = await bePropagating.getSignal(prop!);
                    signal.addEventListener('value-changed', e => {
                        checkSwitches(self, onOrOff);
                    });
                    onSwitch.signal = new WeakRef(signal);
                }
                break;
            case '~':
            case '%':
            case '@':
            case '#':{
                let editableElement: EventTarget | null | undefined = null;
                switch(type){
                    case '@':
                        editableElement = await findRealm(enhancedElement, ['wf', prop!]);
                        break;

                    case '#':
                        editableElement = await findRealm(enhancedElement, ['wrn', '#' + prop!]);
                        break;
                    case '%':
                        editableElement = await findRealm(enhancedElement, ['wrn', `[part~="${prop}"]`]);
                        break;
                    case '~':
                        throw 'NI';
                        editableElement = await findRealm(enhancedElement, ['wis', ``])
                }
                onSwitch.signal = new WeakRef(editableElement as HTMLInputElement);
                editableElement?.addEventListener('input', e => {
                    checkSwitches(self, onOrOff);
                });
                break;
            }
            // case '@':{
            //     const inputEl = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
            //     if(!inputEl) throw 404;
                
            // }
            // case '#':{
            //     const inputEl = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
            //     if(!inputEl) throw 404;
            //     onSwitch.signal = new WeakRef(inputEl);
            //     inputEl.addEventListener('input', e => {
            //         checkSwitches(self, onOrOff);
            //     });
            //     break;
            // }

        }
        
        

    }
    checkSwitches(self, onOrOff);

}

const symLookup = new Map(
    []
);

function checkSwitches(self: AP, onOrOff: 'on' | 'off'){
    const {onBinarySwitches, offBinarySwitches} = self;
    const binarySwitches = onOrOff === 'on' ? onBinarySwitches : offBinarySwitches;
    if(binarySwitches?.length === 0) return;
    let foundOne = false;
    for(const onSwitch of binarySwitches!){
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