import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
export class BeSwitched extends BE {
    static config = {
        propDefaults: {
            hiddenStyle: 'display:none',
        },
        propInfo: {
            ...beCnfg.propInfo,
            twoValueSwitches: {},
            switchesSatisfied: {},
            val: {},
            echoVal: {},
            nValueSwitches: {},
        },
        compacts: {
            echo_val_to_echoVal: 20,
        },
        actions: {
            onTrue: {
                ifEquals: ['val', 'echoVal'],
                ifAllOf: ['val']
            },
            onFalse: {
                ifEquals: ['val', 'echoVal'],
                ifNoneOf: ['val']
            },
            onTwoValSwitches: {
                ifAllOf: ['twoValueSwitches']
            },
            onNValSwitches: {
                ifAllOf: ['nValueSwitches']
            },
            calcVal: {
                ifKeyIn: ['lhs', 'rhs', 'switchesSatisfied']
            },
        }
    };
    async onTwoValSwitches(self) {
        const { doTwoValSwitch } = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self);
    }
    async onNValSwitches(self) {
        const { NValueSwitch } = await import('./NValueSwitch.js');
        new NValueSwitch(self);
    }
    calcVal(self) {
        const { lhs, rhs, checkIfNonEmptyArray, beBoolish, switchesSatisfied, twoValueSwitches } = self;
        //console.log({switchesSatisfied});
        if (twoValueSwitches !== undefined) {
            return {
                val: switchesSatisfied,
                resolved: true,
            };
        }
        if (beBoolish && typeof lhs === 'boolean' || typeof rhs === 'boolean') {
            let lhsIsh = !!lhs;
            let rhsIsh = !!rhs;
            if (checkIfNonEmptyArray) {
                if (typeof lhs !== 'boolean') {
                    lhsIsh = !Array.isArray(lhs) || lhs.length === 0;
                }
                if (typeof rhs !== 'boolean') {
                    rhsIsh = !Array.isArray(rhs) || rhs.length === 0;
                }
            }
            return {
                val: lhsIsh === rhsIsh,
                resolved: true
            };
        }
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
        const { enhancedElement, toggleInert: toggleDisabled, deferRendering } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null) {
            const keys = [];
            const clone = enhancedElement.content.cloneNode(true);
            for (const child of clone.children) {
                if (!child.id) {
                    child.id = 'a' + crypto.randomUUID();
                }
                keys.push(child.id);
            }
            enhancedElement.setAttribute('itemref', keys.join(' '));
            if (!enhancedElement.hasAttribute('itemscope'))
                enhancedElement.setAttribute('itemscope', '');
            enhancedElement.after(clone);
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
        const { enhancedElement, toggleInert, minMem } = self;
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
            if (minMem) {
                child.remove();
            }
            else {
                child.classList.add('be-switched-hide');
                if (toggleInert && !child.inert) {
                    child.inert = true;
                }
            }
        }
        if (minMem)
            enhancedElement.removeAttribute('itemref');
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
