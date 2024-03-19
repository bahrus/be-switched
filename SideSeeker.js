import { findRealm } from 'trans-render/lib/findRealm.js';
export class SideSeeker extends EventTarget {
    invokeCheckSwitches;
    eventName;
    prop;
    type;
    perimeter;
    constructor(invokeCheckSwitches, eventName, prop, type, perimeter) {
        super();
        this.invokeCheckSwitches = invokeCheckSwitches;
        this.eventName = eventName;
        this.prop = prop;
        this.type = type;
        this.perimeter = perimeter;
    }
    val;
    async do(self, onOrOff, enhancedElement) {
        const { eventName, prop, type, perimeter } = this;
        let signal = undefined;
        let eventSuggestion = undefined;
        let signalRef = undefined;
        switch (type) {
            case '|':
                signalRef = await findRealm(enhancedElement, ['wis', prop]);
                if (signalRef.hasAttribute('contenteditable')) {
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }
                else {
                    import('be-value-added/be-value-added.js');
                    signalRef = await signalRef.beEnhanced.whenResolved('be-value-added');
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'value-changed';
                }
                break;
            case '~':
            case '@':
            case '#': {
                switch (type) {
                    case '@':
                        if (perimeter !== undefined) {
                            signalRef = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]);
                        }
                        else {
                            signalRef = await findRealm(enhancedElement, ['wf', prop]);
                        }
                        break;
                    case '#':
                        signalRef = await findRealm(enhancedElement, ['wrn', '#' + prop]);
                        break;
                    case '~':
                        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop);
                        signalRef = await findRealm(enhancedElement, ['wis', localName, true]);
                        break;
                }
                if (!signalRef)
                    throw 404;
                signal = new WeakRef(signalRef);
                eventSuggestion = eventName || 'input';
                break;
            }
            case '/':
                signalRef = await findRealm(enhancedElement, ['corn', '[itemscope]']);
                signal = new WeakRef(signalRef);
                break;
        }
        if (this.invokeCheckSwitches && signalRef !== undefined && eventSuggestion !== undefined) {
            const { checkSwitches } = await import('./doTwoValSwitch.js');
            signalRef.addEventListener(eventSuggestion, e => {
                checkSwitches(self, onOrOff);
            });
        }
        return {
            signal,
            eventSuggestion
        };
    }
}
