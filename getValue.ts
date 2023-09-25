import {SignalRefType} from './types';

export function getValue(obj: SignalRefType){
    if(obj instanceof HTMLElement){
        if('value' in obj){
            return obj.value;
        }
        //TODO:  hyperlinks
        return obj.textContent;
    }else{
        return obj.value;
    }
}