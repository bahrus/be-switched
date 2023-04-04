import {Actions, PP, PPP, PPPP, CanonicalConfig} from './types';
export class BeSwitched extends EventTarget implements Actions {

    async camelToCanonical(pp: PP): PPPP {
        const canonicalConfig: CanonicalConfig = {
            links: []
        };

        return {
            canonicalConfig
        };
    }

    async onCanonical(pp: PP, mold: PPP): PPPP {
        return mold;
    }
}