import {AP, ProPAP, OnSwitch, PAP} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOnSwitchStatements: RegExpOrRegExpExt<OnSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^when(?<type>\$|\#|\&)(?<prop>[\w]+)`),
        defaultVals:{}
    }
];

export async function prsOn(self: AP) : ProPAP{
    const {On} = self;
    const onSwitches: Array<OnSwitch> = [];
    for(const onS of On!){
        const test = tryParse(onS, reOnSwitchStatements) as OnSwitch;
        if(test === null) throw 'PE'//Parse Error
        onSwitches.push(test);
    }
    return {
        onSwitches
    } as PAP;
}

