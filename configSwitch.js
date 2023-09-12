import('be-value-added/be-value-added.js');
//almost identical to be-itmized/#addMicrodataEleemnt -- share?
export async function configSwitch(self) {
    const { enhancedElement, onSwitches } = self;
    const scope = enhancedElement.closest('[itemscope]');
    for (const onSwitch of onSwitches) {
        const { prop } = onSwitch;
        let itempropEl = scope.querySelector(`[itemprop="${prop}"]`); //TODO check in donut
        if (itempropEl === null) {
            itempropEl = document.createElement('link');
            itempropEl.setAttribute('itemprop', prop);
            scope.appendChild(itempropEl);
        }
        const beValueAdded = await itempropEl.beEnhanced.whenResolved('be-value-added');
        if (beValueAdded.value) {
            self.anySwitchIsOn = true;
            return;
        }
        beValueAdded.addEventListener('value-changed', e => {
            console.log(e);
        });
        // for(const itempropEl of itempropEls){
        //     (<any>itempropEl).beEnhanced.by.beValueAdded.value = itemVal;
        // }
    }
}
