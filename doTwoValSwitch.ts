import {AP, ProPAP, OnBinaryValueSwitch, PAP} from './types';
import {BVAAllProps} from 'be-value-added/types';
import {findRealm} from 'trans-render/lib/findRealm.js';
import {getSignalVal} from 'be-linked/getSignalVal.js';
import {getVal} from 'trans-render/lib/getVal.js';
export async function doTwoValSwitch(self: AP, onOrOff: 'on' | 'off'){
    const {enhancedElement, onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    for(const onSwitch of valueSwitches!){
        const {lhsProp, rhsProp, lhsType, rhsType, eventNames, lhsPerimeter, rhsPerimeter} = onSwitch;
        //console.log({eventNames, lhsProp, rhsProp, lhsType, rhsType, lhsSubProp, rhsSubProp});
        const splitEventNames = eventNames === undefined ? ['input', 'input'] : eventNames.split(',');

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
            case '~':
            case '@':
            case '#':{
                let inputEl: HTMLInputElement;
                switch(lhsType){
                    case '@':
                        if(lhsPerimeter !== undefined){
                            inputEl = await findRealm(enhancedElement, ['wi', lhsPerimeter, `[name="${lhsProp}"]`]) as HTMLInputElement;
                        }else{
                            inputEl = await findRealm(enhancedElement, ['wf', lhsProp!]) as HTMLInputElement;
                        }
                        
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + lhsProp!]) as HTMLInputElement;
                        break;
                    case '~':
                        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(lhsProp!);
                        inputEl = await findRealm(enhancedElement, ['wis', localName, true]) as HTMLInputElement;
                        break;
                }
                if(!inputEl) throw 404;
                onSwitch.lhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener(splitEventNames[0], e => {
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
            case '~':
            case '@':
            case '#':{
                let inputEl: HTMLInputElement;
                switch(rhsType){
                    case '@':
                        if(rhsPerimeter !== undefined){
                            inputEl = await findRealm(enhancedElement, ['wi', rhsPerimeter, `[name="${rhsProp}"]`]) as HTMLInputElement;
                        }else{
                            inputEl = await findRealm(enhancedElement, ['wf', rhsProp!]) as HTMLInputElement;
                        }
                        break;
                    case '#':
                        inputEl = await findRealm(enhancedElement, ['wrn', '#' + rhsProp!]) as HTMLInputElement;
                        break;
                    case '~':
                        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(rhsProp!);
                        inputEl = await findRealm(enhancedElement, ['wis', localName, true]) as HTMLInputElement;
                        break;
                }
                if(!inputEl) throw 404;
                onSwitch.rhsSignal = new WeakRef(inputEl);
                inputEl.addEventListener(splitEventNames.length > 1 ? splitEventNames[1] : splitEventNames[0], e => {
                    checkSwitches(self, onOrOff);
                });
                break;
            }
        }
    }
    await checkSwitches(self, onOrOff);
}

async function checkSwitches(self: AP, onOrOff: 'on' | 'off'){
    const {onTwoValueSwitches, offTwoValueSwitches} = self;
    const valueSwitches = onOrOff === 'on' ? onTwoValueSwitches : offTwoValueSwitches;
    if(valueSwitches?.length === 0) return;
    let foundOne = false;
    for(const onSwitch of valueSwitches!){
        const {req, lhsSignal, rhsSignal, op, negate, rhsSubProp, lhsSubProp} = onSwitch;
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
        const lhs = lhsSubProp !== undefined ? await getVal({host: lhsRef}, lhsSubProp) :  getSignalVal(lhsRef);
        const rhs = rhsSubProp !== undefined ? await getVal({host:rhsRef}, rhsSubProp) : getSignalVal(rhsRef);
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