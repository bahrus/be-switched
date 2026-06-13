# be-switched ( 🎚️ )

*be-switched* is a template element enhancement that can lazy load content when conditions are met, and/or it can modify the DOM so that css rules can choose what sorts of display modifications are needed.

It is a member of the [be-enhanced](https://github.com/bahrus/be-enhanced) family of enhancements, that can "cast spells" on server rendered content, but also apply the same logic quietly during template instantiation. 


[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-switched)
[![Playwright Tests](https://github.com/bahrus/be-switched/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-switched/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-switched.png)](http://badge.fury.io/js/be-switched)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-switched?style=for-the-badge)](https://bundlephobia.com/result?p=be-switched)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-switched?compression=gzip">


Conditionally loading and/or displaying content is a fundamental need.  This element enhancement provides such support, "inline" within the HTML markup, with support for easy to read declarative, logical expressions as well as JavaScript, if the declarative support proves insufficient.


## Two Rendering Modes

As far as rendering conditional changes, tt does so in one of two ways:

1.  If the amount of HTML to show / hide is fairly small and lightweight, the element enhancement works best with the *data* element, and simply sets the attribute/property "value" to true or false depending on the outcome of the logical expression.
2.  If the content to load is heavy, then wrap the content in a template, to allow the browser to delay in rendering and hydrating the content until absolutely necessary.

##  Three logical expression modes

be-switched's logical expressions, used to decide whether to switch the content on or off, supports three different modes:  

1.  It can switch the template "on and off" based on comparing two values (lhs and rhs), or multiple such comparisons, declaratively.
2.  Or it can switch the template "on and off" based on a single value.  Or multiple such binary conditions.
3.  Or, with the help of JavaScript, we can evaluate a complex expression that is automatically recalculated anytime any of its n dependencies change, where n can be as high as needed.
   
The values to compare can come from peer microdata or form elements, or properties coming from the host or peer (custom) elements, as well as data attributes adorning the template.

We will look at all three options closely, starting with...

# Part I  

<details>
    <summary>Comparing two values via JavaScriptObjectNotation</summary>

## A single lhs/rhs comparison

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
        template.enh.beSwitched.lhs = 'hello';
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
oTemplate.enc.set.beSwitched.rhs = 37;
```

The extra ".set" is necessary just in case beSwitched hasn't been attached to the element yet.

The first line can be avoided if we already know be-enhanced has been registered.  

Another way to pass in the value reliably is thusly:

```JavaScript
if(oTemplate.enh === undefined) oTemplate.enh = {};
if(oTemplate.enh.beSwitched === undefined) oTemplate.enh.beSwitched = {};
oTemplate.enh.beSwitched.rhs = 37;
```

All of this is to say, most frameworks probably don't and won't be able to make it trivially easy to pass values to the enhancement, especially for unbundled applications that make use of the dynamic import(), so that the timing of when dependencies load is unpredictable.  

Frameworks fail us, yet again!

</details>

... And for that reason*, among others, an alternative way of "pulling in" values to compare is provided via:

# Part II - Comparing multiple values with Hemingway Notation

We will take a bit of an unusual approach to our explication -- we will document "harder" cases first, leading to simpler and simpler cases, as you continue reading below.

This enhancement takes the view that the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) is the surest way to heaven.  If you get anxious from complex code-centric overkill, fear not, the examples will only get easier as you read through, so enjoy the liberating feeling that comes with that.

But for those power hungry developers who want full, unfettered access to the JavaScript runtime in their binding expressions, we start...

## With XOXO's to the Reactive JS-firsters

Due primarily to the platform not playing very nice with progressive enhancement needs, this integration isn't as seamless as I would like.  Here's to hoping (despite all the evidence) that the platform will show some HTML love sometime in the distant future.  But for now, this will have to do.

### Adding a local, unique anonymous conditional expression "unsafely"

If your production web site runs in a setting without CSP checks (or allows for inline expressions), then this works just fine, and is supported:


```html
<ways-of-science itemscope>
    <carrot-nosed-woman id=carrot-nosed-woman></carrot-nosed-woman>
    <a-duck id=a-duck></a-duck>
    <template
        be-switched='on per #carrot-nosed-woman@weight-change and #a-duck@molting'
        onchange="event.r = Math.abs(event.args[0] - event.args[1]) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Some shortcuts / better developer ergonomics:

1.  As suggested in the title, this package provides an emoji based alternative to the canonical name "be-switched". In applications that use be-switched frequently, where concerns about clashing with already registered packages in npm isn't a concern, it might make development more productive to utilize a shorter name.  The best alternative name is probably "turn", and it does seem unlikely to me that the platform would ever add attribute "turn" to the template element, but you never know, I guess.

This package does provide an alternative name you can use, which seems quite future-proof and succinct:  🎚️ via this [file](https://github.com/bahrus/be-switched/blob/baseline/%F0%9F%8E%9A%EF%B8%8F.ts).

I think you will agree, looking at that file, how easy it is to define your own name (like "turn", but don't sue me if the platform "turns" on you).

The remaining examples will use this symbol (🎚️), so please translate that symbol to "be-switched" or "turn" or "switch" in your mind when you see it below.  Note that on Windows, to select this emoji, type flying window + . and search for "sli".  It should retain in memory for a while after that once you use it.

2.  Note the use of id's: carrot-nosed-woman and a-duck.  Use of id's in web development (particularly outside ShadowDOM) is a significant pain point, due to the uniqueness requirement.  To aid with this issue, consider taking advantage of an underlying "primitive" this enhancements builds on top of:  Support for auto generating ids so they are unique, per this [proposal](https://github.com/whatwg/html/issues/11585).  The "magic" attribute used to turn on this capability is:  "-id".  

Let's see how the markup above becomes more manageable when we apply both of these techniques:


```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️="on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting"
        onchange="event.r = Math.abs(event.args[0] - event.args[1]) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```


Our expression can alternatively be more expressive:

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️="on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting"
        onchange="event.r = Math.abs(event.f.carrotNosedWoman - event.f.aDuck) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Here, we are attempting to keep our expressions short, which means some abbreviations are used:

1.  event.r means "the return value of the expression  should be..."
2.  The "f" in event.f stands for "factors" in the conditional evaluation -- factors derived from what the be-switched expression is "based on".

What this is saying:  

> Find peer elements with ids carrotNosedWoman and aDuck.  Listen for weight-changed and molting events, respectively, and when those events happen, evaluate the JavaScript event handler referenced in the onchange attribute.  If event.r is set to true, display the contents within the template.  If event.r is set to false, hide it.  Also, evaluate the expression immediately at the outset. 

The assumptions we make for getting values from these peer custom elements (when not specified as it isn't specified above) is based on the following:

1.  If the elements found by id have dashes in the tag names, wait for customElements.whenDefined.
2.  Infer the value of the element via:
    1.  If 'value' in the element, use that.
    2.  If not, use ariaValueNow if present.
    3.  If not, check if 'checked' in oCarrotNosedWoman, use that.
    4.  Try ariaChecked.
    5.  Check if 'href' in oCarrotNosedWoman, use that.
    6.  As a last resort attempt at mind reading, use the string obtained from textContent.
3.  Listens for input event (by default and if not specified, but in the example above, they *are* specified).


> [!NOTE]
> As mentioned earlier, if all you need to do is conditionally display a small amount of content, as the examples in this document do, it may be more effective to simply use css to hide/display the content.  Similar advice has been issued [elsewhere](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).  This enhancement does in fact support the more lightweight solution:


```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <data  defer-🎚️
        🎚️="on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting"
        onchange="event.r = Math.abs(event.f.carrotNosedWoman - event.f.aDuck) < 10"
    ></data>
    <div>A witch!</div>
    <div -id>Burn her!</div>
    
</ways-of-science>
<style>
    ways-of-science>div {
        display: none;
    }
    ways-of-science:has(data[value="true"])>div{
        display: block;
    }
</style>
```


### Adding "View Transition" support

When using this enhancement in the recommended way, as described by the note above, where the "on" condition results in displaying a significant amount of new content it may make sense to apply "view transition" support to the view change.

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️='on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting' 
        🎚️-transitional
        onchange="event.r = Math.abs(event.f.carrotNosedWoman - event.f.aDuck) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
<style>
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 2s;
    }
</style>
```

and/or:

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️='on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting'
        onchange="event.r = Math.abs(event.f.carrotNosedWoman - event.f.aDuck) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
<style>
    body{
        --be-transitional: true;
    }
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 2s;
    }
</style>
```


### Adding a local, unique anonymous conditional expression "CSP safely"

The JavaScript expressions we've seen, embedded in inline event handlers, won't currently pass muster with most minimal safety CSP settings.  The following approach will (but will require adding some hash keys to the meta data for the site)

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template
        -id defer-🎚️
        🎚️='on per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting'
        🎚️-js="Math.abs(f.carrotNosedWoman - f.aDuck) < 10"
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Variables that are available inside these -js expressions:

|   Variable Name   |  Meaning                  |
|-------------------|---------------------------|
| e                 | The change event          |
| f                 | Factors of the expression |
| args              | Array of the factors      |

## Registering a named, global event handler

This also works, and can survive CSP scrutiny:

```html
<script type=module blocking=defer>
    import {register} from 'be-switched/emc.js';
    register('isMadeOfWood', e => e.r = Math.abs(e.args[0] - e.args[1]) < 10));
</script>
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️='on if isMadeOfWood, per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting'
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Our event handler can reference the adorned element, so that we can remove the hardcoding of 10:

```html
<script type=module blocking=render>
    import {register} from 'be-switched/emc.js';
    register('isMadeOfWood',
      e => e.r = Math.abs(e.args[0] - e.args[1]) < Number(e.target.dataset.maxDiff)
    );
</script>
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️ data-max-diff=10
        🎚️='on if isMadeOfWood, per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting'
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

This is, in fact, such a useful pattern, that "isMadeOfWood" is built into this package, so no JS is actually necessary.  Sorry, JS-firsters!

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️ data-max-diff=10
        🎚️='on if nearlyEq, per #{{carrot-nosed-woman}}@weight-change and #{{a-duck}}@molting'
    >
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Here is another, less cinematic example, also baked in, so no JS needed:

```html
<label for=lhs>LHS:</label>
<input id=lhs>
<label for=rhs>RHS:</label>
<input id=rhs>
<template
    🎚️='on if eq, per #lhs and #rhs'
>
    <div>LHS === RHS</div>
</template>
```


We are often (but not always in the case of 2. below) making some assumptions about the elements we are comparing -- 

1.  The value of the elements we are comparing are primitive JS types that are either inferrable, or specified by a property path.
2.  The values of the elements we are comparing change in conjunction with a (user-initiated) event. 


## Bye JavaScript, nice knowin' ya!

What follows quickly moves outside the domain of JavaScript, so if JS is your only game, you have passed the course and are ready to code to your heart's content!  Supporting the declarative bindings as described below won't be loaded unless actually used, so little to no harm done if you don't choose to use what follows.

We start by looking at pairs of comparisons between the "lhs" (left hand side) and the "rhs" (right hand side).

These statements don't invoke the onchange event at all, and are purely declarative.  But we can list a number of comparisons, some of which add to an "or" statement, others to an "and" condition, others can act as a negation, etc.  So we will get much the same power as we get with JavaScript, but declaratively, with no possible side effects (and be less prone to catastrophic errors).

### ID Referencing

Let's start with the most elementary two value switch:

```html
<label>
    LHS: <input id=lhs>
</label>

<label>
    RHS: <input id=rhs>
</label>

<template 🎚️='on when #lhs = #rhs'>
    <div>LHS === RHS</div>
</template>
```


> [!NOTE]
> The comparison condition is re-evaluated on the input events of the lhs and rhs elements by default.  See below for how to specify alternate event names.

> [!NOTE]
> This should also work, without the spaces surrounding the = sign:

```html
<template 🎚️='on when #lhs=#rhs'>
    <div>LHS === RHS</div>
</template>
```

### Referencing the host

Rather than observing the value of a peer element based on id matching, we can alternatively observe properties from the host, for one of the factors, or both of the factors:

```TypeScript
export class MoodStone extends HTMLElement{
    #isHappy = false;
    get isHappy(){
        return this.#isHappy;
    }
    set isHappy(nv: boolean){
        this.#isHappy = nv;
        this.shadowRoot!.querySelector('#target2')!.textContent = nv.toString();
    }
    #isWealthy = false;
    get isWealthy(){
        return this.#isWealthy;
    }
    set isWealthy(nv: boolean){
        this.#isWealthy = nv;
        this.shadowRoot!.querySelector('#target3')!.textContent = nv.toString();
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadowRoot!.innerHTML = String.raw `
            <div id=target2></div>
            <div id=target3></div>
            <h3>Conditional Display based on host property</h3>
            <template 🎚️='on when isHappy'>
                <div id=day> What a beautiful day!</div>
            </template>

            <template 🎚️='off when isHappy = isWealthy'>
                <div id=eq>IsHappy === isWealthy</div>
            </template>
            <be-hive></be-hive>
        `;
    }

}

customElements.define('mood-stone', MoodStone);
```


### Type casting

```html
<label for=lhs>
    LHS: <input id=lhs type=number>
</label>

<label for=rhs>
    RHS: <input id=rhs>
</label>

<template 
    🎚️='on when #lhs = #rhs'
    🎚️-as=number
>
    <div>LHS === RHS</div>
</template>
```

### Use View Transitions

Just as before, we can do some in one of two ways:

```html
<label for=lhs>LHS:</label>
<input id=lhs type=number>
<label for=rhs>RHS:</label>
<input id=rhs>
<template 
    🎚️='on when #lhs = #rhs'
    🎚️-as=number
    🎚️-transitional>
    <div>LHS === RHS</div>
</template>

<style>
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 2s;
    }
</style>
```

To apply the transitional setting more globally, use a css property as follows, for whatever css selector where it should be applied:

```css
body{
    --be-transitional: true;
}
```


### Specifying event name(s)

```html
<ways-of-science itemscope>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️='
            on when #{{carrot-nosed-woman}}@weight-change = #{{a-duck}}@molting
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

Remember that if the event name is not specified, the input event is assumed, when elements are found by name or by id or by tag name, and if no prop name is specified (see below).  Regardless of the event names specified, the developer uses the built in "oninput" attribute to provide a custom script to evaluate whether the condition is met.


### Specify property path to compare

Use the  "chained accessor" symbol (?.) for specifying a property path.

```html
<ways-of-science>
    <carrot-nosed-woman #></carrot-nosed-woman>
    <a-duck #></a-duck>
    <template -id defer-🎚️
        🎚️='
            On when #{{carrotNosedWoman}}?.weight equals #{{aDuck}}?.weight
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

There's a lot to unpack here:

This assumes ideally that the host custom element conforms to the ["RoundaboutReady"](https://github.com/bahrus/trans-render/wiki/II.--Signals-vs-Roundabouts#how-to-be-roundabout-ready) interface -- in particular, has a "propagator" property that emits events "weight" when the weight property changes for *carrot-nosed-woman* and *a-duck*.

If no such interface is detected, this will instead override the setter for the "weight" property which may not always work or feel very resilient.

Also, note that this can actually be a chain of accessors n-levels deep.  

## Specify Source of Truth attributes [TODO]

If the elements being observed don't have propagators to subscribe to, and the thought of overriding a setter feels wrong or simply doesn't work, but the property happens to have a corresponding attribute that serves as a "source of truth" corresponding to the property, then we can take advantage of that:

```html
<ways-of-science>
    <carrot-nosed-woman weight=92 #></carrot-nosed-woman>
    <a-duck weight=82 #></a-duck>
    <template -id defer-🎚️
        🎚️='
            On when #{{carrotNosedWoman}}[weight] equals #{{aDuck}}[weight]
     '>
        <div>A witch!</div>
        <div>Burn her!</div>
    </template>
</ways-of-science>
```

### Specify less than

"Less than" is supported:

```html
<label for=lhs>
    LHS: <input type=number id=lhs>
</label>
<label for=rhs>
    RHS: <input type=number id=rhs>
</label>
<template 🎚️='on when #lhs < #rhs'>
    <div>LHS &lt; RHS</div>
</template>
```

### Specify greater than

This is supported:

```html
<label for=lhs>
    LHS: <input type=number id=lhs>
</label>
<label for=rhs>
    RHS: <input type=number id=rhs>
</label>
<template 🎚️='on when #lhs > #rhs'>
    <div>LHS &gt; RHS</div>
</template>
```

Likewise, <= and >= are supported.


## And now for something completely different

The previous group of examples all focused on comparing two values.  

But what if we just want to lazy load content when a single value goes from "falsy" to "truthy"?  This package supports that as well.

## Boolean conditions based on peer elements or host

## By Itemprop

```html
<data value=true itemprop=isHappy hidden |></data>
<template -id defer-🎚️ 🎚️='on when #{{isHappy}}'>
    <my-content></my-content>
</template>
```

## By Name

```html
<input name=isHappy type="checkbox" @>
<template -id defer-🎚️ 🎚️='on when #{{isHappy}}'>
    <my-content></my-content>
</template>
```

[TODO] demo/boolish conditions/by id/multipleEls.html -- support for auto generation of id's within the template

### Externally referenced 

If this element enhancement is used inside a repeating DOM structure, it is more efficient to let the template that defines the conditional logic reference a template outside the loop, which may be inside the ShadowRoot somewhere, or the host's ShadowRoot, iteratively into the root document is tried (in that order), identified by id:

```html
<head>
    ...
     <template id=dRqfXaPaqEek5BRwfxTttg>
        <my-content></my-content>
     </template>
</head>
<body>
    <for-each ...>
        <div>
            <input data-id={{@ isHappy}} type="checkbox">
            <template -id defer-🎚️ 🎚️='on when {{#isHappy}}' rel=preload src=#dRqfXaPaqEek5BRwfxTttg></template>
        </div>
    </for-each>
    <script type=module>
        import '/🎚️.js';
    </script>
</body>
```

### And-like condition

```html
<form>
    ...
    <input id=isHappy>
    ...
    <template 🎚️='on only when #isHappy'>
        <my-content></my-content>
    </template>
</form>
```

This is an "and" condition due to the presence of "only".

### Condition coming from host

If the identifier doesn't start with #, then we are looking for a property coming from the host.

```html
<mood-stone>
    #shadow
    <template 🎚️='on when isHappy'>
        <my-content></my-content>
    </template>
    <be-hive></be-hive>
</mood-stone>
```


### Comparison to a constant

```html
<label for=lhs>LHS:</label>
<input id=lhs type=number>

<template 
    🎚️='on when #lhs eq `37`'
    🎚️-as=number
  >
    <div>LHS === RHS</div>
</template>
```

Can have multiple such statements -- or condition.  Each sentence can begin with "on" or "On", whichever seems more readable.

### Multiple conditions (period-separated statements)

Multiple conditions can be combined within a single 🎚️ attribute by separating them with a period (`.`).  Each statement is a self-contained condition that begins with "on" or "off":

```html
<template 🎚️='on when #lhs = #rhs. on when #isHappy'>
    <div>Both conditions met!</div>
</template>
```

All "on" statements are combined as an **OR** condition — the content displays if *any* of them are satisfied.  An "off" statement acts as a **veto** — if any "off" condition is met, the content is hidden regardless of the "on" conditions:

```html
<template 🎚️='on when #lhs = #rhs. off when #isDisabled'>
    <div>LHS equals RHS, unless disabled</div>
</template>
```

> [!NOTE]
> A period is only required when separating multiple statements.  Single-statement expressions do not need a trailing period.

### Negation logic

All the examples above also work, but instead of "on", use "off", which of course means the negation is performed.


## Viewing Locally

Any web server that serves static files with server-side includes will do but...

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/demo/ in a modern browser

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



## Compatibility with server-side-rendering

*be-switched* is compatible with server-side-rendering if the following approach is used:

If, during the time the SSR is taking place, the desire is not to display the content, but rely on the client to lazy load when conditions warrant, then the syntax above is exactly what the SSR should generate.

If, however, the content should display initially, but we want the client-side JavaScript to be able to hide / disable the content when conditions in the browser change, the server should render the contents adjacent to the template, and leverage standard microdata attributes, to establish artificial hierarchies.

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck id=aDuck></a-duck>
    </largest-scale>
    <template blow-dry itemscope itemref="witch burn-her" 
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
    <!>
    <div id=witch>A witch!</div>
    <div id=burn-her>Burn her!</div>
</ways-of-science>
```

We are using built-in support for microdata to signify a hierarchical relationship with a flat list of DOM elements.

In this scenario, repeating the content inside the template is unnecessary, unless the optional setting: deleteWhenInvalid is set to true.

## Throwing elements out of scope away [Untested]

An option, minMem, allows for completely wiping away content derived from the template when conditions are no longer met.  This *might* be better on a low memory device, especially if the content has no support for be-oosoom (see below).


## Additional conditions

*be-switched* can work in tandem with another enhancement, [mt-si](https://github.com/bahrus/mt-si) to add common additional conditions before the template *be-switched* adorns becomes active.  One example would be media queries:

```html
<script mt-si type=application/json>
{
    "whereMediaMatches": "..."
}
</script>

...
<template mt-si defer-be-switched be-switched="...">
    <my-heavy-lifting-component defer-hydration mt-si></my-heavy-lifting-component>
</template>
```



