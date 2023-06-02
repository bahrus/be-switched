import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import { IEchoTo } from '../xtal-element/types';

export class BeSwitched extends BE<AP, Actions, HTMLTemplateElement> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
        } as BEConfig
    }

    calcVal(self: this): PAP {
        const {lhs, rhs, checkIfNonEmptyArray, beBoolish} = self;
        if(checkIfNonEmptyArray){
            if(!Array.isArray(lhs) || lhs.length === 0) return {
                val: false,
                resolved: true,
            }
        }
        if(beBoolish && typeof lhs === 'boolean' || typeof rhs === 'boolean'){
            return {
                val: !!lhs === !!rhs,
                resolved: true
            }
        }
        return {
            val: lhs === rhs,
            resolved: true,
        }
    }

    async onTrue(self: this) {
        const {enhancedElement, toggleDisabled, deferRendering} = self;
        const itemref= enhancedElement.getAttribute('itemref');
        if(itemref === null){
            const keys : string[] = [];
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            const appendedChildren = insertAdjacentTemplate(enhancedElement, enhancedElement, 'afterend');
            for(const child of appendedChildren){
                if(!child.id){
                    child.id = 'a' + crypto.randomUUID();
                }
                keys.push(child.id);
            }
            enhancedElement.setAttribute('itemref', keys.join(' '));
            if(!enhancedElement.hasAttribute('itemscope')) enhancedElement.setAttribute('itemscope', '');
        }else{
            if(deferRendering){
                self.deferRendering = false;
                return;
            }
            const rn = enhancedElement.getRootNode() as DocumentFragment;
            const keys = itemref.split(' ');
            for(const key of keys){
                const child = rn.getElementById(key);
                if(child === null) continue;
                child.classList.remove('be-switched-hide');
                if(toggleDisabled && (<any>child).disabled === false){
                    (<any>child).disabled = true;
                }
            }
        }
    }
    async onFalse(self: this){
        const {enhancedElement, toggleDisabled} = self;
        const itemref = enhancedElement.getAttribute('itemref');
        if(itemref === null) return;
        addStyle(self);
        const rn = enhancedElement.getRootNode() as DocumentFragment;
        const keys = itemref.split(' ');
        for(const key of keys){
            const child = rn.getElementById(key);
            if(child === null) continue;
            child.classList.add('be-switched-hide');
            if(toggleDisabled && (<any>child).disabled === false){
                (<any>child).disabled = true;
            }
        }
    }

    #mql: MediaQueryList | undefined;
    addMediaListener(self: this){
        const { ifMediaMatches, enhancedElement} = self;
        if(!ifMediaMatches) return [{}, {}] as POA; //clears previous listener
        this.#mql = window.matchMedia(ifMediaMatches! as string); //TODO:  support observant media matches
        return [{}, {chkMedia: {on: 'change', of: this.#mql, doInit: true}}] as POA;
    }

    chkMedia(self: this, e: MediaQueryListEvent){
        return {matchesMediaQuery: e.matches} as PAP;
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

export interface BeSwitched extends AllProps{}

const tagName = 'be-switched';
const ifWantsToBe = 'switched';
const upgrade = '*';

const xe = new XE<AP, Actions>({
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
            beBoolish: true,
        },
        propInfo: {
            ...propInfo,
            val: {
                notify: {
                    echoTo: {
                        key: 'echoVal',
                        delay: 'displayDelay'
                    } as IEchoTo<AP>
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
                ifKeyIn:  ['ifMediaMatches']
            }
        }
    },
    superclass: BeSwitched
});

register(ifWantsToBe, upgrade, tagName);