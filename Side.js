import { findRealm } from 'trans-render/lib/findRealm.js';
import { checkSwitches } from './doTwoValSwitch.js';
export class Side {
    tvs;
    eventName;
    prop;
    type;
    perimeter;
    constructor(tvs, eventName, prop, type, perimeter) {
        this.tvs = tvs;
        this.eventName = eventName;
        this.prop = prop;
        this.type = type;
        this.perimeter = perimeter;
    }
    async do(self, onOrOff, enhancedElement) {
        const { tvs, eventName, prop, type, perimeter } = this;
        const { dependsOn } = tvs;
        switch (type) {
            case '|':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, prop);
                if (itempropEl.hasAttribute('contenteditable')) {
                    tvs.lhsSignal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                else {
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                    tvs.lhsSignal = new WeakRef(beValueAdded);
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
                tvs.lhsSignal = new WeakRef(inputEl);
                if (dependsOn) {
                    inputEl.addEventListener('input', e => {
                        enhancedElement.dispatchEvent(new Event('input'));
                    });
                    inputEl.addEventListener('change', e => {
                        enhancedElement.dispatchEvent(new Event('change'));
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
    }
}
