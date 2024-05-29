import {BeHive, EnhancementMountCnfg} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';
import {AP} from './types'

const base = 'be-switched';
const op = String.raw `(?<!\\)(?<op>(equals|eq|lt|gt))`;

const onWhenLhsPartOpRhsPart = String.raw `^on when (?<lhsPart>.*) ${op} (?<rhsPart>.*)`;
const offWhenLhsPartOpRhsPart = String.raw `^off when (?<lhsPart>.*) ${op} (?<rhsPart>.*)`;
export const emc: EnhancementMountCnfg<AP> = {
    base,
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                twoValueSwitches: [
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
                ]
            }
        }
    },
    enhPropKey: 'beSwitched',
    importEnh: async () => {
        const {BeSwitched} = await import('./behance.js');
        return BeSwitched;
    }
};

const mose = document.createElement('script') as MOSE<EnhancementMountCnfg>;
mose.id = base;
mose.synConfig = emc;

MountObserver.synthesize(document, BeHive, mose);