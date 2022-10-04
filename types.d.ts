import {BeDecoratedProps, EventHandler, MinimalProxy} from 'be-decorated/types';
import {IObserve, StringOrIObserve} from 'be-observant/types';


export interface EndUserProps {
    if?: StringOrIObserve,
    ifMediaMatches?: StringOrIObserve,
    ifVal: boolean,
    lhs: StringOrIObserve,
    op: '===',
    rhs: StringOrIObserve,
    lhsVal: any,
    rhsVal: any,
    val: boolean,
    hiddenStyle: string,
    ifNonEmptyArray: any[] | IObserve,
    ifNonEmptyArrayVal: undefined | any[],
    toggleDisabled: boolean;
    displayDelay: number;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    eventHandlers: EventHandler[],
    echoVal: boolean,
    matchesMediaQuery: boolean,
}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    finale(proxy: Proxy, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    onLHS(self: PP): void;
    onRHS(self: PP): void;
    onIf(self: PP): void;
    onIfMediaMatches(self: PP): void;
    calcVal(self: PP): void;
    onVal(self: PP): void;
    doMain(self: PP): void;
    onIfNonEmptyArray(self: PP): void;
}