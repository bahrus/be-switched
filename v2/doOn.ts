import {RegExpOrRegExpExt} from 'be-decorated/types';
import {upstreamEvent} from 'be-linked/reOn.js';

const reMapStatements : RegExpOrRegExpExt[] = [
    {
        //On input event of previous phone-number part map value to lhs.
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Map(?<upstreamPropPath>[\w\:]+)(?<!\\)To(?<memKey>\w+)`),
        defaultVals: {},
    }
];