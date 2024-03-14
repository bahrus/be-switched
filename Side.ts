import { ElTypes, SignalRefType } from '../be-linked/types';
import { BVAAllProps } from '../be-value-added/types';
import { findRealm } from 'trans-render/lib/findRealm.js';
import {AP, OnTwoValueSwitch} from './types';
import {checkSwitches} from './doTwoValSwitch.js';

export class Side{
    constructor(
        public tvs: OnTwoValueSwitch, 
        public eventName: string,
        public prop?: string,
        public type?: ElTypes,
        public perimeter?: string,
    ){}
    async do(
        self: AP,
        onOrOff: 'on' | 'off',
        enhancedElement: Element) : Promise<WeakRef<SignalRefType> | undefined>
    {
        const {tvs, eventName, prop, type, perimeter} = this;
        const {dependsOn} = tvs;
        let signal: WeakRef<SignalRefType> | undefined = undefined;
        switch(type){
            case '|':
                const {getItemPropEl} = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, prop!);
                if(itempropEl.hasAttribute('contenteditable')){
                    signal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self, onOrOff);
                    });
                }else{
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                    signal = new WeakRef<BVAAllProps>(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                break;
            case '~':
            case '@':
            case '#':{
                let inputEl: HTMLInputElement;
                switch(type){
                    case '@':
                        if(perimeter !== undefined){
                            inputEl = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]) as HTMLInputElement;
                        }else{
                            inputEl = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
                        }
                        
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
                        break;
                    case '~':
                        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop!);
                        inputEl = await findRealm(enhancedElement, ['wis', localName, true]) as HTMLInputElement;
                        break;
                }
                if(!inputEl) throw 404;
                signal = new WeakRef(inputEl);
                if(dependsOn){
                    inputEl.addEventListener('input', e => {
                        enhancedElement.dispatchEvent(new Event('input'));
                    });
                    inputEl.addEventListener('change', e => {
                        enhancedElement.dispatchEvent(new Event('change'));
                    });
                }else{
                    inputEl.addEventListener(eventName, e => {
                        checkSwitches(self, onOrOff);
                    });
                }

                break;
            }
        }
        return signal;
    }
}