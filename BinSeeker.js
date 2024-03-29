import { Seeker } from 'be-linked/Seeker.js';
export class BinSeeker extends Seeker {
    async callback(self, signalRef, eventSuggestion, onOrOff) {
        const { checkSwitches } = await import('./doBinSwitch.js');
        signalRef.addEventListener(eventSuggestion, e => {
            checkSwitches(self, onOrOff);
        });
    }
}
