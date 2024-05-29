import { BE } from 'be-enhanced/BE.js';
export class BeSwitched extends BE {
    static config = {
        propInfo: {
            // on: {},
            // On: {},
            // off: {},
            // Off: {}
            twoValueSwitches: {},
        },
        actions: {
            onTwoValSwitches: {
                ifAllOf: ['twoValueSwitches']
            }
        }
    };
    async onTwoValSwitches(self) {
        const { twoValueSwitches } = self;
        console.log({ twoValueSwitches });
    }
}
