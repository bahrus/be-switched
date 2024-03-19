export async function doElevate(self, elevate, switchOn) {
    const { enhancedElement } = self;
    const { to, val } = elevate;
    if (to !== undefined) {
        const { prsElO } = await import('trans-render/lib/prs/prsElO.js');
        const parsed = prsElO(to);
        const { prop, elType, subProp } = parsed;
        const { Side: Seeker } = await import('./Side.js');
        const s = new Side(false, undefined, prop, elType);
        const signalAndEvent = await s.do(self, 'on', enhancedElement);
        if (signalAndEvent === undefined)
            throw 404;
        const { signal } = signalAndEvent;
        const ref = signal?.deref();
        if (ref === undefined)
            return;
        const valToSet = typeof val === 'undefined' ? switchOn : val;
        if (subProp !== undefined) {
            const { setProp } = await import('trans-render/lib/setProp.js');
            setProp(ref, `${prop}.${subProp}`, valToSet);
        }
        else {
            ref[prop] = valToSet;
        }
    }
}
