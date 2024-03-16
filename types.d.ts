import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {BVAAllProps} from 'be-value-added/types';
import {AP as BPAP, ISignal, Actions as BPActions} from 'be-propagating/types';
import {ElTypes, SignalRefType} from 'be-linked/types';
import { Propagator } from "../trans-render/froop/PropSvc";

export interface EndUserProps extends IBE<HTMLTemplateElement>{
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
    On?: Array<SwitchStatement>;
    on?: Array<SwitchStatement>;
    Off?: Array<SwitchStatement>;
    off?: Array<SwitchStatement>;
}

export interface AllProps extends EndUserProps{
    val: boolean,
    switchesSatisfied?: boolean,
    echoVal: boolean,
    onBinarySwitches?: Array<OneValueSwitch>,
    onTwoValueSwitches?: Array<TwoValueSwitch>,
    offBinarySwitches?: Array<OneValueSwitch>,
    offTwoValueSwitches?: Array<TwoValueSwitch>,
    //onNValueSwitches?: Array<
    isParsed?: boolean,
    onNValueSwitches?: Array<NValueScriptSwitch>
}

export type SwitchStatement = string;


export interface OneValueSwitch{
    prop?: string,
    type?: ElTypes,
    req?: boolean,
    signal?: WeakRef<SignalRefType>,
    negate?: boolean,
    
}

export interface TwoValueSwitch{
    lhsProp?: string,
    rhsProp?: string,
    lhsSubProp?: string,
    rhsSubProp?: string,
    lhsType?: ElTypes,
    rhsType?: ElTypes,
    lhsPerimeter?: string,
    rhsPerimeter?: string,
    lhsEvent?: string,
    rhsEvent?: string,
    dependsOn?: boolean,
    switchedOn?: boolean,
    req?: boolean,
    op?: 'equals' | 'eq' | 'lt' | 'gt',
    lhsSignal?: WeakRef<SignalRefType>,
    rhsSignal?: WeakRef<SignalRefType>,
    negate?: boolean,
    //eventNames?: string,
    lhs?: ISide,
    rhs?: ISide,
}

export interface Dependency{
    prop?: string,
    elType?: ElTypes,
    perimeter?: string,
    event?: string
}

export interface NValueScriptSwitch {
    dependencies?: Array<Dependency>
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    calcVal(self: this): PAP;
    onTrue(self: this): Promise<void>;
    onFalse(self: this): Promise<void>;
    addMediaListener(self: this): POA;
    chkMedia(self: this, e: MediaQueryListEvent): PAP;
    onOn(self: this): ProPAP;
    onOff(self: this): ProPAP;
    onOnBinarySwitches(self: this): Promise<void>;
    onTwoValSwitches(self: this): Promise<void>;
    onOffBinarySwitches(self: this): Promise<void>;
    offTwoValSwitches(sef: this): Promise<void>;
}



// https://github.com/webcomponents-cg/community-protocols/issues/12#issuecomment-872415080
//export type loadEventName = 'load';
export type inputEventName = 'input';
//export type changeEventName = 'change';

export interface ISide {
    val: any
}

export interface EventForTwoValSwitch {
    ctx?: TwoValueSwitch,
    lhsTarget?: SignalRefType,
    rhsTarget?: SignalRefType,
    switchOn?: boolean,
}
