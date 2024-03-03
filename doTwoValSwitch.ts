import {AP, ProPAP, OnBinaryValueSwitch, PAP} from './types';
import {BVAAllProps} from 'be-value-added/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
import {getSignalVal} from 'be-linked/getSignalVal.js';
export async function doTwoValSwitch(self: AP, onOrOff: 'on' | 'off'){
    const {enhancedElement, onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for(const onSwitch of valueSwitches!){
        const {lhsProp, rhsProp, lhsType, rhsType} = onSwitch;
        switch(lhsType){
            case '|':
                const {getItemPropEl} = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, lhsProp!);
                if(itempropEl.hasAttribute('contenteditable')){
                    onSwitch.lhsSignal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self, onOrOff);
                    });
                }else{
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                    onSwitch.lhsSignal = new WeakRef<BVAAllProps>(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                break;

            case '@':
            case '#':{
                let inputEl: HTMLInputElement;
                switch(lhsType){
                    case '@':
                        inputEl = await findRealm(enhancedElement, ['wf', lhsProp!]) as HTMLInputElement;
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + lhsProp!]) as HTMLInputElement;
                        break;
                }
                if(!inputEl) throw 404;
                onSwitch.lhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self, onOrOff);
                });
                break;
            }
           
        }
        switch(rhsType){
            case '|':
                const {getItemPropEl} = await import('./getItempropEl.js');
                const itempropEl = await getItemPropEl(enhancedElement, rhsProp!);
                if(itempropEl.hasAttribute('contenteditable')){
                    onSwitch.rhsSignal = new WeakRef(itempropEl);
                    itempropEl.addEventListener('input', e => {
                        checkSwitches(self, onOrOff);
                    });
                }else{
                    import('be-value-added/be-value-added.js');
                    const beValueAdded = await  (<any>itempropEl).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                    onSwitch.rhsSignal = new WeakRef<BVAAllProps>(beValueAdded);
                    beValueAdded.addEventListener('value-changed', e => {
                        checkSwitches(self, onOrOff);
                    });
                }
                break;
            case '@':
            case '#':{
                let inputEl: HTMLInputElement;
                switch(rhsType){
                    case '@':
                        inputEl = await findRealm(enhancedElement, ['wf', rhsProp!]) as HTMLInputElement;
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + rhsProp!]) as HTMLInputElement;
                        break;
                }
                if(!inputEl) throw 404;
                onSwitch.rhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener('input', e => {
                    checkSwitches(self, onOrOff);
                });
                break;
            }
        }
    }
    checkSwitches(self, onOrOff);
}

function checkSwitches(self: AP, onOrOff: 'on' | 'off'){
    const {onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    if(valueSwitches?.length === 0) return;
    let foundOne = false;
    for(const onSwitch of valueSwitches!){
        const {req, lhsSignal, rhsSignal, op, negate} = onSwitch;
        if(foundOne && !req) continue; 
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
        const lhs = getSignalVal(lhsRef);
        const rhs = getSignalVal(rhsRef);
        
        let value = false;
        switch(op){
            case 'equals':
                value = lhs === rhs;
                break;
        }
        if(negate) value = !value;
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