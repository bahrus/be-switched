import {findRealm} from 'trans-render/lib/findRealm.js';
export async function getItemPropEl(enhancedElement: Element, prop: string){
    let itempropEl= await findRealm(enhancedElement, ['wis', prop])  as HTMLLinkElement;
    if(itempropEl === null){
        itempropEl = document.createElement('link');
        itempropEl.setAttribute('itemprop', prop!);
        const scope = enhancedElement.closest('[itemscope]');
        if(scope === null) throw 404;
        scope.appendChild(itempropEl);
    }
    return itempropEl;
}