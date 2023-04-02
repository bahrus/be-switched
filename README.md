# be-switched 

*be-switched* is a template behavior that lazy loads content when conditions are met.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)

[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-switched/"><img src="https://nodei.co/npm/be-switched.png"></a>

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">

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

<details>
    <summary>Why is this syntax so busy?</summary>

1.  We are demonstrating a capability most conditional syntax doesn't support -- the ability to monitor siblings (some might consider that a bug rather than a feature.)
2.  In my view, if built-in template instantiation ever lands in the browser, it ought to optionally support the beautiful syntax demonstrated by Vue, and other templating libraries -- not requiring a template wrapper around single element tags.  Because it ought to be able to wrap it in a template during the processing.  However, the syntax we are showing is the syntax that would be delivered to the browser.  And this decorator / behavior, together with its counterpart, be-repeated, aren't guaranteed to be loaded during template instantiation.  In that scenario, where it isn't loaded yet, template instantiation punts, allowing the behavior to perform the conditional logic progressively in the live DOM tree.  We don't want to load content prematurely, because that's wasteful.
</details>

Editing JSON attributes inside HTML isn't the most pleasant experience, but it isn't so bad after installing the [JSON-in-HTML](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) extension, for VSCode users.  The extension works in the VSCode PWA and [github.dev](https://github.dev/bahrus/be-switched) domain as well.

For an optimal editing experience, edit html via an mts/mjs file with the help of the [may-it-be compiler](https://github.com/bahrus/may-it-be).

If the be-switched attribute is applied to a DOM node outside any ShadowDOM, then the template will lazy load when the conditions are satisfied.

To use inside a ShadowDOM realm, an instance of the [be-hive](https://github.dev/bahrus/be-hive) web component must be placed somewhere inside.

To use fully compliant HTML5 syntax, use data-be-switched instead of be-switched.

The syntax for binding the lhs and rhs of the expressions to other DOM nodes within the ShadowRealm, or to the host container, follows the same pattern / syntax used by [be-observant](https://github.com/bahrus/be-observant#syntax-in-depth).

"if" can also come from observing other elements.

## Compatibility with server-side-rendering

*be-switched* is compatible with server-side-rendering if the following approach is used:

If during the time the SSR is taking place, the desire is not to display the content, but rely on the client to lazy load when conditions warrant, then the syntax above is exactly what the SSR should generate.

If, however, the content should display initially, but we want the client-side JavaScript to be able to hide / disable the content when conditions in the browser change, the server should render the contents adjacent to the template, and provide an indicator, data-cnt, that specifies how many elements below the template are managed by the be-switched directive / decorator / behavior.

```html
<template  data-cnt=2 be-switched='{
    "if": true,
    "lhs": {"observe": "largest-scale:has(>woman-with-carrot-attached-to-nose)", "vft": true},
    "lhsVal": 140 //or whatever the value was on the server
    "op": "===",
    "rhs": {"observe": "largest-scale:has(>a-duck)", "vft": true},
    "rhsVal": 140,
    "deferRendering": true 
}'></template>
<div>A witch!</div>
```

## Hemingway Notation [TODO]


```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='
        Link value of previous largest scale element having inner woman with carrot attached to nose element to lhs property of my proxy.
        Link value of previous largest scale element having inner a-duck element to rhs property of my proxy.
        Make visible only if lhs = rhs.
        Defer rendering.
    '>
        <div>A witch!</div>
    </template>
</ways-of-science>
```




A [demo](https://github.com/bahrus/be-switched/blob/baseline/demo/ssr.html) can be seen by opening http://localhost:3030/ssr (see set up instructions below).



## Additional conditions be-switched supports

In addition to "if" boolean checks, and equality checks using lhs and rhs keys, some additional "if" checks can be made:

<table>
    <caption>Additional Supported Conditions
    <thead>
        <tr>
            <th>Key</th>
            <th>Meaning</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ifMediaMatches</td>
            <td>Expands the template / makes visible only when the specified media query expression is satisfied.</td>
        </tr>
        <tr>
            <td>ifNonEmptyArray</td>
            <td>Tests if (bound) expression evaluates to a non empty array</td>
        </tr>
        <tr>
            <td>ifURLMatches</td>
            <td>Tests if URL matches URL Pattern [TODO]</td>
        </tr>
        <tr>
            <td>Other planned op values [TODO]</td>
            <td>>, >=, <, <=</td>
    </tbody>
</table>

## Lazy Loading

be-switched can "go to sleep" when the template it adorns goes out of view, if the template is also decorated by [be-oosoom](https://github.com/be-oosoom).

## Viewing Your Element Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.h
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Running Tests

```
> npm run test
```