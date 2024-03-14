import {AP, loadEventName, inputEventName, changeEventName, EventForTwoValSwitch, OnTwoValueSwitch} from './types';
import {BVAAllProps} from 'be-value-added/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
import {getSignalVal} from 'be-linked/getSignalVal.js';
import {getVal} from 'trans-render/lib/getVal.js';
import {Side} from './Side.js';
import { SignalRefType } from '../be-linked/types';

export async function doTwoValSwitch(self: AP, onOrOff: 'on' | 'off'){
    const {enhancedElement, onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for(const onSwitch of valueSwitches!){
        const {lhsProp, rhsProp, lhsType, rhsType, eventNames, lhsPerimeter, rhsPerimeter, dependsOn} = onSwitch;
        //console.log({eventNames, lhsProp, rhsProp, lhsType, rhsType, lhsSubProp, rhsSubProp});
        const splitEventNames = eventNames === undefined ? ['input', 'input'] : eventNames.split(',');
        const lhs = onSwitch.lhs = new Side(
            onSwitch, 
            splitEventNames[0],
            lhsProp,
            lhsType,
            lhsPerimeter
        );
        const rhs = onSwitch.rhs = new Side(
            onSwitch,
            splitEventNames[1],
            rhsProp,
            rhsType,
            rhsPerimeter
        );
        onSwitch.lhsSignal = await lhs.do(self, onOrOff, enhancedElement);
        onSwitch.rhsSignal = await rhs.do(self, onOrOff, enhancedElement);
        if(dependsOn){
            lhs.doLoadEvent(enhancedElement);
        }
    }
    
    await checkSwitches(self, onOrOff);
}

export async function checkSwitches(self: AP, onOrOff: 'on' | 'off'){
    const {onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    if(valueSwitches?.length === 0) return;
    let foundOne = false;
    for(const onSwitch of valueSwitches!){
        const {req, lhsSignal, rhsSignal, op, negate, rhsSubProp, lhsSubProp, dependsOn, switchedOn} = onSwitch;
        if(foundOne && !req) continue;
        let value = false; 
        if(dependsOn){
            value = switchedOn!;
        }else{
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
                case 'equals':
                    value = lhs === rhs;
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



