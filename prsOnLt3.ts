import {AP, ProPAP, OneValueSwitch, PAP, TwoValueSwitch, NValueScriptSwitch, TwoPartOpStatement} from './types';
import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import {parse} from 'trans-render/dss/parse.js';
//import { strType, prsElO } from 'trans-render/lib/prs/prsElO.js';
import {RegExpOrRegExpExt} from 'trans-render/lib/prs/types';

const op = String.raw `(?<!\\)(?<op>(Equals|Eq|Lt|Gt))`;

const lhsPartOpRhsPart = String.raw `(?<lhsPart>.*)${op}(?<rhsPart>.*)`;

const ifPart = String.raw `(?<ifPart>.*)`;

const reTwoPartStatements: RegExpOrRegExpExt<TwoPartOpStatement>[] = [
    {
        regExp: new RegExp(String.raw `^when${lhsPartOpRhsPart}`),
        defaultVals: {}
    },
]

const reOneValSwitchStatements: RegExpOrRegExpExt<OneValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^when${ifPart}`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(String.raw `^onlyWhen${ifPart}`),
        defaultVals:{
            req: true
        }
    },
];

export async function prsOnLt3(self: AP, negate = false) : ProPAP{
    const {On, on, Off, off} = self;
    const oneValueSwitches: Array<OneValueSwitch> = [];
    const twoValueSwitches : Array<TwoValueSwitch> = [];
    const onUnion = negate ? [...(Off || []), ...(off || [])] : [...(On || []), ...(on || [])];
    
    for(const onS of onUnion){
        const twoPartStatementTest = tryParse(onS, reTwoPartStatements) as TwoPartOpStatement;
        if(twoPartStatementTest !== null){
            const {lhsPart, rhsPart, op} = twoPartStatementTest;
            const lhs = await parse(lhsPart);
            const rhs = await parse(rhsPart);
            const tvs: TwoValueSwitch = {
                lhsSpecifier: lhs,
                op,
                rhsSpecifier: rhs,
                negate,
            };
            if(tvs.op === 'eq') tvs.op = 'equals';
        
            twoValueSwitches.push(tvs);
            continue;
        }
        //TODO, leverage same approach for binary, with extra support (events, subprops, etc)
        const binarySwitchTest = tryParse(onS, reOneValSwitchStatements) as OneValueSwitch;
        if(binarySwitchTest === null) throw 'PE';//Parse Error
        const {ifPart} = binarySwitchTest;
        const specifier = await parse(ifPart);
        binarySwitchTest.specifier = specifier;
        oneValueSwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches: oneValueSwitches,
        onTwoValueSwitches: twoValueSwitches,
    }
}