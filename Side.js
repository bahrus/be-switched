import { findRealm } from 'trans-render/lib/findRealm.js';
import { checkSwitches } from './doTwoValSwitch.js';
export class Side extends EventTarget {
    tvs;
    eventName;
    prop;
    type;
    perimeter;
    constructor(tvs, eventName, prop, type, perimeter) {
        super();
        this.tvs = tvs;
        this.eventName = eventName;
        this.prop = prop;
        this.type = type;
        this.perimeter = perimeter;
    }
    val;
    async do(self, onOrOff, enhancedElement) {
        const { tvs, eventName, prop, type, perimeter } = this;
        const { dependsOn } = tvs;
        let signal = undefined;
        switch (type) {
            case '|':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, prop);
                if (itempropEl.hasAttribute('contenteditable')) {
                    signal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                else {
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                    signal = new WeakRef(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                break;
            case '~':
            case '@':
            case '#': {
                let inputEl;
                switch (type) {
                    case '@':
                        if (perimeter !== undefined) {
                            inputEl = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]);
                        }
                        else {
                            inputEl = await findRealm(enhancedElement, ['wf', prop]);
                        }
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + prop]);
                        break;
                    case '~':
                        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop);
                        inputEl = await findRealm(enhancedElement, ['wis', localName, true]);
                        break;
                }
                if (!inputEl)
                    throw 404;
                signal = new WeakRef(inputEl);
                if (dependsOn) {
                    if (enhancedElement.oninput) {
                        inputEl.addEventListener('input', e => {
                            const lhsTarget = this.tvs.lhsSignal?.deref();
                            if (!lhsTarget)
                                return;
                            const rhsTarget = this.tvs.rhsSignal?.deref();
                            if (!rhsTarget)
                                return;
                            const evt = new InputEvent(tvs, lhsTarget, rhsTarget);
                            enhancedElement.dispatchEvent(evt);
                            tvs.switchedOn = evt.switchOn;
                            checkSwitches(self, onOrOff);
                        });
                    }
                }
                else {
                    inputEl.addEventListener(eventName, e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                break;
            }
        }
        return signal;
    }
    doLoadEvent(enhancedElement) {
        const ctx = this.tvs;
        const lhsTarget = ctx.lhsSignal?.deref();
        if (!lhsTarget)
            return;
        const rhsTarget = ctx.rhsSignal?.deref();
        if (!rhsTarget)
            return;
        if (enhancedElement.oninput) {
            const event = new InputEvent(ctx, lhsTarget, rhsTarget);
            enhancedElement.dispatchEvent(event);
            ctx.switchedOn = event.switchOn;
            console.log(event);
        }
    }
}
export class InputEvent extends Event {
    ctx;
    lhsTarget;
    rhsTarget;
    switchOn;
    static EventName = 'input';
    constructor(ctx, lhsTarget, rhsTarget, switchOn) {
        super(InputEvent.EventName);
        this.ctx = ctx;
        this.lhsTarget = lhsTarget;
        this.rhsTarget = rhsTarget;
        this.switchOn = switchOn;
    }
}
// export class ChangeEvent extends Event implements EventForTwoValSwitch{
//     static EventName: changeEventName = 'change';
//     constructor(
//         public ctx: OnTwoValueSwitch, 
//         public lhsTarget: SignalRefType, 
//         public rhsTarget: SignalRefType, 
//         public switchOn?: boolean){
//         super(ChangeEvent.EventName);
//     }
// }
// export class LoadEvent extends Event implements EventForTwoValSwitch{
//     static EventName: loadEventName = 'load';
//         constructor(
//         public ctx: OnTwoValueSwitch, 
//         public lhsTarget: SignalRefType, 
//         public rhsTarget: SignalRefType, 
//         public switchOn?: boolean){
//         super(LoadEvent.EventName);
//     }
// }
