import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
//import {getElementToObserve} from 'be-observant/be-observant.js';
const ce = new CE({
    config: {
        tagName: 'be-switched',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'switched',
            noParse: true,
            forceVisible: true,
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults: {
        actions: [],
        on: {},
        init: (self, decor) => {
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe));
            console.log(params);
        },
        finale: (self, target) => {
        }
    },
    superclass: XtalDecor
});
