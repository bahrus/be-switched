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
            onOn: {
                //ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['On', 'on'],
            },
            onOff: {
                //ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['Off', 'off'],
            },
        }
    };
    async onOn(self) {
        const { on, On } = self;
        console.log({ on, On });
        // const {parsedFrom} = self;
        // let parsed = prsOnCache.get(parsedFrom);
        // if(parsed === undefined){
        //     const {prsOn} = await import('../prsOn.js');
        //     parsed = await prsOn(self);
        //     prsOnCache.set(parsedFrom, parsed); 
        // }
        // return structuredClone(parsed);
        return {};
    }
    async onOff(self) {
        // const {parsedFrom} = self;
        // let parsed = prsOffCache.get(parsedFrom);
        // if(parsed === undefined){
        //     const {prsOn} = await import('../prsOn.js');
        //     parsed = await prsOn(self, true);
        //     prsOffCache.set(parsedFrom, parsed); 
        // }
        // return structuredClone(parsed);
        return {};
    }
}
