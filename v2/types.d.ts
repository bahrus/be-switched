import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE<HTMLTemplateElement>{
    lhs: any,
    rhs: any,
    displayDelay: number;
}

export interface AllProps extends EndUserProps{
    val: boolean,
    echoVal: boolean,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    calcVal(self: this): PAP;
    onTrue(self: this): Promise<void>;
    onFalse(self: this): Promise<void>;
}