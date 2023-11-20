import { findRealm } from 'trans-render/lib/findRealm.js';
import { getSignalVal } from 'be-linked/getSignalVal.js';
export async function doTwoValSwitch(self, onOrOff) {
    const { enhancedElement, onTwoValueSwitches, offTwoValueSwitches } = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for (const onSwitch of valueSwitches) {
        const { lhsProp, rhsProp, lhsType, rhsType } = onSwitch;
        switch (lhsType) {
            case '$':
                const { getItemPropEl } = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, lhsProp);
                if (itempropEl.hasAttribute('contenteditable')) {
                    onSwitch.lhsSignal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self);
                    });
                }
                else {
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                    onSwitch.lhsSignal = new WeakRef(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self);
                    });
                }
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
                const itempropEl = await getItemPropEl(enhancedElement, rhsProp);
                if (itempropEl.hasAttribute('contenteditable')) {
                    onSwitch.rhsSignal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self);
                    });
                }
                else {
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
                    onSwitch.rhsSignal = new WeakRef(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self);
                    });
                }
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
    checkSwitches(self);
}
function checkSwitches(self) {
    const { onTwoValueSwitches } = self;
    if (onTwoValueSwitches?.length === 0)
        return;
    let foundOne = false;
    for (const onSwitch of onTwoValueSwitches) {
        const { req, lhsSignal, rhsSignal, op } = onSwitch;
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
        const lhs = getSignalVal(lhsRef);
        const rhs = getSignalVal(rhsRef);
        let value = false;
        switch (op) {
            case 'equals':
                value = lhs === rhs;
                break;
        }
        if (req) {
            if (!value) {
                //console.log({lhs, rhs, value, req});
                self.switchesSatisfied = false;
                return;
            }
        }
        else {
            if (value)
                foundOne = true;
        }
        //console.log({lhs, rhs, value, foundOne});
    }
    self.switchesSatisfied = foundOne;
}
