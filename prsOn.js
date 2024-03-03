import { tryParse } from 'be-enhanced/cpu.js';
const strType = String.raw `\||\#|\@|\/|\%|\~`;
const lhsOpRhs = String.raw `when(?<lhsType>${strType})(?<lhsProp>[\w\-\:]+)(?<!\\)(?<op>Equals)(?<rhsType>${strType})(?<rhsProp>[\w\-\:]+)`;
const eventTypeLhsOpRhs = String.raw `^(?<eventTypes>[\w\-\:]+)$`;
const reOnTwoValSwitchStatements = [
    {
        regExp: new RegExp(`^${lhsOpRhs}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(eventTypeLhsOpRhs),
        defaultVals: {}
    }
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
    },
    {
        regExp: new RegExp(String.raw `^when(?<prop>[\w]+)`),
        defaultVals: {
            type: '/'
        }
    },
];
export async function prsOn(self) {
    const { On, on } = self;
    const onBinarySwitches = [];
    const onTwoValueSwitches = [];
    const onUnion = [...(On || []), ...(on || [])];
    for (const onS of onUnion) {
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
