# be-switched 

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='{
        "iff": true,
        "lhs": {"observe": "[-lhs]", "vft": true},
        "op": "===",
        "rhs": {"observe": "[-rhs]", "vft": true},
    }'><div>A witch!</div></template>
</ways-of-science>
```
iff, op can also come from observations [TODO]

## Compatibility with server-side-rendering

*be-switched* is compatible with server-side-rendering if the following approach is used:

If during the time the SSR is taking place, the desire is not to display the content, but rely on the client to lazy load when conditions warrant, then the syntax above is exactly what the SSR should generate.

If, however, the content should display initially, but we want the client-side JavaScript to be able to hide / disable the content when conditions in the browser change, the server should render the contents adjacent to the template, and provide an indicator, data-cnt, that specifies how many elements below the template are managed by the be-switched directive / decorator / behavior.

```html
<template  data-cnt=1 be-switched='{
    "iff": true,
    "lhs": {"observe": "[-lhs]", "vft": true},
    "op": "===",
    "rhs": {"observe": "[-rhs]", "vft": true},
}'></template>
<div>A witch!</div>
```

## With Holy Grail layout, lazy loading [TODO]

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <div class="container" be-switched='{
        "iff": true,
        "lhs": {"observe": "[-lhs]", "vft": true},
        "?": "===",
        "rhs": {"observe": "[-rhs]", "vft": true},
        "andMediaMatches": "screen and (min-width: 1975px)",
        "beginSelector": ">header",
        "endSelector": ">footer",
        "lazyLoad": true,
        "lazyDelay": 50,
        "toggleDisabled": true,
        "templateSelector": "template"
    }'>
        <header>
            <template>
            <!-- Header content -->
            </template>
        </header>

        
        <nav>
            <template>
            <!-- Navigation -->
            <template>
        </nav>

        <main>
            <template>
            <!-- Main content -->
            </template>
        </main>

        <aside>
            <template>
            <!-- Sidebar / Ads -->
            </template>
        </aside>        



        <footer>
            <template>
                <!-- Footer content -->
            </template>
        </footer>
    </div>
</ways-of-science>
```