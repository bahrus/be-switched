// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
import {Registry} from 'be-hive/Registry.js';
import {aggs} from 'be-hive/aggEvt.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-switched/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

//const base = 'be-switched';
const op = String.raw `(?<!\\)(?<op>(equals|eq|lt|gt))`;
const whenLHSPart = String.raw `when (?<lhsPart>.*)`;
const rhsPart = String.raw `(?<rhsPart>.*)`;
//const rhsPartAsRhsType = String.raw `${rhsPart} as (?<rhsType>(number|boolean|string))`;
const onWhenLhsPartOpRhsPart = String.raw `^on ${whenLHSPart} ${op} ${rhsPart}`;
const onWhenLhsPartOpRhsPartWithin = String.raw `${onWhenLhsPartOpRhsPart} w/i (?<within>.*)`;
//const onWhenLhsPartOpRhsPartAsRhsType = String.raw `^on ${whenLHSPart} ${op} ${rhsPartAsRhsType}`;
const offWhenLhsPartOpRhsPart = String.raw `^off ${whenLHSPart} ${op} ${rhsPart}`;
const onIfRegisteredHandlerBasedOnDependencies = String.raw `^on if (?<registeredHandler>.*)\, based on (?<dependencyPart>.*)`;
const onBasedOnDependencies = String.raw `^on based on (?<dependencyPart>.*)`;
const onWhenIfPart = String.raw `^on when (?<ifPart>.*)`;
const onOnlyWhenIfPart = String.raw `^on only when (?<ifPart>.*)`;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-switched',
    branches: ['', 'js'],
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                twoValueSwitches: [
                    {
                        regExp: onWhenLhsPartOpRhsPartWithin,
                        defaultVals: {},
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier'], ['within', 'withinSpecifier']]
                    },
                    {
                        regExp: onWhenLhsPartOpRhsPart,
                        defaultVals: {},
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier']]
                    },
                    {
                        regExp: offWhenLhsPartOpRhsPart,
                        defaultVals: { negate: true },
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier']]
                    }
                ],
                nValueSwitches: [
                    {
                        regExp: onIfRegisteredHandlerBasedOnDependencies,
                        defaultVals: {},
                        dssArrayKeys: [['dependencyPart', 'dependencies']]
                    },
                    {
                        regExp: onBasedOnDependencies,
                        defaultVals: {},
                        dssArrayKeys: [['dependencyPart', 'dependencies']]
                    }
                ],
                singleValSwitches: [
                    {
                        regExp: onWhenIfPart,
                        defaultVals: {},
                        dssKeys: [['ifPart', 'specifier']]
                    },
                    {
                        regExp: onOnlyWhenIfPart,
                        defaultVals: { req: true },
                        dssKeys: [['ifPart', 'specifier']]
                    }
                ]
            }
        },
        '1.0': {
            instanceOf: 'String',
            mapsTo: 'js'
        }
    },
    enhPropKey: 'beSwitched',
    importEnh: async () => {
        const { BeSwitched } = await import('./be-switched.js');
        return BeSwitched;
    }
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
