// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
import {Registry} from 'be-hive/Registry.js';
import {aggs} from 'be-hive/aggEvt.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-switched/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

const op = String.raw `(?<!\\)(?<op>(equals|eq|lt|gt))`;
const whenLHSPart = String.raw `when (?<lhsPart>.*)`;
const rhsPart = String.raw `(?<rhsPart>.*)`;
const onOrOffWhenLhsPartOpRhsPart = String.raw `^(?<onOrOff>(on|On|off|Off)) ${whenLHSPart} ${op} ${rhsPart}(, and set itemscope to ())?`;
//const onOrOffWhenLhsPartOpRhsPartWithin = String.raw `${onOrOffWhenLhsPartOpRhsPart}( w/i (?<within>.*))?`;
const onIfRegisteredHandlerBasedOnDependencies = String.raw `^on if (?<registeredHandler>.*)\, based on (?<dependencyPart>.*)`;
const onBasedOnDependencies = String.raw `^(o|O)n based on (?<dependencyPart>.*)`;
const onWhenIfPart = String.raw `^on when (?<ifPart>.*)`;
const onOnlyWhenIfPart = String.raw `^on only when (?<ifPart>.*)`;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-switched',
    branches: ['', 'js', 'transitional', 'min-mem', 'cmt-wrap'],
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                twoValueSwitches: [
                    {
                        regExp: onOrOffWhenLhsPartOpRhsPart,
                        defaultVals: {},
                        ipeKeys: [['lhsPart', 'lhsIPE'], ['rhsPart', 'rhsIPE']]
                    },

                ],
                nValueSwitches: [
                    {
                        regExp: onIfRegisteredHandlerBasedOnDependencies,
                        defaultVals: {},
                        ipeKeys: [['dependencyPart', 'dependencies']]
                    },
                    {
                        regExp: onBasedOnDependencies,
                        defaultVals: {},
                        ipeKeys: [['dependencyPart', 'dependencies']]
                    }
                ],
                singleValSwitches: [
                    {
                        regExp: onWhenIfPart,
                        defaultVals: {},
                        ipeKeys: [['ifPart', 'ipe']]
                    },
                    {
                        regExp: onOnlyWhenIfPart,
                        defaultVals: { req: true },
                        ipeKeys: [['ifPart', 'ipe']]
                    }
                ]
            }
        },
        '1.0': {
            instanceOf: 'String',
            mapsTo: 'js'
        },
        '2.0': {
            instanceOf: 'Boolean',
            mapsTo: 'transitional'
        },
        '3.0': {
            instanceOf: 'Boolean',
            mapsTo: 'minMem'
        },
    },
    enhPropKey: 'beSwitched',
    importEnh: async () => {
        const { BeSwitched } = await import('./be-switched.js');
        return BeSwitched;
    },
    mapEmcTo: 'emc',
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

for(const key in aggs){
    Registry.register(emc, key, aggs[key]);
}

/**
 * 
 * @param {string} handlerName 
 * @param {EventListenerOrFn} handler 
 */
export function register(handlerName, handler){
    Registry.register(emc, handlerName, handler);
}

/**
 * 
 * @param {CSSQuery} q 
 * @param {string} handlerName 
 * @param {EventListenerOrFn} handler 
 */
export function within(q, handlerName, handler){
    Registry.within(emc, q, handlerName, handler);
}
