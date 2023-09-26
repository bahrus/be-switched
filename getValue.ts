import {SignalRefType} from './types';
//shared with be-for
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