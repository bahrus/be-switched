import { tryParse } from 'be-enhanced/cpu.js';
const reOnSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^onlyWhen(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals: {
            req: true
        }
    },
    {
        regExp: new RegExp(String.raw `^when(?<type>\$|\#|\@)(?<prop>[\w]+)`),
        defaultVals: {}
    }
];
export async function prsOn(self) {
    const { On } = self;
    const onSwitches = [];
    for (const onS of On) {
        const test = tryParse(onS, reOnSwitchStatements);
        if (test === null)
            throw 'PE'; //Parse Error
        onSwitches.push(test);
    }
    return {
        onSwitches
    };
}
