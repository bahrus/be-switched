// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {BAP, Actions} from './ts-refs/be-switched/types' */;
/** @import {EnhancementInfo, EventListenerOrFn} from  './ts-refs/trans-render/be/types'*/
let cnt = 0;

/**
 * @implements {Actions}
 */
class BeSwitched extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults: {
            hiddenStyle: 'display:none',
            lhs: false,
            rhs: true,
            singleValSwitchesSatisfied: false,
            singleValSwitchNoGo: false,
            twoValSwitchesSatisfied: false,
            twoValSwitchNoGo: false,
            notProcessedJS: true,
        },
        propInfo: {
            ...propInfo,
            twoValueSwitches: {},
            switchesSatisfied: {},
            val: {},
            echoVal: {},
            nValueSwitches: {},
            rawStatements: {},
            singleValSwitches: {},
            js: {},
        },
        compacts: {
            echo_val_to_echoVal: 20,
            when_singleValSwitches_changes_invoke_onSingleValSwitches: 0,
            when_twoValueSwitches_changes_invoke_onTwoValSwitches: 0,
            when_rawStatements_changes_invoke_onRawStatements: 0,
            when_js_changes_invoke_processJS: 0,
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
            calcSwitchesSatisfied: {
                ifKeyIn: ['singleValSwitchNoGo', 'singleValSwitchesSatisfied', 'twoValSwitchNoGo', 'twoValSwitchesSatisfied']
            },
            calcVal: {
                ifKeyIn: ['lhs', 'rhs', 'switchesSatisfied']
            },
            onNValSwitches: {
                ifAllOf: ['nValueSwitches'],
                ifNotAllOf: ['js', 'notProcessedJS']
            }
        },
        positractions: [
            resolved, rejected,
        ]
    };
    #enhKey;
    /**
     * @type {EnhancementInfo}
     */
    #enhancementInfo;
    /**
     * 
     * @param {Element} el 
     * @param {EnhancementInfo} enhancementInfo 
     */
    async attach(el, enhancementInfo) {
        this.#enhKey = enhancementInfo.mountCnfg?.enhPropKey;
        this.#enhancementInfo = enhancementInfo;
        super.attach(el, enhancementInfo);
    }
    /**
     * 
     * @param {BAP} self 
     */
    async onSingleValSwitches(self) {
        const { SingleValSwitchHandler } = await import('./SingleValSwitchHandler.js');
        new SingleValSwitchHandler(self);
        //doSingleValSwitch(self);
    }
    /**
     * 
     * @param {BAP} self 
     */
    async onTwoValSwitches(self) {
        const { TwoValSwitchHandler } = await import('./TwoValSwitchHandler.js');
        new TwoValSwitchHandler(self);
    }
        /**
     * 
     * @param {BAP} self 
     */
    async onNValSwitches(self) {
        const {notProcessedJS, js} = self;
        const { NValueSwitch } = await import('./NValueSwitch.js');
        new NValueSwitch(self, this.#enhancementInfo);
    }
    /**
     * 
     * @param {BAP} self 
     */
    calcVal(self) {
        const { lhs, rhs, checkIfNonEmptyArray, beBoolish, switchesSatisfied, twoValueSwitches, nValueSwitches, singleValSwitches } = self;
        //console.log({switchesSatisfied});
        if (twoValueSwitches !== undefined || nValueSwitches !== undefined || singleValSwitches !== undefined) {
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
    /**
     * 
     * @param {BAP} self 
     */
    calcSwitchesSatisfied(self) {
        const { singleValSwitchNoGo, singleValSwitchesSatisfied, twoValSwitchNoGo, twoValSwitchesSatisfied } = self;
        return {
            switchesSatisfied: !singleValSwitchNoGo && !twoValSwitchNoGo && (singleValSwitchesSatisfied || twoValSwitchesSatisfied),
        };
    }
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async onTrue(self) {
        const { enhancedElement, toggleInert, deferRendering, transitional } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null) {
            const keys = [];
            let templToClone = enhancedElement;
            const externalRefId = templToClone.dataset.blowDryRef;
            if (externalRefId)
                templToClone = window[externalRefId];
            const { tagTempl } = await import('trans-render/dss/tref/tagTempl.js');
            if(!transitional || !document.startViewTransition){
                tagTempl(templToClone, this.#enhKey);
            }else{
                document.startViewTransition(() => {
                    tagTempl(templToClone, this.#enhKey);
                })
            }
            
        }
        else {
            if (deferRendering) {
                self.deferRendering = false;
                return;
            }
            const itemref = enhancedElement.getAttribute('itemref');
            if(itemref !== null){
                const { getChildren } = await import('trans-render/dss/tref/getChildren.js');
                const children = getChildren(enhancedElement, itemref);
                this.#changeVisibility(children, toggleInert, 'remove');
                // for (const child of children) {
                //     child.classList.remove('be-switched-hide');
                //     if (toggleInert && 'disabled' in child && child.disabled === false) {
                //         child.disabled = true;
                //     }
                // }
            }

        }
    }

    /**
     * 
     * @param {Array<HTMLElement>} children 
     * @param {boolean | undefined} toggleInert 
     * @param {'add' | 'remove'} verb 
     */
    #changeVisibility(children, toggleInert, verb){
        const disable = verb === 'remove' ? true : false;
        for (const child of children) {
            child.classList[verb]('be-switched-hide');
            if (toggleInert && 'disabled' in child && child.disabled === !disable) {
                child.disabled = disable;
            }
        }
    }
    async onFalse(self) {
        const { enhancedElement, toggleInert, minMem } = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if (itemref === null)
            return;
        addStyle(self);
        const { getChildren } = await import('trans-render/dss/tref/getChildren.js');
        const children = getChildren(enhancedElement, itemref);
        this.#changeVisibility(children, toggleInert, 'add');
        // const rn = enhancedElement.getRootNode();
        // const keys = itemref.split(' ');
        // for (const key of keys) {
        //     const child = rn.getElementById(key);
        //     if (child === null)
        //         continue;
        //     if (minMem) {
        //         child.remove();
        //     }
        //     else {
        //         child.classList.add('be-switched-hide');
        //         if (toggleInert && !child.inert) {
        //             child.inert = true;
        //         }
        //     }
        // }
        if (minMem){
            enhancedElement.removeAttribute('itemref');
        }
            
    }
    onRawStatements(self) {
        const { rawStatements } = self;
        console.error('The following statements could not be parsed.', rawStatements);
    }

    /**
     * 
     * @param {BAP} self 
     */
    async processJS(self){
        const {js, enhancedElement} = self;
        const expr = `
    const {f, args} = e;
    e.r = ${js};
`;
        const handler = (await import('trans-render/lib/activate.js')).activate(expr);
        //TODO abort controller
        enhancedElement.addEventListener('change', handler);
        return /** @type {BAP} */({
            notProcessedJS: false,
        });
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
await BeSwitched.bootUp();
export { BeSwitched };
