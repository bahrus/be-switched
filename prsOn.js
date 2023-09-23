import { tryParse } from 'be-enhanced/cpu.js';
const reOnTwoValSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^when(?<lhsType>\$|\#|\@)(?<lhsProp>[\w]+)(?<!\\)(?<op>Equals)(?<rhsType>\$|\#|\@)(?<rhsProp>[\w]+)`),
        defaultVals: {}
    },
];
const reOnBinarySwitchStatements = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals: {
            req: true
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals: {}
    }
];
export async function prsOn(self) {
    const { On } = self;
    const onBinarySwitches = [];
    for (const onS of On) {
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements);
        if (twoValSwitchTest !== null) {
        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements);
        if (binarySwitchTest === null)
            throw 'PE'; //Parse Error
        onBinarySwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches
    };
}
