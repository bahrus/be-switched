// @ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-switched/types' */
/** @import {RAConfig} from './types/roundabout/types' */
/** @import {PatternConfig} from './types/nested-regex-groups/types' */

/** @type {PatternConfig[]} */
const parsePatterns = [
    // Two-value comparisons: on/off when #lhs op #rhs
    // With event specifiers using @
    {
        name: 'twoValWithEvents',
        pattern: String.raw `^(?<onOrOff>on|off|On|Off)\s+when\s+(?<lhsPart>[^=<>!]+?)\s*(?<op>=|equals|eq|<|lt|>|gt|<=|lte|>=|gte)\s*(?<rhsPart>.+)$`,
        description: 'Two-value comparison: on/off when LHS op RHS'
    },
    // N-value with registered handler: on if handlerName, per dependencies
    {
        name: 'nValWithHandler',
        pattern: String.raw `^(?:on|On)\s+if\s+(?<registeredHandler>[^,]+),\s*per\s+(?<dependencyPart>.+)$`,
        description: 'N-value with registered handler: on if handler, per deps'
    },
    // N-value without handler: on per dependencies
    {
        name: 'nValPerDeps',
        pattern: String.raw `^(?:on|On)\s+per\s+(?<dependencyPart>.+)$`,
        description: 'N-value without handler: on per deps'
    },
    // Single-value boolean (with "only" = AND/required): on only when #ref
    {
        name: 'singleValOnly',
        pattern: String.raw `^(?<onOrOff>on|off|On|Off)\s+only\s+when\s+(?<ifPart>.+)$`,
        description: 'Single-value required condition: on only when ref',
        defaultVals: { req: 'true' }
    },
    // Single-value boolean: on/off when #ref
    {
        name: 'singleVal',
        pattern: String.raw `^(?<onOrOff>on|off|On|Off)\s+when\s+(?<ifPart>.+)$`,
        description: 'Single-value boolean condition: on/off when ref'
    },
];

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>}
 */
export const emc = {
    enhConfig: {
        enhKey: 'BeSwitched',
        spawn: 'be-switched/be-switched.js',
        withAttrs: {
            base: 'be-switched',
            _base: {
                mapsTo: 'parsedStatements',
                parser: 'parse-pattern-statements',
                instanceOf: 'Array',
                parserConfig: parsePatterns
            },
            js: '${base}-js',
            _transitional: {
                instanceOf: 'Boolean'
            },
            as: '${base}-as',
            _minMem: {
                instanceOf: 'Boolean'
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            hydrate: {
                ifAllOf: ['parsedStatements', 'enhancedElement']
            },
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
            },
            processJS: {
                ifAllOf: ['js', 'notProcessedJS', 'enhancedElement']
            }
        },
        compacts: {
            echo_val_to_echoVal: 20,
        },
        defaultPropVals: {
            beBoolish: true,
            hiddenStyle: 'display:none',
            lhs: false,
            rhs: true,
            singleValSwitchesSatisfied: false,
            singleValSwitchNoGo: false,
            twoValSwitchesSatisfied: false,
            twoValSwitchNoGo: false,
            notProcessedJS: true,
            idRefAttr: 'data-be-switched-idrefs',
        }
    }
};

export function render() {
    return JSON.stringify(emc, null, 4);
}

console.log(render());
