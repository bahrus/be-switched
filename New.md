
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
        Require lhs = rhs.
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
Check that ready to display property of host is truthy.
Check that read only property of previous input element is falsy.
Check that hidden property of previous input element is truthy.
Check that media matches wide device.
Check that list of books property of host is a non empty array.
On toggle event of host check that open property is truthy.
On input event of previous phone-number part pass value to lhs.
On input event of previous phone-number-confirm part pass value to rhs.
Check that lhs=rhs.
'>
</template>
```

Or condition

The example above illustrates a massive and condition.  The get access to or conditions, separate statements with triple trick marks, like markdown:

```html
<input part=phone-number>
<input part=phone-number-confirm>
```
Check that ready to display property of host is true.
```
Check that read only property of previous input element is false.
```
'>
</template>
```




