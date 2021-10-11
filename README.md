# be-switched [TODO]

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

iff, setAttr, ? can also come from observations.

## With Holy Grail layout, lazy loading

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