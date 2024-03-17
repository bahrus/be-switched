import { AP, EventForNValueSwitch, NValueScriptSwitch, inputEventName } from './types';
import {Side} from './Side.js';
import { SignalRefType } from 'be-linked/types';

export class NValueSwitch{
    constructor(self: AP){
        this.do(self);
    }

    #signals: Map<string, WeakRef<SignalRefType>> = new Map();
    #nValueSwitch: NValueScriptSwitch | undefined;
    async do(self: AP){
        const {onNValueSwitches} = self;
        if(onNValueSwitches === undefined || onNValueSwitches.length > 1) throw 'NI';
        const nValueSwitch = onNValueSwitches[0];
        this.#nValueSwitch = nValueSwitch;
        const {dependencies} = nValueSwitch;
        const {enhancedElement} = self;
        for(const dependency of dependencies!){
            const {
                perimeter,
                prop,
                elType,
                event
            } = dependency
            const side = new Side(
                false,
                event,
                prop,
                elType,
                perimeter
            );
            const res = await side.do(self, 'on', enhancedElement);
            const {eventSuggestion, signal} = res!;
            this.#signals.set(prop!, signal!);
            const ref = signal!.deref();
            ref?.addEventListener(eventSuggestion!, e => {
                this.#invokeInputEvent(self);
            });
        }
        this.#invokeInputEvent(self);
    }

    async #invokeInputEvent(self: AP){
        const factors: {[key: string]: SignalRefType} = {};
        for(const [key, value] of this.#signals.entries()){
            factors[key] = value.deref() as SignalRefType;
        }
        const inputEvent = new InputEvent(this.#nValueSwitch!, factors);
        const {enhancedElement} = self;
        enhancedElement.dispatchEvent(inputEvent);
        const {switchOn, elevate} = inputEvent;
        if(typeof switchOn === 'boolean'){
            self.switchesSatisfied = switchOn;
        }
        if(elevate !== undefined){
            const {doElevate} = await import('./doElevate.js');
            await doElevate(self, elevate, switchOn);
        }
    }
}

export class InputEvent extends Event implements EventForNValueSwitch{

    static EventName: inputEventName = 'input';

    constructor(
        public ctx: NValueScriptSwitch, 
        public factors: {[key: string]: SignalRefType},
        public switchOn?: boolean,
        public elevate?: {
            val: any,
            to: string
        }
        ){
        super(InputEvent.EventName, {bubbles: true});
    }
}