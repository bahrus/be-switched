# be-switched 

*be-switched* is a template behavior that lazy loads content when conditions are met.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)

[![Actions Status](https://github.com/bahrus/be-switched/workflows/CI/badge.svg)](https://github.com/bahrus/be-switched/actions?query=workflow%3ACI)

<a href="https://nodei.co/npm/be-switched/"><img src="https://nodei.co/npm/be-switched.png"></a>

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched='{
        "if": true,
        "lhs": {"observe": "[-lhs]", "vft": true},
        "op": "===",
        "rhs": {"observe": "[-rhs]", "vft": true},
    }'><div>A witch!</div></template>
</ways-of-science>
```

Editing JSON attributes inside HTML isn't the most pleasant experience, but it isn't so bad after installing the [JSON-in-HTML](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) extension, for VSCode users.  The extension works in the VSCode PWA and [github.dev](https://github.dev/bahrus/be-switched) domain as well.


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
<template  data-cnt=1 be-switched='{
    "if": true,
    "lhs": {"observe": "[-lhs]", "vft": true},
    "op": "===",
    "rhs": {"observe": "[-rhs]", "vft": true},
}'></template>
<div>A witch!</div>
```

A [demo](https://github.com/bahrus/be-switched/blob/baseline/demo/ssr.html) can be seen by opening http://localhost:3030/ssr (see set up instructions below).

In the future, as the defer-hydration cross-web component library protocol solidifies, support will be added to ensure no extra unnecessary "flops" are wasted during hydration.

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
            <td>Expands the template / makes visibile only when the specified media query expression is satisfied.</td>
        </tr>
        <tr>
            <td>ifNonEmptyArray</td>
            <td>Tests if (bound) expression evaluates to a non empty array</td>
        </tr>
    </tbody>
</table>

## Lazy Loading 

Lazy Loading is supported, so that in addition to satisfying the other conditions, the template must appear within the visible area of the browser.

Syntax:

```html
<style>
/* These styling hacks will often lead to more effect lazy-loading.
   Some experimentation will likely be required in each scenario to determine whether these settings help / hurt
   or need further adjustments. */
.be-lazy-loaded{
    position:absolute;
    top: -10000px;
    display:block;
}
be-switched-filler{
    display:block;
    min-height:1000px;
}
</style>
<template class=be-lazy-loaded be-switched='{
    "if": true,
    "lhs": {"observe": "#lhs", "on": "input", "vft": "value"},
    "op": "===",
    "rhs": {"observe": "#rhs", "on": "input", "vft": "value"},
    "lazyDisplay": true,
    "lazyDelay": 100,
}'>
    <div class="container">
      <div class="header">Header</div>
      <div class="panel left">Left panel</div>
      <div class="mainbody">Main body</div>
      <div class="panel right">Right panel</div>
      <div class="footer">Footer</div>
    </div>
</template>
```

The lazyDelay parameter is optional (it defaults to 50).  Without a delay, multiple lazy loaded sections will all seem to be visible during initial display, as they may all have zero size.

You may need to apply some styling associated with the attribute set via setAttr.  That attribute will be set to "true" when it is displayed.

## Viewing Your Element Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Running Tests

```
> npm run test
```