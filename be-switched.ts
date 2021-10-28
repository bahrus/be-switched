import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeSwitchedVirtualProps, BeSwitchedActions, BeSwitchedProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
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

    doMain({val, echoVal, proxy, toggleDisabled}: this){
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
                    if(nextSib) {
                        nextSib.classList.remove('be-switched-hide');
                        if(toggleDisabled && (<any>nextSib).disabled === false){
                            (<any>nextSib).disabled = true;
                        }
                    }
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
                    if(toggleDisabled && (<any>nextSib).disabled === true){
                        (<any>nextSib).disabled = false;
                    }
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
