// @ts-check
/** @import {Actions, PAP, AllProps, AP, ParsedStatements, TwoValueSwitch, SingleValSwitch, NValueSwitch, ValueSpecifier} from './types/be-switched/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;

/**
 * @implements {Actions}
 */
class BeSwitched {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement
     * @param {SpawnContext} ctx
     * @param {PAP} initVals
     */
    constructor(enhancedElement, ctx, initVals) {
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps} self
     * @param {Element & ElementEnhancementGateway} enhancedElement
     * @param {SpawnContext} ctx
     * @param {PAP} initVals
     */
    async init(self, enhancedElement, ctx, initVals) {
        const { customData } = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc);
        /** @type {RoundaboutOptions} */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * Process parsed statements from the DSL and route to appropriate handlers.
     * @param {AP} self
     * @returns {Promise<PAP>}
     */
    async hydrate(self) {
        const { parsedStatements, enhancedElement } = self;
        const { success, statements } = parsedStatements;
        if (!success || !statements || statements.length === 0) {
            return { resolved: true };
        }

        /** @type {TwoValueSwitch[]} */
        const twoValueSwitches = [];
        /** @type {SingleValSwitch[]} */
        const singleValSwitches = [];
        /** @type {NValueSwitch[]} */
        const nValueSwitches = [];

        for (const statement of statements) {
            const { pattern, value } = statement;
            if (!value) continue;

            switch (pattern) {
                case 'twoValWithEvents': {
                    const tvs = parseTwoValSwitch(value, self);
                    if (tvs) twoValueSwitches.push(tvs);
                    break;
                }
                case 'nValWithHandler':
                case 'nValPerDeps': {
                    const nvs = parseNValueSwitch(value);
                    if (nvs) nValueSwitches.push(nvs);
                    break;
                }
                case 'singleValOnly':
                case 'singleVal': {
                    const svs = parseSingleValSwitch(value);
                    if (svs) singleValSwitches.push(svs);
                    break;
                }
            }
        }

        /** @type {PAP} */
        const result = { resolved: true };

        if (twoValueSwitches.length > 0) {
            // @ts-ignore
            self.twoValueSwitches = twoValueSwitches;
        }
        if (singleValSwitches.length > 0) {
            // @ts-ignore
            self.singleValSwitches = singleValSwitches;
        }
        if (nValueSwitches.length > 0) {
            // @ts-ignore
            self.nValueSwitches = nValueSwitches;
        }

        return result;
    }

    /**
     * Dynamically import and delegate to SingleValSwitchHandler
     * @param {AP} self
     */
    async onSingleValSwitches(self) {
        const { SingleValSwitchHandler } = await import('./SingleValSwitchHandler.js');
        new SingleValSwitchHandler(self);
    }

    /**
     * Dynamically import and delegate to TwoValSwitchHandler
     * @param {AP} self
     */
    async onTwoValSwitches(self) {
        const { TwoValSwitchHandler } = await import('./TwoValSwitchHandler.js');
        new TwoValSwitchHandler(self);
    }

    /**
     * Dynamically import and delegate to NValueSwitch
     * @param {AP} self
     */
    async onNValSwitches(self) {
        const { NValueSwitchHandler } = await import('./NValueSwitchHandler.js');
        new NValueSwitchHandler(self);
    }

    /**
     * @param {AP} self
     * @returns {PAP}
     */
    calcVal(self) {
        const { lhs, rhs, beBoolish, switchesSatisfied, twoValueSwitches, nValueSwitches, singleValSwitches } = self;
        // @ts-ignore - these are dynamically set
        if (twoValueSwitches !== undefined || nValueSwitches !== undefined || singleValSwitches !== undefined) {
            return {
                val: switchesSatisfied,
                resolved: true,
            };
        }
        if (beBoolish && (typeof lhs === 'boolean' || typeof rhs === 'boolean')) {
            const lhsIsh = !!lhs;
            const rhsIsh = !!rhs;
            return {
                val: lhsIsh === rhsIsh,
                resolved: true,
            };
        }
        return {
            val: lhs === rhs,
            resolved: true,
        };
    }

    /**
     * @param {AP} self
     * @returns {PAP}
     */
    calcSwitchesSatisfied(self) {
        const { singleValSwitchNoGo, singleValSwitchesSatisfied, twoValSwitchNoGo, twoValSwitchesSatisfied } = self;
        return {
            switchesSatisfied: !singleValSwitchNoGo && !twoValSwitchNoGo && (singleValSwitchesSatisfied || twoValSwitchesSatisfied),
        };
    }

    /**
     * @type {boolean | undefined}
     */
    #isEmpty;

    /**
     * @type {boolean}
     */
    #transitional = false;

    /**
     * @param {Element} enhancedElement
     * @returns {boolean}
     */
    #determineIfEmpty(enhancedElement) {
        if (this.#isEmpty !== undefined) return this.#isEmpty;
        if (!(enhancedElement instanceof HTMLTemplateElement)) {
            this.#isEmpty = true;
            return true;
        }
        if (enhancedElement.getAttribute('rel') === 'preload') {
            this.#isEmpty = false;
            return false;
        }
        if (enhancedElement.content === undefined || enhancedElement.content.childElementCount === 0) {
            this.#isEmpty = true;
            return true;
        }
        this.#isEmpty = false;
        return false;
    }

    /**
     * @param {AP} self
     */
    async onTrue(self) {
        const { enhancedElement, transitional, idRefAttr, toggleInert } = self;

        if ('value' in enhancedElement) {
            /** @type {any} */ (enhancedElement).value = true;
        } else {
            enhancedElement.classList.remove('be-switched-off');
            enhancedElement.classList.add('be-switched-on');
        }

        if (this.#determineIfEmpty(enhancedElement)) return;

        const transitional2 = transitional || this.#transitional;

        const contentToClone = /** @type {DocumentFragment} */ (/** @type {any} */ (enhancedElement).remoteContent || enhancedElement.content);
        const idRefChildren = getIdRefChildren(enhancedElement, idRefAttr);

        if (idRefChildren.length === 0) {
            const clone = /** @type {DocumentFragment} */ (contentToClone.cloneNode(true));
            const cloneChildren = Array.from(clone.children);
            const refs = [];
            let cnt = 0;
            for (const child of cloneChildren) {
                const id = child.id !== '' ? child.id : `be-switched-${cnt++}`;
                refs.push(id);
                child.id = id;
            }
            enhancedElement.setAttribute(idRefAttr, refs.join(' '));
            changeVisibility(cloneChildren, toggleInert, 'remove');
            if (!transitional2 || !document.startViewTransition) {
                enhancedElement.after(clone);
            } else {
                document.startViewTransition(() => {
                    enhancedElement.after(clone);
                });
            }
        } else {
            if (!transitional2 || !document.startViewTransition) {
                changeVisibility(idRefChildren, toggleInert, 'remove');
            } else {
                document.startViewTransition(() => {
                    changeVisibility(idRefChildren, toggleInert, 'remove');
                });
            }
        }
    }

    /**
     * @param {AP} self
     */
    async onFalse(self) {
        const { enhancedElement, toggleInert, transitional, idRefAttr, hiddenStyle } = self;

        if ('value' in enhancedElement) {
            /** @type {any} */ (enhancedElement).value = false;
        } else {
            enhancedElement.classList.add('be-switched-off');
            enhancedElement.classList.remove('be-switched-on');
        }

        if (this.#determineIfEmpty(enhancedElement)) return;

        const transitional2 = transitional || this.#transitional;
        addStyle(hiddenStyle, enhancedElement);

        const idRefChildren = getIdRefChildren(enhancedElement, idRefAttr);
        if (!transitional2 || !document.startViewTransition) {
            changeVisibility(idRefChildren, toggleInert, 'add');
        } else {
            document.startViewTransition(() => {
                changeVisibility(idRefChildren, toggleInert, 'add');
            });
        }
    }

    /**
     * @param {AP} self
     * @returns {Promise<PAP>}
     */
    async processJS(self) {
        const { js, enhancedElement } = self;
        const expr = `
    const {f, args} = e;
    e.r = ${js};
`;
        const handler = (await import('be-switched/activate.js')).activate(expr);
        enhancedElement.addEventListener('change', handler);
        return /** @type {PAP} */ ({
            notProcessedJS: false,
        });
    }
}

// ========== Helper functions ==========

/**
 * Get children referenced by the idref attribute
 * @param {Element} enhancedElement
 * @param {string} idRefAttr
 * @returns {Element[]}
 */
function getIdRefChildren(enhancedElement, idRefAttr) {
    const idRefs = enhancedElement.getAttribute(idRefAttr);
    if (!idRefs) return [];
    const rn = enhancedElement.getRootNode();
    return idRefs.split(' ').map(id => /** @type {Document | ShadowRoot} */ (rn).getElementById(id)).filter(el => el !== null);
}

/**
 * @param {Array<Element>} children
 * @param {boolean | undefined} toggleInert
 * @param {'add' | 'remove'} verb
 */
function changeVisibility(children, toggleInert, verb) {
    const disable = verb === 'remove' ? true : false;
    for (const child of children) {
        child.classList[verb]('be-switched-hide');
        if (toggleInert && 'disabled' in child && /** @type {any} */ (child).disabled === !disable) {
            /** @type {any} */ (child).disabled = disable;
        }
    }
}

const styleMap = new WeakSet();
/**
 * @param {string} hiddenStyle
 * @param {Element} enhancedElement
 */
function addStyle(hiddenStyle, enhancedElement) {
    let rootNode = /** @type {any} */ (enhancedElement.getRootNode());
    if (rootNode.host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        style.innerHTML = /* css */ `
            .be-switched-hide{
                ${hiddenStyle}
            }
        `;
        rootNode.appendChild(style);
    }
}

// ========== DSL Parsing helpers ==========

/**
 * Parse a specifier string like "#elementId@eventName" or "#{{element-id}}?.prop" or "`constant`"
 * @param {string} raw
 * @param {AP} [self]
 * @returns {ValueSpecifier}
 */
function parseSpecifier(raw, self) {
    const trimmed = raw.trim();
    /** @type {ValueSpecifier} */
    const spec = {};

    // Constant value: `value`
    const constMatch = trimmed.match(/^`([^`]*)`(?:-as-(\w+))?$/);
    if (constMatch) {
        spec.constVal = constMatch[1];
        if (constMatch[2]) spec.as = /** @type {any} */ (constMatch[2]);
        else if (self?.as) spec.as = self.as;
        return spec;
    }

    let working = trimmed;

    // Type casting suffix: -as-number
    const asMatch = working.match(/-as-(\w+)$/);
    if (asMatch) {
        spec.as = /** @type {any} */ (asMatch[1]);
        working = working.substring(0, working.length - asMatch[0].length);
    } else if (self?.as) {
        spec.as = self.as;
    }

    // Source of truth attribute: [attrName]
    const attrMatch = working.match(/\[(\w[\w-]*)\]$/);
    if (attrMatch) {
        spec.attr = attrMatch[1];
        working = working.substring(0, working.length - attrMatch[0].length);
    }

    // Chained property path: ?.propName or ?.prop1?.prop2
    const pathMatch = working.match(/\?\.([\w.?]+)$/);
    if (pathMatch) {
        const pathParts = pathMatch[1].split('?.');
        spec.prop = pathParts[0];
        if (pathParts.length > 1) {
            spec.path = pathParts.slice(1).join('?.');
        }
        working = working.substring(0, working.length - pathMatch[0].length);
    }

    // Event name: @eventName
    const evtMatch = working.match(/@([\w-]+)$/);
    if (evtMatch) {
        spec.evtName = evtMatch[1];
        working = working.substring(0, working.length - evtMatch[0].length);
    }

    // ID reference: # or #{{id}} or #id
    if (working.startsWith('#')) {
        let id = working.substring(1);
        // Handle {{id}} template syntax
        const tmplMatch = id.match(/^\{\{(.+?)\}\}$/);
        if (tmplMatch) {
            id = tmplMatch[1];
        }
        spec.id = id;
    }
    // If no # prefix, it's a host property reference
    else if (working.length > 0) {
        spec.prop = spec.prop || working;
    }

    return spec;
}

/**
 * Parse a two-value switch from regex captures
 * @param {Record<string, any>} value
 * @param {AP} self
 * @returns {TwoValueSwitch | null}
 */
function parseTwoValSwitch(value, self) {
    const { onOrOff, lhsPart, rhsPart, op } = value;
    if (!lhsPart || !rhsPart) return null;

    const lhsSpecifier = parseSpecifier(lhsPart.trim(), self);
    const rhsSpecifier = parseSpecifier(rhsPart.trim(), self);

    // Normalize operator
    let normalizedOp = op;
    if (op === '=') normalizedOp = 'eq';
    if (op === '<') normalizedOp = 'lt';
    if (op === '>') normalizedOp = 'gt';
    if (op === '<=') normalizedOp = 'lte';
    if (op === '>=') normalizedOp = 'gte';

    return {
        onOrOff: onOrOff.toLowerCase(),
        lhsSpecifier,
        rhsSpecifier,
        op: normalizedOp,
    };
}

/**
 * Parse a single-value switch from regex captures
 * @param {Record<string, any>} value
 * @returns {SingleValSwitch | null}
 */
function parseSingleValSwitch(value) {
    const { onOrOff, ifPart, req } = value;
    if (!ifPart) return null;

    const specifier = parseSpecifier(ifPart.trim());

    return {
        onOrOff: onOrOff.toLowerCase(),
        specifier,
        req: req === 'true',
    };
}

/**
 * Parse an n-value switch from regex captures
 * @param {Record<string, any>} value
 * @returns {NValueSwitch | null}
 */
function parseNValueSwitch(value) {
    const { registeredHandler, dependencyPart } = value;
    if (!dependencyPart) return null;

    // Parse dependencies: "#ref1@evt1 and #ref2@evt2"
    const depParts = dependencyPart.split(/\s+and\s+/);
    /** @type {ValueSpecifier[]} */
    const dependencies = [];

    for (const dep of depParts) {
        const spec = parseSpecifier(dep.trim());
        dependencies.push(spec);
    }

    return {
        dependencies,
        registeredHandler: registeredHandler || undefined,
    };
}

export { BeSwitched };
