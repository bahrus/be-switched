import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
const cache = new Map();
const prsOnCache = new Map();
const prsOffCache = new Map();
export class BeSwitched extends BE {
    static get beConfig() {
        return {
            parse: true,
            //primaryProp: 'camelConfig',
            cache,
            //primaryPropReq: true,
            parseAndCamelize: true,
            camelizeOptions: {},
            isParsedProp: 'isParsed'
        };
    }
    calcVal(self) {
        const { lhs, rhs, checkIfNonEmptyArray, beBoolish, On, switchesSatisfied, on, Off, off } = self;
        //console.log({switchesSatisfied});
        if ((On || on || Off || off) !== undefined) {
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
    //TODO:  use trans-render/lib/partition
    async onTrue(self) {
        const { enhancedElement, toggleInert: toggleDisabled, deferRendering } = self;
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
    async onOn(self) {
        const { parsedFrom } = self;
        let parsed = prsOnCache.get(parsedFrom);
        if (parsed === undefined) {
            const { prsOn } = await import('./prsOn.js');
            parsed = await prsOn(self);
            prsOnCache.set(parsedFrom, parsed);
        }
        return structuredClone(parsed);
    }
    async onOff(self) {
        const { parsedFrom } = self;
        let parsed = prsOffCache.get(parsedFrom);
        if (parsed === undefined) {
            const { prsOn } = await import('./prsOn.js');
            parsed = await prsOn(self, true);
            prsOffCache.set(parsedFrom, parsed);
        }
        return structuredClone(parsed);
    }
    async doOnBinarySwitches(self) {
        if (self.onBinarySwitches?.length === 0)
            return;
        const { doBinSwitch } = await import('./doBinSwitch.js');
        doBinSwitch(self, 'on');
    }
    async doOnTwoValSwitches(self) {
        if (self.onTwoValueSwitches?.length === 0)
            return;
        const { doTwoValSwitch } = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self, 'on');
    }
    async doOffBinarySwitches(self) {
        if (self.onBinarySwitches?.length === 0)
            return;
        const { doBinSwitch } = await import('./doBinSwitch.js');
        doBinSwitch(self, 'off');
    }
    async doOffTwoValSwitches(self) {
        if (self.onTwoValueSwitches?.length === 0)
            return;
        const { doTwoValSwitch } = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self, 'off');
    }
    async doOnNValSwitches(self) {
        if (self.onNValueSwitches?.length === 0)
            return;
        const { NValueSwitch } = await import('./NValueSwitch.js');
        new NValueSwitch(self);
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
export const tagName = 'be-switched';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
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
            toggleInert: false,
            deferRendering: false,
            beBoolish: true,
            minMem: false,
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
                ifAllOf: ['isParsed'],
                ifKeyIn: ['lhs', 'rhs', 'switchesSatisfied']
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
            },
            onOn: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['On', 'on'],
            },
            onOff: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['Off', 'off'],
            },
            doOnBinarySwitches: 'onBinarySwitches',
            doOnTwoValSwitches: 'onTwoValueSwitches',
            doOffBinarySwitches: 'offBinarySwitches',
            doOffTwoValSwitches: 'offTwoValueSwitches',
            doOnNValSwitches: 'onNValueSwitches',
        }
    },
    superclass: BeSwitched
});
