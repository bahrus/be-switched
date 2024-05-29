import { BeSwitched } from './be-switched.js';
import {AP, ISide} from './types.js';
import {Seeker} from 'be-linked/Seeker.js';

export class SideSeeker<TSelf = AP, TCtx = 'on' | 'off'> extends Seeker<TSelf, TCtx> implements ISide{

    async callback<TSelf, TCtx>(self: TSelf, signalRef: HTMLInputElement, eventSuggestion: string){
        const {checkSwitches} = await import('./doTwoValSwitch.js');
        signalRef.addEventListener(eventSuggestion, e => {
            checkSwitches(self as BeSwitched);
        })
    }


}




