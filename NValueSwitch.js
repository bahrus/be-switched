import { Side } from './Side.js';
export class NValueSwitch {
    constructor(self) {
        this.do(self);
    }
    #signals = new Map();
    #nValueSwitch;
    async do(self) {
        const { onNValueSwitches } = self;
        if (onNValueSwitches === undefined || onNValueSwitches.length > 1)
            throw 'NI';
        const nValueSwitch = onNValueSwitches[0];
        this.#nValueSwitch = nValueSwitch;
        const { dependencies } = nValueSwitch;
        const { enhancedElement } = self;
        for (const dependency of dependencies) {
            const { perimeter, prop, elType, event } = dependency;
            const side = new Side(false, event, prop, elType, perimeter);
            const res = await side.do(self, 'on', enhancedElement);
            const { eventSuggestion, signal } = res;
            this.#signals.set(prop, signal);
            const ref = signal.deref();
            ref?.addEventListener(eventSuggestion, e => {
                this.#invokeInputEvent(self);
            });
        }
        this.#invokeInputEvent(self);
    }
    async #invokeInputEvent(self) {
        const factors = {};
        for (const [key, value] of this.#signals.entries()) {
            factors[key] = value.deref();
        }
        const inputEvent = new InputEvent(this.#nValueSwitch, factors);
        const { enhancedElement } = self;
        enhancedElement.dispatchEvent(inputEvent);
        const { switchOn, elevate } = inputEvent;
        if (typeof switchOn === 'boolean') {
            self.switchesSatisfied = switchOn;
        }
        if (elevate !== undefined) {
            const { doElevate } = await import('./doElevate.js');
            await doElevate(self, elevate, switchOn);
        }
    }
}
export class InputEvent extends Event {
    ctx;
    factors;
    switchOn;
    elevate;
    static EventName = 'input';
    constructor(ctx, factors, switchOn, elevate) {
        super(InputEvent.EventName, { bubbles: true });
        this.ctx = ctx;
        this.factors = factors;
        this.switchOn = switchOn;
        this.elevate = elevate;
    }
}
