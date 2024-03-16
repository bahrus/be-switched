import { getSignalVal } from 'be-linked/getSignalVal.js';
import { getVal } from 'trans-render/lib/getVal.js';
import { Side } from './Side.js';
export async function doTwoValSwitch(self, onOrOff) {
    const { enhancedElement, onTwoValueSwitches, offTwoValueSwitches } = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for (const onSwitch of valueSwitches) {
        const { lhsProp, rhsProp, lhsType, rhsType, lhsPerimeter, rhsPerimeter, lhsEvent, rhsEvent, dependsOn } = onSwitch;
        const lhs = onSwitch.lhs = new Side(onSwitch, lhsEvent, lhsProp, lhsType, lhsPerimeter);
        const rhs = onSwitch.rhs = new Side(onSwitch, rhsEvent, rhsProp, rhsType, rhsPerimeter);
        onSwitch.lhsSignal = await lhs.do(self, onOrOff, enhancedElement);
        onSwitch.rhsSignal = await rhs.do(self, onOrOff, enhancedElement);
        if (dependsOn) {
            lhs.doLoadEvent(enhancedElement);
        }
    }
    await checkSwitches(self, onOrOff);
}
export async function checkSwitches(self, onOrOff) {
    const { onTwoValueSwitches, offTwoValueSwitches } = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    if (valueSwitches?.length === 0)
        return;
    let foundOne = false;
    for (const onSwitch of valueSwitches) {
        const { req, lhsSignal, rhsSignal, op, negate, rhsSubProp, lhsSubProp, dependsOn, switchedOn } = onSwitch;
        if (foundOne && !req)
            continue;
        let value = false;
        if (dependsOn) {
            value = switchedOn;
        }
        else {
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
            const lhs = lhsSubProp !== undefined ? await getVal({ host: lhsRef }, lhsSubProp) : getSignalVal(lhsRef);
            const rhs = rhsSubProp !== undefined ? await getVal({ host: rhsRef }, rhsSubProp) : getSignalVal(rhsRef);
            switch (op) {
                case 'eq':
                case 'equals':
                    value = lhs === rhs;
                    break;
                case 'lt':
                    value = lhs < rhs;
                    break;
            }
            if (negate)
                value = !value;
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
