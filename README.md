# be-switched 

*be-switched* is a template element enhancement that lazy loads content when conditions are met.

It is a member of the [be-enhanced](https://github.com/bahrus/be-enhanced) family of enhancements, that can "cast spells" on server rendered content, but also apply the same logic quietly during template instantiation. 

be-switched can easily complement server-rendered HTML, as discussed below.

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)
[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-switched.png)](http://badge.fury.io/js/be-switched)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">

##  The basic functionality

be-switched can be used in two modes:  

1.  It can switch the template "on and off" based on comparing two values (lhs and rhs). 
2.  Or it can switch the template "on and off" based on the values of peer microdata or form elements.

We will look at both options closely, starting with...

### Comparing two values

```html
<template be-switched='{
    "lhs": 37,
    "rhs": "hello"
}'>
    <div>lhs === rhs</div>
</template>
```

"lhs" stands for left-hand-side.  "rhs" stands for "right-hand-side".

The default values for these two properties is lhs=false/rhs=true.  So this allows for a simple, single "if" statement, as well as an "if not" statement.

> [!NOTE]
> By default, setting "beBoolish" is set to true, which means that if either the lhs or rhs value is a boolean, the equality check is made using truthy/falsy criteria, rather than an exact match of boolean values.

Since the lhs (37) doesn't equal the rhs ("hello"), the content inside the template remains inside the template.  The moment the lhs equals the rhs, the content inside the template is appended adjacent to the template element.  If the lhs later becomes unequal to the rhs again, the live DOM content that came from the template is hidden via css.

Now how can we change the values of the lhs and rhs?  Normally, a framework can pass values to the top level of a web component / built-in element.  Some frameworks may be able to pass values to sub properties.  With such frameworks, they could, theoretically, pass updated values like so (under the hood):

```
await customElements.whenDefined('be-enhanced');
oTemplate.beEnhanced.by.beSwitched.rhs = 37;
```

The extra ".by" is necessary just in case beSwitched hasn't been attached to the element yet.

The first line can be avoided if we already know be-enhanced has been registered.  

Another way to pass in the value reliably is thusly:

```
if(oTemplate.beEnhanced === undefined) oTemplate.beEnhanced = {};
if(oTemplate.beEnhanced.beSwitched === undefined) oTemplate.beEnhanced.beSwitched = {};
oTemplate.beEnhanced.beSwitched.rhs = 37;
```

All of this is to say, most frameworks probably don't and won't be able to make it trivially easy to pass values to the enhancement, especially for unbundled applications that make use of the dynamic import(), so that the timing of when dependencies load is unpredictable.  

Frameworks fail us, yet again!

For that reason, among others, a supporting "enhancement helper" is provided:  [be-linked](https://github.com/bahrus/be-linked), which we discuss below.  Using that helper, this enhancement (be-switched) can be used within most any framework, especially web component "frameworks", or even without the help of a client-side framework of any sort, adding its magic onto what the server rendered.  Essentially be-linked becomes our loosely coupled "framework".

### Hemingway Notation

In the following example, we see be-switched used in combination with [be-linked](https://github.com/bahrus/be-linked).  be-linked allows us to connect components together using ["Hemingway notation"](https://bookanalysis.com/ernest-hemingway/writing-style/).

It should be noted that this simple functionality that be-linked demonstrates below, connecting siblings together, without a host element micromanaging everything, is actually beyond the capabilities of most every framework out there (other than JQuery)!

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
        to $0-enh-by-be-switched : lhs.

        Link value property of previous largest-scale element 
        having inner a-duck element 
        to $0-enh-by-be-switched : rhs.'
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Another reason to consider using be-linked in conjunction with be-switched:  It provides an elegant way of self-binding lazy loaded content, without burdening the framework/web component library with micro managing components coming and going.

### Ditto notation

We can reduce the wordiness of our statements linking components together by using some "ditto" syntax, where we use ^ to indicate to copy the word from the previous statement.  Here we remove the line feeds to help visualize the ditto notation (at the expense of incurring horizontal scrolling in github's rendering):

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template be-linked='
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to $0-enh-by-be-switched : lhs.
        ^    ^     ^        ^  ^        ^             ^       ^      ^                  a-duck                ^       ^  ^                     : rhs.
        '
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

## Boolean conditions based on peer elements [WIP]

A somewhat simpler approach that be-switched also supports is basing the instantiation / hiding of the template based on (a combination of) boolean conditions of peer elements that can contain values -- form elements or microdata elements.

If all you are trying to do is to instantiate (and then hide, as conditions change) a template depending on a single truthy value of a peer element, use the following syntax:

```html
<div itemscope>
    ...
    <link itemprop=isHappy href=https://schema.org/True>
    ...
    <template be-switched='On when $ is happy.'>
        <my-content></my-content>
    </template>
</div>
```



Can have multiple such statements -- or condition.

Can also reference form element, or [form associated custom elements](https://bennypowers.dev/posts/form-associated-custom-elements/)

```html
<form>
    ...
    <input name=isHappy>
    ...
    <template be-switched='On when & is happy.'>
        <my-content></my-content>
    </template>
</form>
```

Checks for $0.checked, if undefined, checks for $0.ariaChecked.  Listens for input and change events.

```html
<form>
    ...
    <input id=isHappy>
    ...
    <template be-switched='On when # is happy.'>
        <my-content></my-content>
    </template>
</form>
```

```html
<form>
    ...
    <input id=isHappy>
    ...
    <template be-switched='On only when # is happy.'>
        <my-content></my-content>
    </template>
</form>
```

This is an "and" condition due to the presence of "only"


## Compatibility with server-side-rendering [Untested]

*be-switched* is compatible with server-side-rendering if the following approach is used:

If during the time the SSR is taking place, the desire is not to display the content, but rely on the client to lazy load when conditions warrant, then the syntax above is exactly what the SSR should generate.

If, however, the content should display initially, but we want the client-side JavaScript to be able to hide / disable the content when conditions in the browser change, the server should render the contents adjacent to the template, and leverage standard microdata attributes, to establish artificial hierarchies.

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
            "settings": {
                "enh":{
                    "beSwitched": {
                        "deferRendering": true,
                        "autoImport": true,
                    }
                }

            }
        }
        Link value property of previous largest-scale element having inner woman-with-carrot-attached-to-nose element to $0-enh-by-be-switched : lhs.
        ^    ^     ^        ^  ^        ^             ^       ^      ^                  a-duck                ^       ^  ^                     : rhs.
        '
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
    <div id=witch>A witch!</div>
    <div id=burn-her>Burn her!</div>
</ways-of-science>
```

We are using built-in support for microdata to signify a hierarchical relationship with a flat list of DOM elements.

In this scenario, repeating the content inside the template is unnecessary, unless the optional setting: deleteWhenInvalid is set to true.

## Throwing elements out of scope away [Untested]

An option, minMem, allows for completely wiping away content derived from the template when conditions are no longer met.  This *might* be better on a low memory device, especially if the content has no support for be-oosoom (see below).

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

## Lazy Loading / Hibernating [Untested]

be-switched can "go to sleep" when the template it adorns goes out of view, if the template is also decorated by [be-oosoom](https://github.com/be-oosoom).  *be-switched* provides an option to toggle the inert property when the conditions become false, in lieu of deleting the content.

## Viewing Your Element Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.h
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-searching/be-switched.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-switched';
</script>
```

