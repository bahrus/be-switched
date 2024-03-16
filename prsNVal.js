import { strType } from './prsOn.js';
import { tryParse } from 'be-enhanced/cpu.js';
const perimeter = String.raw `\^(?<perimeter>.*)`;
const prop = String.raw `(?<prop>[\w\-\:\|]+)`;
const typeProp = String.raw `(?<elType>${strType})${prop}`;
const perimeterTypeProp = String.raw `${perimeter}${typeProp}`;
const reDependencyStatements = [
    {
        regExp: new RegExp(perimeterTypeProp),
        defaultVals: {}
    },
    {
        regExp: new RegExp(typeProp),
        defaultVals: {}
    },
    {
        regExp: new RegExp(prop),
        defaultVals: { elType: '/' }
    }
];
export function prsNValue(nvalSwitch) {
    const { dependsOn } = nvalSwitch;
    const dependencies = [];
    const splitDependsOn = dependsOn.split('And');
    for (const dependencyStr of splitDependsOn) {
        const dependency = {};
        //TODO move this to trans-render, as this is definitely becoming a pattern
        const eventSplit = dependencyStr.split('::');
        let nonEventPart = eventSplit[0];
        if (eventSplit.length > 1) {
            dependency.event = eventSplit[1];
        }
        const test = tryParse(nonEventPart, reDependencyStatements);
        if (test === null)
            throw 'PE'; //Parsing error
        dependencies.push(test);
    }
    nvalSwitch.dependencies = dependencies;
}
