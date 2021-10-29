import {BeDecoratedProps, EventHandler} from 'be-decorated/types';

export interface BeSwitchedVirtualProps{
    eventHandlers: EventHandler[],
    if: boolean | object,
    ifMediaMatches: string,
    ifVal: boolean,
    lhs: any,
    op: string,
    rhs: any,
    lhsVal: any,
    rhsVal: any,
    val: boolean,
    echoVal: boolean,
    hiddenStyle: string,
    matchesMediaQuery: boolean,
    ifNonEmptyArray: any[] | object,
    ifNonEmptyArrayVal: undefined | any[],
    toggleDisabled: boolean;
    displayDelay: number;
    lazyDisplay: boolean;
    isIntersecting: boolean;
    setClass: string;
    
}
export interface BeSwitchedProps extends BeSwitchedVirtualProps{
    proxy: HTMLTemplateElement & BeSwitchedVirtualProps;
}

export interface BeSwitchedActions{
    intro(proxy: HTMLTemplateElement & BeSwitchedVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLTemplateElement & BeSwitchedVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    onLHS(self: this): void;
    onRHS(self: this): void;
    onIf(self: this): void;
    onIfMediaMatches(self: this): void;
    calcVal(self: this): void;
    onVal(self: this): void;
    doMain(self: this): void;
    onIfNonEmptyArray(self: this): void;
    onLazyDisplay(self: this): void;
}