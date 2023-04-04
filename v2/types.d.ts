import {BeDecoratedProps, EventHandler, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {Link} from 'be-linked/types';
import {QueryInfo, Scope, camelQry, JSONObject} from 'trans-render/lib/types';

export interface EndUserProps {
    camelConfig?: CamelConfig | CamelConfig[],
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    canonicalConfig?: CanonicalConfig;
}

export interface CamelConfig<TSrc=any, TDest=any>{
    links: Link[];
    Check?: CheckStatement[];
    On?: OnUpstreamEventToLorRStatement[];
    Map?: MapUpstreamPropToLorR[];
}

export interface CanonicalConfig{
    links: Link[];
    
}

export type UpstreamPropPath = string;
export type UpstreamCamelQry = camelQry;
export type LHS = string;
export type RHS = string;

export type TorForNEA = 'Truthy' | 'Falsy' | 'NonEmptyArray';

export type Op = '=';

export type LorR = 'LHS' | 'RHS';

export type EventName = string;

export type CheckUpstreamIsTOrFStatement = `That${UpstreamPropPath}Of${UpstreamCamelQry}Is${TorForNEA}`;
export type CheckLHSOpRHSStatement = `${LHS}${Op}${RHS}`;
export type CheckStatement = CheckUpstreamIsTOrFStatement | CheckLHSOpRHSStatement;
export type OnUpstreamEventToLorRStatement = `${EventName}Of${UpstreamCamelQry}Map${UpstreamPropPath}To${LorR}`;
export type MapUpstreamPropToLorR = `${UpstreamPropPath}Of${UpstreamCamelQry}To${LorR}`;
export type Proxy = (HTMLScriptElement | HTMLTemplateElement) & VirtualProps;

export interface PP extends VirtualProps{
    proxy: Proxy
}

export type PPP = Partial<PP>;

export type PPPP = Promise<PPP>;

export interface Actions{
    camelToCanonical(pp: PP): PPPP;
    onCanonical(pp: PP, mold: PPP): PPPP;
}