import {AP, ProPAP, OnBinaryValueSwitch, PAP, OnTwoValueSwitch} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOnTwoValSwitchStatements: RegExpOrRegExpExt<OnBinaryValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^when(?<lhsType>\$|\#|\@)(?<lhsProp>[\w]+)(?<!\\)(?<op>Equals)(?<rhsType>\$|\#|\@)(?<rhsProp>[\w]+)`),
        defaultVals:{}
    },
]

const reOnBinarySwitchStatements: RegExpOrRegExpExt<OnBinaryValueSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals:{
            req: true
        } as OnBinaryValueSwitch
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals:{}
    }
];

export async function prsOn(self: AP) : ProPAP{
    const {On} = self;
    const onBinarySwitches: Array<OnBinaryValueSwitch> = [];
    for(const onS of On!){
        const twoValSwitchTest = tryParse(onS, reOnTwoValSwitchStatements) as OnTwoValueSwitch;
        if(twoValSwitchTest !== null){

        }
        const binarySwitchTest = tryParse(onS, reOnBinarySwitchStatements) as OnBinaryValueSwitch;
        if(binarySwitchTest === null) throw 'PE'//Parse Error
        onBinarySwitches.push(binarySwitchTest);
    }
    return {
        onBinarySwitches
    } as PAP;
}

