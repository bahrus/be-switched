import { BeHive } from 'be-hive/be-hive.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
const base = 'be-switched';
const op = String.raw `(?<!\\)(?<op>(equals|eq|lt|gt))`;
const onWhenLhsPartOpRhsPart = String.raw `^on when (?<lhsPart>.*) ${op} (?<rhsPart>.*)`;
const offWhenLhsPartOpRhsPart = String.raw `^off when (?<lhsPart>.*) ${op} (?<rhsPart>.*)`;
export const emc = {
    base,
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                twoValueSwitches: [
                    {
                        regExp: onWhenLhsPartOpRhsPart,
                        defaultVals: {}
                    },
                    {
                        regExp: offWhenLhsPartOpRhsPart,
                        defaultVals: { negate: true }
                    }
                ]
            }
        }
    },
    enhPropKey: 'beSwitched',
    importEnh: async () => {
        const { BeSwitched } = await import('./behance.js');
        return BeSwitched;
    }
};
const mose = document.createElement('script');
mose.id = base;
mose.synConfig = emc;
MountObserver.synthesize(document, BeHive, mose);
