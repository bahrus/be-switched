import { SignalRefType } from '../be-linked/types.js';
import { findRealm } from 'trans-render/lib/findRealm.js';
import {AP, ISide, SignalAndEvent} from './types.js';
import {ElTypes, ElO} from 'trans-render/lib/prs/types';

export class SideSeeker<TSelf = AP, TCtx = 'on' | 'off'> extends EventTarget implements ISide{
    constructor(
        public elO: ElO,
        public doCallback?: boolean,
    ){
        super();
    }
    val: any;
    async do<TSelf, TCtx>(
        self: TSelf,
        onOrOff: TCtx,
        enhancedElement: HTMLTemplateElement) : Promise<SignalAndEvent | undefined>
    {
        const {elO} = this;
        const {event, prop, elType, perimeter} = elO;
        let signal: WeakRef<SignalRefType> | undefined = undefined;
        let eventSuggestion: string | undefined = undefined;
        let signalRef: HTMLInputElement | undefined = undefined;
        switch(elType){
            case '|':
                signalRef = await findRealm(enhancedElement, ['wis', prop!])  as HTMLInputElement;
                if(signalRef.hasAttribute('contenteditable')){
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }else{
                    [signalRef, signal, eventSuggestion] = await this.addValue(signalRef);
                }
                break;
            case '~':
            case '@':
            case '#':{
                switch(elType){
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

                eventSuggestion = event || 'input'

                break;
            }
            case '/':
                signalRef = await findRealm(enhancedElement, ['corn', '[itemscope]']) as HTMLInputElement;
                signal = new WeakRef(signalRef);
                break;
            
        }
        if(this.doCallback && signalRef !== undefined && eventSuggestion !== undefined){
            await this.callback(self, signalRef, eventSuggestion, onOrOff);
        }
        return {
            signal,
            eventSuggestion
        };
    }

    async callback<TSelf, TCtx>(self: TSelf, signalRef: HTMLInputElement, eventSuggestion: string, onOrOff: TCtx){
        const {checkSwitches} = await import('./doTwoValSwitch.js');
        signalRef.addEventListener(eventSuggestion, e => {
            checkSwitches(self as AP, onOrOff as 'on' | 'off');
        })
    }

    async addValue(signalRef: HTMLInputElement) : Promise<[HTMLInputElement, WeakRef<SignalRefType>, string]>{
        import('be-value-added/be-value-added.js');
        const newSignalRef = await  (<any>signalRef).beEnhanced.whenResolved('be-value-added') as HTMLInputElement;
        const signal = new WeakRef(signalRef);
        return [newSignalRef, signal, 'value-changed'];
    }

}




