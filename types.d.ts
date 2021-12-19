import {BeDecoratedProps, EventHandler} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';

type huVals = boolean | string | IObserve
export interface BeSwitchedVirtualProps{
    eventHandlers: EventHandler[],
    if: huVals,
    ifMediaMatches: huVals,
    ifVal: boolean,
    lhs: huVals,
    op: string,
    rhs: huVals,
    lhsVal: any,
    rhsVal: any,
    val: boolean,
    echoVal: boolean,
    hiddenStyle: string,
    matchesMediaQuery: boolean,
    ifNonEmptyArray: any[] | IObserve,
    ifNonEmptyArrayVal: undefined | any[],
    toggleDisabled: boolean;
    displayDelay: number;
    lazyDisplay: boolean;
    isIntersecting: boolean;
    lazyLoadClass: string;
    lazyDelay: number;
    // setClass: string;
    
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