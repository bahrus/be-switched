import { findRealm } from 'trans-render/lib/findRealm.js';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function doBinSwitch(self, onOrOff) {
    const { enhancedElement, onBinarySwitches, offBinarySwitches } = self;
    const binarySwitches = onOrOff === 'on' ? onBinarySwitches : offBinarySwitches;
    for (const onSwitch of binarySwitches) {
        const { prop, type } = onSwitch;
        switch (type) {
            case '$':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, prop);
                import('be-value-added/be-value-added.js');
                const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                onSwitch.signal = new WeakRef(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                });
                break;
            case '@': {
                const inputEl = await findRealm(enhancedElement, ['wf', prop]);
                if (!inputEl)
                    throw 404;
                onSwitch.signal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
            case '#': {
                const inputEl = await findRealm(enhancedElement, ['wrn', '#' + prop]);
                if (!inputEl)
                    throw 404;
                onSwitch.signal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
            case '/': {
                const host = await findRealm(enhancedElement, 'hostish');
                if (!host)
                    throw 404;
                import('be-propagating/be-propagating.js');
                const bePropagating = await host.beEnhanced.whenResolved('be-propagating');
                const signal = await bePropagating.getSignal(prop);
                signal.addEventListener('value-changed', e => {
                    checkSwitches(self);
                });
                onSwitch.signal = new WeakRef(signal);
            }
        }
    }
    checkSwitches(self);
}
function checkSwitches(self) {
    const { onBinarySwitches } = self;
    if (onBinarySwitches?.length === 0)
        return;
    let foundOne = false;
    for (const onSwitch of onBinarySwitches) {
        const { req } = onSwitch;
        if (foundOne && !req)
            continue;
        const ref = onSwitch.signal?.deref();
        if (ref === undefined) {
            console.warn({ onSwitch, msg: "Out of scope" });
            continue;
        }
        let value = false;
        if (ref.checked !== undefined) {
            value = ref.checked;
        }
        else if (ref instanceof Element && ref.hasAttribute('aria-checked')) {
            value = ref.getAttribute('aria-checked') === 'true';
        }
        else {
            value = ref.value;
        }
        if (req) {
            if (!value) {
                //console.log({value, foundOne, req});
                self.switchesSatisfied = false;
                return;
            }
            else {
                foundOne = true;
            }
        }
        else {
            if (value)
                foundOne = true;
        }
        //console.log({value, foundOne, req});
    }
    //console.log({foundOne, onBinarySwitches});
    self.switchesSatisfied = foundOne;
}
