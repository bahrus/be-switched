import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import { parse } from 'trans-render/dss/parse.js';
const op = String.raw `(?<!\\)(?<op>(Equals|Eq|Lt|Gt))`;
const lhsPartOpRhsPart = String.raw `(?<lhsPart>.*)${op}(?<rhsPart>.*)`;
const ifPart = String.raw `(?<ifPart>.*)`;
const reTwoPartStatements = [
    {
        regExp: new RegExp(String.raw `^when${lhsPartOpRhsPart}`),
        defaultVals: {}
    },
];
const reOneValSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^when${ifPart}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(String.raw `^onlyWhen${ifPart}`),
        defaultVals: {
            req: true
        }
    },
];
export async function prsOnLt3(self, negate = false) {
    const { On, on, Off, off } = self;
    const oneValueSwitches = [];
    const twoValueSwitches = [];
    const onUnion = negate ? [...(Off || []), ...(off || [])] : [...(On || []), ...(on || [])];
    for (const onS of onUnion) {
        const twoPartStatementTest = tryParse(onS, reTwoPartStatements);
        if (twoPartStatementTest !== null) {
            const { lhsPart, rhsPart, op } = twoPartStatementTest;
            const lhs = await parse(lhsPart);
            const rhs = await parse(rhsPart);
            const tvs = {
                lhsSpecifier: lhs,
                op,
                rhsSpecifier: rhs,
                negate,
            };
            if (tvs.op === 'eq')
                tvs.op = 'equals';
            twoValueSwitches.push(tvs);
            continue;
        }
        //TODO, leverage same approach for binary, with extra support (events, subprops, etc)
        const binarySwitchTest = tryParse(onS, reOneValSwitchStatements);
        if (binarySwitchTest === null)
            throw 'PE'; //Parse Error
        const { ifPart } = binarySwitchTest;
        const specifier = await parse(ifPart);
        binarySwitchTest.specifier = specifier;
        oneValueSwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches: oneValueSwitches,
        onTwoValueSwitches: twoValueSwitches,
    };
}
