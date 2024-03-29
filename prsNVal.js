import { parse } from 'trans-render/dss/parse.js';
export async function prsNValue(nvalSwitch) {
    const { dependsOn } = nvalSwitch;
    const dependencies = [];
    const splitDependsOn = dependsOn.split('And');
    for (const dependencyStr of splitDependsOn) {
        const test = await parse(dependencyStr);
        dependencies.push(test);
    }
    nvalSwitch.dependencies = dependencies;
}
