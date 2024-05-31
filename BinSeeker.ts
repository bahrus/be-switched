import {AP} from './types.js';
import {Seeker} from 'be-linked/Seeker.js';

export class BinSeeker<TSelf = AP, TCtx = 'on' | 'off'> extends Seeker<TSelf, TCtx>{

    async callback<TSelf, TCtx>(self: TSelf, signalRef: HTMLInputElement, eventSuggestion: string, propagator: EventTarget | undefined){
        const {checkSwitches} = await import('./doSingleValSwitch.js');
        (propagator || signalRef).addEventListener(eventSuggestion, e => {
            checkSwitches(self as AP);
        })
    }


}




