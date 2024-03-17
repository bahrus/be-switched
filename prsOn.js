import { tryParse } from 'trans-render/lib/prs/tryParse.js';
const reNValueSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^dependingOn(?<dependsOn>.*)`),
        defaultVals: {}
    }
];
export async function prsOn(self, negate = false) {
    const { On, on, Off, off } = self;
    const nValueScriptSwitches = [];
    const onUnion = negate ? [...(Off || []), ...(off || [])] : [...(On || []), ...(on || [])];
    let foundNonNValSwitch = false;
    for (const onS of onUnion) {
        const nValSwitchTest = tryParse(onS, reNValueSwitchStatements);
        if (nValSwitchTest !== null) {
            const { prsNValue } = await import('./prsNVal.js');
            prsNValue(nValSwitchTest);
            nValueScriptSwitches.push(nValSwitchTest);
            continue;
        }
        else {
            foundNonNValSwitch = true;
        }
    }
    let Lt3 = {};
    if (foundNonNValSwitch) {
        const { prsOnLt3 } = await import('./prsOnLt3.js');
        Lt3 = await prsOnLt3(self, negate);
    }
    return {
        ...Lt3,
        onNValueSwitches: nValueScriptSwitches,
    };
}
