# be-switched [WIP]

*be-switched* is a template element enhancement that lazy loads content when conditions are met.

It is a member of the [be-enhanced](https://github.com/bahrus/be-enhanced) family of enhancements, that can "cast spells" on server rendered content, but also apply the same logic quietly during template instantiation. 


[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)
[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-switched.png)](http://badge.fury.io/js/be-switched)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">

##  The basic functionality

be-switched can be used in two modes:  

1.  It can switch the template "on and off" based on comparing two values (lhs and rhs). 
2.  Or it can switch the template "on and off" based on a single value.

The values to compare can come from peer microdata or form elements, or "boolish" properties coming from the host or peer (custom) elements.

We will look at both options closely, starting with...

## Comparing two values - JavaScriptObjectNotation

### Example 1

```html
<!-- Example 1 -->
<template id=template be-switched='{
    "lhs": 37,
    "rhs": "hello"
}'>
    <div>lhs === rhs</div>
</template>
<button onclick=setLHS()>Set lhs = "hello"</button>
<script>
    function setLHS(){
        template.beEnhanced.beSwitched.lhs = 'hello';
    }
</script>
```

"lhs" stands for left-hand-side.  "rhs" stands for "right-hand-side".

The default values for these two properties is lhs=false/rhs=true.  So this allows for a simple, single "if" statement, as well as an "if not" statement.

> [!NOTE]
> By default, property "beBoolish" is set to true, which means that if either the lhs or rhs value is a boolean, the equality check is made using truthy/falsy criteria, rather than an exact match of boolean values.

Since the lhs (37) doesn't equal the rhs ("hello"), the content inside the template remains inside the template.  The moment the lhs equals the rhs, the content inside the template is appended adjacent to the template element.  If the lhs later becomes unequal to the rhs again, the live DOM content that came from the template is hidden via css.

Now how can we change the values of the lhs and rhs?  Normally, a framework can pass values to the top level of a web component / built-in element.  Some frameworks may be able to pass values to sub properties.  With such frameworks, they could, theoretically, pass updated values like so (under the hood):

```JavaScript
await customElements.whenDefined('be-enhanced');
oTemplate.beEnhanced.by.beSwitched.rhs = 37;
```

The extra ".by" is necessary just in case beSwitched hasn't been attached to the element yet.

The first line can be avoided if we already know be-enhanced has been registered.  

Another way to pass in the value reliably is thusly:

```JavaScript
if(oTemplate.beEnhanced === undefined) oTemplate.beEnhanced = {};
if(oTemplate.beEnhanced.beSwitched === undefined) oTemplate.beEnhanced.beSwitched = {};
oTemplate.beEnhanced.beSwitched.rhs = 37;
```

All of this is to say, most frameworks probably don't and won't be able to make it trivially easy to pass values to the enhancement, especially for unbundled applications that make use of the dynamic import(), so that the timing of when dependencies load is unpredictable.  

Frameworks fail us, yet again!

For that reason, among others, an alternative way of "pulling in" values to compare is provided via:

## Hemingway Notation

## Special Symbols

In the examples below, we will encounter special symbols used in order to keep the statements small:

| Symbol       | Meaning                        | Notes                                                                                |
|--------------|--------------------------------|--------------------------------------------------------------------------------------|
| /propName    |"Hostish"                       | Attaches listeners to getters/setters.                                               |
| @propName    |Name attribute                  | Listens for input events.                                                            |
| |propName    |Itemprop attribute              | If contenteditible, listens for input events.  Otherwise, uses be-value-added.       |
| #propName    |Id attribute                    | Listens for input events.                                                            |
| %propName    |match based on part attribute   | Listens for input events.                                                            |
| -prop-name   |Marker indicates prop           | Attaches listeners to getters/setters.                                               | 
| ~elementName |match based on element name     | Listens for input events.                                                            |


"Hostish" means:

1.  First, do a "closest" for an element with attribute itemscope, where the tag name has a dash in it.  Do that search recursively.  
2.  If no match found, use getRootNode().host.

We are often (but not always in the case of 2. below) making some assumptions about the elements we are comparing -- 

1.  The value of the elements we are comparing are primitive JS types that are either inferrable, or specified by a property path.
2.  The values of the elements we are comparing change in conjunction with a (user-initiated) event.  


### Example 2a

```html
<label for=lhs>LHS:</label>
<input id=lhs>
<label for=rhs>RHS:</label>
<input id=rhs>
<template be-switched='on when #lhs equals #rhs.'>
    <div>LHS === RHS</div>
</template>
```

> [!NOTE]
> For id based matches (which is what we have above), the search is done within the root node of the element.  

> [!NOTE]
> The comparison condition is re-evaluated on the input events of the lhs and rhs elements.  See below for how to specify alternate event names


### Example 2b

```html
<form>
    <label>
        LHS:
        <input name=lhs>
    </label>
    
    <label>RHS:
        <input name=rhs>
    </label>
    
    <template be-switched='on when @lhs equals @rhs.'>
        <div>LHS === RHS</div>
    </template>
</form>
```

Here, the search for matching names is done within a containing form, and if no form is found, within the root node.

However, if that is not sufficient, we can specify a "scoping" perimeter via an "upSearch" query.  Symbolically, we use the "^" symbol to indicate this [TODO]:

```html
<section>
    <label>
        LHS:
        <input name=lhs>
    </label>
    
    <label>RHS:
        <input name=rhs>
    </label>
    
    <template be-switched='on when ^section@lhs equals ^section@rhs.'>
        <div>LHS === RHS</div>
    </template>
</section>
```

"UpSearch" means:  First check for previous siblings that match the selector, then the parent, then previous siblings of the parent, etc.  Stop at the ShadowDOM root.

[TODO] Support for down search?

Maybe use v or ¥ (or &yen?).

### Example 2c

```html
<div itemscope>

    <span itemprop=lhs contenteditable></span>
    
    <span itemprop=rhs contenteditable></span>
    
    
    <template be-switched='on when |lhs equals |rhs.'>
        <div>LHS === RHS</div>
    </template>
</div>
```

Here the search is done within the nearest itemscope, and if no itemscope is found, within the root node.

Again, if that proves inadequate, use the ^ character to indicate the closest parent to search within.

### Example 2d

```html
<ways-of-science itemscope>
    <carrot-nosed-woman></carrot-nosed-woman>
    <a-duck></a-duck>
    <template 
        be-switched='
            On when ~ carrotNosedWoman equals ~ aDuck.
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

What this does:

1.  Finds carrot-nosed-woman within itemscope, and if not found, within root node.  
2.  Waits for customElements.whenDefined('carrot-nosed-woman').
3.  Attempts to infer the value of the element.
    1.  If 'value' in oCarrotNosedWoman, uses that.
    2.  ariaValueNow.
    3.  If 'checked' in oCarrotNosedWoman, uses that.
    4.  ariaChecked.
    5.  If 'href' in oCarrotNosedWoman, uses that.
    6.  textContent
4.  Finds element a-duck.
5.  Waits for customElements.whenDefined('a-duck').
6.  Attempts to infer the value of the element, same as 3 above.
7.  Compares the values.
8.  Listens for input event, and re-evaluates.

## Example 2e specifying event name(s) 

Although the following almost looks like a typo and might not get Hemingway's stamp of approval, it was the best we could come up with as far as being able to specify the event name/type(s) to listen for:

```html
<ways-of-science itemscope>
    <carrot-nosed-woman></carrot-nosed-woman>
    <a-duck></a-duck>
    <template 
        be-switched='
            On on weight-changed when ~ carrotNosedWoman equals ~ aDuck.
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

This will listen for "weight-changed" events on both the carrot-nosed-woman and the a-duck elements.

To specify a different event for each, separate with commas:

```html
<template 
    be-switched='
        On on weight-changed,molting when ~ carrotNosedWoman equals ~ aDuck.
'></template>
```

The change event type is applied to carrot-nosed-woman, and input event type is applied to a-duck.

## Example 2f [TODO]

*be-switched*, and in fact the entire ecosystem be-switched is a part of, encourages developers who create form associated custom elements, or editable custom elements that recognize the contentEditable attribute, to utilize "change" and "input" for their event names, just as is done for built-in elements.  Maybe "input" events should be used for changes that are intended to be "complete" by a single user action, and "change" used when there are intermediate steps the user doesn't intend to affect anything.

Everything becomes easier that way, and will also make Hemingway's spirit ready to pass on.

So instead of example 2e, to specify using the change event, use the exclamation point (kind of an emphatic, I'm ready!):

```html
<ways-of-science itemscope>
    <carrot-nosed-woman></carrot-nosed-woman>
    <a-duck></a-duck>
    <template 
        be-switched='
            On when ~ carrotNosedWoman! equals ~ aDuck.
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

## Example 2f => 2g[TODO] specify property path to compare 

```html
<ways-of-science>
    <carrot-nosed-woman></carrot-nosed-woman>
    <a-duck></a-duck>
    <template 
        be-switched='
            On when ~ carrotNosedWoman:weight equals ~ aDuck:weight.
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

### Example 2g => 2h[TODO] property path including  single argument methods with string arguments. 

```html
<ways-of-science>
    <largest-scale>
        <carrot-nosed-woman></carrot-nosed-woman>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <template 
        be-switched='On 
            when 
                ^largest-scale~carrotNosedWoman:weight
            equals 
                ^largest-scale~aDuck:weight'>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

## And now for something completely different

Examples 2* all focused on comparing two values.  The reason for focusing first on what is the "harder" case, is simply to suggest why this enhancement was so named.

But what if we just want to lazy load content when a single value goes from "false" to "true"?  This package supports that as well.

## Boolean conditions based on peer elements or host

If all you are trying to do is to instantiate (and then hide, as conditions change) a template depending on a single truthy value of a peer element, use the following syntax:

### Example 3a

```html
<div itemscope>
    ...
    <link itemprop=isHappy href=https://schema.org/True>
    <template be-switched='on when ^ is truthy.'>
        <my-content></my-content>
    </template>
</div>
```

The standalone ^ is indicating to just look at the previous element sibling.

### Example 3b Down search

```html
<div itemscope>
    ...
    
    <template be-switched='on when v is falsy.'>
        <my-content></my-content>
    </template>
    <link itemprop=isHappy href=https://schema.org/True>
</div>
```

### Example 3a => 3c [TODO] 

```html
<div itemscope>
    ...
    <link itemprop=isHappy href=https://schema.org/True>
    ...
    <template be-switched='on when | is happy. //or |isHappy.' >
        <my-content></my-content>
    </template>
</div>
```

Can have multiple such statements -- or condition.  Each sentence can begin with "on" or "On", whichever seems more readable.



If no itemscope container is present and there's some ambiguity use [TODO]:

```html
<section part=myPart>
    ...
    <link itemprop=isHappy href=https://schema.org/True>
    ...
    <template be-switched='on when ^%myPart|isHappy.'>
        <my-content></my-content>
    </template>
</section>
```



### Example 3b => 3d [TODO]

Can also reference form element, or [form associated custom elements](https://bennypowers.dev/posts/form-associated-custom-elements/)

```html
<form>
    ...
    <input name=isHappy type=checkbox>
    ...
    <template be-switched='on when @ is happy.'>
        <my-content></my-content>
    </template>
</form>
```

Checks for $0.checked, if undefined, checks for $0.ariaChecked.  Listens for input events.

### Example 3c => 3e [TODO]

```html
<form>
    ...
    <input id=isHappy type=checkbox>
    ...
    <template be-switched='on when # is happy.'>
        <my-content></my-content>
    </template>
</form>
```

### Example 3d => 3f [TODO]

```html
<form>
    ...
    <input id=isHappy>
    ...
    <template be-switched='on only when # is happy.'>
        <my-content></my-content>
    </template>
</form>
```

This is an "and" condition due to the presence of "only"

### Example 3e => 3g [TODO] binding based on part attribute

```html
<form>
    <input part=isHappy type="checkbox">
    <template be-switched='on when % is happy.'>
        <my-content id=myContent></my-content>
    </template>
</form>
```



### Example 3f => void binding based on class attribute. [NOTTODO?]

So this is where we have a clash between Hemingway and CSS.  The most natural symbol to use for a class selector would be the period (".").  However, because the period is used to break up statements, that would require an escape character of some sort, or using some other symbol to represent the class query.

After staring at my keyboard for several hours, I have decided that maybe this is for the best.  Using css classes for purposes of binding may cross a barrier into "hackish" territory, especially when there are so many attractive alternatives that we've discussed above.  The part attribute is already skating on thin ice, but I think, in the context of a web component, may make sense to use sometimes, as the purpose of the part is more "public" and I think will tend to be more semantic as far as the nature of the element it adorns.

### Example 4a

"/" refers to the host.

```html
<mood-stone>
    #shadow
    <template be-switched='on when / is happy.'>
        <my-content></my-content>
    </template>
    <be-hive></be-hive>
</mood-stone>
```


This also works: 

### Example 4b

```html
<mood-stone>
    #shadow
    <template be-switched='on when /isHappy.'>
        <my-content></my-content>
    </template>
    <be-hive></be-hive>
</mood-stone>
```

/ is considered the "default" symbol, so it actually doesn't need to be specified:

### Example 4c

```html
<mood-stone>
    #shadow
    <template be-switched='on when is happy.'>
        <my-content></my-content>
    </template>
    <be-hive></be-hive>
</mood-stone>
```

### Example !2a - !4a [Not Fully Tested]

All the examples above also work, but instead of "on", use "off", which of course means the negation is performed.

## Viewing Your Element Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js
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
import 'be-switched/be-switched.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-switched';
</script>
```



P.S.



## Compatibility with server-side-rendering [TODO]

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
        be-switched='
        Off when value property of previous largest-scale element 
        having inner woman-with-carrot-attached-to-nose element 
        is not equal to the value property of previous largest-scale element 
        having inner a-duck element 
        .
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
            <td>ifMediaequals</td>
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

