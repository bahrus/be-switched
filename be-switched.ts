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
            noParse: true,
            forceVisible: true,
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults: {
        actions:[],
        on:{},
        init: (self: Element, decor: XtalDecorProps<Element>) => {
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe!)!);
            console.log(params);
        },
        finale: (self: Element, target: Element) => {

        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-switched'));
