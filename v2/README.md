

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='
        Map value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs.
        Map value property of previous largest-scale element having inner a-duck element to rhs.
        Check IF lhs = rhs.
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
Check if ready to display property of host is truthy.
Check if read only property of previous input element is falsy.
Check if hidden property of previous input element is truthy.
Check if media matches wide device.
Check if list of books property of host is a non empty array.
On toggle event of host check if open property is truthy.
On input event of previous phone-number part map value to lhs.
On input event of previous phone-number-confirm part map value to rhs.
Check if lhs=rhs.
'>
</template>
```

Or condition

The example above illustrates a massive and condition.  If an or condition of such groups of and conditions is needed, separate statements with triple tick marks, like markdown:

```html
<input part=phone-number>
<input part=phone-number-confirm>
```
Check if ready to display property of host is true.
```
Check if read only property of previous input element is false.
```
'>
</template>
```




