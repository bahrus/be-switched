import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
//import {getElementToObserve} from 'be-observant/be-observant.js';
const ce = new CE({
    config: {
        tagName: 'be-switched',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'switched',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'iff', 'lhs', '?', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal']
        }
    },
    complexPropDefaults: {
        actions: [
            ({ lhs, self }) => {
                console.log(self.lhs);
            },
            ({ iff, self }) => {
                self.val = iff;
            },
            ({ val, self }) => {
                setTimeout(() => {
                    self.echoVal = val;
                }, 5000);
            },
            ({ val, echoVal, self }) => {
                if (val !== echoVal)
                    return;
                if (val) {
                    if (self.dataset.cnt === undefined) {
                        const appendedChildren = insertAdjacentTemplate(self, self, 'afterend');
                        self.dataset.cnt = appendedChildren.length.toString();
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
