import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import { IEchoTo } from '../xtal-element/types';

const cache = new Map<string, {}>();
const prsOnCache = new Map<string, {}>();
const prsOffCache = new Map<string, {}>();
export class BeSwitched extends BE<AP, Actions, HTMLTemplateElement> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
            //primaryProp: 'camelConfig',
            cache,
            //primaryPropReq: true,
            parseAndCamelize: true,
            camelizeOptions:{

            },
            isParsedProp: 'isParsed'
        } as BEConfig
    }

    calcVal(self: this): PAP {
        const {lhs, rhs, checkIfNonEmptyArray, beBoolish, On, switchesSatisfied, on, Off, off} = self;
        //console.log({switchesSatisfied});
        if((On || on || Off || off) !== undefined){
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

    async onTrue(self: this) {
        const {enhancedElement, toggleInert: toggleDisabled, deferRendering} = self;
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

    async onOn(self: this): ProPAP {
        const {parsedFrom} = self;
        let parsed = prsOnCache.get(parsedFrom);
        if(parsed === undefined){
            const {prsOn} = await import('./prsOn.js');
            parsed = await prsOn(self);
            prsOnCache.set(parsedFrom, parsed); 
        }
        return structuredClone(parsed);
    }

    async onOff(self: this): ProPAP {
        const {parsedFrom} = self;
        let parsed = prsOffCache.get(parsedFrom);
        if(parsed === undefined){
            const {prsOff} = await import('./prsOff.js');
            parsed = await prsOff(self);
            prsOffCache.set(parsedFrom, parsed); 
        }
        return structuredClone(parsed);
    }

    async onOnBinarySwitches(self: this): Promise<void> {
        const {doBinSwitch} = await import('./doBinSwitch.js');
        doBinSwitch(self, 'on');
    }

    async onTwoValSwitches(self: this): Promise<void> {
        const {doTwoValSwitch} = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self, 'on');
    }

    async onOffBinarySwitches(self: this): Promise<void> {
        const {doBinSwitch} = await import('./doBinSwitch.js');
        doBinSwitch(self, 'off');
    }

    async offTwoValSwitches(self: this): Promise<void> {
        const {doTwoValSwitch} = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self, 'off');
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
                    } as IEchoTo<AP>
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
                ifKeyIn:  ['ifMediaMatches']
            },
            onOn: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['On', 'on'],
            },
            onOff:{
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['Off', 'off'],
            },
            onOnBinarySwitches: 'onBinarySwitches',
            onTwoValSwitches: 'onTwoValueSwitches',
            onOffBinarySwitches: 'offBinarySwitches',
            offTwoValSwitches: 'offTwoValueSwitches',
        }
    },
    superclass: BeSwitched
});

register(ifWantsToBe, upgrade, tagName);