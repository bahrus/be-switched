import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeSwitchedVirtualProps, BeSwitchedActions, BeSwitchedProps} from './types';
import {getElementToObserve, IObserve, getObserve} from 'be-observant/getElementToObserve.js';
import {addListener} from 'be-observant/addListener.js';
import {register} from 'be-hive/register.js';

export class BeSwitchedController implements BeSwitchedActions{


    intro(proxy: Element & BeSwitchedVirtualProps, target: Element, beDecorProps: BeDecoratedProps){

    }

    onLHS({lhs, proxy}: this){
        hookUp(lhs, proxy, 'lhsVal');       
    }

    onRHS({rhs, proxy}: this){
        hookUp(rhs, proxy, 'rhsVal');        
    }

    onIf({if: iff, proxy}: this){
        hookUp(iff, proxy, 'ifVal');
    }

    onIfNonEmptyArray({ifNonEmptyArray, proxy}: this){
        if(Array.isArray(ifNonEmptyArray)){
            proxy.ifNonEmptyArrayVal = ifNonEmptyArray;
        }else{
            hookUp(ifNonEmptyArray, proxy, 'ifNonEmptyArrayVal');
        }

    }

    onIfMediaMatches({ifMediaMatches}: this){
        this.addMediaListener(this);
    }

    #mediaQueryHandler = (e: MediaQueryListEvent) => {
        this.proxy.matchesMediaQuery = e.matches;
    }
    #mql: MediaQueryList | undefined;
    addMediaListener = ({ ifMediaMatches}: this) => {
        this.disconnect();
        this.#mql = window.matchMedia(ifMediaMatches!);
        this.#mql.addEventListener('change', this.#mediaQueryHandler);
        this.proxy.matchesMediaQuery = this.#mql.matches;
    }

    calcVal({
        ifVal, lhsVal, rhsVal, op, proxy, ifMediaMatches, matchesMediaQuery,
        ifNonEmptyArray, ifNonEmptyArrayVal
    }: this){
        if(!ifVal){
            proxy.val = false;
            return;
        }
        if(ifMediaMatches !== undefined){
            if(!matchesMediaQuery){
                proxy.val = false;
                return;
            }
        }
        if(ifNonEmptyArray !== undefined){
            if(ifNonEmptyArrayVal === undefined || ifNonEmptyArrayVal.length === 0){
                proxy.val = false;
                return;
            }
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

    onVal({val, proxy}: this){
        if((<any>proxy).debug){
            console.log({val, proxy});
        }
        setTimeout(() => {
            if(proxy.echoVal !== proxy.val){
                proxy.echoVal = proxy.val;
            }
        }, 16);
    }

    doMain({val, echoVal, proxy}: this){
        if(val !== echoVal) return;
        if(val){
            if(proxy.dataset.cnt === undefined){
                const appendedChildren = insertAdjacentTemplate(proxy, proxy, 'afterend');
                addStyle(proxy);
                proxy.dataset.cnt = appendedChildren.length.toString();
            }else{
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy as Element | null;
                let idx = 0
                while(nextSib && idx < cnt){
                    nextSib = nextSib.nextElementSibling;
                    if(nextSib) nextSib.classList.remove('be-switched-hide');
                    idx++;
                }                        
            }
            
        }else{
            if(proxy.dataset.cnt !== undefined){
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy as Element | null;
                let idx = 0
                while(nextSib && idx < cnt){
                    nextSib = nextSib.nextElementSibling;
                    if(nextSib) nextSib.classList.add('be-switched-hide');
                    idx++;
                }
            }
        }
    }



    disconnect() {

        // https://www.youtube.com/watch?v=YDU_3WdfkxA&list=LL&index=2
        if (this.#mql) this.#mql.removeEventListener('change', this.#mediaQueryHandler);
    }

    finale(proxy: Element & BeSwitchedVirtualProps, target:Element, beDecorProps: BeDecoratedProps){
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
        this.disconnect();
    }
}

function hookUp(fromParam: any, proxy: any, toParam: string){
    switch(typeof fromParam){
        case 'object':{
                if(Array.isArray(fromParam)){
                    //assume for now is a string array
                    const arr = fromParam as string[];
                    if(arr.length !== 1) throw 'NI';
                    //assume for now only one element in the array
                    //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                    proxy[toParam] = fromParam;
                }else{
                    const observeParams = fromParam as IObserve;
                    const elementToObserve = getElementToObserve(proxy, observeParams);
                    if(elementToObserve === null){
                        console.warn({msg:'404',observeParams});
                        return;
                    }
                    addListener(elementToObserve, observeParams, toParam, proxy);
                }

            }
            break;
        case 'string':
            {
                const isProp = fromParam[0];
                const vft = isProp ? fromParam.substr(1) : fromParam;
                const observeParams = isProp ? {onSet: vft, vft} as IObserve : {vft} as IObserve;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                addListener(elementToObserve, observeParams, toParam, proxy);
            }
            
        default:
            proxy[toParam] = fromParam;
    }
}

export interface BeSwitchedController extends BeSwitchedProps{}

const tagName = 'be-switched';

const ifWantsToBe = 'switched';

const upgrade = 'template';

define<BeSwitchedProps & BeDecoratedProps<BeSwitchedProps, BeSwitchedActions>, BeSwitchedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: true,
            virtualProps: [
                'eventHandlers', 'if', 'ifVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 
                'val', 'echoVal', 'hiddenStyle', 'ifMediaMatches', 'matchesMediaQuery',
                'ifNonEmptyArray', 'ifNonEmptyArrayVal'
            ],
            intro: 'intro',
            finale: 'finale'
        },
        actions:{
            onLHS:{
                ifKeyIn: ['lhs']
            },
            onRHS: {
                ifKeyIn: ['rhs']
            },
            onIf: {
                ifKeyIn: ['if']
            },
            onIfMediaMatches: {
                ifKeyIn: ['ifMediaMatches']
            },
            onIfNonEmptyArray:{
                ifAllOf: ['ifNonEmptyArray']
            },
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain:{
                ifKeyIn: ['val', 'echoVal']
            }
        }
    },
    complexPropDefaults:{
        controller: BeSwitchedController
    }
});

const styleMap = new WeakSet<Node>();
function addStyle(proxy: Element & BeSwitchedVirtualProps){
    let rootNode = proxy.getRootNode();
    if ((<any>rootNode).host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        const hiddenStyle = proxy.hiddenStyle || 'display:none';
        style.innerHTML = /* css */`
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}
register(ifWantsToBe, upgrade, tagName);
