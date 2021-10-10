# be-switched [TODO]

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <div hidden be-switched='{
        "iff": true,
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "value-from-target": "value"},
        "?": "===",
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "value-from-target": "value"},
        "setAttr": "hidden"
    }'>A witch!</div>
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
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "value-from-target": "value"},
        "?": "===",
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "value-from-target": "value"},
        "andIff":{
            "isViewable": ["header", "footer"],
            "mediaMatches": ["screen and (min-width: 1975px)"]
        }
    }'>
        <header>
            <template>
            <!-- Header content -->
            </template>
        </header>

        <template>
            <nav>
                <!-- Navigation -->
            </nav>

            <main>
                <!-- Main content -->
            </main>

            <aside>
                <!-- Sidebar / Ads -->
            </aside>        
        </template>



        <footer>
            <!-- Footer content -->
        </footer>
    </div>
</ways-of-science>
```