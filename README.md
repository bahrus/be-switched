# be-switched

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <div hidden be-switched='{
        "iff": true,
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "value-from-target": "value"},
        "?": "===",
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "value-from-target": "value"},
        "setAttr": "hidden"
    }'>A witch!</div>
</ways-of-science>
```