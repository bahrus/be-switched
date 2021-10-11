import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
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
                    const docFrag = self.content.cloneNode(true);
                    document.body.appendChild(docFrag);
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
