import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {BVAAllProps} from 'be-value-added/types';

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
    
}

export interface AllProps extends EndUserProps{
    val: boolean,
    switchesSatisfied?: boolean,
    echoVal: boolean,
    onBinarySwitches?: Array<OnBinaryValueSwitch>,
    onTwoValueSwitches?: Array<OnTwoValueSwitch>,
    isParsed?: boolean,
}

export type SwitchStatement = string;

export type Types = '$' | '#' | '@';

export interface OnBinaryValueSwitch{
    prop?: string,
    type?: Types,
    req?: boolean,
    signal?: WeakRef<BVAAllProps> | WeakRef<HTMLInputElement>,
}

export interface OnTwoValueSwitch{
    lhsProp?: string,
    rhsProp?: string,
    lhsType?: Types,
    rhsType?: Types,
    req?: boolean,
    op?: 'equals'
    lhsSignal?: WeakRef<BVAAllProps> | WeakRef<HTMLInputElement>,
    rhsSignal?: WeakRef<BVAAllProps> | WeakRef<HTMLInputElement>,
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
    onOnBinarySwitches(self: this): Promise<void>;
    onTwoValSwitches(self: this): Promise<void>;
}