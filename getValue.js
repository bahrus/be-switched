export function getValue(obj) {
    if (obj instanceof HTMLElement) {
        if ('value' in obj) {
            return obj.value;
        }
        //TODO:  hyperlinks
        return obj.textContent;
    }
    else {
        return obj.value;
    }
}
