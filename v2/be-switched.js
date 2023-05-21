import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeSwitched extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig, self } = pp;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            links: []
        };
        const { links } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Check, Map, On } = cc;
            if (On !== undefined) {
                const { doOn } = await import('./doOn.js');
                await doOn(cc, links, pp);
            }
            if (Check !== undefined) {
                const { doCheck } = await import('./doCheck.js');
                await doCheck(cc, links, pp);
            }
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(pp, mold) {
        const { canonicalConfig } = pp;
        const { links } = canonicalConfig;
        if (links !== undefined) {
            const { pass } = await import('be-linked/pass.js');
            for (const link of links) {
                await pass(pp, link);
            }
        }
        return mold;
    }
    evaluateConditions(pp) {
    }
}
const tagName = 'be-switched';
const ifWantsToBe = 'switched';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: [upgrade],
            virtualProps: ['camelConfig', 'canonicalConfig', 'conditions', 'value'],
            primaryProp: 'camelConfig',
            parseAndCamelize: true,
            camelizeOptions: {},
            primaryPropReq: true,
        },
        actions: {
            camelToCanonical: 'camelConfig',
            onCanonical: {
                ifAllOf: ['canonicalConfig', 'camelConfig'],
                returnObjMold: {
                    resolved: true,
                }
            }
        }
    },
    complexPropDefaults: {
        controller: BeSwitched
    }
});
register(ifWantsToBe, upgrade, tagName);
