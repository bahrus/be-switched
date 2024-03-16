export async function doNValueSwitch(self) {
    const { onNValueSwitches } = self;
    if (onNValueSwitches === undefined || onNValueSwitches.length > 1)
        throw 'NI';
    const nValueSwitch = onNValueSwitches[0];
    console.log({ nValueSwitch });
}
