import { tryParse } from 'be-enhanced/cpu.js';
const strType = String.raw `\||\#|\@|\/|\%|\~`;
const lhsPerimeter = String.raw `\^(?<lhsPerimeter>.*)`;
const lhsTypeLHSProp = String.raw `(?<lhsType>${strType})(?<lhsProp>[\w\-\:\|]+)`;
const rhsPerimeter = String.raw `\^(?<rhsPerimeter>.*)`;
const rhsTypeRhsProp = String.raw `(?<rhsType>${strType})(?<rhsProp>[\w\-\:\|]+)`;
const opEquals = String.raw `(?<!\\)(?<op>(Equals|Eq))`;
const lhsOpRhs = String.raw `${lhsTypeLHSProp}${opEquals}${rhsTypeRhsProp}`;
const lhsPerimeterLhsOpRhsPerimeterRhs = String.raw `${lhsPerimeter}${lhsTypeLHSProp}${opEquals}${rhsPerimeter}${rhsTypeRhsProp}`;
const lhsPerimeterLhsOpRhs = String.raw `${lhsPerimeter}${lhsTypeLHSProp}${opEquals}${rhsTypeRhsProp}`;
const lhsOpRhsPerimeterRhs = String.raw `${lhsTypeLHSProp}${opEquals}${rhsPerimeter}${rhsTypeRhsProp}`;
const LhsOpRhsEventNames = String.raw `${lhsOpRhs}(?<!\\)\,ListeningFor(?<eventNames>[\w\-\:\,]+)(?<!\\)(Event|Events)`;
const reOnTwoValSwitchStatements = [
    {
        regExp: new RegExp(`^when${lhsPerimeterLhsOpRhsPerimeterRhs}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(`^when${lhsPerimeterLhsOpRhs}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(`^when${lhsOpRhsPerimeterRhs}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(`^when${LhsOpRhsEventNames}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(`^when${lhsOpRhs}`),
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
        console.log({ onS, twoValSwitchTest });
        if (twoValSwitchTest !== null) {
            const { lhsProp, rhsProp } = twoValSwitchTest;
            if (lhsProp?.includes(':')) {
                const split = lhsProp.split(':');
                twoValSwitchTest.lhsProp = split[0];
                twoValSwitchTest.lhsSubProp = '.' + split.slice(1).join('.');
            }
            if (rhsProp?.includes(':')) {
                const split = rhsProp.split(':');
                twoValSwitchTest.rhsProp = split[0];
                twoValSwitchTest.rhsSubProp = '.' + split.slice(1).join('.');
            }
            //twoValSwitchTest.rhsProp = twoValSwitchTest.lhs
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
