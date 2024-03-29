import { Dependency, NValueScriptSwitch } from './types';
import {parse} from 'trans-render/dss/parse.js';


export async function prsNValue(nvalSwitch: NValueScriptSwitch){
    const {dependsOn} = nvalSwitch;
    const dependencies: Array<Dependency> = [];
    const splitDependsOn = dependsOn!.split('And');
    for(const dependencyStr of splitDependsOn){
        
        const test = await parse(dependencyStr);
        dependencies.push(test);
    }
    nvalSwitch.dependencies = dependencies;
}