import { define } from 'be-decorated/be-decorated.js';
import { getElementToObserve, addListener } from 'be-observant/be-observant.js';
export class BeSwitchedController {
    intro(proxy, target, beDecorProps) {
    }
    onLHS({ lhs }) {
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
    }
    finale(proxy, target, beDecorProps) {
    }
}
const tagName = 'be-switched';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade: 'template',
            ifWantsToBe: 'switched',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'iff', 'iffVal', 'lhs', 'op', 'rhs', 'lhsVal', 'rhsVal', 'val', 'echoVal', 'hiddenStyle'],
            intro: 'intro',
            finale: 'finale'
        }
    },
    complexPropDefaults: {
        controller: BeSwitchedController
    }
});
