### What problem are you trying to solve?

Managing id's for server streamed HTML, without tooling or a framework, is error prone, as has been well articulated [here](https://github.com/whatwg/html/issues/10143).  The thing that makes them especially challenging is the need to maintain uniqueness, particularly in a document that combines multiple independent sections that may even come from different sources.

### What solutions exist today?

Vue and React provide [useId](https://blog.vuejs.org/posts/vue-3-5#useid) for this purpose.  But that requires using a framework.  Many web sites are simply static and don't need a full blown framework or any JavaScript.  In a way, this proposal is suggesting incorporating the useId solution into the browser, where that makes sense.

What's great about their solutions is that they produce predictable results, as discussed by @mayank99 and @alice below, making hydration of the data reliable.

In fact, as I learned from the helpful user feedback notes that @alice collected, a very similar solution to the specific proposal below already exists, that is less JS-centric, one that received loving praise:

- [Alpine](https://alpinejs.dev/directives/id)


### How would you solve it?

Introduce a new global attribute, "generatedids" -- or something shorter?  This would be modeled after the "parseparts" attribute that was/is being considered as a way of preprocessing the streamed server generated html for DOM parts (tied to template instantiation).

This attribute could be used to list locally scoped auto generated id's:

```html
<form generatedids="foo,bar">
  ...
  <label for={{foo}}>foo:</label>
  ...
  <input type=checkbox id={{foo}}>
  
  ...
  
  <label for={{bar}}>bar:</label>
  ...
  <input type=checkbox id={{bar}}>
  
   <output for="{{foo}} {{bar}}"></output>
</form>
```

(Ideally, label's should wrap input elements).

This would make the connection "latch" at start up, and allow for moving elements anywhere inside the root node with no breakage.

If an outer tag that contains the form element also has generatedids = "foo", the inner most one trumps, similar to nested const's in JavaScript.

Adding id's to elements like the input element can serve many useful purposes, including making hydration more reliable, as the [useId explanation](https://blog.vuejs.org/posts/vue-3-5#useid) makes clear, and persistence, as pointed out by @alice.  

The solutions adopted by React, Vue, Alpine and others should be studied closely for any lessons learned.

So beyond improving the developer ergonomics of working with ids,  some additional critical goals of this solution should be:

1.   Identically structured HTML (ignoring the text content and attribute values other than generatedids attributes) should result in an identical set of auto generated id's.
2.  The algorithm for creating these id's should be published, and be as easy as possible to replicate in userland.   This could help to build SSR solutions that work on top of this solution. Perhaps it will need to include a publicly reserved "base" that all the id's start with, to ensure no conflicts with other auto generated solutions in userland.
3.  Along the lines of point 2 above, make sure this solution *is* compatible with a generic userland ssr solution, extending the reach of this solution so it could in fact be utilized by non-static applications that choose to leverage it when appropriate.
4.  The id's should have at least one character in it that makes it distinguishable from a JavaScript variable name.

I think some secondary goals should be:

1.  The id's should be as small as possible.  Meaning, I don't think readability should be a goal, as I don't think we want applications to pin any styling or JavaScript code around these auto generated id's.
2.  Small perturbations of the html structure should result in small perturbations in the id's.  This is probably a qualitative goal.



### Anything else?

Note the ability to reference multiple generated ids in the output element.  It would be great if that can be generalized to work with [custom element enhancements](https://github.com/WICG/webcomponents/issues/1000):

```html
<template be-switched="on when {{foo}} equals {{bar}}">
   foo === bar
</template>
```

Also, there is one important scenario that this wouldn't solve -- dynamic loops where there isn't a root node per iteration of the loop.  So I think template instantiation, should the platform (please) ever provide this, would still need to provide additional help for such scenarios, as proposed [here](https://github.com/WICG/webcomponents/issues/1013#issuecomment-2257557589):

```html
<template>
    {{#each item of items with generated-ids(myId, yourId)}}
        <span
        role="checkbox"
        aria-checked="false"
        tabindex="0"
        aria-labelledby="{{myId}}"></span>
        <span id="{{myId}}">I agree to the Terms and Conditions.</span>
    {{/each}}
</template>
```

### Ways to avoid carpal syndrome

Consider this html:

```html
<form generatedids="foo,bar">
  ...
  <label for={{foo}}>foo:</label>
  ...
  <input name=foo type=checkbox id={{foo}}>
  
  ...
  
  <label for={{bar}}>bar:</label>
  ...
  <input name=bar type=checkbox id={{bar}}>
  
   <output for="{{foo}} {{bar}}"></output>
</form>
```

This could be reduced a bit:

```html
<form generatedids="@foo,@bar">
  ...
  <label for={{foo}}>foo:</label>
  ...
  <input name=foo type=checkbox>
  
  ...
  
  <label for={{bar}}>bar:</label>
  ...
  <input name=bar type=checkbox>
  
   <output for="{{foo}} {{bar}}"></output>
</form>
```

This would do the equivalent as the example above -- add the id attributes for the input elements, with the auto generated id's, referenceable by foo and bar.
