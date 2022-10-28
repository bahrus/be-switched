import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {VirtualProps, Actions, PP, Proxy, PPP, PPE} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';

export class BeSwitchedController extends EventTarget implements Actions{


    onLHS({lhs, proxy}: PP){
        hookUp(lhs, proxy, 'lhsVal');       
    }

    onRHS({rhs, proxy}: PP){
        hookUp(rhs, proxy, 'rhsVal');        
    }

    onIf({if: iff, proxy}: PP){
        hookUp(iff, proxy, 'ifVal');
    }

    onIfNonEmptyArray({ifNonEmptyArray, proxy}: PP){
        if(Array.isArray(ifNonEmptyArray)){
            proxy.ifNonEmptyArrayVal = ifNonEmptyArray;
        }else{
            hookUp(ifNonEmptyArray, proxy, 'ifNonEmptyArrayVal');
        }
    }

    chkMedia({}: PP, e: MediaQueryListEvent){
        return {matchesMediaQuery: e.matches} as PPP;
    }
    #mql: MediaQueryList | undefined;
    addMediaListener(pp: PP){
        const { ifMediaMatches} = pp;
        if(!ifMediaMatches) return [{}, {}] as PPE; //clears previous listener
        this.#mql = window.matchMedia(ifMediaMatches! as string); //TODO:  support observant media matches
        return [{}, {chkMedia: {on: 'change', of: this.#mql, doInit: true}}] as PPE;
    }

    calcVal(pp: PP){
        const {deferRendering} = pp;
        if(deferRendering){
            return {
                deferRendering: false,
            }
        }
        const {ifVal, lhsVal, rhsVal} = pp;
        if(!ifVal){
            return {
                val: false,
            }
        }
        const {ifMediaMatches, matchesMediaQuery} = pp;
        if(ifMediaMatches !== undefined){
            if(!matchesMediaQuery){
                return {
                    val: false,
                }
            }
        }
        const {ifNonEmptyArray, ifNonEmptyArrayVal} = pp;
        if(ifNonEmptyArray !== undefined){
            if(ifNonEmptyArrayVal === undefined || ifNonEmptyArrayVal.length === 0){
                return {
                    val: false
                };
            }
        }
        const {op} =  pp;
        if(op === undefined) {
            return {
                val: true
            };
        }

        switch(op){
            case '===':
                return {val: (lhsVal === rhsVal)};
        }        
    }

    #echoTimeOut: string | number | NodeJS.Timeout | undefined;
    onVal({val, proxy, displayDelay}: PP){
        if((<any>proxy).debug){
            console.log({val, proxy});
        }
        clearTimeout(this.#echoTimeOut);
        this.#echoTimeOut = setTimeout(() => {
            if(proxy.echoVal !== proxy.val){
                proxy.echoVal = proxy.val;
            }
        }, displayDelay);
    }

    async doMain({val, echoVal, proxy, toggleDisabled}: PP){
        if(val !== echoVal) return;
        if(val){
            if(proxy.dataset.cnt === undefined){
                const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
                const appendedChildren = insertAdjacentTemplate(proxy, proxy, 'afterend');
                
                proxy.dataset.cnt = (appendedChildren.length + 1).toString();
            }else{
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy as Element | null;
                let idx = 1
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
            addStyle(proxy);
            //checks for !val are done when appropriate -- boolean conditions, not necessarily lazy loading, is now false
            // if(setClass !== undefined && !val){
            //     proxy.classList.remove(setClass);
            // }
            if(proxy.dataset.cnt !== undefined){
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy as Element | null;
                let idx = 1
                while(nextSib && idx < cnt){
                    nextSib = nextSib.nextElementSibling;
                    if(nextSib !== null){
                        if(!val) nextSib.classList.add('be-switched-hide');
                        if(toggleDisabled && (<any>nextSib).disabled === true){
                            (<any>nextSib).disabled = false;
                        }
                        idx++;
                    }

                }
            }

        }
    }


    async finale(proxy: Proxy, target:Element, beDecorProps: BeDecoratedProps){
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}


const tagName = 'be-switched';

const ifWantsToBe = 'switched';

const upgrade = 'template';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: [upgrade],
            virtualProps: [
                'eventHandlers', 'if', 'ifVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 
                'val', 'echoVal', 'hiddenStyle', 'ifMediaMatches', 'matchesMediaQuery',
                'ifNonEmptyArray', 'ifNonEmptyArrayVal', 'displayDelay', 'beOosoom', 'disabled',
            ],
            proxyPropDefaults:{
                displayDelay: 16,
                op: '===',
                beOosoom: '!disabled',
            },
            finale: 'finale',
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
            addMediaListener: {
                ifKeyIn: ['ifMediaMatches']
            },
            onIfNonEmptyArray:'ifNonEmptyArray',
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery', 'ifNonEmptyArrayVal', 'echoVal'],
                ifNoneOf: ['disabled']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain:{
                ifKeyIn: ['val', 'echoVal']
            },
        }
    },
    complexPropDefaults:{
        controller: BeSwitchedController
    }
});

const styleMap = new WeakSet<Node>();
function addStyle(proxy: Element & VirtualProps){
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

