import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeSwitchedVirtualProps, BeSwitchedActions, BeSwitchedProps} from './types';
import {getElementToObserve, addListener, IObserve} from 'be-observant/be-observant.js';
import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import {register} from 'be-hive/be-hive.js';

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

    calcVal({iffVal, lhsVal, rhsVal, op, proxy, ifMediaMatches, matchesMediaQuery}: this){
        if(!iffVal){
            proxy.val = false;
            return;
        }
        if(ifMediaMatches !== undefined){
            if(!matchesMediaQuery){
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
            virtualProps: ['eventHandlers', 'iff', 'iffVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal', 'hiddenStyle'],
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
            onIff: {
                ifKeyIn: ['iff']
            },
            onIfMediaMatches: {
                ifKeyIn: ['ifMediaMatches']
            },
            calcVal: {
                ifKeyIn: ['iffVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery']
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
