import {BeHive, EMC, seed} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';
import {AP} from './types'

const base = 'be-switched';
const op = String.raw `(?<!\\)(?<op>(equals|eq|lt|gt))`;
const whenLHSPart = String.raw `when (?<lhsPart>.*)`;
const rhsPart = String.raw `(?<rhsPart>.*)`;
const rhsPartAsRhsType = String.raw `${rhsPart} as (?<rhsType>(number|boolean|string))`;
const onWhenLhsPartOpRhsPart = String.raw `^on ${whenLHSPart} ${op} ${rhsPart}`;
const onWhenLhsPartOpRhsPartAsRhsType = String.raw `^on ${whenLHSPart} ${op} ${rhsPartAsRhsType}`;
const offWhenLhsPartOpRhsPart = String.raw `^off ${whenLHSPart} ${op} ${rhsPart}`;
const onDependencies = String.raw `^on depending on (?<dependencyPart>.*)`;
const onWhenIfPart = String.raw `^on when (?<ifPart>.*)`;
const onOnlyWhenIfPart = String.raw `^on only when (?<ifPart>.*)`;
export const emc: EMC<AP> = {
    base,
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                twoValueSwitches: [
                    {
                        regExp: onWhenLhsPartOpRhsPartAsRhsType,
                        defaultVals:{},
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier']]
                    },
                    {
                        regExp: onWhenLhsPartOpRhsPart,
                        defaultVals:{},
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier']]
                    },
                    {
                        regExp: offWhenLhsPartOpRhsPart,
                        defaultVals:{negate: true},
                        dssKeys: [['lhsPart', 'lhsSpecifier'], ['rhsPart', 'rhsSpecifier']]
                    }
                ],
                nValueSwitches: [
                    {
                        regExp: onDependencies,
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
                        defaultVals: {req: true},
                        dssKeys: [['ifPart', 'specifier']]
                    }
                ]
            }
        }
    },
    enhPropKey: 'beSwitched',
    importEnh: async () => {
        const {BeSwitched} = await import('./be-switched.js');
        return BeSwitched;
    }
};

const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);