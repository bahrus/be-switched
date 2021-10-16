import {BeDecoratedProps, EventHandler} from 'be-decorated/types';

export interface BeSwitchedVirtualProps{
    eventHandlers: EventHandler[],
    iff: boolean | object,
    iffVal: boolean,
    lhs: any,
    op: string,
    rhs: any,
    lhsVal: any,
    rhsVal: any,
    val: boolean,
    echoVal: boolean,
    hiddenStyle: string,
}
export interface BeSwitchedProps extends BeSwitchedVirtualProps{
    proxy: HTMLTemplateElement & BeSwitchedVirtualProps;
}

export interface BeSwitchedActions{
    intro(proxy: HTMLTemplateElement & BeSwitchedVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLTemplateElement & BeSwitchedVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    onLHS(self: this): void;
    onRHS(self: this): void;
    onIff(self: this): void;
    calcVal(self: this): void;
    onVal(self: this): void;
    doMain(self: this): void;
}