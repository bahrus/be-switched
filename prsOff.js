import { tryParse } from 'be-enhanced/cpu.js';
const strType = String.raw `\$|\#|\@|\/`;
const reOnTwoValSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^when(?<lhsType>${strType})(?<lhsProp>[\w]+)(?<!\\)(?<op>Equals)(?<rhsType>${strType})(?<rhsProp>[\w]+)`),
        defaultVals: {
            negate: true
        }
    },
];
const reOnBinarySwitchStatements = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals: {
            req: true,
            negate: true,
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals: {
            negate: true,
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<prop>[\w]+)`),
        defaultVals: {
            type: '/',
            negate: true,
        }
    },
];
export async function prsOff(self) {
    const { Off, off } = self;
    const offBinarySwitches = [];
    const offTwoValueSwitches = [];
    const onUnion = [...(Off || []), ...(off || [])];
    for (const onS of onUnion) {
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements);
        if (twoValSwitchTest !== null) {
            offTwoValueSwitches.push(twoValSwitchTest);
            continue;
        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements);
        if (binarySwitchTest === null)
            throw 'PE'; //Parse Error
        offBinarySwitches.push(binarySwitchTest);
    }
    return {
        offBinarySwitches,
        offTwoValueSwitches
    };
}
