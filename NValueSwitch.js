// @ts-check
/** @import {BAP} from './ts-refs/be-switched/types' */;
/** @import {EnhancementInfo, EventListenerOrFn} from  './ts-refs/trans-render/be/types'*/
/** @import {AbsorbingObject} from './ts-refs/trans-render/asmr/types' */

import { AggEvent, rguid } from 'be-hive/aggEvt.js';
export class NValueSwitch {
    /**
     * @type {BAP}
     */
    self;
    /**
     * @type {EnhancementInfo}
     */
    enhancementInfo;
    /**
     * 
     * @param {BAP} self 
     * @param {EnhancementInfo} enhancementInfo 
     */
    constructor(self, enhancementInfo) {
        this.self = self;
        this.enhancementInfo = enhancementInfo;
        this.do(self);
    }
    /**
     * @type {{[key: string]: AbsorbingObject} | undefined}
     */
    #propToAO;
    /**
     * @type {EventListenerOrFn | undefined}
     */
    #handlerObj;
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async do(self) {
        const { find } = await import('trans-render/dss/find.js');
        const { ASMR } = await import('trans-render/asmr/asmr.js');
        const { nValueSwitches } = self;
        if (nValueSwitches === undefined || nValueSwitches.length > 1)
            throw 'NI';
        const nValueSwitch = nValueSwitches[0];
        const { dependencies, registeredHandler } = nValueSwitch;
        const { enhancedElement } = self;
        const { synConfig, mountCnfg } = this.enhancementInfo;
        const { enhPropKey } = mountCnfg;
        const { registeredHandlers, scopedHandlers } = await import('be-hive/be-hive.js');
        const scopedCluster = scopedHandlers.get(synConfig.top);
        if (scopedCluster === undefined)
            throw 404;
        const scopedCustomHandlers = scopedCluster.get(enhPropKey);
        if (scopedCustomHandlers === undefined) {
            console.warn(404);
            return;
        }
        //this.#scopedHandlers = scopedCustomHandlers;
        let scopedHandlerObj = scopedCustomHandlers.get(registeredHandler);
        let handlerObj;
        if (scopedHandlerObj !== undefined) {
            for (const item of scopedHandlerObj) {
                if (enhancedElement.closest(item[0])) {
                    handlerObj = item[1];
                    break;
                }
            }
        }
        if (handlerObj === undefined) {
            const cluster = registeredHandlers.get(synConfig.top);
            if (cluster === undefined)
                throw 404;
            const handlers = cluster.get(enhPropKey);
            if (handlers === undefined) {
                throw 404;
            }
            //this.#customHandlers = handlers;
            handlerObj = handlers.get(registeredHandler);
        }
        if (handlerObj === undefined)
            throw 404;
        if (handlerObj.toString().substring(0, 5) === 'class') {
            handlerObj = new handlerObj();
        }
        this.#handlerObj = handlerObj;
        /**
         * @type {{[key: string]: AbsorbingObject}}
         */
        const propToAO = {};
        for (const dependency of dependencies) {
            const remoteEl = await find(enhancedElement, dependency);
            if (!(remoteEl instanceof Element))
                continue;
            const { prop } = dependency;
            if (prop === undefined)
                throw 'NI';
            const ao = await ASMR.getAO(remoteEl, {
                evt: dependency.evt || 'input',
                selfIsVal: dependency.path === '$0',
            });
            propToAO[prop] = ao;
        }
        this.#propToAO = propToAO;
        const ac = this.#ac = new AbortController();
        const aos = Object.values(propToAO);
        for (const ao of aos) {
            ao.addEventListener('.', this, { signal: ac.signal });
        }
        this.handleEvent();
    }
    #ac;
    async handleEvent() {
        const self = this.self;
        const { enhancedElement } = self;
        const obj = {};
        const args = [];
        for (const prop in this.#propToAO) {
            const ao = this.#propToAO[prop];
            const val = await ao.getValue();
            args.push(val);
            obj[prop] = val;
        }
        const event = new SwitchEvent(args, obj, enhancedElement);
        const handlerObj = this.#handlerObj;
        if (handlerObj !== undefined) {
            if ('handleEvent' in handlerObj) {
                handlerObj.handleEvent(event);
            }
            else {
                handlerObj(event);
            }
        }
        self.channelEvent(event);
        if (event.r !== rguid) {
            self.switchesSatisfied = !!event.r;
        }
    }
    disconnect() {
        if (this.#ac !== undefined) {
            this.#ac.abort();
        }
        ;
    }
}
export class SwitchEvent extends AggEvent {
    static eventName = 'be-switched';

    /**
     *
     * @param {Array<any>} args
     * @param {{[key: string]: any}} f
     * @param {Element} target
     */
    constructor(args, f, target) {
        super(SwitchEvent.eventName, args, f, target);
    }
}
