/** @import {BAP, Actions} from './ts-refs/be-switched/types' */;

/**
 * 
 * @param {BAP} self 
 * @param {boolean} transitional 
 */
export async function cmtWrapOnTrue(self, transitional){
    const {wrap, wrapped} = await import('mount-observer/slotkin/wrap.js');
    const wrappedVal = enhancedElement[wrapped];
    if(!wrappedVal){
        const {getCount} = await import('trans-render/dss/tref/getCount.js');
        wrap(enhancedElement, `${base}-${getCount(base)}`, true) ;
    }
    const {getFrag} = await import('mount-observer/slotkin/getFrag.js');
    const children = getFrag(enhancedElement, wrappedVal);

    if(children === null){
        let templToClone = enhancedElement;
        const externalRefId = templToClone.dataset.blowDryRef;
        if (externalRefId){
            templToClone = window[externalRefId];
        }
        const clone = templToClone.content.cloneNode(true);
        if(!transitional2 || !document.startViewTransition){
            enhancedElement.after(clone);
        }else{
            document.startViewTransition(() => {
                enhancedElement.after(clone);
            });
        } 
    }else{
        const elChildren = /** @type {Array<HTMLElement>} */ (children.filter(x => x instanceof HTMLElement));
        if(!transitional2 || !document.startViewTransition){
            changeVisibility(elChildren, toggleInert, 'remove');
        }else{
            document.startViewTransition(() => {
                changeVisibility(elChildren, toggleInert, 'remove');
            })
        }
    }
}

/**
 * 
 * @param {Array<Element>} children 
 * @param {boolean | undefined} toggleInert 
 * @param {'add' | 'remove'} verb 
 */
function changeVisibility(children, toggleInert, verb){
    const disable = verb === 'remove' ? true : false;
    for (const child of children) {
        child.classList[verb]('be-switched-hide');
        if (toggleInert && 'disabled' in child && child.disabled === !disable) {
            child.disabled = disable;
        }
    }
}