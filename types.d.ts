import {BeDecoratedProps, EventHandler, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {IObserve, StringOrIObserve} from 'be-observant/types';


export interface EndUserProps {
    if?: StringOrIObserve,
    ifMediaMatches?: string,//StringOrIObserve,
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
    deferRendering?: boolean;
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

export type PPP = Partial<PP>;

export type PPE = [PPP, EventConfigs<Proxy, Actions>]

export interface Actions{
    finale(proxy: Proxy, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
    onLHS(self: PP): void;
    onRHS(self: PP): void;
    onIf(self: PP): void;
    addMediaListener(self: PP): PPE;
    calcVal(self: PP): PPP;
    onVal(self: PP): void;
    doMain(self: PP): void;
    chkMedia(self: PP, e: MediaQueryListEvent): PPP;
    onIfNonEmptyArray(self: PP): void;
}