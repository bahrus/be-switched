import { findRealm } from 'trans-render/lib/findRealm.js';
export async function getItemPropEl(enhancedElement, prop) {
    let itempropEl = await findRealm(enhancedElement, ['wis', prop]);
    if (itempropEl === null) {
        itempropEl = document.createElement('link');
        itempropEl.setAttribute('itemprop', prop);
        const scope = enhancedElement.closest('[itemscope]');
        if (scope === null)
            throw 404;
        scope.appendChild(itempropEl);
    }
    return itempropEl;
}
