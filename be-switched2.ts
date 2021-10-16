import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeSwitchedVirtualProps, BeSwitchedActions, BeSwitchedProps} from './types';
import {getElementToObserve, addListener, IObserve} from 'be-observant/be-observant.js';

export class BeSwitchedController implements BeSwitchedActions{

    intro(proxy: Element & BeSwitchedVirtualProps, target: Element, beDecorProps: BeDecoratedProps){

    }

    onLHS({lhs, proxy}: this){
        switch(typeof lhs){
            case 'object':
                const observeParams = lhs as IObserve;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                addListener(elementToObserve, observeParams, 'lhsVal', proxy);
                break;
            default:
                proxy.lhsVal = lhs;
        }        
    }

    onRHS({rhs, proxy}: this){
        switch(typeof rhs){
            case 'object':
                const observeParams = rhs as IObserve;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                addListener(elementToObserve, observeParams, 'rhsVal', proxy);
                break;
            default:
                proxy.rhsVal = rhs;
        }        
    }

    onIff({iff, proxy}: this){
        switch(typeof iff){
            case 'object':
                const observeParams = iff as IObserve;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                addListener(elementToObserve, observeParams, 'iffVal', proxy);
                break;
            default:
                proxy.iffVal = iff;
        } 
    }

    calcVal({iffVal, lhsVal, rhsVal, op, proxy}: this){
        if(!iffVal){
            proxy.val = false;
            return;
        }
        if(op === undefined) {
            proxy.val = true;
            return;
        }
        switch(op){
            case '===':
                proxy.val = (lhsVal === rhsVal);
                break;
        }        
    }

    finale(proxy: Element & BeSwitchedVirtualProps, target:Element, beDecorProps: BeDecoratedProps){

    }
}

export interface BeSwitchedController extends BeSwitchedProps{}

const tagName = 'be-switched';

define<BeSwitchedProps & BeDecoratedProps<BeSwitchedProps, BeSwitchedActions>, BeSwitchedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade: 'template',
            ifWantsToBe: 'switched',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'iff', 'iffVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal', 'hiddenStyle'],
            intro: 'intro',
            finale: 'finale'
        }
    },
    complexPropDefaults:{
        controller: BeSwitchedController
    }
});