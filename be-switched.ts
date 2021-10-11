import {XtalDecor, XtalDecorCore} from 'xtal-decor/xtal-decor.js';
import { XtalDecorProps } from 'xtal-decor/types';
import {CE} from 'trans-render/lib/CE.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { IObserve } from 'be-observant/types';
import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
//import {getElementToObserve} from 'be-observant/be-observant.js';

const ce = new CE<XtalDecorCore<Element>>({
    config:{
        tagName: 'be-switched',
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'switched',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'iff', 'lhs', '?', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal']
        }
    },
    complexPropDefaults: {
        actions:[
            ({lhs, self}) => {
                console.log(self.lhs);
            },
            ({iff, self}) => {
                self.val = iff;
            },
            ({val, self}) => {
                setTimeout(() => {
                    self.echoVal = val;
                }, 5000)
            },
            ({val, echoVal, self}) => {
                if(val !== echoVal) return;
                if(val){
                    const docFrag = self.content.cloneNode(true);
                    document.body.appendChild(docFrag);
                }
            }
        ],
        on:{},
        init: (self: any, decor: XtalDecorProps<Element>) => {
            //const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe!)!);
            console.log(self.iff);
        },
        finale: (self: Element, target: Element) => {

        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-switched'));


