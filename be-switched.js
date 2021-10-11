import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import { getElementToObserve, addListener } from 'be-observant/be-observant.js';
const ce = new CE({
    config: {
        tagName: 'be-switched',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'switched',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'iff', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal', 'hiddenStyle']
        }
    },
    complexPropDefaults: {
        actions: [
            ({ lhs, self }) => {
                switch (typeof lhs) {
                    case 'object':
                        const observeParams = lhs;
                        const elementToObserve = getElementToObserve(self, observeParams);
                        if (elementToObserve === null) {
                            console.warn({ msg: '404', observeParams });
                            return;
                        }
                        addListener(elementToObserve, observeParams, 'lhsVal', self);
                        break;
                    default:
                        self.lhsVal = lhs;
                }
            },
            ({ rhs, self }) => {
                switch (typeof rhs) {
                    case 'object':
                        const observeParams = rhs;
                        const elementToObserve = getElementToObserve(self, observeParams);
                        if (elementToObserve === null) {
                            console.warn({ msg: '404', observeParams });
                            return;
                        }
                        addListener(elementToObserve, observeParams, 'rhsVal', self);
                        break;
                    default:
                        self.rhsVal = rhs;
                }
            },
            ({ iff, lhsVal, rhsVal, op, self }) => {
                console.log({ iff, lhsVal, rhsVal });
                if (!iff) {
                    self.val = false;
                    return;
                }
                console.log({ op });
                if (op === undefined) {
                    self.val = true;
                    return;
                }
                switch (op) {
                    case '===':
                        self.val = (lhsVal === rhsVal);
                        break;
                }
            },
            ({ val, self }) => {
                setTimeout(() => {
                    if (self.echoVal !== self.val) {
                        self.echoVal = self.val;
                    }
                }, 5000);
            },
            ({ val, echoVal, self }) => {
                if (val !== echoVal)
                    return;
                console.log({ val });
                if (val) {
                    if (self.dataset.cnt === undefined) {
                        const appendedChildren = insertAdjacentTemplate(self, self, 'afterend');
                        addStyle(self);
                        self.dataset.cnt = appendedChildren.length.toString();
                    }
                    else {
                        const cnt = Number(self.dataset.cnt);
                        let nextSib = self;
                        let idx = 0;
                        while (nextSib && idx < cnt) {
                            nextSib = nextSib.nextElementSibling;
                            nextSib.classList.remove('be-switched-hide');
                        }
                    }
                }
                else {
                    if (self.dataset.cnt !== undefined) {
                        const cnt = Number(self.dataset.cnt);
                        let nextSib = self;
                        let idx = 0;
                        while (nextSib && idx < cnt) {
                            nextSib = nextSib.nextElementSibling;
                            nextSib.classList.add('be-switched-hide');
                        }
                    }
                }
            }
        ],
        on: {},
        init: (self, decor) => {
            //const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe!)!);
            console.log(self.iff);
        },
        finale: (self, target) => {
        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-switched'));
const styleMap = new WeakSet();
function addStyle({ self }) {
    let rootNode = self.getRootNode();
    if (rootNode.host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        const hiddenStyle = self.hiddenStyle || 'display:none';
        style.innerHTML = /* css */ `
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}
