import {BeDecoratedProps, EventHandler} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';

type huVals = boolean | string | IObserve

export interface BeSwitchedEndUserProps {
    if: huVals,
    ifMediaMatches: huVals,
    ifVal: boolean,
    lhs: huVals,
    op: '===',
    rhs: huVals,
    lhsVal: any,
    rhsVal: any,
    val: boolean,
    hiddenStyle: string,
    ifNonEmptyArray: any[] | IObserve,
    ifNonEmptyArrayVal: undefined | any[],
    toggleDisabled: boolean;
    displayDelay: number;
}

export interface BeSwitchedVirtualProps extends BeSwitchedEndUserProps{
    eventHandlers: EventHandler[],
    echoVal: boolean,
    matchesMediaQuery: boolean,
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
}