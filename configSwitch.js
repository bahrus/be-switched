import('be-value-added/be-value-added.js');
import { findRealm } from 'trans-render/lib/findRealm.js';
//almost identical to be-itemized/#addMicrodataElement -- share?
export async function configSwitch(self) {
    const { enhancedElement, onSwitches } = self;
    //TODO:  replace with trans-render/lib/findRealm.js.
    //const scope = enhancedElement.closest('[itemscope]') as Element;
    for (const onSwitch of onSwitches) {
        const { prop, type } = onSwitch;
        let scope;
        switch (type) {
            case '$':
                let itempropEl = await findRealm(enhancedElement, ['wis', prop]);
                if (itempropEl === null) {
                    itempropEl = document.createElement('link');
                    itempropEl.setAttribute('itemprop', prop);
                    const scope = enhancedElement.closest('[itemscope]');
                    scope.appendChild(itempropEl);
                }
                const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                onSwitch.signal = new WeakRef(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                });
                break;
        }
    }
    checkSwitches(self);
}
function checkSwitches(self) {
    const { onSwitches } = self;
    let foundOne = false;
    for (const onSwitch of onSwitches) {
        const { req } = onSwitch;
        if (foundOne && !req)
            continue;
        const ref = onSwitch.signal?.deref();
        if (ref === undefined) {
            console.warn({ onSwitch, msg: "Out of scope" });
            continue;
        }
        if (req) {
            if (!ref.value) {
                self.switchesSatisfied = false;
                return;
            }
        }
        else {
            if (ref.value)
                foundOne = true;
        }
    }
    self.switchesSatisfied = foundOne;
}
