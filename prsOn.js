const reOnSwitchStatements = [
    {
        regExp: new RegExp(String.raw `^onWhen(?<type>\$|\#|\&)(?<prop>[\w]+)`),
        defaultVals: {}
    }
];
export async function prsOn(self) {
    const { On } = self;
    const onSwitches = [];
    for (const onS of On) {
        console.log(onS);
    }
    return {
        onSwitches
    };
}
