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
        const { lhs, rhs, checkIfNonEmptyArray } = self;
        if (checkIfNonEmptyArray) {
            if (!Array.isArray(lhs) || lhs.length === 0)
                return {
                    val: false,
                    resolved: true,
                };
        }
        return {
            val: lhs === rhs,
            resolved: true,
        };
    }
    async onTrue(self) {
        const { enhancedElement, toggleDisabled, deferRendering } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null) {
            const keys = [];
            const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
            const appendedChildren = insertAdjacentTemplate(enhancedElement, enhancedElement, 'afterend');
            for (const child of appendedChildren) {
                if (!child.id) {
                    child.id = 'a' + crypto.randomUUID();
                }
                keys.push(child.id);
            }
            enhancedElement.setAttribute('itemref', keys.join(' '));
            if (!enhancedElement.hasAttribute('itemscope'))
                enhancedElement.setAttribute('itemscope', '');
        }
        else {
            if (deferRendering) {
                self.deferRendering = false;
                return;
            }
            const rn = enhancedElement.getRootNode();
            const keys = itemref.split(' ');
            for (const key of keys) {
                const child = rn.getElementById(key);
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
        const rn = enhancedElement.getRootNode();
        const keys = itemref.split(' ');
        for (const key of keys) {
            const child = rn.getElementById(key);
            if (child === null)
                continue;
            child.classList.add('be-switched-hide');
            if (toggleDisabled && child.disabled === false) {
                child.disabled = true;
            }
        }
    }
    #mql;
    addMediaListener(self) {
        const { ifMediaMatches, enhancedElement } = self;
        if (!ifMediaMatches)
            return [{}, {}]; //clears previous listener
        this.#mql = window.matchMedia(ifMediaMatches); //TODO:  support observant media matches
        return [{}, { chkMedia: { on: 'change', of: this.#mql, doInit: true } }];
    }
    chkMedia(self, e) {
        return { matchesMediaQuery: e.matches };
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
            op: '===',
            checkIfNonEmptyArray: false,
            ifMediaMatches: '',
            hiddenStyle: 'display:none',
            toggleDisabled: false,
            deferRendering: false,
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
            },
            addMediaListener: {
                ifKeyIn: ['ifMediaMatches']
            }
        }
    },
    superclass: BeSwitched
});
register(ifWantsToBe, upgrade, tagName);
