import { AP } from './types';

export async function doNValueSwitch(self: AP){
    const {onNValueSwitches} = self;
    if(onNValueSwitches === undefined || onNValueSwitches.length > 1) throw 'NI';
    const nValueSwitch = onNValueSwitches[0];
    
}