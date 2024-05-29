import { BE } from 'be-enhanced/BE.js';
export class BeSwitched extends BE {
    static config = {
        propInfo: {
            twoValueSwitches: {},
        },
        actions: {
            onTwoValSwitches: {
                ifAllOf: ['twoValueSwitches']
            }
        }
    };
    async onTwoValSwitches(self) {
        const { doTwoValSwitch } = await import('./doTwoValSwitch.js');
        doTwoValSwitch(self);
    }
}
