import { Seeker } from 'be-linked/Seeker.js';
export class BinSeeker extends Seeker {
    async callback(self, signalRef, eventSuggestion, propagator, onOrOff) {
        const { checkSwitches } = await import('./doBinSwitch.js');
        (propagator || signalRef).addEventListener(eventSuggestion, e => {
            checkSwitches(self, onOrOff);
        });
    }
}
