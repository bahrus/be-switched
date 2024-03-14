import { getSignalVal } from 'be-linked/getSignalVal.js';
import { getVal } from 'trans-render/lib/getVal.js';
import { Side } from './Side.js';
export async function doTwoValSwitch(self, onOrOff) {
    const { enhancedElement, onTwoValueSwitches, offTwoValueSwitches } = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for (const onSwitch of valueSwitches) {
        const { lhsProp, rhsProp, lhsType, rhsType, eventNames, lhsPerimeter, rhsPerimeter } = onSwitch;
        //console.log({eventNames, lhsProp, rhsProp, lhsType, rhsType, lhsSubProp, rhsSubProp});
        const splitEventNames = eventNames === undefined ? ['input', 'input'] : eventNames.split(',');
        const lhs = new Side(onSwitch, splitEventNames[0], lhsProp, lhsType, lhsPerimeter);
        onSwitch.lhsSignal = await lhs.do(self, onOrOff, enhancedElement);
        const rhs = new Side(onSwitch, splitEventNames[1], rhsProp, rhsType, rhsPerimeter);
        onSwitch.rhsSignal = await rhs.do(self, onOrOff, enhancedElement);
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
        const { req, lhsSignal, rhsSignal, op, negate, rhsSubProp, lhsSubProp, dependsOn } = onSwitch;
        if (dependsOn)
            continue;
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
        const lhs = lhsSubProp !== undefined ? await getVal({ host: lhsRef }, lhsSubProp) : getSignalVal(lhsRef);
        const rhs = rhsSubProp !== undefined ? await getVal({ host: rhsRef }, rhsSubProp) : getSignalVal(rhsRef);
        let value = false;
        switch (op) {
            case 'equals':
                value = lhs === rhs;
                break;
        }
        if (negate)
            value = !value;
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
export class LoadEvent extends Event {
    lhs;
    rhs;
    switchOn;
    static EventName = 'load';
    constructor(lhs, rhs, switchOn) {
        super(LoadEvent.EventName);
        this.lhs = lhs;
        this.rhs = rhs;
        this.switchOn = switchOn;
    }
}
export class InputEvent extends Event {
    lhs;
    rhs;
    switchOn;
    static EventName = 'input';
    constructor(lhs, rhs, switchOn) {
        super(InputEvent.EventName);
        this.lhs = lhs;
        this.rhs = rhs;
        this.switchOn = switchOn;
    }
}
export class ChangeEvent extends Event {
    lhs;
    rhs;
    switchOn;
    static EventName = 'change';
    constructor(lhs, rhs, switchOn) {
        super(ChangeEvent.EventName);
        this.lhs = lhs;
        this.rhs = rhs;
        this.switchOn = switchOn;
    }
}
