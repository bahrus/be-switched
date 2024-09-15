import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import { Positractions, PropInfo } from './ts-refs/trans-render/froop/types';
import {IEnhancement,  BEAllProps, EnhancementInfo} from './ts-refs/trans-render/be/types';

let cnt = 0;
class BeSwitched extends BE<AP, Actions, HTMLTemplateElement> implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{
            hiddenStyle: 'display:none',
            lhs: false,
            rhs: true,
            singleValSwitchesSatisfied: false,
            singleValSwitchNoGo: false,
            twoValSwitchesSatisfied: false,
            twoValSwitchNoGo: false,
        },
        propInfo:{
            ...beCnfg.propInfo,
            twoValueSwitches: {},
            switchesSatisfied: {},
            val: {},
            echoVal: {},
            nValueSwitches: {},
            rawStatements: {},
            singleValSwitches: {},
        },
        compacts:{
            echo_val_to_echoVal: 20,
            when_singleValSwitches_changes_invoke_onSingleValSwitches: 0,
            when_twoValueSwitches_changes_invoke_onTwoValSwitches: 0,
            when_rawStatements_changes_invoke_onRawStatements: 0,
            when_nValueSwitches_changes_invoke_onNValSwitches: 0,
        },
        actions:{
            onTrue: {
                ifEquals: ['val', 'echoVal'],
                ifAllOf: ['val']
            },
            onFalse: {
                ifEquals: ['val', 'echoVal'],
                ifNoneOf: ['val']
            },
            calcSwitchesSatisfied:{
                ifKeyIn: ['singleValSwitchNoGo', 'singleValSwitchesSatisfied', 'twoValSwitchNoGo', 'twoValSwitchesSatisfied']
            },
            calcVal: {
                ifKeyIn: ['lhs', 'rhs', 'switchesSatisfied']
            },

        },
        positractions: [
            ...beCnfg.positractions!,
        ]
    }
    #enhKey: string | undefined;
    #enhancementInfo: EnhancementInfo;
    override async attach(el: HTMLTemplateElement, enhancementInfo: EnhancementInfo){
        this.#enhKey = enhancementInfo.mountCnfg?.enhPropKey;
        this.#enhancementInfo = enhancementInfo;
        super.attach(el, enhancementInfo);
    }
    async onSingleValSwitches(self: this): Promise<void> {
        const {SingleValSwitchHandler} = await import('./SingleValSwitchHandler.js');
        new SingleValSwitchHandler(self);
        //doSingleValSwitch(self);
    }

    async onTwoValSwitches(self: this){
        const {doTwoValSwitch} = await import('./TwoValSwitchHandler.js');
        doTwoValSwitch(self);
    }

    async onNValSwitches(self: this){
        const {NValueSwitch} = await import('./NValueSwitch.js');
        new NValueSwitch(self, this.#enhancementInfo);
    }

    calcVal(self: this): PAP {
        const {
            lhs, rhs, checkIfNonEmptyArray, beBoolish, switchesSatisfied, twoValueSwitches,
            nValueSwitches, singleValSwitches
        } = self;
        //console.log({switchesSatisfied});
        if(twoValueSwitches !== undefined || nValueSwitches !== undefined || singleValSwitches !== undefined){
            return {
                val: switchesSatisfied,
                resolved: true,
            }
        }
        if(beBoolish && typeof lhs === 'boolean' || typeof rhs === 'boolean'){
            let lhsIsh = !!lhs;
            let rhsIsh = !!rhs;
            if(checkIfNonEmptyArray){
                if(typeof lhs !== 'boolean'){
                    lhsIsh = !Array.isArray(lhs) || lhs.length === 0;
                }
                if(typeof rhs !== 'boolean'){
                    rhsIsh = !Array.isArray(rhs) || rhs.length === 0;
                }
            }
            return {
                val: lhsIsh === rhsIsh,
                resolved: true
            }
        }
        if(checkIfNonEmptyArray){
            
            if(!Array.isArray(lhs) || lhs.length === 0) return {
                val: false,
                resolved: true,
            }
        }
        return {
            val: lhs === rhs,
            resolved: true,
        }
    }

    calcSwitchesSatisfied(self: this): Partial<AllProps> {
        const {singleValSwitchNoGo, singleValSwitchesSatisfied, twoValSwitchNoGo, twoValSwitchesSatisfied} = self;
        return {
            switchesSatisfied: !singleValSwitchNoGo && !twoValSwitchNoGo && (singleValSwitchesSatisfied || twoValSwitchesSatisfied),
        }
    }

    async onTrue(self: this) {
        const {enhancedElement, toggleInert: toggleDisabled, deferRendering} = self;
        const itemref= enhancedElement.getAttribute('itemref');
        if(itemref === null){
            const keys : string[] = [];
            let templToClone = enhancedElement;
            const externalRefId = templToClone.dataset.blowDryRef;
            if(externalRefId) templToClone = (<any>window)[externalRefId];
            const {tagTempl} = await import('trans-render/dss/tref/tagTempl.js');
            tagTempl(templToClone, this.#enhKey!);
        }else{
            if(deferRendering){
                self.deferRendering = false;
                return;
            }
            const {getChildren} = await import('trans-render/dss/tref/getChildren.js');
            const children = getChildren(enhancedElement, enhancedElement.getAttribute('itemref')!);
            for(const child of children){
                child.classList.remove('be-switched-hide');
                if(toggleDisabled && (<any>child).disabled === false){
                    (<any>child).disabled = true;
                }
            }
        }
    }

    async onFalse(self: this){
        const {enhancedElement, toggleInert, minMem} = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if(itemref === null) return;
        addStyle(self);
        const rn = enhancedElement.getRootNode() as DocumentFragment;
        const keys = itemref.split(' ');
        for(const key of keys){
            const child = rn.getElementById(key);
            if(child === null) continue;
            if(minMem) {
                child.remove();
            }else{
                child.classList.add('be-switched-hide');
                if(toggleInert && !child.inert){
                    child.inert = true;
                }
            }

        }
        if(minMem) enhancedElement.removeAttribute('itemref');
    }

    onRawStatements(self: this): void {
        const {rawStatements} = self;
        console.error('The following statements could not be parsed.', rawStatements);
        
    }
    
}

const styleMap = new WeakSet<Node>();

function addStyle(ap: AP){
    const {enhancedElement, hiddenStyle} = ap;
    let rootNode = enhancedElement.getRootNode();
    if ((<any>rootNode).host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        style.innerHTML = /* css */`
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}

interface BeSwitched extends AllProps{}

await BeSwitched.bootUp();

export {BeSwitched}