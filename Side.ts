import { ElTypes, SignalRefType } from '../be-linked/types';
import { BVAAllProps } from '../be-value-added/types';
import { findRealm } from 'trans-render/lib/findRealm.js';
import {AP, ISide, SignalAndEvent} from './types';
//import {checkSwitches} from './doTwoValSwitch.js';

export class Side extends EventTarget implements ISide{
    constructor(
        public invokeCheckSwitches?: boolean,
        public eventName?: string,
        public prop?: string,
        public type?: ElTypes,
        public perimeter?: string,
    ){
        super();
    }
    val: any;
    async do(
        self: AP,
        onOrOff: 'on' | 'off',
        enhancedElement: HTMLTemplateElement) : Promise<SignalAndEvent | undefined>
    {
        const {eventName, prop, type, perimeter} = this;
        let signal: WeakRef<SignalRefType> | undefined = undefined;
        let eventSuggestion: string | undefined = undefined;
        let signalRef: HTMLInputElement | undefined = undefined;
        switch(type){
            case '|':
                const {getItemPropEl} = await import('./getItempropEl.js');
                signalRef = await getItemPropEl(enhancedElement, prop!) as HTMLInputElement;
                if(signalRef.hasAttribute('contenteditable')){
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                    // if(this.invokeCheckSwitches){
                    //     itempropEl.addEventListener('input', e => {
                    //         checkSwitches(self, onOrOff);
                    //     });
                    // }

                }else{
                    import('be-value-added/be-value-added.js');
                    signalRef = await  (<any>signalRef).beEnhanced.whenResolved('be-value-added') as HTMLInputElement;
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'value-changed';
                    // if(this.invokeCheckSwitches){
                    //     beValueAdded.addEventListener(eventSuggestion, e => {
                    //         checkSwitches(self, onOrOff);
                    //     });
                    // }

                }
                break;
            case '~':
            case '@':
            case '#':{
                switch(type){
                    case '@':
                        if(perimeter !== undefined){
                            signalRef = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]) as HTMLInputElement;
                        }else{
                            signalRef = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
                        }
                        
                        break;
                    case '#':
                        signalRef = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
                        break;
                    case '~':
                        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop!);
                        signalRef = await findRealm(enhancedElement, ['wis', localName, true]) as HTMLInputElement;
                        break;
                }
                if(!signalRef) throw 404;
                signal = new WeakRef(signalRef);

                eventSuggestion = eventName || 'input'

                break;
            }
            
        }
        if(this.invokeCheckSwitches && signalRef !== undefined && eventSuggestion !== undefined){
            const {checkSwitches} = await import('./doTwoValSwitch.js');
            signalRef.addEventListener(eventSuggestion, e => {
                checkSwitches(self, onOrOff);
            })
        }
        return {
            signal,
            eventSuggestion
        };
    }
    // doLoadEvent(enhancedElement: HTMLTemplateElement){
    //     const ctx = this.tvs;
    //     const lhsTarget = ctx.lhsSignal?.deref();
    //     if(!lhsTarget) return;
    //     const rhsTarget = ctx.rhsSignal?.deref();
    //     if(!rhsTarget) return;
    //     if(enhancedElement.oninput){
    //         const event = new InputEvent(ctx, lhsTarget, rhsTarget);
    //         enhancedElement.dispatchEvent(event as Event);
    //         ctx.switchedOn = event.switchOn;
    //         console.log(event);
    //     }

    // }

}




