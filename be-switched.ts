import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {VirtualProps, Actions, PP, Proxy} from './types';
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

    onIfMediaMatches(pp: PP){
        this.addMediaListener(pp);
    }

    #mediaQueryHandler({proxy}: PP, e: MediaQueryListEvent){
        proxy.matchesMediaQuery = e.matches;
    }
    #mql: MediaQueryList | undefined;
    #mqlAbortController: AbortController | undefined;
    addMediaListener(pp: PP){
        const { ifMediaMatches, proxy} = pp;
        this.disconnect();
        this.#mql = window.matchMedia(ifMediaMatches! as string); //TODO:  support observant media matches
        this.#mqlAbortController = new AbortController();
        this.#mql.addEventListener('change', (e: MediaQueryListEvent) => {
            this.#mediaQueryHandler(pp, e);
        });
        proxy.matchesMediaQuery = this.#mql.matches;
    }

    calcVal({
        ifVal, lhsVal, rhsVal, op, proxy, ifMediaMatches, matchesMediaQuery,
        ifNonEmptyArray, ifNonEmptyArrayVal
    }: PP){
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



    disconnect() {

        // https://www.youtube.com/watch?v=YDU_3WdfkxA&list=LL&index=2
        if (this.#mql && this.#mqlAbortController) this.#mqlAbortController.abort();
    }

    async finale(proxy: Proxy, target:Element, beDecorProps: BeDecoratedProps){
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
        this.disconnect();
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
            onIfMediaMatches: {
                ifKeyIn: ['ifMediaMatches']
            },
            onIfNonEmptyArray:'ifNonEmptyArray',
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery', 'ifNonEmptyArrayVal', 'echoVal']
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

