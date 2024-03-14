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
                        //console.log({evt});
                    });
                    inputEl.addEventListener('change', e => {
                        const target = signal?.deref();
                        if (!target)
                            return;
                        const evt = new ChangeEvent(tvs, target);
                        enhancedElement.dispatchEvent(evt);
                        console.log({ evt });
                    });
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
export class ChangeEvent extends Event {
    ctx;
    target;
    switchOn;
    static EventName = 'change';
    constructor(ctx, target, switchOn) {
        super(ChangeEvent.EventName);
        this.ctx = ctx;
        this.target = target;
        this.switchOn = switchOn;
    }
}
