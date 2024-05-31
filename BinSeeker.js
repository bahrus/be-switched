import { Seeker } from 'be-linked/Seeker.js';
export class BinSeeker extends Seeker {
    async callback(self, signalRef, eventSuggestion, propagator) {
        const { checkSwitches } = await import('./doSingleValSwitch.js');
        (propagator || signalRef).addEventListener(eventSuggestion, e => {
            checkSwitches(self);
        });
    }
}
