import { getSignalVal } from 'be-linked/getSignalVal.js';
import { getVal } from 'trans-render/lib/getVal.js';
import { SideSeeker } from './SideSeeker.js';
export async function doTwoValSwitch(self) {
    const { enhancedElement, twoValueSwitches } = self;
    for (const onSwitch of twoValueSwitches) {
        const { lhsSpecifier, rhsSpecifier, negate } = onSwitch;
        const lhs = onSwitch.lhs = new SideSeeker(lhsSpecifier, true);
        const rhs = onSwitch.rhs = new SideSeeker(rhsSpecifier, true);
        const lhsReturnObj = await lhs.do(self, negate, enhancedElement);
        onSwitch.lhsSignal = lhsReturnObj?.signal;
        const rhsReturnObj = await rhs.do(self, negate, enhancedElement);
        onSwitch.rhsSignal = rhsReturnObj?.signal;
    }
    await checkSwitches(self);
}
export async function checkSwitches(self) {
    const { twoValueSwitches } = self;
    let foundOne = false;
    if (twoValueSwitches?.length === 0) {
        self.switchesSatisfied = foundOne;
        return;
    }
    for (const onSwitch of twoValueSwitches) {
        const { req, lhsSignal, rhsSignal, op, negate, lhsSpecifier, rhsSpecifier } = onSwitch;
        if (foundOne && !req)
            continue;
        let value = false;
        {
            const { path: lhsSubProp } = lhsSpecifier;
            const { path: rhsSubProp, as: rhsType } = rhsSpecifier;
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
            let rhs = rhsSubProp !== undefined ? await getVal({ host: rhsRef }, rhsSubProp) : getSignalVal(rhsRef);
            if (rhsType !== undefined) {
                console.log({ rhsType });
                switch (rhsType) {
                    case 'Number':
                        rhs = Number(rhs);
                        break;
                    default:
                        throw 'NI';
                }
            }
            switch (op) {
                case 'eq':
                case 'equals':
                    value = lhs === rhs;
                    break;
                case 'lt':
                    value = lhs < rhs;
                    break;
                case 'gt':
                    value = lhs > rhs;
                    break;
            }
            if (negate)
                value = !value;
        }
        if (req) {
            if (!value) {
                //console.log({lhs, rhs, value, req});
                self.twoValSwitchNoGo = true;
                return;
            }
        }
        else {
            if (value)
                foundOne = true;
        }
        //console.log({lhs, rhs, value, foundOne});
    }
    self.twoValSwitchNoGo = false;
    self.twoValSwitchesSatisfied = foundOne;
}
