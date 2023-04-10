import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from "be-hive/register.js";
import {Actions, PP, PPP, PPPP, CanonicalConfig, Proxy, CamelConfig} from './types';
export class BeSwitched extends EventTarget implements Actions {

    async camelToCanonical(pp: PP): PPPP {
        const {camelConfig, self} = pp;
        const {arr} = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig: CanonicalConfig = {
            links: []
        };
        const {links} = canonicalConfig;
        for(const cc of camelConfigArr){
            const {Check, Map, On} = cc;
        }
        return {
            canonicalConfig
        };
    }

    async onCanonical(pp: PP, mold: PPP): PPPP {
        const {} = pp;
        return mold;
    }

    
}

const tagName = 'be-switched';
const ifWantsToBe = 'switched';
const upgrade = 'template';

define<Proxy & BeDecoratedProps<Proxy, Actions, CamelConfig>, Actions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['camelConfig', 'canonicalConfig'],
            primaryProp: 'camelConfig',
            parseAndCamelize: true,
            camelizeOptions: {

            }
        }
    },
    complexPropDefaults: {
        controller: BeSwitched
    }
});

register(ifWantsToBe, upgrade, tagName);