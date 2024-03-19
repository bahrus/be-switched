import {AP} from './types';
import {getSignalVal} from 'be-linked/getSignalVal.js';
import {getVal} from 'trans-render/lib/getVal.js';
import {SideSeeker} from './SideSeeker.js';

export async function doTwoValSwitch(self: AP, onOrOff: 'on' | 'off'){
    const {enhancedElement, onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for(const onSwitch of valueSwitches!){
        const {
            lhsProp, 
            rhsProp, 
            lhsType, 
            rhsType, 
            lhsPerimeter, 
            rhsPerimeter,
            lhsEvent,
            rhsEvent,
            //dependsOn
        } = onSwitch;
        const lhs = onSwitch.lhs = new SideSeeker(
            {
                prop: lhsProp,
                elType: lhsType,
                perimeter: lhsPerimeter,
                event: lhsEvent,
            },
            true, 
            
        );
        const rhs = onSwitch.rhs = new SideSeeker(
            {
                prop: rhsProp,
                elType: rhsType,
                perimeter: rhsPerimeter,
                event: rhsEvent
            },
            true,
        );
        const lhsReturnObj = await lhs.do(self, onOrOff, enhancedElement);
        onSwitch.lhsSignal = lhsReturnObj?.signal;
        const rhsReturnObj = await rhs.do(self, onOrOff, enhancedElement);
        onSwitch.rhsSignal = rhsReturnObj?.signal;
        // if(dependsOn){
        //     lhs.doLoadEvent(enhancedElement);
        // }
    }
    await checkSwitches(self, onOrOff);
}

export async function checkSwitches(self: AP, onOrOff: 'on' | 'off'){
    const {onTwoValueSwitches, offTwoValueSwitches, onNValueSwitches} = self;
    let foundOne = false;
    if(onNValueSwitches !== undefined){
        for(const nvalSwitch of onNValueSwitches){
            if(nvalSwitch.switchedOn){
                foundOne = true;
            }
        }
    }
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    if(valueSwitches?.length === 0) {
        self.switchesSatisfied = foundOne;
        return;
    }
    

    for(const onSwitch of valueSwitches!){
        const {req, lhsSignal, rhsSignal, op, negate, rhsSubProp, lhsSubProp} = onSwitch;
        if(foundOne && !req) continue;
        let value = false; 
        {
            const lhsRef = lhsSignal?.deref();
            if(lhsRef === undefined) {
                console.warn({onSwitch, msg: "Out of scope"});
                continue;
            } 
            const rhsRef = rhsSignal?.deref();
            if(rhsRef === undefined) {
                console.warn({onSwitch, msg: "Out of scope"});
                continue;
            } 
            const lhs = lhsSubProp !== undefined ? await getVal({host: lhsRef}, lhsSubProp) :  getSignalVal(lhsRef);
            const rhs = rhsSubProp !== undefined ? await getVal({host:rhsRef}, rhsSubProp) : getSignalVal(rhsRef);
            
            switch(op){
                case 'eq':
                case 'equals':
                    value = lhs === rhs;
                    break;
                case 'lt':
                    value = lhs < rhs;
                    break;
                case 'gt':
                    value = lhs > rhs;
                    break;
            }
            if(negate) value = !value;
        }
        if(req){
            if(!value){
                //console.log({lhs, rhs, value, req});
                self.switchesSatisfied = false;
                return;
            }
        }else{
            if(value) foundOne = true;
        }
        //console.log({lhs, rhs, value, foundOne});
    }
    
    self.switchesSatisfied = foundOne;
}



