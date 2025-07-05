// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import { get } from 'trans-render/XV/get.js';
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
            transitional: {},
            emc: {},
        },
        compacts: {
            echo_val_to_echoVal: 20,
            when_singleValSwitches_changes_call_onSingleValSwitches: 0,
            when_twoValueSwitches_changes_call_onTwoValSwitches: 0,
            when_rawStatements_changes_call_onRawStatements: 0,
            when_js_changes_call_processJS: 0,
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
        ], 
        
    };
    //#enhKey;
    /**
     * @type {EnhancementInfo}
     */
    #enhancementInfo;

    /**
     * @type {boolean}
     */
    #transitional;

    /**
     * @type {boolean | undefined}
     */
    #isEmpty;

    /**
     * 
     * @param {Element} el 
     * @param {EnhancementInfo} enhancementInfo 
     */
    async attach(el, enhancementInfo) {
        //this.#enhKey = enhancementInfo.mountCnfg?.enhPropKey;
        this.#enhancementInfo = enhancementInfo;
        const style = window.getComputedStyle(el);
        this.#transitional = style.getPropertyValue('--be-transitional') === 'true';
        super.attach(el, enhancementInfo);
    }
    /**
     * 
     * @param {BAP} self 
     */
    async onSingleValSwitches(self) {
        const { SingleValSwitchHandler } = await import('./SingleValSwitchHandler.js');
        new SingleValSwitchHandler(self);
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
        const {notProcessedJS, js, emc} = self;
        const { NValueSwitch } = await import('./NValueSwitch.js');
        new NValueSwitch(self, this.#enhancementInfo);
    }
    /**
     * 
     * @param {BAP} self 
     */
    calcVal(self) {
        const { lhs, rhs, checkIfNonEmptyArray, beBoolish, switchesSatisfied, twoValueSwitches, nValueSwitches, singleValSwitches } = self;
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
     * @param {HTMLTemplateElement} enhancedElement 
     * @returns 
     */
    #determineIfEmpty(enhancedElement){
        if(this.#isEmpty !== undefined) return this.#isEmpty;
        if(!(enhancedElement instanceof HTMLTemplateElement)){
            this.#isEmpty = true;
            return true;
        }
        if(enhancedElement.dataset.blowDryRef){
            this.#isEmpty = false;
            return false;
        }
        if(enhancedElement.content === undefined || enhancedElement.content.childElementCount === 0){
            this.#isEmpty = true;
            return true;
        }
        this.#isEmpty = false;
        return false;
    }
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async onTrue(self) {
        const { enhancedElement, toggleInert, deferRendering, transitional, emc } = self;
        if('value' in enhancedElement){
            enhancedElement.value = true;
        }else{
            enhancedElement.classList.remove('be-switched-off');
            enhancedElement.classList.add('be-switched-on');
        }

        if(this.#determineIfEmpty(enhancedElement)) return;
        const {base} = emc;
        if(!base) throw 500;

        const transitional2 = transitional || this.#transitional;

        const {wrap, wrapped} = await import('mount-observer/slotkin/wrap.js');
        const wrappedVal = enhancedElement[wrapped];
        if(!wrappedVal){
            const {getCount} = await import('trans-render/dss/tref/getCount.js');
            wrap(enhancedElement, `${base}-${getCount(base)}`, true) ;
        }
        const {getFrag} = await import('mount-observer/slotkin/getFrag.js');
        const children = getFrag(enhancedElement, wrappedVal);
        if(children === null){
            let templToClone = enhancedElement;
            const externalRefId = templToClone.dataset.blowDryRef;
            if (externalRefId){
                templToClone = window[externalRefId];
            }
            const clone = templToClone.content.cloneNode(true);
            if(!transitional2 || !document.startViewTransition){
                enhancedElement.after(clone);
            }else{
                document.startViewTransition(() => {
                    enhancedElement.after(clone);
                });
            } 
        }else{
            const elChildren = /** @type {Array<HTMLElement>} */ (children.filter(x => x instanceof HTMLElement));
            if(!transitional2 || !document.startViewTransition){
                this.#changeVisibility(elChildren, toggleInert, 'remove');
            }else{
                document.startViewTransition(() => {
                    this.#changeVisibility(elChildren, toggleInert, 'remove');
                })
            }
        }
         

    }

    /**
     * 
     * @param {Array<Element>} children 
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
        const { enhancedElement, toggleInert, minMem, transitional } = self;
        if('value' in enhancedElement){
            enhancedElement.value = false;
        }else{
            enhancedElement.classList.add('be-switched-off');
            enhancedElement.classList.remove('be-switched-on');
        }
        
        if(this.#determineIfEmpty(enhancedElement)) return;

        const transitional2 = transitional || this.#transitional;
        addStyle(self);
        const {wrapped} = await import('mount-observer/slotkin/wrap.js');
        const wrappedVal = enhancedElement[wrapped];
        if(!wrappedVal) return;
        const {getFrag} = await import('mount-observer/slotkin/getFrag.js');
        let children = getFrag(enhancedElement, wrappedVal);
        if(children === null) return;
        
        const elChildren = /** @type {Array<HTMLElement>} */ (children.filter(x => x instanceof HTMLElement));
        if(!transitional2 || !document.startViewTransition){
            this.#changeVisibility(elChildren, toggleInert, 'add');
        }else{
            document.startViewTransition(() => {
                this.#changeVisibility(elChildren, toggleInert, 'add');
            })
        }
        if (minMem){
            //TODO:
            //enhancedElement.removeAttribute('itemref');
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
