import { define } from 'be-decorated/be-decorated.js';
import { getElementToObserve, addListener } from 'be-observant/be-observant.js';
import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import { register } from 'be-hive/be-hive.js';
export class BeSwitchedController {
    intro(proxy, target, beDecorProps) {
    }
    onLHS({ lhs, proxy }) {
        switch (typeof lhs) {
            case 'object':
                const observeParams = lhs;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', observeParams });
                    return;
                }
                addListener(elementToObserve, observeParams, 'lhsVal', proxy);
                break;
            default:
                proxy.lhsVal = lhs;
        }
    }
    onRHS({ rhs, proxy }) {
        switch (typeof rhs) {
            case 'object':
                const observeParams = rhs;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', observeParams });
                    return;
                }
                addListener(elementToObserve, observeParams, 'rhsVal', proxy);
                break;
            default:
                proxy.rhsVal = rhs;
        }
    }
    onIf({ if: iff, proxy }) {
        switch (typeof iff) {
            case 'object':
                const observeParams = iff;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', observeParams });
                    return;
                }
                addListener(elementToObserve, observeParams, 'ifVal', proxy);
                break;
            default:
                proxy.ifVal = iff;
        }
    }
    onIfNonZeroArray({ ifNonZeroArray, proxy }) {
        if (Array.isArray(ifNonZeroArray)) {
            proxy.ifNonZeroArrayVal = ifNonZeroArray.length > 0;
        }
        else {
            const observeParams = ifNonZeroArray;
            const elementToObserve = getElementToObserve(proxy, observeParams);
            if (elementToObserve === null) {
                console.warn({ msg: '404', observeParams });
                return;
            }
            addListener(elementToObserve, observeParams, 'ifNonZeroArray', proxy);
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
    calcVal({ ifVal, lhsVal, rhsVal, op, proxy, ifMediaMatches, matchesMediaQuery, ifNonZeroArray, ifNonZeroArrayVal }) {
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
        if (ifNonZeroArray !== undefined) {
            if (!ifNonZeroArrayVal) {
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
    onVal({ val, proxy }) {
        setTimeout(() => {
            if (proxy.echoVal !== proxy.val) {
                proxy.echoVal = proxy.val;
            }
        }, 16);
    }
    doMain({ val, echoVal, proxy }) {
        if (val !== echoVal)
            return;
        if (val) {
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
                    if (nextSib)
                        nextSib.classList.remove('be-switched-hide');
                    idx++;
                }
            }
        }
        else {
            if (proxy.dataset.cnt !== undefined) {
                const cnt = Number(proxy.dataset.cnt);
                let nextSib = proxy;
                let idx = 0;
                while (nextSib && idx < cnt) {
                    nextSib = nextSib.nextElementSibling;
                    if (nextSib)
                        nextSib.classList.add('be-switched-hide');
                    idx++;
                }
            }
        }
    }
    disconnect() {
        // https://www.youtube.com/watch?v=YDU_3WdfkxA&list=LL&index=2
        if (this.#mql)
            this.#mql.removeEventListener('change', this.#mediaQueryHandler);
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
                'val', 'echoVal', 'hiddenStyle', 'ifMediaMatches', 'matchesMediaQuery'
            ],
            intro: 'intro',
            finale: 'finale'
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
            onIfNonZeroArray: {
                ifAllOf: ['ifNonZeroArray']
            },
            calcVal: {
                ifKeyIn: ['ifVal', 'lhsVal', 'rhsVal', 'op', 'matchesMediaQuery']
            },
            onVal: {
                ifKeyIn: ['val']
            },
            doMain: {
                ifKeyIn: ['val', 'echoVal']
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
