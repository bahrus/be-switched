import { tryParse } from 'be-enhanced/cpu.js';
const strType = String.raw `\$|\#|\@|\/`;
const reOnTwoValSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^when(?<lhsType>${strType})(?<lhsProp>[\w]+)(?<!\\)(?<op>Equals)(?<rhsType>${strType})(?<rhsProp>[\w]+)`),
        defaultVals: {}
    },
];
const reOnBinarySwitchStatements = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals: {
            req: true
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals: {}
    }
];
export async function prsOn(self) {
    const { On } = self;
    const onBinarySwitches = [];
    const onTwoValueSwitches = [];
    for (const onS of On) {
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements);
        if (twoValSwitchTest !== null) {
            onTwoValueSwitches.push(twoValSwitchTest);
            continue;
        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements);
        if (binarySwitchTest === null)
            throw 'PE'; //Parse Error
        onBinarySwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches,
        onTwoValueSwitches
    };
}
