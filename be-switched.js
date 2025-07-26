// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import { get } from 'trans-render/XV/get.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {BAP, Actions} from './ts-refs/be-switched/types' */;
/** @import {EnhancementInfo, EventListenerOrFn} from  './ts-refs/trans-render/be/types'*/
let cnt = 0;

/**
 * @type {WeakMap<DocumentFragment, DocumentFragment>}
 */
const wrappedContent = new WeakMap();

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
            cmtWrap: false,
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
            minMem:{},
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
        if(enhancedElement.getAttribute('rel') === 'preload'){
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
     * @type {HTMLTemplateElement | undefined}
     */
    #externalTemplRef = undefined;
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async onTrue(self) {
        const { enhancedElement, transitional, cmtWrap } = self;
        if('value' in enhancedElement){
            enhancedElement.value = true;
        }else{
            enhancedElement.classList.remove('be-switched-off');
            enhancedElement.classList.add('be-switched-on');
        }

        if(this.#determineIfEmpty(enhancedElement)) return;


        const transitional2 = transitional || this.#transitional;
        if(cmtWrap){
            const {cmtWrapOnTrue} = await import('./cmtWrap.js');
            await cmtWrapOnTrue(self, transitional2);
        }else{
            const attr = `data-from-be-switched`;
            let contentToClone = enhancedElement.content;
            if(enhancedElement.getAttribute('rel') === 'preload' && enhancedElement.hasAttribute('src')){
                contentToClone = await (await import('mount-observer/getContent.js')).getContent(enhancedElement);
            }
            if(!wrappedContent.has(contentToClone)){
                if(contentToClone.childElementCount !== 1){
                    const parentLocalName = enhancedElement.parentElement?.localName;
                    let wrapperTag = 'div';
                    switch(parentLocalName){
                        case 'table':
                        case 'tbody':
                            wrapperTag = 'tbody';
                            break;
                        case 'thead':
                            wrapperTag = 'thead';
                            break;

                    }
                    const wrapper = document.createElement(wrapperTag);
                    wrapper.appendChild(contentToClone);
                    const fragment = new DocumentFragment();
                    fragment.appendChild(wrapper);
                    wrappedContent.set(contentToClone, fragment);
                }else{
                    wrappedContent.set(contentToClone, contentToClone);
                }
                wrappedContent.get(contentToClone)?.firstElementChild?.setAttribute(attr, 'true');
                
            }
            const ns = enhancedElement.nextElementSibling;
            if(ns instanceof Element && ns.hasAttribute(attr)){
                ns.classList.remove('be-switched-hide');
            }else{
                const clone = wrappedContent.get(contentToClone)?.cloneNode(true);
                if(clone === undefined) throw 500;
                if(!transitional2 || !document.startViewTransition){
                    enhancedElement.after(clone);
                }else{
                    document.startViewTransition(() => {
                        enhancedElement.after(clone);
                    });
                }
            }
        }

    }


    async onFalse(self) {
        const { enhancedElement, toggleInert, minMem, transitional, cmtWrap } = self;
        if('value' in enhancedElement){
            enhancedElement.value = false;
        }else{
            enhancedElement.classList.add('be-switched-off');
            enhancedElement.classList.remove('be-switched-on');
        }
        
        if(this.#determineIfEmpty(enhancedElement)) return;

        const transitional2 = transitional || this.#transitional;
        addStyle(self);

        if(cmtWrap){
            const {cmtWrapOnFalse} = await import('./cmtWrap.js');
            await cmtWrapOnFalse(self, transitional2);
        }else{
            const ns = enhancedElement.nextElementSibling;
            if(ns instanceof Element && ns.hasAttribute('data-from-be-switched')){
                ns.classList.add('be-switched-hide');
                // if(toggleInert){
                //     ns.inert = true;
                // }
            }
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
