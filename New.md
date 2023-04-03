
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
        Link lhs to value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element.
        Link rhs to value of previous largest-scale element having inner a-duck element.
        Make visible when lhs = rhs.
        Defer rendering.
    '>
        <div>A witch!</div>
    </template>
</ways-of-science>
```

```html
<input>
<template be-switched='
{
    "declare": {
        "wideDevice": "(min-width: 30em) and (orientation: landscape)"
    }
}
Require read only property of previous input element to be false.
Require hidden property of previous input element to be true.
Require media matches wide device.
Make visible when all conditions are met.
'>
</template>
```

