import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeSwitchedVirtualProps, BeSwitchedActions, BeSwitchedProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';



export class BeSwitchedController implements BeSwitchedActions{

    #target: Element | undefined;
    intro(proxy: Element & BeSwitchedVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        this.#target = target;
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

    #observer: IntersectionObserver | undefined;
    onLazyDisplay({proxy, lazyDelay, lazyLoadClass}: this){
        const filler = document.createElement('be-switched-filler');;
        proxy.insertAdjacentElement('beforebegin', filler);
        proxy.style.display = 'inline-block';
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0
        } as IntersectionObserverInit;
        this.#observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            const entry = entries[0];
            proxy.isIntersecting = entry.isIntersecting;
        }, options);
        this.#observer.observe(this.#target!);
        doQueue(proxy);
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

    onVal({val, proxy, displayDelay}: this){
        if((<any>proxy).debug){
            console.log({val, proxy});
        }
        setTimeout(() => {
            if(proxy.echoVal !== proxy.val){
                proxy.echoVal = proxy.val;
            }
        }, displayDelay);
    }

    doMain({val, echoVal, proxy, toggleDisabled, isIntersecting, lazyDisplay, lazyLoadClass}: this){
        if(val !== echoVal) return;
        const valWithLazy = !val ? false : (!lazyDisplay || isIntersecting);
        if(valWithLazy){
            // if(setClass !== undefined){
            //     proxy.classList.add(setClass);
            // }
            //if(isIntersecting) proxy.classList.remove(lazyLoadClass);
            if(proxy.dataset.cnt === undefined){
                const appendedChildren = insertAdjacentTemplate(proxy, proxy, 'afterend');
                
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
            addStyle(proxy);
            //checks for !val are done when appropriate -- boolean conditions, not necessarily lazy loading, is now false
            // if(setClass !== undefined && !val){
            //     proxy.classList.remove(setClass);
            // }
            if(proxy.dataset.cnt !== undefined){
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy as Element | null;
                let idx = 0
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
        if (this.#mql) this.#mql.removeEventListener('change', this.#mediaQueryHandler);
        if(this.#observer !== undefined) this.#observer.disconnect();
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
                'ifNonEmptyArray', 'ifNonEmptyArrayVal', 'displayDelay', 
                'lazyDisplay', 'isIntersecting', 'lazyLoadClass', 'lazyDelay'
            ],
            proxyPropDefaults:{
                displayDelay: 16,
                lazyLoadClass: 'be-lazy-loaded',
                lazyDelay: 50,
            },
            intro: 'intro',
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
            onIfNonEmptyArray:{
                ifAllOf: ['ifNonEmptyArray']
            },
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery', 'isIntersecting', 'ifNonEmptyArrayVal', 'echoVal']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain:{
                ifKeyIn: ['val', 'echoVal', 'isIntersecting']
            },
            onLazyDisplay:{
                ifAllOf: ['lazyDisplay']
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

const queue: any[] = [];
let queueIsProcessing = false;
function doQueue(newItem?: any){
    if(newItem !== undefined){
        queue.push(newItem);
    }
    if(queue.length === 0) {
        queueIsProcessing = false;
        return;
    }
    queueIsProcessing = true;
    const doThisOne = queue.shift()!;
    setTimeout(() => {
        doThisOne.classList.remove(doThisOne.lazyLoadClass);
        const prevSibling = doThisOne.previousElementSibling;
        if(prevSibling !== null && prevSibling.localName === 'be-switched-filler'){
            prevSibling.remove();
        }
        doQueue();
    }, doThisOne.lazyDelay);

}
