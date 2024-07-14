import {AP, Elevate} from './types';

export async function doElevate(self: AP, elevate: Elevate, switchOn: boolean | undefined){
    const {enhancedElement} = self;
    const {to, val} = elevate;
    if(to !== undefined){
        const {parse} = await import('trans-render/dss/parse.js');
        const parsed = await parse(to);
        const {prop, path} = parsed;
        //const {prop, elType, subProp} = parsed;
        const {SideSeeker} = await import('./SideSeeker.js');
        const s = new SideSeeker(
            parsed,
            undefined,
            
        );
        const signalAndEvent = await s.do(self, 'on', enhancedElement);
        if(signalAndEvent === undefined) throw 404;
        const {signal} = signalAndEvent;
        const ref = signal?.deref() as any;
        if(ref === undefined) return;
        const valToSet = typeof val === 'undefined' ? switchOn : val;
        if(path !== undefined){
            const {setProp} = await import('trans-render/lib/setProp.js');
            setProp(ref, `${prop}.${path}`, valToSet);
        }else{
            ref[prop!] = valToSet
        }
        
    }

}