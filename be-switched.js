import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
export class BeSwitchedController {
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onLHS({ lhs, proxy }) {
        hookUp(lhs, proxy, 'lhsVal');
    }
    onRHS({ rhs, proxy }) {
        hookUp(rhs, proxy, 'rhsVal');
    }
    onIf({ if: iff, proxy }) {
        hookUp(iff, proxy, 'ifVal');
    }
    #observer;
    onLazyDisplay({ proxy }) {
        proxy.style.display = 'inline-block';
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0
        };
        this.#observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            proxy.isIntersecting = entry.isIntersecting;
        }, options);
        this.#observer.observe(this.#target);
    }
    onIfNonEmptyArray({ ifNonEmptyArray, proxy }) {
        if (Array.isArray(ifNonEmptyArray)) {
            proxy.ifNonEmptyArrayVal = ifNonEmptyArray;
        }
        else {
            hookUp(ifNonEmptyArray, proxy, 'ifNonEmptyArrayVal');
        }
    }
    onIfMediaMatches({ ifMediaMatches }) {
        this.addMediaListener(this);
    }
    #mediaQueryHandler = (e) => {
        this.proxy.matchesMediaQuery = e.matches;
    };
    #mql;
    addMediaListener = ({ ifMediaMatches }) => {
        this.disconnect();
        this.#mql = window.matchMedia(ifMediaMatches);
        this.#mql.addEventListener('change', this.#mediaQueryHandler);
        this.proxy.matchesMediaQuery = this.#mql.matches;
    };
    calcVal({ ifVal, lhsVal, rhsVal, op, proxy, ifMediaMatches, matchesMediaQuery, ifNonEmptyArray, ifNonEmptyArrayVal }) {
        if (!ifVal) {
            proxy.val = false;
            return;
        }
        if (ifMediaMatches !== undefined) {
            if (!matchesMediaQuery) {
                proxy.val = false;
                return;
            }
        }
        if (ifNonEmptyArray !== undefined) {
            if (ifNonEmptyArrayVal === undefined || ifNonEmptyArrayVal.length === 0) {
                proxy.val = false;
                return;
            }
        }
        if (op === undefined) {
            proxy.val = true;
            return;
        }
        switch (op) {
            case '===':
                proxy.val = (lhsVal === rhsVal);
                break;
        }
    }
    onVal({ val, proxy, displayDelay }) {
        if (proxy.debug) {
            console.log({ val, proxy });
        }
        setTimeout(() => {
            if (proxy.echoVal !== proxy.val) {
                proxy.echoVal = proxy.val;
            }
        }, displayDelay);
    }
    doMain({ val, echoVal, proxy, toggleDisabled, isIntersecting, lazyDisplay, setAttr }) {
        if (val !== echoVal)
            return;
        const valWithLazy = !val ? false : (!lazyDisplay || isIntersecting);
        if (valWithLazy) {
            if (setAttr !== undefined) {
                proxy.setAttribute(setAttr, "true");
            }
            if (proxy.dataset.cnt === undefined) {
                const appendedChildren = insertAdjacentTemplate(proxy, proxy, 'afterend');
                addStyle(proxy);
                proxy.dataset.cnt = appendedChildren.length.toString();
            }
            else {
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy;
                let idx = 0;
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
            if (setAttr) {
                proxy.setAttribute(setAttr, "false");
            }
            if (proxy.dataset.cnt !== undefined) {
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy;
                let idx = 0;
                while (nextSib && idx < cnt) {
                    nextSib = nextSib.nextElementSibling;
                    if (nextSib)
                        nextSib.classList.add('be-switched-hide');
                    if (toggleDisabled && nextSib.disabled === true) {
                        nextSib.disabled = false;
                    }
                    idx++;
                }
            }
        }
    }
    disconnect() {
        // https://www.youtube.com/watch?v=YDU_3WdfkxA&list=LL&index=2
        if (this.#mql)
            this.#mql.removeEventListener('change', this.#mediaQueryHandler);
        if (this.#observer !== undefined)
            this.#observer.disconnect();
    }
    finale(proxy, target, beDecorProps) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
        this.disconnect();
    }
}
const tagName = 'be-switched';
const ifWantsToBe = 'switched';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: true,
            virtualProps: [
                'eventHandlers', 'if', 'ifVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal',
                'val', 'echoVal', 'hiddenStyle', 'ifMediaMatches', 'matchesMediaQuery',
                'ifNonEmptyArray', 'ifNonEmptyArrayVal', 'displayDelay', 'lazyDisplay', 'isIntersecting', 'setAttr'
            ],
            intro: 'intro',
            finale: 'finale',
            displayDelay: 16,
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
            onIfMediaMatches: {
                ifKeyIn: ['ifMediaMatches']
            },
            onIfNonEmptyArray: {
                ifAllOf: ['ifNonEmptyArray']
            },
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain: {
                ifKeyIn: ['val', 'echoVal', 'isIntersecting']
            },
            onLazyDisplay: {
                ifAllOf: ['lazyDisplay']
            }
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
register(ifWantsToBe, upgrade, tagName);
