import {AP, ProPAP, OneValueSwitch, PAP, TwoValueSwitch, NValueScriptSwitch} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {tryParse} from 'be-enhanced/cpu.js';

export const strType = String.raw `\||\#|\@|\/|\%|\~`;



const reNValueSwitchStatements: RegExpOrRegExpExt<NValueScriptSwitch>[] = [
    {
        regExp: new RegExp(String.raw `^dependingOn(?<dependsOn>.*)`),
        defaultVals:{
        }
    }
];



export async function prsOn(self: AP) : ProPAP{
    const {On, on} = self;
    const nValueScriptSwitches: Array<NValueScriptSwitch> = [];
    const onUnion = [...(On || []), ...(on || [])];
    let foundNonNValSwitch = false;
    for(const onS of onUnion){
        const nValSwitchTest = tryParse(onS, reNValueSwitchStatements) as NValueScriptSwitch;
        if(nValSwitchTest !== null){
            const {prsNValue} = await import('./prsNVal.js');
            prsNValue(nValSwitchTest);
            nValueScriptSwitches.push(nValSwitchTest);
            continue;
        }else{
            foundNonNValSwitch = true;
        }
        
        
    }
    let Lt3: PAP = {};
    if(foundNonNValSwitch){
        const {prsOnLt3} = await import('./prsOnLt3.js');
        Lt3 = await prsOnLt3(self);
    }
    
    return {
        ...Lt3,
        onNValueSwitches: nValueScriptSwitches,
    } as PAP;
}

