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
    onIff({ iff, proxy }) {
        switch (typeof iff) {
            case 'object':
                const observeParams = iff;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', observeParams });
                    return;
                }
                addListener(elementToObserve, observeParams, 'iffVal', proxy);
                break;
            default:
                proxy.iffVal = iff;
        }
    }
    calcVal({ iffVal, lhsVal, rhsVal, op, proxy }) {
        if (!iffVal) {
            proxy.val = false;
            return;
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
    finale(proxy, target, beDecorProps) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
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
            virtualProps: ['eventHandlers', 'iff', 'iffVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal', 'hiddenStyle'],
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
            onIff: {
                ifKeyIn: ['iff']
            },
            calcVal: {
                ifKeyIn: ['iffVal', 'lhsVal', 'rhsVal', 'op']
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
