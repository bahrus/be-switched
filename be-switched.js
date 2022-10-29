import { define } from 'be-decorated/DE.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
export class BeSwitchedController extends EventTarget {
    onLHS({ lhs, proxy }) {
        hookUp(lhs, proxy, 'lhsVal');
    }
    onRHS({ rhs, proxy }) {
        hookUp(rhs, proxy, 'rhsVal');
    }
    onIf({ if: iff, proxy }) {
        hookUp(iff, proxy, 'ifVal');
    }
    onIfNonEmptyArray({ ifNonEmptyArray, proxy }) {
        if (Array.isArray(ifNonEmptyArray)) {
            proxy.ifNonEmptyArrayVal = ifNonEmptyArray;
        }
        else {
            hookUp(ifNonEmptyArray, proxy, 'ifNonEmptyArrayVal');
        }
    }
    chkMedia({}, e) {
        return { matchesMediaQuery: e.matches };
    }
    #mql;
    addMediaListener(pp) {
        const { ifMediaMatches } = pp;
        if (!ifMediaMatches)
            return [{}, {}]; //clears previous listener
        this.#mql = window.matchMedia(ifMediaMatches); //TODO:  support observant media matches
        return [{}, { chkMedia: { on: 'change', of: this.#mql, doInit: true } }];
    }
    calcVal(pp) {
        const { deferRendering } = pp;
        if (deferRendering) {
            return {
                deferRendering: false,
            };
        }
        const { ifVal, lhsVal, rhsVal } = pp;
        if (!ifVal) {
            return {
                val: false,
            };
        }
        const { ifMediaMatches, matchesMediaQuery } = pp;
        if (ifMediaMatches !== undefined) {
            if (!matchesMediaQuery) {
                return {
                    val: false,
                };
            }
        }
        const { ifNonEmptyArray, ifNonEmptyArrayVal } = pp;
        if (ifNonEmptyArray !== undefined) {
            if (ifNonEmptyArrayVal === undefined || ifNonEmptyArrayVal.length === 0) {
                return {
                    val: false
                };
            }
        }
        const { op } = pp;
        if (op === undefined) {
            return {
                val: true
            };
        }
        switch (op) {
            case '===':
                return { val: (lhsVal === rhsVal) };
        }
    }
    #echoTimeOut;
    onVal({ val, proxy, displayDelay }) {
        if (proxy.debug) {
            console.log({ val, proxy });
        }
        clearTimeout(this.#echoTimeOut);
        this.#echoTimeOut = setTimeout(() => {
            if (proxy.echoVal !== proxy.val) {
                proxy.echoVal = proxy.val;
            }
        }, displayDelay);
    }
    async doMain({ val, echoVal, proxy, toggleDisabled }) {
        if (val !== echoVal)
            return;
        if (val) {
            if (proxy.dataset.cnt === undefined) {
                const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
                const appendedChildren = insertAdjacentTemplate(proxy, proxy, 'afterend');
                proxy.dataset.cnt = (appendedChildren.length + 1).toString();
            }
            else {
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy;
                let idx = 1;
                while (nextSib && idx < cnt) {
                    nextSib = nextSib.nextElementSibling;
                    if (nextSib) {
                        nextSib.classList.remove('be-switched-hide');
                        if (toggleDisabled && nextSib.disabled === false) {
                            nextSib.disabled = true;
                        }
                    }
                    idx++;
                }
            }
        }
        else {
            addStyle(proxy);
            //checks for !val are done when appropriate -- boolean conditions, not necessarily lazy loading, is now false
            // if(setClass !== undefined && !val){
            //     proxy.classList.remove(setClass);
            // }
            if (proxy.dataset.cnt !== undefined) {
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy;
                let idx = 1;
                while (nextSib && idx < cnt) {
                    nextSib = nextSib.nextElementSibling;
                    if (nextSib !== null) {
                        if (!val)
                            nextSib.classList.add('be-switched-hide');
                        if (toggleDisabled && nextSib.disabled === true) {
                            nextSib.disabled = false;
                        }
                        idx++;
                    }
                }
            }
        }
    }
    async finale(proxy, target, beDecorProps) {
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}
const tagName = 'be-switched';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            forceVisible: [upgrade],
            virtualProps: [
                'eventHandlers', 'if', 'ifVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal',
                'val', 'echoVal', 'hiddenStyle', 'ifMediaMatches', 'matchesMediaQuery',
                'ifNonEmptyArray', 'ifNonEmptyArrayVal', 'displayDelay', 'beOosoom', 'disabled',
            ],
            proxyPropDefaults: {
                displayDelay: 16,
                op: '===',
                beOosoom: '!disabled',
            },
            finale: 'finale',
        },
        actions: {
            onLHS: {
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
            onIfNonEmptyArray: 'ifNonEmptyArray',
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery', 'ifNonEmptyArrayVal', 'echoVal'],
                ifNoneOf: ['disabled']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain: {
                ifKeyIn: ['val', 'echoVal']
            },
        }
    },
    complexPropDefaults: {
        controller: BeSwitchedController
    }
});
const styleMap = new WeakSet();
function addStyle(proxy) {
    let rootNode = proxy.getRootNode();
    if (rootNode.host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        const hiddenStyle = proxy.hiddenStyle || 'display:none';
        style.innerHTML = /* css */ `
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}
register('switched', upgrade, tagName);
