import {RegExpOrRegExpExt} from 'be-decorated/types';
import {upstream} from 'be-linked/reCommon.js';
import {Link} from 'be-linked/types.js';
import {CamelConfig, PP} from './types';
import {Scope} from 'trans-render/lib/types';

export async function doCheck(cc: CamelConfig, links: Link[], pp: PP){
    const {Check} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    const {adjustLink} = await import('be-linked/adjustLink.js');
    for(const checkString of Check!){
        const test = tryParse(checkString, reCheckStatements);
        if(test !== null){
            await adjustLink(test as Link);
            links.push({
                ...test,
            });
        }
    }  
}

interface CheckStatement {
    upstreamCamelQry: Scope & String,
}

// Check if list of books property of host is a non empty array.
const reCheckStatements : RegExpOrRegExpExt[] = [
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