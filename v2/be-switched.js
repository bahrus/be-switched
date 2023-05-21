import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeSwitched extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    calcVal(self) {
        const { lhs, rhs } = self;
        return {
            val: lhs === rhs,
            resolved: true,
        };
    }
    async onTrue(self) {
        const { enhancedElement, toggleDisabled } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null) {
            const keys = [];
            const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
            const appendedChildren = insertAdjacentTemplate(enhancedElement, enhancedElement, 'afterend');
            for (const child of appendedChildren) {
                if (!child.id) {
                    child.id = crypto.randomUUID();
                }
                keys.push(child.id);
            }
            enhancedElement.setAttribute('itemref', keys.join(' '));
        }
        else {
            const parent = (enhancedElement.parentElement || enhancedElement.getRootNode());
            const keys = itemref.split(' ');
            for (const key of keys) {
                const child = parent.getElementById(key);
                if (child === null)
                    continue;
                child.classList.remove('be-switched-hide');
                if (toggleDisabled && child.disabled === false) {
                    child.disabled = true;
                }
            }
        }
    }
    async onFalse(self) {
        const { enhancedElement, toggleDisabled } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null)
            return;
        addStyle(self);
        const parent = (enhancedElement.parentElement || enhancedElement.getRootNode());
        const keys = itemref.split(' ');
        for (const key of keys) {
            const child = parent.getElementById(key);
            if (child === null)
                continue;
            child.classList.add('be-switched-hidden');
            if (toggleDisabled && child.disabled === false) {
                child.disabled = true;
            }
        }
    }
}
const styleMap = new WeakSet();
function addStyle(ap) {
    const { enhancedElement, hiddenStyle } = ap;
    let rootNode = enhancedElement.getRootNode();
    if (rootNode.host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        style.innerHTML = /* css */ `
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}
const tagName = 'be-switched';
const ifWantsToBe = 'switched';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            val: false,
            echoVal: false,
            lhs: false,
            rhs: true,
            displayDelay: 16,
            hiddenStyle: 'display:none',
            toggleDisabled: false,
        },
        propInfo: {
            ...propInfo,
            val: {
                notify: {
                    echoTo: {
                        key: 'echoVal',
                        delay: 'displayDelay'
                    }
                }
            }
        },
        actions: {
            calcVal: {
                ifKeyIn: ['lhs', 'rhs']
            },
            onTrue: {
                ifEquals: ['val', 'echoVal'],
                ifAllOf: ['val']
            },
            onFalse: {
                ifEquals: ['val', 'echoVal'],
                ifNoneOf: ['val']
            }
        }
    },
    superclass: BeSwitched
});
register(ifWantsToBe, upgrade, tagName);
