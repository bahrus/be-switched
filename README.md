# be-switched 

*be-switched* is a template element enhancement that lazy loads content when conditions are met.

It is a member of the [be-enhanced](https://github.com/bahrus/be-enhanced) family of enhancements, that can "cast spells" on server rendered content, but also apply the same logic quietly during template instantiation. 

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)
[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)
<a href="https://nodei.co/npm/be-switched/"><img src="https://nodei.co/npm/be-switched.png"></a>
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">

##  The basic functionality

```html
<template be-switched='{
    "lhs": 37,
    "rhs": "hello"
}'>
    <div>lhs === rhs</div>
</template>
```

Since the lhs (37) doesn't equal "hello", the content inside the template remains inside the template.  The moment the lhs equals the rhs, the content inside the template is appended adjacent to the template element.  If the lhs later becomes uneaual to the rhs again, the live DOM content that came from the template is hidden via css.

Now how can we change the values of the lhs and rhs?  Normally, a framework can pass values to the top level of a web component / built-in element.  Some frameworks may be able to pass values to sub properties.  With such frameworks, they can pass updated values like so (under the hood):

```
await customElements.whenDefined('be-enhanced');
oTemplate.beEnhanced.by.beSwitched.rhs = 37;
```

The extra ".by" is necessary just in case beSwitched hasn't been attached to the element yet.

The first line can be avoided if we already know be-enhanced has been registered.  It can also be avoided thusly:

```
if(oTemplate.beEnhanced === undefined) oTemplate.beEnhanced = {};
if(oTemplate.beEnhanced.beSwitched === undefined) oTemplate.beEnhanced.beSwitched = {};
oTemplate.beEnhanced.beSwitched.rhs = 37;
```

All of this is to say, most frameworks probably won't make it trivially easy to pass values to the enhancement.

For that reason, among others, a supporting "enhancement helper" is provided:  be-linked, which we discuss below.  Using that helper, this enhancement can be used within most any framework, or even without the help of a framework.  

## 100% Hemingway Notation

In the following example, we see be-switched used in combination with [be-linked](https://github.com/bahrus/be-linked).

The syntax is admittedly a bit long-winded (shortcuts described below).  All the line feeds / indentation is purely optional, to make it easier to read in a github environment (without horizontal scrolling).  It uses 100% ["Hemingway notation"](https://bookanalysis.com/ernest-hemingway/writing-style/).

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-linked='
        Link value property of previous largest-scale element 
        having inner woman-with-carrot-attached-to-nose element 
        to lhs property of be-switched enhancement of adorned element.

        Link value property of previous largest-scale element 
        having inner a-duck element 
        to rhs property of be-switched enhancement of adorned element.'
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

## Hemingway Notation combined with JSON notation.

be-link provides a more TypeScript friendly alternative (that is also a bit less wordy):

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-linked='
        {
            "enh": {
                "beSwitched": {"lhs": "", "rhs": ""}
            }
        }
        Link value property of previous largest-scale element 
        having inner woman-with-carrot-attached-to-nose element to lhs.

        Link value property of previous largest-scale element 
        having inner a-duck element to rhs.
        '
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

This is basically saying that "lhs" refers to the lhs property of the beSwitched enhancement.  Likewise with "rhs".

## Ditto notation [TODO]

We can reduce the wordiness further by using some Ditto notation:

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-linked='
        {
            "enh": {
                "beSwitched": {"lhs": "","rhs": ""}
            }
        }
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs.
        ^    ^     ^        ^  ^        ^             ^       ^      ^                  a-duck                ^       ^  rhs.
        '
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

## Compatibility with server-side-rendering [TODO]

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
    <template itemscope itemref="witch burn-her" 
        be-linked='
        {
            "enh": {
                "beSwitched": {
                    "lhs": "",
                    "rhs": "",
                }
            },
            "settings": {
                "enh":{
                    "beSwitched": {
                        "deferRendering": true,
                        "autoImport": true,
                    }
                }

            }
        }
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to lhs.
        ^    ^     ^        ^  ^        ^             ^       ^      ^                  a-duck                ^       ^  rhs.
        '
    >
    </template>
    <div id=witch>A witch!</div>
    <div id=burn-her>Burn her!</div>
</ways-of-science>
```

We are using built-in support for micro-data to signify a hierarchical relationship with a flat list of DOM elements.


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