# be-switched 

*be-switched* is a template behavior that lazy loads content when conditions are met.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)

[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-switched/"><img src="https://nodei.co/npm/be-switched.png"></a>

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">

In the following example, we see be-switched used in combination with [be-linked](https://github.com/bahrus/be-linked).

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-switched
        be-linked='
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs property of be-switched enhancement of adorned element.
        Link value property of previous largest-scale element having inner a-duck element to rhs property of be-switched enhancement of adorned element.'
    >
        <div>A witch!</div>
    </template>
</ways-of-science>
```



## Compatibility with server-side-rendering

*be-switched* is compatible with server-side-rendering if the following approach is used:

If during the time the SSR is taking place, the desire is not to display the content, but rely on the client to lazy load when conditions warrant, then the syntax above is exactly what the SSR should generate.

If, however, the content should display initially, but we want the client-side JavaScript to be able to hide / disable the content when conditions in the browser change, the server should render the contents adjacent to the template, and provide an indicator, data-cnt, that specifies how many elements below the template are managed by the be-switched directive / decorator / behavior.

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template itemscope itemref=witch be-switched='{"deferRendering": true}'
        be-linked='
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs property of be-switched enhancement of adorned element.
        Link value property of previous largest-scale element having inner a-duck element to rhs property of be-switched enhancement of adorned element.'
    >
        
    </template>
    <div id=witch></div>
</ways-of-science>
```



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
            <td>checkIfNonEmptyArray</td>
            <td>Tests if (bound) expression evaluates to a non empty array</td>
        </tr>
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