import { upstreamEvent } from 'be-linked/reOn.js';
export async function doOn(cc, links, pp) {
    const { On } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    const { adjustLink } = await import('be-linked/adjustLink.js');
    for (const onString of On) {
        const test = tryParse(onString, reOnStatements);
        if (test !== null) {
            await adjustLink(test, pp);
            links.push({
                ...test,
            });
        }
    }
}
const reOnStatements = [
    {
        //On input event of previous phone-number part map value to lhs.
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Map(?<upstreamPropPath>[\w\:]+)(?<!\\)To(?<memKey>\w+)`),
        defaultVals: {},
    },
    {
        //On toggle event of host check if open property is truthy.
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsTruthy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsFalsy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsNonEmptyArray`),
        defaultVals: {},
    },
];
