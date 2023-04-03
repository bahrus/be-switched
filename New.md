
```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='{
        "if": true,
        "lhs": {"observe": "largest-scale:has(>woman-with-carrot-attached-to-nose", "vft": true},
        "op": "===",
        "rhs": {"observe": "largest-scale:has(>a-duck)", "vft": true},
    }'><div>A witch!</div></template>
</ways-of-science>
```

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs.
        Link value property of previous largest-scale element having inner a-duck element to rhs.
        Make visible when lhs = rhs.
        Defer rendering.
    '>
        <div>A witch!</div>
    </template>
</ways-of-science>
```

```html
<input part=phone-number>
<input part=phone-number-confirm>
<template be-switched='
{
    "declare": {
        "wideDevice": "(min-width: 30em) and (orientation: landscape)"
    }
}
Require read only property of previous input element to be false.
Require hidden property of previous input element to be true.
Require media matches wide device.
On input event of phone number part pass value to lhs.
On input event of phone number confirm part pass value to rhs.
Make visible when all conditions are met and lhs=rhs.
'>
</template>
```

