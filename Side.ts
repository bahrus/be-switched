import { ElTypes, SignalRefType } from '../be-linked/types';
import { findRealm } from 'trans-render/lib/findRealm.js';
import {AP, ISide, SignalAndEvent} from './types';

export class Seeker extends EventTarget implements ISide{
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
                signalRef = await findRealm(enhancedElement, ['wis', prop!])  as HTMLInputElement;
                if(signalRef.hasAttribute('contenteditable')){
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }else{
                    import('be-value-added/be-value-added.js');
                    signalRef = await  (<any>signalRef).beEnhanced.whenResolved('be-value-added') as HTMLInputElement;
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'value-changed';
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
            case '/':
                signalRef = await findRealm(enhancedElement, ['corn', '[itemscope]']) as HTMLInputElement;
                signal = new WeakRef(signalRef);
                break;
            
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


}




