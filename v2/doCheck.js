import { upstream } from 'be-linked/reCommon.js';
export async function doCheck(cc, links, pp) {
    const { Check } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    const { adjustLink } = await import('be-linked/adjustLink.js');
    for (const checkString of Check) {
        const test = tryParse(checkString, reCheckStatements);
        if (test !== null) {
            await adjustLink(test);
            links.push({
                ...test,
            });
        }
    }
}
// Check if list of books property of host is a non empty array.
const reCheckStatements = [
    {
        regExp: new RegExp(String.raw `if${upstream}(?<!\\)IsTruthy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `if${upstream}(?<!\\)IsFalsy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `ifMediaMatches${upstream}(?<mediaMatch>\w+)`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `if(?<lhs>\w+)=(?<rhs>\w+)`),
        defaultVals: {},
    }
];
