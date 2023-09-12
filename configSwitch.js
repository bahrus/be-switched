import('be-value-added/be-value-added.js');
//almost identical to be-itmized/#addMicrodataEleemnt -- share?
export async function configSwitch(self) {
    const { enhancedElement, onSwitches } = self;
    const scope = enhancedElement.closest('[itemscope]');
    for (const onSwitch of onSwitches) {
        const { prop } = onSwitch;
        let itempropEls = Array.from(scope.querySelectorAll(`[itemprop="${prop}"]`)); //TODO check in donut
        if (itempropEls.length === 0) {
            const itempropEl = document.createElement('link');
            itempropEl.setAttribute('itemprop', prop);
            scope.appendChild(itempropEl);
        }
        // for(const itempropEl of itempropEls){
        //     (<any>itempropEl).beEnhanced.by.beValueAdded.value = itemVal;
        // }
    }
}
