import {RegExpOrRegExpExt} from 'be-decorated/types';
import {} from 'be-linked/doOn.js';

const reMapStatements : RegExpOrRegExpExt[] = [
    {
        //On input event of previous phone-number part map value to lhs.
        regExp: new RegExp(String.raw `${upstream}To(?<memKey>\w+)`),
        defaultVals: {},
    }
];