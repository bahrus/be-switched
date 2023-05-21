import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import { IEchoTo } from '../../xtal-element/types';

export class BeSwitched extends BE<AP, Actions, HTMLTemplateElement> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
        } as BEConfig
    }

    calcVal(self: this): PAP {
        const {lhs, rhs} = self;
        return {
            val: lhs === rhs,
            resolved: true,
        }
    }

    async onTrue(self: this) {
        const {enhancedElement} = self;
        const itemref= enhancedElement.getAttribute('itemref');
        if(itemref === null){
            const keys : string[] = [];
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            const appendedChildren = insertAdjacentTemplate(enhancedElement, enhancedElement, 'afterend');
            for(const child of appendedChildren){
                if(!child.id){
                    child.id = crypto.randomUUID();
                }
                keys.push(child.id);
            }
            enhancedElement.setAttribute('itemref', keys.join(' '));
        }
    }
    async onFalse(self: this){

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
            doMainOnTrue: {
                ifEquals: ['val', 'echoVal'],
                ifAllOf: ['val']
            }
        }
    },
    superclass: BeSwitched
});

register(ifWantsToBe, upgrade, tagName);