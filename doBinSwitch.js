import('be-value-added/be-value-added.js');
import { findRealm } from 'trans-render/lib/findRealm.js';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function doBinSwitch(self) {
    const { enhancedElement, onBinarySwitches } = self;
    for (const onSwitch of onBinarySwitches) {
        const { prop, type } = onSwitch;
        switch (type) {
            case '$':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = getItemPropEl(enhancedElement, prop);
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
        }
    }
    checkSwitches(self);
}
function checkSwitches(self) {
    const { onBinarySwitches } = self;
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
                self.switchesSatisfied = false;
                return;
            }
        }
        else {
            if (value)
                foundOne = true;
        }
    }
    self.switchesSatisfied = foundOne;
}