import { findRealm } from 'trans-render/lib/findRealm.js';
export async function doTwoValSwitch(self) {
    const { enhancedElement, onTwoValueSwitches } = self;
    for (const onSwitch of onTwoValueSwitches) {
        const { lhsProp, rhsProp, lhsType, rhsType } = onSwitch;
        switch (lhsType) {
            case '$':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = getItemPropEl(enhancedElement, lhsProp);
                const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                onSwitch.lhsSignal = new WeakRef(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                });
                break;
            case '@': {
                const inputEl = await findRealm(enhancedElement, ['wf', lhsProp]);
                if (!inputEl)
                    throw 404;
                onSwitch.lhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
            case '#': {
                const inputEl = await findRealm(enhancedElement, ['wrn', '#' + lhsProp]);
                if (!inputEl)
                    throw 404;
                onSwitch.lhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
        }
        switch (rhsType) {
            case '$':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = getItemPropEl(enhancedElement, rhsProp);
                const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                onSwitch.rhsSignal = new WeakRef(beValueAdded);
                beValueAdded.addEventListener('value-changed', e => {
                    checkSwitches(self);
                });
                break;
            case '@': {
                const inputEl = await findRealm(enhancedElement, ['wf', rhsProp]);
                if (!inputEl)
                    throw 404;
                onSwitch.rhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
            case '#': {
                const inputEl = await findRealm(enhancedElement, ['wrn', '#' + rhsProp]);
                if (!inputEl)
                    throw 404;
                onSwitch.rhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self);
                });
                break;
            }
        }
    }
}
function checkSwitches(self) {
    const { onTwoValueSwitches } = self;
    let foundOne = false;
    for (const onSwitch of onTwoValueSwitches) {
        const { req, lhsSignal, rhsSignal } = onSwitch;
        if (foundOne && !req)
            continue;
        const lhsRef = lhsSignal?.deref();
        if (lhsRef === undefined) {
            console.warn({ onSwitch, msg: "Out of scope" });
            continue;
        }
        const rhsRef = rhsSignal?.deref();
        if (rhsRef === undefined) {
            console.warn({ onSwitch, msg: "Out of scope" });
            continue;
        }
        const lhs = lhsRef.value;
        const rhs = rhsRef.value;
        let value = false;
    }
}
