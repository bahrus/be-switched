import {AP, ProPAP, OneValueSwitch as BinaryValueSwitch, PAP, TwoValueSwitch as TwoValueSwitch} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const strType = String.raw `\||\#|\@|\/`;

const reOnTwoValSwitchStatements: RegExpOrRegExpExt<BinaryValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^when(?<lhsType>${strType})(?<lhsProp>[\w]+)(?<!\\)(?<op>Equals)(?<rhsType>${strType})(?<rhsProp>[\w]+)`),
        defaultVals:{
            negate: true
        }
    },
]

const reOnBinarySwitchStatements: RegExpOrRegExpExt<BinaryValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals:{
            req: true,
            negate: true,
        } as BinaryValueSwitch
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>${strType})(?<prop>[\w]+)`),
        defaultVals:{
            negate: true,
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<prop>[\w]+)`),
        defaultVals:{
            type: '/',
            negate: true,
        }
    },
];

export async function prsOff(self: AP) : ProPAP{
    const {Off, off} = self;
    const offBinarySwitches: Array<BinaryValueSwitch> = [];
    const offTwoValueSwitches : Array<TwoValueSwitch> = [];
    const onUnion = [...(Off || []), ...(off || [])];
    for(const onS of onUnion){
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements) as TwoValueSwitch;
        if(twoValSwitchTest !== null){
            offTwoValueSwitches.push(twoValSwitchTest);
            continue;
        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements) as BinaryValueSwitch;
        if(binarySwitchTest === null) throw 'PE';//Parse Error
        offBinarySwitches.push(binarySwitchTest);
    }
    return {
        offBinarySwitches,
        offTwoValueSwitches
    } as PAP;
}

