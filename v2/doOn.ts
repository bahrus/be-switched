import {RegExpOrRegExpExt} from 'be-decorated/types';
import { CamelConfig, PP, UpstreamPropPath } from './types';
import {Link} from 'be-linked/types';
import {upstreamEvent} from 'be-linked/reOn.js';
import {Scope} from 'trans-render/lib/types';


export async function doOn(cc: CamelConfig, links: Link[], pp: PP){
   const {On} = cc;
   const {tryParse} = await import('be-decorated/cpu.js');
   const {adjustLink} = await import('be-linked/adjustLink.js');
   for(const onString of On!){
      const test = tryParse(onString, reOnStatements);
      if(test !== null){
         await adjustLink(test as Link, pp);
         links.push({
            ...test,
         });
      }
   }
}

interface OnStatement {
   on: string,
   upstreamCamelQry: Scope & string,
   upstreamPropPath : UpstreamPropPath,
   memKey: string,
}

const reOnStatements : RegExpOrRegExpExt[] = [
    {
        //On input event of previous phone-number part map value to lhs.
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Map(?<upstreamPropPath>[\w\:]+)(?<!\\)To(?<memKey>\w+)`),
        defaultVals: {},
    },
    {
       //On toggle event of host check if open property is truthy.
       regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsTruthy`),
       defaultVals: {}, 
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsFalsy`),
        defaultVals: {}, 
     },
     {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)CheckIf(?<upstreamPropPath>[\w\\\:]+)PropertyIsNonEmptyArray`),
        defaultVals: {}, 
     },

];