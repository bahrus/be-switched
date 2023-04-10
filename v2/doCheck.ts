import {RegExpOrRegExpExt} from 'be-decorated/types';
import {upstream} from 'be-linked/reCommon.js';
import {Link} from 'be-linked/types.js';
import {CamelConfig, PP} from './types';

export async function doCheck(cc: CamelConfig, links: Link[], pp: PP){
    const {Check} = cc;
    
}

// Check if list of books property of host is a non empty array.
const reCheckStatements : RegExpOrRegExpExt[] = [
    {
        regExp: new RegExp(String.raw `(?<!\\)If${upstream}(?<!\\)IsTruthy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `(?<!\\)If${upstream}(?<!\\)IsFalsy`),
        defaultVals: {},
    },
    {
        regExp: new RegExp(String.raw `(?<!\\)IfMediaMatches${upstream}(?<mediaMatch>\w+)`),
        defaultVals: {},
    },
];