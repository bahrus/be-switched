import {BeDecoratedProps, EventHandler, MinimalProxy} from 'be-decorated/types';
import {IObserve, StringOrIObserve} from 'be-observant/types';


export interface EndUserProps {
    if?: StringOrIObserve,
    ifMediaMatches?: StringOrIObserve,
    ifVal?: boolean,
    lhs?: StringOrIObserve,
    op?: '===',
    rhs?: StringOrIObserve,
    lhsVal?: any,
    rhsVal?: any,
    hiddenStyle?: string,
    ifNonEmptyArray?: any[] | IObserve,
    toggleDisabled: boolean;
    displayDelay: number;
    /**
     * Works with beOosoom decorator, so becomes inert when out of view
     */
    beOosoom?: string;
    disabled?: boolean;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    eventHandlers: EventHandler[],
    val: boolean,
    echoVal: boolean,
    ifNonEmptyArrayVal: undefined | any[],
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