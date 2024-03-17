import {AP, ProPAP, OneValueSwitch, PAP, TwoValueSwitch, NValueScriptSwitch, TwoPartOpStatement} from './types';
import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import { strType, prsElO } from 'trans-render/lib/prs/prsElO.js';
import {RegExpOrRegExpExt} from 'trans-render/lib/prs/types';

const op = String.raw `(?<!\\)(?<op>(Equals|Eq|Lt|Gt))`;

const lhsPartOpRhsPart = String.raw `(?<lhsPart>.*)${op}(?<rhsPart>.*)`;

const reTwoPartStatements: RegExpOrRegExpExt<TwoPartOpStatement>[] = [
    {
        regExp: new RegExp(String.raw `^when${lhsPartOpRhsPart}`),
        defaultVals: {}
    }
]

const reOneValSwitchStatements: RegExpOrRegExpExt<OneValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals:{
            req: true
        } as OneValueSwitch
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(String.raw `^when(?<prop>[\w]+)`),
        defaultVals:{
            type: '/'
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
            const lhs = prsElO(lhsPart);
            const rhs = prsElO(rhsPart);
            const tvs: TwoValueSwitch = {
                lhsEvent: lhs.event,
                lhsPerimeter: lhs.perimeter,
                lhsProp: lhs.prop,
                lhsSubProp: lhs.subProp,
                lhsType: lhs.elType,
                op,
                rhsEvent: rhs.event,
                rhsPerimeter: rhs.perimeter,
                rhsProp: rhs.prop,
                rhsSubProp: rhs.subProp,
                rhsType: lhs.elType,
                negate,
            };
            if(tvs.op === 'eq') tvs.op = 'equals';
        
            twoValueSwitches.push(tvs);
            continue;
        }
        const binarySwitchTest = tryParse(onS, reOneValSwitchStatements) as OneValueSwitch;
        if(binarySwitchTest === null) throw 'PE';//Parse Error
        oneValueSwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches: oneValueSwitches,
        onTwoValueSwitches: twoValueSwitches,
    }
}