import { Seeker } from 'be-linked/Seeker.js';
export class SideSeeker extends Seeker {
    async callback(self, signalRef, eventSuggestion, onOrOff) {
        const { checkSwitches } = await import('./doTwoValSwitch.js');
        signalRef.addEventListener(eventSuggestion, e => {
            checkSwitches(self, onOrOff);
        });
    }
}
