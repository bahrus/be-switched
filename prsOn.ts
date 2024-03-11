import {AP, ProPAP, OnBinaryValueSwitch, PAP, OnTwoValueSwitch} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const strType = String.raw `\||\#|\@|\/|\%|\~`;

const lhsPerimeter = String.raw `\^(?<lhsPerimeter>.*)`;

const rhsPerimeter = String.raw `\^(?<rhsPerimeter>.*)`;

const lhsOpRhs = String.raw `(?<lhsType>${strType})(?<lhsProp>[\w\-\:\|]+)(?<!\\)(?<op>Equals)(?<rhsType>${strType})(?<rhsProp>[\w\-\:\|]+)`;

const lhsPerimeterLhsOpRhsPerimeterRhs = String.raw `\^(?<lhsPerimeter>.*)(?<lhsType>${strType})(?<lhsProp>[\w\-\:\|]+)(?<!\\)(?<op>Equals)${rhsPerimeter}(?<rhsType>${strType})(?<rhsProp>[\w\-\:\|]+)`;

const eventTypeLhsOpRhs = String.raw `^on(?<eventNames>[\w\-\:\,]+)(?<!\\)When${lhsOpRhs}`;

const reOnTwoValSwitchStatements: RegExpOrRegExpExt<OnBinaryValueSwitch>[] = [
    {
        regExp: new RegExp(`^when${lhsPerimeterLhsOpRhsPerimeterRhs}`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(`^when${lhsOpRhs}`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(eventTypeLhsOpRhs),
        defaultVals: {}
    }
]

const reOnBinarySwitchStatements: RegExpOrRegExpExt<OnBinaryValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals:{
            req: true
        } as OnBinaryValueSwitch
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

export async function prsOn(self: AP) : ProPAP{
    const {On, on} = self;
    const onBinarySwitches: Array<OnBinaryValueSwitch> = [];
    const onTwoValueSwitches : Array<OnTwoValueSwitch> = [];
    const onUnion = [...(On || []), ...(on || [])];
    for(const onS of onUnion){
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements) as OnTwoValueSwitch;
        console.log({twoValSwitchTest});
        if(twoValSwitchTest !== null){
            const {lhsProp, rhsProp} = twoValSwitchTest;
            if(lhsProp?.includes(':')){
                const split = lhsProp.split(':');
                twoValSwitchTest.lhsProp = split[0];
                twoValSwitchTest.lhsSubProp = '.' + split.slice(1).join('.');
            }
            if(rhsProp?.includes(':')){
                const split = rhsProp.split(':');
                twoValSwitchTest.rhsProp = split[0];
                twoValSwitchTest.rhsSubProp = '.' + split.slice(1).join('.');
            }
            //twoValSwitchTest.rhsProp = twoValSwitchTest.lhs
            onTwoValueSwitches.push(twoValSwitchTest);
            continue;
        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements) as OnBinaryValueSwitch;
        if(binarySwitchTest === null) throw 'PE';//Parse Error
        onBinarySwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches,
        onTwoValueSwitches
    } as PAP;
}

