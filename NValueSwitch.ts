import { AP, inputEventName } from './types';
import {Side} from './Side.js';
import { SignalRefType } from 'be-linked/types';

export class NValueSwitch{
    constructor(self: AP){
        this.do(self);
    }

    #signals: Map<string, WeakRef<SignalRefType>> = new Map();
    async do(self: AP){
        const {onNValueSwitches} = self;
        if(onNValueSwitches === undefined || onNValueSwitches.length > 1) throw 'NI';
        const nValueSwitch = onNValueSwitches[0];
        console.log({nValueSwitch});
        const {dependencies} = nValueSwitch;
        for(const dependency of dependencies!){
            const {
                perimeter,
                prop,
                elType
            } = dependency
            // const side = new Side(
            //     false,

            // )
        }
    }
}

// export class InputEvent extends Event implements EventForTwoValSwitch{

//     static EventName: inputEventName = 'input';

//     constructor(
//         public ctx: TwoValueSwitch, 
//         public lhsTarget: SignalRefType, 
//         public rhsTarget: SignalRefType, 
//         public switchOn?: boolean){
//         super(InputEvent.EventName);
//     }
// }