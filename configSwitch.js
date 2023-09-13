import('be-value-added/be-value-added.js');
//almost identical to be-itemized/#addMicrodataElement -- share?
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
        onSwitch.signal = new WeakRef(beValueAdded);
        beValueAdded.addEventListener('value-changed', e => {
            checkSwitches(self);
        });
    }
    checkSwitches(self);
}
function checkSwitches(self) {
    const { onSwitches } = self;
    let foundOne = false;
    for (const onSwitch of onSwitches) {
        const { req } = onSwitch;
        if (foundOne && !req)
            continue;
        const ref = onSwitch.signal?.deref();
        if (ref === undefined) {
            console.warn({ onSwitch, msg: "Out of scope" });
            continue;
        }
        if (req) {
            if (!ref.value) {
                self.switchesSatisfied = false;
                return;
            }
        }
        else {
            if (ref.value)
                foundOne = true;
        }
    }
    self.switchesSatisfied = foundOne;
}
