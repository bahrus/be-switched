import {AP, ProPAP, OneValueSwitch, PAP, TwoValueSwitch, NValueScriptSwitch, TwoPartOpStatement} from './types';
import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import { strType, prsElO } from 'trans-render/lib/prs/prsElO.js';
import {RegExpOrRegExpExt} from 'trans-render/lib/prs/types';

const lhsPerimeter = String.raw `\^(?<lhsPerimeter>.*)`;

const lhsTypeLHSProp = String.raw `(?<lhsType>${strType})(?<lhsProp>[\w\-\:\|]+)`;

const rhsPerimeter = String.raw `\^(?<rhsPerimeter>.*)`;

const rhsTypeRhsProp = String.raw `(?<rhsType>${strType})(?<rhsProp>[\w\-\:\|]+)`;

const op = String.raw `(?<!\\)(?<op>(Equals|Eq|Lt|Gt))`;

const lhsOpRhs = String.raw `${lhsTypeLHSProp}${op}${rhsTypeRhsProp}`;

const lhsPerimeterLhsOpRhsPerimeterRhs = String.raw `${lhsPerimeter}${lhsTypeLHSProp}${op}${rhsPerimeter}${rhsTypeRhsProp}`;

const lhsPerimeterLhsOpRhs = String.raw `${lhsPerimeter}${lhsTypeLHSProp}${op}${rhsTypeRhsProp}`;

const lhsOpRhsPerimeterRhs = String.raw `${lhsTypeLHSProp}${op}${rhsPerimeter}${rhsTypeRhsProp}`;

const lhsPartOpRhsPart = String.raw `(?<lhsPart>.*)${op}(?<rhsPart>.*)`;

// const reTwoValSwitchStatements: RegExpOrRegExpExt<TwoValueSwitch>[] = [
//     {
//         regExp: new RegExp(`^when${lhsPerimeterLhsOpRhsPerimeterRhs}`),
//         defaultVals:{}
//     },
//     {
//         regExp: new RegExp(`^when${lhsPerimeterLhsOpRhs}`),
//         defaultVals: {}
//     },
//     {
//         regExp: new RegExp(`^when${lhsOpRhsPerimeterRhs}`),
//         defaultVals: {}
//     },
//     {
//         regExp: new RegExp(`^when${lhsOpRhs}`),
//         defaultVals:{}
//     },

// ]

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
        // const twoValSwitchTest = tryParse(onS, reTwoValSwitchStatements) as TwoValueSwitch;
        // if(twoValSwitchTest !== null){
        //     let {lhsProp, rhsProp, op} = twoValSwitchTest;
        //     if(op === 'eq') twoValSwitchTest.op = 'equals';
        //     const lhsEventSplit = lhsProp?.split('::');
        //     if(lhsEventSplit?.length === 2){
        //         lhsProp = twoValSwitchTest.lhsProp = lhsEventSplit[0];
        //         twoValSwitchTest.lhsEvent = lhsEventSplit[1];
        //     }
        //     if(lhsProp?.includes(':')){
        //         const split = lhsProp.split(':');
        //         twoValSwitchTest.lhsProp = split[0];
        //         twoValSwitchTest.lhsSubProp = '.' + split.slice(1).join('.');
        //     }
        //     const rhsEventSplit = rhsProp?.split('::');
        //     if(rhsEventSplit?.length === 2){
        //         rhsProp = twoValSwitchTest.rhsProp = rhsEventSplit[0];
        //         twoValSwitchTest.rhsEvent = rhsEventSplit[1];
        //     }
        //     if(rhsProp?.includes(':')){
        //         const split = rhsProp.split(':');
        //         twoValSwitchTest.rhsProp = split[0];
        //         twoValSwitchTest.rhsSubProp = '.' + split.slice(1).join('.');
        //     }
        //     twoValSwitchTest.negate = negate;
        //     twoValueSwitches.push(twoValSwitchTest);
        //     continue;
        // }
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