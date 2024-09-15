//import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IEnhancement} from './ts-refs/trans-render/be/types';
//import {BVAAllProps} from 'be-value-added/types';
//import {AP as BPAP, ISignal, Actions as BPActions} from 'be-propagating/types';
//import {ElTypes, SignalRefType} from 'be-linked/types';
//import { Propagator } from "../trans-render/froop/PropSvc";
import {Specifier} from './ts-refs/trans-render/dss/types';

export interface EndUserProps extends IEnhancement<HTMLTemplateElement>{
    lhs?: any,
    rhs?: any,
    ifMediaMatches?: string,
    checkIfNonEmptyArray?: boolean;
    op?: '===';
    /**
     * If lhs and/or rhs is boolean, just check that truthiness matches.
     */
    beBoolish: boolean;
    displayDelay?: number;
    hiddenStyle?: string;
    toggleInert?: boolean;
    deferRendering?: boolean;
    minMem?: boolean;
    /**
     * Works with beOosoom decorator, so becomes inert when out of view
     */
    beOosoom?: string;
    // On?: Array<SwitchStatement>;
    // on?: Array<SwitchStatement>;
    // Off?: Array<SwitchStatement>;
    // off?: Array<SwitchStatement>;
}

export interface AllProps extends EndUserProps{
    val: boolean,
    singleValSwitchesSatisfied?: boolean,
    singleValSwitchNoGo?: boolean,
    twoValSwitchesSatisfied?: boolean,
    twoValSwitchNoGo?: boolean,
    switchesSatisfied?: boolean,
    echoVal: boolean,
    singleValSwitches?: Array<OneValueSwitch>,
    twoValueSwitches?: Array<TwoValueSwitch>,
    offBinarySwitches?: Array<OneValueSwitch>,
    nValueSwitches?: Array<NValueScriptSwitch>
    rawStatements?: Array<string>
}

export type SwitchStatement = string;


export interface OneValueSwitch{
    ifPart: string,
    specifier: Specifier,
    signal?: WeakRef<SignalRefType>,
    req?: boolean,
}

export type Op = 'equals' | 'eq' | 'lt' | 'gt';

export interface TwoPartOpStatement{
    lhsPart: string,
    op: Op,
    rhsPart: string,
    within: string,
}

export interface TwoValueSwitch{
    lhsSpecifier?: Specifier,
    rhsSpecifier?: Specifier,
    withinSpecifier?: Specifier,
    req?: boolean,
    op?: Op,
    lhsSignal?: WeakRef<SignalRefType>,
    rhsSignal?: WeakRef<SignalRefType>,
    negate?: boolean,
    //eventNames?: string,
    lhs?: ISide,
    rhs?: ISide,
    //lhsType?: 'number' | 'boolean',
    //rhsType?: 'number' | 'boolean' | 'string',
}

export interface Dependency extends Specifier{}

export interface CanBeSwitchedOn {
    switchedOn?: boolean,
}

export interface NValueScriptSwitch extends CanBeSwitchedOn {
    dependsOn?: string,
    dependencies?: Array<Dependency>,
    registeredHandler?: string,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    calcSwitchesSatisfied(self: this): PAP;
    calcVal(self: this): PAP;
    onTrue(self: this): Promise<void>;
    onFalse(self: this): Promise<void>;
    // addMediaListener(self: this): POA;
    // chkMedia(self: this, e: MediaQueryListEvent): PAP;
    
    // doOnBinarySwitches(self: this): Promise<void>;
    onSingleValSwitches(self: this): Promise<void>;
    onTwoValSwitches(self: this): Promise<void>;
    onNValSwitches(self: this): Promise<void>;
    onRawStatements(self: this): void;
}



// https://github.com/webcomponents-cg/community-protocols/issues/12#issuecomment-872415080
//export type loadEventName = 'load';
export type inputEventName = 'input';
//export type changeEventName = 'change';

export interface ISide {
    val: any
}

export interface Elevate {
    val: any,
    to: string
}

export interface EventForNValueSwitch {
    ctx: NValueScriptSwitch,
    factors: {[key: string] : SignalRefType},
    switchOn?: boolean,
    elevate?: Elevate
}

export interface SignalAndEvent {
    signal?: WeakRef<SignalRefType>,
    eventSuggestion?: string
}
